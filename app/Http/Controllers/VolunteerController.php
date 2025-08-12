<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Inertia\Inertia;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Reminder;
use App\Events\NewMessage;
use Illuminate\Http\Request;
use App\Models\ReportProject;
use App\Models\VolunteerPoint;
use App\Models\PointTransaction;
use App\Models\VolunteerBooking;
use App\Models\VolunteerProfile;
use App\Mail\OrganizationReminder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\VolunteerVerification;
use Illuminate\Support\Facades\Storage;

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
    public function getTotalPoints()
    {
        $user = Auth::user();

        // Get total earned points (credits)
        $earnedOtherPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->sum('points');

        $earnedVolunteerPoints = VolunteerPoint::where('user_id', $user->id)
            ->sum('points_earned');

        $earnedPoints = $earnedOtherPoints + $earnedVolunteerPoints;

        // Get total spent points (debits)
        $spentPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->sum('points');

        // $totalPoints = $earnedPoints - $spentPoints;

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

        $earnedReferralPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'credit')
            ->sum('points');

        $grandEarnedPoints = $earnedPoints + $earnedReferralPoints;

        $spentPoints = PointTransaction::where('user_id', $user->id)
            ->where('type', 'debit')
            ->sum('points');

        $totalPoints = $grandEarnedPoints - $spentPoints;

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
        $messages = Message::with(['sender', 'receiver', 'originalMessage.sender', 'booking', 'project'])
            ->where(function ($query) use ($user) {
                $query->where('receiver_id', $user->id)
                    ->orWhere('sender_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Group messages by conversation partner
        $groupedMessages = $messages->groupBy(function ($message) use ($user) {
            // Use a composite key that includes booking_id if available
            $baseKey = $message->sender_id === $user->id
                ? $message->receiver_id
                : $message->sender_id;

            return $message->booking_id
                ? "{$baseKey}-{$message->booking_id}"
                : $baseKey;
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
            'project_id' => 'nullable|exists:projects,id',
            'booking_id' => 'nullable|exists:volunteer_bookings,id',
        ]);

        $user = Auth::user();
        $project = $request->project_id ? Project::find($request->project_id) : null;
        $booking = $request->booking_id ? VolunteerBooking::find($request->booking_id) : null;

        // If we have a booking but no project, get project from booking
        if ($booking && !$project) {
            $project = $booking->project;
        }

        // Check if this is a paid project conversation
        $isPaidProject = $project && $project->type_of_project === 'Paid';

        // Check if user has made payment for paid projects
        $hasPayment = false;
        if ($isPaidProject && $booking) {
            $hasPayment = $booking->payments()
                ->where('status', 'completed')
                ->exists();
        }

        // Patterns for restricted content
        $patterns = [
            'phone' => '/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/',
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'url' => '/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/'
        ];

        $filteredMessage = $request->message;
        $hasRestrictedContent = false;

        // Only filter restricted content if:
        // - It's a free project, OR
        // - It's a paid project but no payment has been made
        if (!$isPaidProject || ($isPaidProject && !$hasPayment)) {
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $filteredMessage)) {
                    $filteredMessage = preg_replace($pattern, '[content removed]', $filteredMessage);
                    $hasRestrictedContent = true;
                }
            }
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'message' => $filteredMessage,
            'status' => 'Unread',
            'reply_to' => $request->reply_to,
            'project_id' => $project ? $project->id : null,
            'booking_id' => $booking ? $booking->id : null,
        ]);


        broadcast(new NewMessage($message))->toOthers();

        return back()->with([
            'success' => 'Message sent successfully.',
            'hasRestrictedContent' => $hasRestrictedContent,
            'isPaidProject' => $isPaidProject,
            'hasPayment' => $hasPayment,
        ]);
    }

    public function panelStoreMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'project_id' => 'required|exists:projects,id',
        ]);

        dd($request);

        // $message = Message::create([
        //     'sender_id' => $request->sender_id,
        //     'receiver_id' => $request->receiver_id,
        //     'message' => $request->message,
        //     'project_id' => $request->project_id,
        //     'status' => 'Unread',
        // ]);

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
        $user = Auth::user();
        $volunteer = VolunteerProfile::where('user_id', $user->id)->first();

        $verification = $volunteer
            ? VolunteerVerification::where('volunteer_id', $volunteer->id)->first()
            : null;

        return Inertia::render('Volunteers/Profile', [
            'volunteer' => $volunteer,
            'verification' => $verification, // Changed from volunteer_verification to verification
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function verification(VolunteerProfile $volunteer)
    {
        $user = Auth::user();

        // Verify the volunteer profile belongs to the authenticated user
        if ($volunteer->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('Volunteers/Verification', [
            'profile' => $volunteer,
            'auth' => [
                'user' => $user,
            ],
            'volunteer' => $volunteer->id,
        ]);
    }
    public function storeVerification(Request $request, $volunteer_profile)
    {
        $volunteerProfile = VolunteerProfile::where('id', $volunteer_profile)->firstOrFail();

        $data = $request->validate([
            'verification_type' => 'required|string|max:255',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Check if volunteer already has a verification record
        $existingVerification = VolunteerVerification::where('volunteer_id', $volunteerProfile->id)->first();

        // Store the new document file
        if ($request->hasFile('document')) {
            // Delete the old document if it exists
            if ($existingVerification && $existingVerification->document) {
                Storage::disk('public')->delete($existingVerification->document);
            }

            $data['document'] = $request->file('document')->store('verification_document', 'public');
        }

        // Add the volunteer profile ID to the data
        $data['volunteer_id'] = $volunteerProfile->id;
        $data['status'] = 'Pending'; // Reset status to Pending for new submission

        // Update or create the verification record
        if ($existingVerification) {
            $existingVerification->update($data);
        } else {
            VolunteerVerification::create($data);
        }

        // Redirect to profile page with success message
        return redirect()->route('volunteer.profile')->with('success', 'Verification documents submitted successfully!');
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'gender' => 'required|string|in:Male,Female,Other',
            'dob' => 'required|date|before:-18 years',
            'country' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'current_profile_picture' => 'nullable|string',
            'remove_profile_picture' => 'nullable|boolean',
            'facebook' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'hobbies' => 'nullable|array',
            'hobbies.*' => 'string|max:255',
            'education_status' => 'required|string|max:255',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:255',
            'nok' => 'required|string|max:255',
            'nok_phone' => 'required|string|max:20',
            'nok_relation' => 'required|string|max:255',
        ]);

        // Find or create the volunteer profile
        $volunteer = VolunteerProfile::firstOrNew(['user_id' => $user->id]);

        // Handle profile picture upload/removal
        if ($request->hasFile('profile_picture')) {
            // Delete old picture if exists
            if ($volunteer->profile_picture) {
                Storage::disk('public')->delete($volunteer->profile_picture);
            }
            $data['profile_picture'] = $request->file('profile_picture')->store('volunteer/profile_pictures', 'public');
        } elseif ($request->input('remove_profile_picture', false)) {
            // Remove picture if requested
            if ($volunteer->profile_picture) {
                Storage::disk('public')->delete($volunteer->profile_picture);
            }
            $data['profile_picture'] = null;
        } elseif ($request->filled('current_profile_picture')) {
            // Keep existing picture if no changes
            $data['profile_picture'] = $request->input('current_profile_picture');
        }

        // Update or create the volunteer profile
        $volunteer->fill($data);
        $volunteer->save();

        return redirect()->back()->with('success', 'Profile saved successfully.');
    }

    public function points()
    {
        $user = Auth::user();

        // Get all point transactions
        $transactions = PointTransaction::with(['booking.project'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'source' => 'transaction', // identify type
                    'type' => $transaction->type,
                    'points' => $transaction->points,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                    'booking' => $transaction->booking,
                ];
            });

        // Get volunteer points
        $volunteerPoints = VolunteerPoint::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($vp) {
                return [
                    'id' => $vp->id,
                    'booking' => $vp->booking, // identify type
                    'type' => 'credit',
                    'points' => $vp->points_earned,
                    'description' => $vp->notes ?? 'Points earned through volunteering',
                    'created_at' => $vp->created_at,
                ];
            });

        // Merge and sort by date (descending)
        $history = $transactions
            ->merge($volunteerPoints)
            ->sortByDesc('created_at')
            ->values(); // reindex

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


    // public function points()
    // {
    //     $user = Auth::user();

    //     // Get all point transactions ordered by date
    //     $transactions = PointTransaction::with(['booking.project'])
    //         ->where('user_id', $user->id)
    //         ->orderBy('created_at', 'desc')
    //         ->get()
    //         ->map(function ($transaction) {
    //             return [
    //                 'id' => $transaction->id,
    //                 'type' => $transaction->type,
    //                 'points' => $transaction->points,
    //                 'description' => $transaction->description,
    //                 'created_at' => $transaction->created_at,
    //                 'booking' => $transaction->booking,
    //             ];
    //         });

    //     $volunteerPoints = VolunteerPoint::where('user_id', $user->id);


    //     return inertia('Volunteers/Points', [
    //         'auth' => [
    //             'user' => $user->toArray(),
    //         ],
    //         'points' => [
    //             'total' => $this->getTotalPoints(),
    //             'history' => $transactions,
    //             'volunteerPoints' => $volunteerPoints,
    //         ]
    //     ]);
    // }

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

        $organization = $booking->project->user;

        DB::beginTransaction();
        try {
            // 1. Create payment record (if you're tracking payments separately)
            // Payment::create([...]);

            // 2. Deduct points from volunteer (debit transaction)
            $this->createPointTransaction(
                $user->id,
                $organization->id,
                $booking->id,
                $pointsNeeded,
                'debit',
                'Points used for booking payment for project: ' . $booking->project->title
            );

            // 3. Add points to organization (credit transaction)
            $this->createPointTransaction(
                $organization->id,
                $organization->id,
                $booking->id,
                $pointsNeeded,
                'credit',
                'Points received from volunteer for project: ' . $booking->project->title
            );

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

    protected function createPointTransaction($userId, $organizationId, $bookingId, $points, $type, $description)
    {
        return PointTransaction::create([
            'user_id' => $userId,
            'organization_id' => $organizationId,
            'booking_id' => $bookingId,
            'points' => $points,
            'type' => $type,
            'description' => $description,
        ]);
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
