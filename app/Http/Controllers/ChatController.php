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

        // Eager load the correct relationships
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

    public function store(Request $request, Chat $chat)
    {
        $request->validate([
            'content' => 'required|string',
            'chat_id' => 'required|exists:chats,id'
        ]);

        $user = Auth::user();
        $chat = Chat::find($request->chat_id);

        // Verify user is part of this chat
        if (!$chat->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        $message = $chat->messages()->create([
            'content' => $request->content,
            'sender_id' => auth()->id(),
            'sender_type' => get_class(auth()->user()),
        ]);

        // Load the sender relationship
        $message->load('sender');

        // Format the message data consistently
        $formattedMessage = [
            'id' => $message->id,
            'content' => $message->content,
            'sender_id' => $message->sender_id,
            'sender_type' => $message->sender_type,
            'created_at' => $message->created_at->toISOString(),
            'status' => 'Sent',
            'sender' => $message->sender,
            'is_admin' => $message->sender_type === 'App\Models\Admin'
        ];

        // Always broadcast the message
        broadcast(new NewChatMessage($formattedMessage, $chat->id));

        return response()->json(['success' => true]);
    }

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
        $message = $chat->chatMessages()->create([
            'content' => 'Admin ' . $admin->name . ' has ended the chat',
            'sender_id' => $admin->id,
            'sender_type' => get_class($admin),
            'is_system' => true
        ]);

        // Broadcast the chat ended message
        broadcast(new NewChatMessage($message, $chat->id))->toOthers();

        return response()->json(['success' => true]);
    }
    public function markAsRead(Request $request, Chat $chat)
    {
        $user = Auth::user();

        // Verify user is part of this chat
        if (!$chat->participants()->where('user_id', $user->id)->exists()) {
            abort(403);
        }

        // Mark all admin messages as read
        $updated = $chat->messages()
            ->where('sender_type', 'App\Models\Admin')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // Broadcast the read status update
        broadcast(new MessageRead($chat->id, now()))->toOthers();

        return response()->json([
            'success' => true,
            'updated_count' => $updated
        ]);
    }


    // Admin section
    public function AdminIndex()
    {
        $admin = auth('admin')->user();

        // Get chats where the current admin is a participant (assigned chats)
        $assignedChats = Chat::whereHas('participants', function ($query) use ($admin) {
            $query->where('admin_id', $admin->id);
        })
            ->where('status', 'active')
            ->with(['participants.user', 'latestMessage'])
            ->orderByDesc(
                ChatMessage::select('created_at')
                    ->whereColumn('chat_id', 'chats.id')
                    ->latest()
                    ->take(1)
            )
            ->get()
            ->map(function ($chat) use ($admin) {
                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->firstWhere('admin_id', null)?->user,
                    'messages' => $chat->messages()
                        ->with('sender')
                        ->orderBy('created_at', 'asc')
                        ->get()
                        ->map(function ($message) {
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
                    'latestMessage' => $chat->latestMessage ? [
                        'message' => $chat->latestMessage->content,
                        'created_at' => $chat->latestMessage->created_at,
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
            ->with(['participants.user', 'latestMessage'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->first()?->user,
                    'messages' => $chat->messages()
                        ->with('sender')
                        ->orderBy('created_at', 'asc')
                        ->get()
                        ->map(function ($message) {
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
                    'latestMessage' => $chat->latestMessage ? [
                        'message' => $chat->latestMessage->content,
                        'created_at' => $chat->latestMessage->created_at,
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
            ->with(['participants.user', 'latestMessage'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'user' => $chat->participants->firstWhere('admin_id', null)?->user,
                    'messages' => $chat->messages()
                        ->with('sender')
                        ->orderBy('created_at', 'asc')
                        ->get()
                        ->map(function ($message) {
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
                    'latestMessage' => $chat->latestMessage ? [
                        'message' => $chat->latestMessage->content,
                        'created_at' => $chat->latestMessage->created_at,
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
            'temp_id' => 'nullable' // Add temp_id validation
        ]);

        $message = $chat->messages()->create([
            'content' => $request->content,
            'sender_id' => $admin->id,
            'sender_type' => get_class($admin),
            'reply_to' => $request->reply_to
        ]);

        // Load the sender relationship
        $message->load('sender');

        // Include temp_id in broadcast for client-side matching
        $message->temp_id = $request->temp_id;

        broadcast(new NewChatMessage($message, $chat->id))->toOthers();

        return response()->json([
            'success' => true,
            'message_id' => $message->id,
            'temp_id' => $request->temp_id
        ]);
    }
    public function AdminMarkAsRead(Chat $chat)
    {
        $chat->messages()
            ->where('sender_type', User::class)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
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
                    return response()->json([
                        'success' => true,
                        'message' => 'You are already assigned to this chat',
                        'chat' => $this->formatChatResponse($chat)
                    ]);
                }

                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Chat already assigned to another admin'
                ], 409); // Use 409 Conflict for better semantics
            }

            // Assign admin to chat
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

            // Broadcast after successful commit
            broadcast(new NewChatMessage($message, $chat->id))->toOthers();

            return back();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Chat acceptance failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept chat'
            ], 500);
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
}
