<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\VolunteerBooking;
use Illuminate\Support\Facades\Auth;

class VolunteerController extends Controller
{
    public function index()
    {
        return inertia('Volunteers/Dashboard');
    }

    public function projects()
    {
        $bookings = VolunteerBooking::with('project')
            ->where('user_id', Auth::id())
            ->get();

        return inertia('Volunteers/Projects', [
            'bookings' => $bookings
        ]);
    }

    public function messages()
    {
        $user = Auth::user();

        // Get all messages where user is either sender or receiver
        $messages = Message::with(['sender', 'receiver', 'originalMessage.sender'])
            ->where(function ($query) use ($user) {
                $query->where('receiver_id', $user->id)
                    ->orWhere('sender_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Group messages by conversation partner
        $groupedMessages = $messages->groupBy(function ($message) use ($user) {
            return $message->sender_id === $user->id
                ? $message->receiver_id
                : $message->sender_id;
        });

        // Prepare conversations with replied messages
        $conversations = $groupedMessages->map(function ($messages, $otherUserId) use ($user) {
            $otherUser = $messages->first()->sender_id === $user->id
                ? $messages->first()->receiver
                : $messages->first()->sender;

            // Add replied message data to each message
            $enhancedMessages = $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'status' => $message->status,
                    'created_at' => $message->created_at,
                    'reply_to' => $message->reply_to,
                    'original_message' => $message->originalMessage ? [
                        'id' => $message->originalMessage->id,
                        'message' => $message->originalMessage->message,
                        'sender_id' => $message->originalMessage->sender_id,
                        'sender' => $message->originalMessage->sender ? [
                            'id' => $message->originalMessage->sender->id,
                            'name' => $message->originalMessage->sender->name,
                            'email' => $message->originalMessage->sender->email,
                        ] : null,
                    ] : null,
                ];
            });

            return [
                'sender' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'email' => $otherUser->email,
                ],
                'messages' => $enhancedMessages,
                'unreadCount' => $messages->where('receiver_id', $user->id)
                    ->where('status', 'Unread')
                    ->count(),
                'latestMessage' => $messages->sortByDesc('created_at')->first()
            ];
        })->sortByDesc(function ($conversation) {
            return $conversation['latestMessage']['created_at'];
        });

        return inertia('Volunteers/Messages', [
            'messages' => $conversations->values()->all(),
        ]);
    }

    public function markAllRead($senderId)
    {
        $user = Auth::user();

        // Verify the sender exists and has messages with the current user
        $messages = Message::where('sender_id', $senderId)
            ->where('receiver_id', $user->id)
            ->where('status', 'Unread')
            ->get();

        if ($messages->isEmpty()) {
            return response()->noContent();
        }

        // Mark all unread messages as read
        Message::where('sender_id', $senderId)
            ->where('receiver_id', $user->id)
            ->where('status', 'Unread')
            ->update(['status' => 'Read']);

        return back()->with('success', 'Message Read.');
    }

    public function storeMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
            'reply_to' => 'nullable|exists:messages,id',
        ]);

        // Filter restricted content
        $patterns = [
            'phone' => '/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/',
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'url' => '/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/'
        ];

        $filteredMessage = $request->message;
        $hasRestrictedContent = false;

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $filteredMessage)) {
                $filteredMessage = preg_replace($pattern, '[content removed]', $filteredMessage);
                $hasRestrictedContent = true;
            }
        }


        $user = Auth::user();

        // Create the new message
        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'message' => $filteredMessage,
            'status' => 'Unread',
            'reply_to' => $request->reply_to,
        ]);

        // Load the sender relationship for the response
        $message->load('sender');
        return back()->with([
            'success' => 'Message sent successfully.',
            'hasRestrictedContent' => $hasRestrictedContent
        ]);
    }

    public function profile()
    {
        return inertia('Volunteers/Profile');
    }
}
