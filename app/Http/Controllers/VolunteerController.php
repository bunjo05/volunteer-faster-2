<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Reminder;
use Illuminate\Http\Request;
use App\Models\ReportProject;
use App\Models\VolunteerPoint;
use App\Models\PointTransaction;
use App\Models\VolunteerBooking;
use App\Mail\OrganizationReminder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class VolunteerController extends Controller
{
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
                return [
                    'id' => $chat->id,
                    'updated_at' => $chat->updated_at,
                    'unread_count' => $chat->messages()
                        ->where('sender_type', 'App\Models\Admin')
                        ->whereNull('read_at') // Use read_at instead of status
                        ->count(),
                    'latest_message' => $chat->latestMessage?->content,
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

    // Add this method to your controller
    protected function getTotalPoints()
    {
        $user = Auth::user();

        // Get total earned points from VolunteerPoints
        $earnedPoints = VolunteerPoint::where('user_id', $user->id)
            ->sum('points_earned');

        // Get total spent points from PointTransactions (debits)
        $spentPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->sum('points');

        // If there are no debit transactions, just return the earned points
        if ($spentPoints === null || $spentPoints == 0) {
            return $earnedPoints;
        }

        return $earnedPoints - $spentPoints;
    }
    public function index()
    {
        $user = Auth::user();

        // Get total points
        $totalPoints = $this->getTotalPoints();

        // Get booking counts by status
        $bookingCounts = VolunteerBooking::where('user_id', $user->id)
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when booking_status = "Pending" then 1 else 0 end) as pending')
            ->selectRaw('sum(case when booking_status = "Approved" then 1 else 0 end) as approved')
            ->selectRaw('sum(case when booking_status = "Rejected" then 1 else 0 end) as rejected')
            ->selectRaw('sum(case when booking_status = "Completed" then 1 else 0 end) as completed')
            ->first();

        // Get recent activities (last 5 points earned)
        $recentActivities = VolunteerPoint::with(['booking.project'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($point) {
                return [
                    'points' => $point->points_earned,
                    'project' => $point->booking->project->title,
                    'date' => $point->created_at->format('M d, Y'),
                ];
            });

        return inertia('Volunteers/Dashboard', [
            'auth' => [
                'user' => $user->toArray() + ['points' => $totalPoints],
            ],
            'stats' => [
                'total_points' => $totalPoints,
                'bookings' => [
                    'total' => $bookingCounts->total,
                    'pending' => $bookingCounts->pending,
                    'approved' => $bookingCounts->approved,
                    'rejected' => $bookingCounts->rejected,
                    'completed' => $bookingCounts->completed,
                ],
            ],
            'recent_activities' => $recentActivities,
        ]);
    }
    public function projects()
    {
        $bookings = VolunteerBooking::with(['project', 'reminders', 'payments', 'pointTransactions'])
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($booking) {
                $daysPending = $booking->created_at->diffInDays(now());
                $lastReminder = $booking->reminders->sortByDesc('created_at')->first();

                // Determine which reminder stage we're at
                if ($booking->booking_status !== 'Pending') {
                    $booking->can_send_reminder = false;
                } elseif (!$lastReminder) {
                    // No reminders sent yet - check if 7 days passed
                    $booking->can_send_reminder = $daysPending >= 7;
                    $booking->reminder_stage = 'first';
                } elseif ($lastReminder->stage === 'first' && $daysPending >= 14) {
                    // First reminder sent - check if 14 days total passed
                    $booking->can_send_reminder = true;
                    $booking->reminder_stage = 'second';
                } elseif ($lastReminder->stage === 'second' && $daysPending >= 30) {
                    // Second reminder sent - check if 30 days total passed
                    $booking->can_send_reminder = true;
                    $booking->reminder_stage = 'final';
                } else {
                    $booking->can_send_reminder = false;
                }

                // Calculate days spent if booking is completed
                $booking->days_spent = $booking->booking_status === 'Completed'
                    ? $booking->calculateDaysSpent()
                    : null;

                // Check if points were used for this booking
                $booking->has_points_transaction = $booking->pointTransactions
                    ->where('type', 'debit')
                    ->isNotEmpty();

                return $booking;
            });

        $user = Auth::user();

        $earnedPoints = VolunteerPoint::where('user_id', $user->id)
            ->sum('points_earned');

        $spentPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->sum('points');

        $totalPoints = $earnedPoints - $spentPoints;

        return inertia('Volunteers/Projects', [
            'bookings' => $bookings,
            'totalPoints' => $totalPoints,
            'points' => $this->getTotalPoints(),
            'auth' => [
                'user' => Auth::user()->toArray(),
            ],
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
            'points' => $this->getTotalPoints(),
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

        dd('Hello World');

        // Load the sender relationship for the response
        $message->load('sender');
        return back()->with([
            'success' => 'Message sent successfully.',
            'hasRestrictedContent' => $hasRestrictedContent
        ]);
    }


    public function panelStoreMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            //     'receiver_id' => 'required|exists:users,id',
            //     'sender_id' => 'required|exists:users,id',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $message = Message::create([
            //     'sender_id' => $request->sender_id,
            //     'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'project_id' => $request->project_id,
            //     'status' => 'Unread',
        ]);

        dd($message);

        // Load the sender relationship for the response
        // $message->load('sender');

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function storeProjectReport(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'report_category_id' => 'required|exists:report_categories,id',
            'report_subcategory_id' => 'required|exists:report_subcategories,id',
            'description' => 'required',
        ]);

        $user = Auth::user();

        $report_project = ReportProject::create([
            'user_id' => $user->id,
            'project_id' => $validated['project_id'],
            'report_category_id' => $validated['report_category_id'],
            'report_subcategory_id' => $validated['report_subcategory_id'],
            'description' => $validated['description'],
            'mark_as_resolved' => 0
        ]);
        return redirect()->back()->with('success', 'Report made Successfully');
    }

    public function sendReminder(Request $request, $bookingId)
    {
        $booking = VolunteerBooking::with(['project.user', 'user', 'reminders'])
            ->where('id', $bookingId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $daysPending = $booking->created_at->diffInDays(now());
        $lastReminder = $booking->reminders->sortByDesc('created_at')->first();

        // Determine current stage
        $stage = 'first';
        if ($lastReminder) {
            if ($lastReminder->stage === 'first' && $daysPending >= 14) {
                $stage = 'second';
            } elseif ($lastReminder->stage === 'second' && $daysPending >= 30) {
                $stage = 'final';
            } else {
                return back()->with('error', 'Not enough time has passed since the last reminder.');
            }
        } elseif ($daysPending < 7) {
            return back()->with('error', 'First reminder can only be sent after 7 days.');
        }

        // Send email to project owner
        Mail::to($booking->project->user->email)
            ->send(new OrganizationReminder($booking, $stage));

        // Create a message record
        Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $booking->project->user_id,
            'message' => ucfirst($stage) . ' reminder sent about the bookingthat was made on ' . $booking->created_at->format('F j, Y'),
            'project_id' => $booking->project_id,
            'status' => 'Unread',
        ]);

        // Create reminder record
        Reminder::create([
            'user_id' => Auth::id(),
            'project_id' => $booking->project_id,
            'booking_id' => $booking->id,
            'stage' => $stage,
            'message' => ucfirst($stage) . ' reminder sent about the bookingthat was made on ' . $booking->created_at->format('F j, Y'),
        ]);

        return back()->with('success', ucfirst($stage) . ' reminder sent successfully!');
    }
    public function profile()
    {
        return inertia(
            'Volunteers/Profile',
            ['points' => $this->getTotalPoints()],
        );
    }

    public function points()
    {
        $user = Auth::user();

        $earnedPoints = VolunteerPoint::with(['booking.project'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $spentPoints = PointTransaction::with(['booking.project'])
            ->where('user_id', $user->id)
            ->where('type', 'debit')
            ->orderBy('created_at', 'desc')
            ->get();

        // Combine earned and spent points into a single history array
        $history = collect();

        foreach ($earnedPoints as $point) {
            $history->push([
                'id' => $point->id,
                'type' => 'earned',
                'points_earned' => $point->points_earned,
                'booking' => $point->booking,
                'created_at' => $point->created_at,
            ]);
        }

        foreach ($spentPoints as $transaction) {
            $history->push([
                'id' => $transaction->id,
                'type' => 'spent',
                'points_earned' => $transaction->points,
                'booking' => $transaction->booking,
                'created_at' => $transaction->created_at,
            ]);
        }

        // Sort history by created_at in descending order
        $history = $history->sortByDesc('created_at')->values()->all();

        return inertia('Volunteers/Points', [
            'auth' => [
                'user' => $user->toArray(),
            ],
            'points' => [
                'total' => $this->getTotalPoints(),
                'history' => $history,
            ]
        ]);
    }
    // Add these methods to VolunteerController
    public function calculatePointsValue($points)
    {
        // Define your conversion rate (e.g., 1 point = $0.10)
        return $points * 0.5;
    }

    public function calculatePointsNeeded($amount)
    {
        // Inverse of the above
        return ceil($amount / 0.5);
    }

    protected function calculateRemainingBalance($booking)
    {
        $totalAmount = $this->calculateTotalAmount(
            $booking->start_date,
            $booking->end_date,
            $booking->project->fees ?? 0,
            $booking->number_of_travellers
        );

        $totalPaid = $booking->payments->sum('amount');

        return $totalAmount - $totalPaid;
    }

    protected function calculateTotalAmount($startDate, $endDate, $fees, $travellers)
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $days = $end->diff($start)->days + 1;

        return $days * $fees * $travellers;
    }

    public function payWithPoints(Request $request, VolunteerBooking $booking)
    {
        $user = Auth::user();
        $remainingBalance = $this->calculateRemainingBalance($booking);
        $pointsNeeded = $this->calculatePointsNeeded($remainingBalance);
        $userPoints = $this->getTotalPoints();

        if ($userPoints < $pointsNeeded) {
            return response()->json([
                'success' => false,
                'message' => 'You don\'t have enough points. You need ' . $pointsNeeded . ' points but only have ' . $userPoints
            ], 400);
        }

        // Get the organization (project owner) ID
        $organizationId = $booking->project->user_id;

        DB::beginTransaction();
        try {
            // 1. Create payment record
            // Payment::create([
            //     'user_id' => $user->id,
            //     'booking_id' => $booking->id,
            //     'amount' => $remainingBalance,
            //     'status' => 'points_paid',
            //     'payment_method' => 'points',
            //     'transaction_id' => 'POINTS-' . uniqid()
            // ]);

            // 2. Deduct points from volunteer (debit transaction)
            PointTransaction::create([
                'user_id' => $user->id,
                'organization_id' => $organizationId,
                'booking_id' => $booking->id,
                'points' => $pointsNeeded,
                'type' => 'debit',
                'description' => 'Points used for booking payment for project: ' . $booking->project->title
            ]);

            // 3. Add points to organization (credit transaction)
            PointTransaction::create([
                'user_id' => $organizationId, // The organization receiving the points
                'organization_id' => $organizationId,
                'booking_id' => $booking->id,
                'points' => $pointsNeeded,
                'type' => 'credit',
                'description' => 'Points received from volunteer for project: ' . $booking->project->title
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'new_points_balance' => $userPoints - $pointsNeeded
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Payment failed: ' . $e->getMessage()
            ], 500);
        }
    }
    protected function deductPoints($user, $points, $booking)
    {
        // Create debit transaction
        PointTransaction::create([
            'user_id' => $user->id,
            'organization_id' => $booking->project->user_id,
            'booking_id' => $booking->id,
            'points' => $points,
            'type' => 'debit',
            'description' => 'Points used for booking payment'
        ]);
    }

    protected function addOrganizationPoints($organization, $points, $booking)
    {
        // Create credit transaction
        PointTransaction::create([
            'user_id' => Auth::id(),
            'organization_id' => $organization->id,
            'booking_id' => $booking->id,
            'points' => $points,
            'type' => 'credit',
            'description' => 'Points received from volunteer'
        ]);
    }
}
