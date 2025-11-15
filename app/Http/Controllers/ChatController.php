<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use App\Events\MessageRead;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Events\NewChatMessage;
use App\Models\ChatParticipant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Eager load the correct relationships with admin data
        $chat = $user->chats()
            ->with(['chatMessages.sender', 'participants.admin'])
            ->first();

        if (!$chat) {
            // Create a new chat without an admin initially
            $chat = Chat::create(['status' => 'pending']);
            $chat->participants()->create(['user_id' => $user->id]);

            // Reload the chat with relationships
            $chat = $chat->fresh(['chatMessages.sender', 'participants.admin']);

            // Notify all online admins
            event(new NewChatMessage($chatId = $chat->id, 'A new chat has been created'));
        }

        return response()->json([
            'chat' => $chat,
            'messages' => $chat->chatMessages()
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'sender_id' => $message->sender_id,
                        'sender_type' => $message->sender_type,
                        'created_at' => $message->created_at,
                        'status' => $message->read_at ? 'Read' : 'Sent',
                        'sender' => $message->sender,
                    ];
                })
        ]);
    }

    public function volunteerChatList()
    {
        $user = Auth::user();

        $chats = $user->chats()
            ->with(['participants.admin', 'messages' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($chat) {
                $latestMessage = $chat->messages->first();
                $adminParticipant = $chat->participants->firstWhere('admin_id', '!=', null);

                return [
                    'id' => $chat->id,
                    'status' => $chat->status,
                    'updated_at' => $chat->updated_at,
                    'unread_count' => $chat->messages()
                        ->where('sender_type', 'App\\Models\\Admin')
                        ->whereNull('read_at')
                        ->count(),
                    'latest_message' => $latestMessage ? [
                        'content' => $latestMessage->content,
                        'created_at' => $latestMessage->created_at,
                    ] : null,
                    'admin' => $adminParticipant?->admin ? [
                        'id' => $adminParticipant->admin->id,
                        'name' => $adminParticipant->admin->name,
                        'email' => $adminParticipant->admin->email,
                    ] : null
                ];
            });

        return response()->json([
            'chats' => $chats
        ]);
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'content' => 'required|string',
    //         'chat_id' => 'required|exists:chats,id',
    //         'temp_id' => 'nullable'
    //     ]);

    //     $user = Auth::user();
    //     $chat = Chat::find($request->chat_id);

    //     // Verify user is part of this chat
    //     if (!$chat->participants()->where('user_id', $user->id)->exists()) {
    //         return response()->json(['error' => 'Unauthorized'], 403);
    //     }

    //     $message = $chat->messages()->create([
    //         'content' => $request->content,
    //         'sender_id' => Auth::id(),
    //         'sender_type' => get_class(Auth::user()),
    //         'temp_id' => $request->temp_id
    //     ]);

    //     $message->load('sender');

    //     $formattedMessage = [
    //         'id' => $message->id,
    //         'content' => $message->content,
    //         'sender_id' => $message->sender_id,
    //         'sender_type' => $message->sender_type,
    //         'created_at' => $message->created_at->toISOString(),
    //         'status' => 'Sent',
    //         'sender' => $message->sender,
    //         'is_admin' => $message->sender_type === 'App\Models\Admin',
    //         'temp_id' => $message->temp_id
    //     ];

    //     // broadcast(new NewChatMessage($formattedMessage, $chat->id))->toOthers();

    //     return response()->json([
    //         'success' => true,
    //         'message_id' => $message->id,
    //         'temp_id' => $message->temp_id
    //     ]);
    // }

    public function acceptChat(Request $request, Chat $chat)
    {
        $admin = auth('admin')->user();

        // Verify chat is pending and not already assigned
        if ($chat->status !== 'pending') {
            abort(400, 'Chat already assigned');
        }

        // Assign admin to chat
        $chat->participants()->create(['admin_id' => $admin->id]);
        $chat->update(['status' => 'active']);

        // Notify user that chat has been accepted
        broadcast(new NewChatMessage([
            'id' => 0, // temporary ID
            'content' => 'An admin has joined the chat',
            'sender_id' => $admin->id,
            'sender_type' => get_class($admin),
            'created_at' => now()->toISOString(),
            'status' => 'Sent',
            'sender' => $admin,
            'is_admin' => true
        ], $chat->id));

        return back();
        // return response()->json(['success' => true]);
    }

    public function endChat(Request $request, Chat $chat)
    {
        $admin = auth('admin')->user();

        // Verify admin has access to this chat
        if (!$chat->participants()->where('admin_id', $admin->id)->exists()) {
            abort(403);
        }

        // Update chat status
        $chat->update(['status' => 'ended']);

        // Create system message
        $chat->messages()->create([
            'content' => 'Admin ' . $admin->name . ' has ended the chat',
            'sender_id' => $admin->id,
            'sender_type' => get_class($admin),
            'is_system' => true
        ]);

        return response()->json(['success' => true]);
    }

    // public function markAsRead(Request $request, Chat $chat)
    // {
    //     $user = Auth::user();

    //     // Verify user is part of this chat
    //     if (!$chat->participants()->where('user_id', $user->id)->exists()) {
    //         abort(403);
    //     }

    //     // Mark all admin messages as read
    //     $updated = $chat->messages()
    //         ->where('sender_type', 'App\Models\Admin')
    //         ->whereNull('read_at')
    //         ->update(['read_at' => now()]);

    //     // Broadcast the read status update
    //     broadcast(new MessageRead($chat->id, now()))->toOthers();

    //     return response()->json([
    //         'success' => true,
    //         'updated_count' => $updated
    //     ]);
    // }


    // Admin section
    public function AdminIndex()
    {
        $admin = auth('admin')->user();

        // Get chats where the current admin is a participant (assigned chats)
        $assignedChats = Chat::whereHas('participants', function ($query) use ($admin) {
            $query->where('admin_id', $admin->id);
        })
            ->where('status', 'active')
            ->with(['participants.user', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderByDesc(
                ChatMessage::select('created_at')
                    ->whereColumn('chat_id', 'chats.id')
                    ->latest()
                    ->take(1)
            )
            ->get()
            ->map(function ($chat) use ($admin) {
                $latestMessage = $chat->messages->last();

                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->firstWhere('admin_id', null)?->user,
                    'messages' => $chat->messages->map(function ($message) {
                        return [
                            'id' => $message->id,
                            'message' => $message->content,
                            'sender_id' => $message->sender_id,
                            'sender_type' => $message->sender_type,
                            'created_at' => $message->created_at,
                            'status' => $message->read_at ? 'Read' : 'Sent',
                            'sender' => $message->sender,
                        ];
                    }),
                    'latestMessage' => $latestMessage ? [
                        'message' => $latestMessage->content,
                        'created_at' => $latestMessage->created_at,
                    ] : null,
                    'unreadCount' => $chat->messages()
                        ->where('sender_type', User::class)
                        ->whereNull('read_at')
                        ->count(),
                    'status' => $chat->status
                ];
            });

        // Get unassigned chats (where no participant has an admin_id)
        $unassignedChats = Chat::whereHas('participants', function ($query) {
            $query->whereNull('admin_id');
        })
            ->whereDoesntHave('participants', function ($query) {
                $query->whereNotNull('admin_id');
            })
            ->where('status', 'pending')
            ->with(['participants.user', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($chat) {
                $latestMessage = $chat->messages->last();

                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->first()?->user,
                    'messages' => $chat->messages->map(function ($message) {
                        return [
                            'id' => $message->id,
                            'message' => $message->content,
                            'sender_id' => $message->sender_id,
                            'sender_type' => $message->sender_type,
                            'created_at' => $message->created_at,
                            'status' => $message->read_at ? 'Read' : 'Sent',
                            'sender' => $message->sender,
                        ];
                    }),
                    'latestMessage' => $latestMessage ? [
                        'message' => $latestMessage->content,
                        'created_at' => $latestMessage->created_at,
                    ] : null,
                    'unreadCount' => $chat->messages()
                        ->where('sender_type', User::class)
                        ->whereNull('read_at')
                        ->count(),
                    'status' => $chat->status
                ];
            });

        // Get ended chats
        $endedChats = Chat::whereHas('participants', function ($query) use ($admin) {
            $query->where('admin_id', $admin->id);
        })
            ->where('status', 'ended')
            ->with(['participants.user', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($chat) {
                $latestMessage = $chat->messages->last();

                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->firstWhere('admin_id', null)?->user,
                    'messages' => $chat->messages->map(function ($message) {
                        return [
                            'id' => $message->id,
                            'message' => $message->content,
                            'sender_id' => $message->sender_id,
                            'sender_type' => $message->sender_type,
                            'created_at' => $message->created_at,
                            'status' => $message->read_at ? 'Read' : 'Sent',
                            'sender' => $message->sender,
                        ];
                    }),
                    'latestMessage' => $latestMessage ? [
                        'message' => $latestMessage->content,
                        'created_at' => $latestMessage->created_at,
                    ] : null,
                    'unreadCount' => 0,
                    'status' => $chat->status
                ];
            });

        return Inertia::render('Admins/Chat/Index', [
            'chats' => $assignedChats,
            'requests' => $unassignedChats,
            'endedChats' => $endedChats
        ]);
    }

    public function AdminStore(Request $request, Chat $chat)
    {
        $admin = auth('admin')->user();

        // Verify admin has access to this chat
        if (!$chat->participants()->where('admin_id', $admin->id)->exists()) {
            abort(403);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
            'reply_to' => 'nullable|exists:chat_messages,id',
        ]);

        $message = $chat->messages()->create([
            'content' => $request->content,
            'sender_id' => $admin->id,
            'sender_type' => get_class($admin),
            'reply_to' => $request->reply_to
        ]);

        // Update chat timestamp
        $chat->touch();

        // Load the sender relationship
        $message->load('sender');

        return back()->with('success', 'Message sent successfully');

        // return response()->json([
        //     'success' => true,
        //     'message_id' => $message->id,
        //     'message' => [
        //         'id' => $message->id,
        //         'message' => $message->content,
        //         'sender_id' => $message->sender_id,
        //         'sender_type' => $message->sender_type,
        //         'created_at' => $message->created_at->toISOString(),
        //         'status' => 'Sent',
        //         'sender' => $message->sender,
        //     ]
        // ]);


    }
    public function AdminMarkAsRead(Chat $chat)
    {
        $admin = auth('admin')->user();

        // Verify admin has access to this chat
        if (!$chat->participants()->where('admin_id', $admin->id)->exists()) {
            abort(403);
        }

        $updated = $chat->messages()
            ->where('sender_type', User::class)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'updated_count' => $updated
        ]);
    }

    public function AdminAcceptChat(Request $request, Chat $chat)
    {
        $admin = auth('admin')->user();

        DB::beginTransaction();
        try {
            // Reload the chat with participants to avoid stale data
            $chat->load('participants');

            // Check for existing admin assignments (atomic with transaction)
            $existingAdminParticipant = $chat->participants
                ->firstWhere('admin_id', '!=', null);

            if ($existingAdminParticipant) {
                if ($existingAdminParticipant->admin_id === $admin->id) {
                    DB::commit();

                    // Return Inertia redirect for page reload
                    return redirect()->route('chat.index')->with([
                        'success' => 'You are already assigned to this chat'
                    ]);
                }

                DB::rollBack();
                return redirect()->route('chat.index')->with([
                    'error' => 'Chat already assigned to another admin'
                ]);
            }

            // FIX: Correct the participant creation - removed the extra array
            $chat->participants()->create(['admin_id' => $admin->id]);
            $chat->update(['status' => 'active']);

            // Create system message
            $message = $chat->messages()->create([
                'content' => 'Admin ' . $admin->name . ' has joined the chat',
                'sender_id' => $admin->id,
                'sender_type' => get_class($admin),
                'is_system' => true
            ]);

            DB::commit();

            // Return Inertia redirect to reload the page with updated data
            return redirect()->route('chat.index')->with([
                'success' => 'Chat accepted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Chat acceptance failed: " . $e->getMessage());
            return redirect()->route('chat.index')->with([
                'error' => 'Failed to accept chat'
            ]);
        }
    }

    private function formatChatResponse($chat)
    {
        return [
            'id' => $chat->id,
            'status' => $chat->status,
            'user' => $chat->participants->firstWhere('admin_id', null)?->user,
            'messages' => $chat->messages()->with('sender')->get()->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'message' => $msg->content,
                    'sender_id' => $msg->sender_id,
                    'sender_type' => $msg->sender_type,
                    'created_at' => $msg->created_at,
                    'status' => $msg->read_at ? 'Read' : 'Sent',
                    'sender' => $msg->sender,
                ];
            })
        ];
    }

    // Volunteer and Organization Chats
    public function listChats()
    {
        $user = Auth::user();

        // Get chats where the user is a participant
        $chats = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['latestMessage'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($chat) use ($user) {
                $adminParticipant = $chat->participants->firstWhere('admin_id', '!=', null);
                return [
                    'id' => $chat->id,
                    'status' => $chat->status,
                    'updated_at' => $chat->updated_at,
                    'unread_count' => $chat->messages()
                        ->where('sender_type', 'App\\Models\\Admin')
                        ->whereNull('read_at') // Use read_at instead of status
                        ->count(),
                    'latest_message' => $chat->latestMessage?->content,
                    'admin' => $adminParticipant?->admin ? [
                        'id' => $adminParticipant->admin->id,
                        'name' => $adminParticipant->admin->name,
                        'email' => $adminParticipant->admin->email,
                    ] : null
                ];
            });

        return response()->json([
            'chats' => $chats
        ]);
    }

    public function startNewChat()
    {
        $user = Auth::user();

        // Check if user already has a pending chat
        $pendingChat = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->where('status', 'pending')->first();

        if ($pendingChat) {
            return response()->json([
                'error' => 'You already have a pending chat',
                'existing_chat' => [
                    'id' => $pendingChat->id,
                    'updated_at' => $pendingChat->updated_at,
                    'unread_count' => 0
                ]
            ], 400);
        }

        // Check if user has too many active chats
        $activeChatCount = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->where('status', 'active')->count();

        if ($activeChatCount >= 1) { // Adjust this number as needed
            return response()->json([
                'error' => 'You already have an active chat'
            ], 400);
        }

        // Create the chat
        $chat = Chat::create([
            'status' => 'pending',
        ]);

        // Add the user as a participant
        $chat->participants()->create([
            'user_id' => $user->id
        ]);

        return response()->json([
            'chat' => [
                'id' => $chat->id,
                'updated_at' => $chat->updated_at,
                'unread_count' => 0,
            ]
        ]);
    }

    public function getMessages(Chat $chat)
    {
        $user = Auth::user();

        // Verify the user is a participant in this chat
        if (!$chat->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $chat->messages()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'sender_id' => $message->sender_id,
                    'sender_type' => $message->sender_type,
                    'created_at' => $message->created_at,
                    'status' => $message->status,
                    'sender' => $message->sender_type === 'App\Models\Admin'
                        ? ['name' => 'Admin']
                        : ['name' => $message->sender->name],
                ];
            });

        return response()->json([
            'messages' => $messages
        ]);
    }

    public function markAsRead(Chat $chat)
    {
        $user = Auth::user();

        // Verify the user is a participant in this chat
        if (!$chat->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $chat->messages()
            ->where('sender_type', 'App\Models\Admin')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'chat_id' => 'required|exists:chats,id',
            'temp_id' => 'nullable',
        ]);

        $user = Auth::user();
        $chat = Chat::findOrFail($request->chat_id);

        // Verify the user is a participant in this chat
        if (!$chat->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message = $chat->messages()->create([
            'sender_id' => $user->id,
            'sender_type' => 'App\Models\User',
            'content' => $request->content,
            // Don't need to set status here since it has a default
        ]);

        // Update chat status if it was pending
        if ($chat->status === 'pending') {
            $chat->update(['status' => 'active']);
        }

        return response()->json([
            'message' => [
                'id' => $message->id,
                'content' => $message->content,
                'sender_id' => $message->sender_id,
                'sender_type' => $message->sender_type,
                'created_at' => $message->created_at,
                'read_at' => $message->read_at,
                'sender' => ['name' => $user->name],
            ],
            'temp_id' => $request->temp_id,
        ]);
    }
}
