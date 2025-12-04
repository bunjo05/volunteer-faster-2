<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Reminder;
use App\Events\NewMessage;
use App\Models\Sponsorship;
use Illuminate\Support\Str;
use App\Models\Appreciation;
use App\Models\ShareContact;
use Illuminate\Http\Request;
use App\Models\ProjectRemark;
use App\Models\ReportProject;
use App\Models\PlatformReview;
use App\Models\VolunteerPoint;
use App\Mail\PlatformReviewMail;
use App\Models\PointTransaction;
use App\Models\VolunteerBooking;
use App\Models\VolunteerProfile;
use App\Mail\AppreciationMessage;
use App\Mail\OrganizationReminder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\ProjectReviewRequested;
use App\Models\VolunteerSponsorship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VolunteerProfileUpdated;
use App\Models\VolunteerVerification;
use Illuminate\Support\Facades\Storage;
use App\Mail\UserVerificationRequestNotification;
use App\Mail\PlatformReview as MailPlatformReview;

class VolunteerController extends Controller
{

    public function shareMessages()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Volunteer') {
            return ['conversations' => []];
        }

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

            return $message->booking_public_id
                ? "{$baseKey}-{$message->booking_public_id}"
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

        return ['conversations' => $conversations->values()->all()];
    }

    // Add this method to your controller
    public function getTotalPoints()
    {
        $user = Auth::user();

        // Get total earned points (credits)
        $earnedOtherPoints = PointTransaction::where('user_public_id', $user->public_id)
            ->where('type', 'credit')
            ->sum('points');

        $earnedVolunteerPoints = VolunteerPoint::where('user_public_id', $user->public_id)
            ->sum('points_earned');

        $earnedPoints = $earnedOtherPoints + $earnedVolunteerPoints;

        // Get total spent points (debits)
        $spentPoints = PointTransaction::where('user_public_id', $user->public_id)
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
        $bookingCounts = VolunteerBooking::where('user_public_id', $user->public_id)
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when booking_status = "Pending" then 1 else 0 end) as pending')
            ->selectRaw('sum(case when booking_status = "Approved" then 1 else 0 end) as approved')
            ->selectRaw('sum(case when booking_status = "Rejected" then 1 else 0 end) as rejected')
            ->selectRaw('sum(case when booking_status = "Completed" then 1 else 0 end) as completed')
            ->first();

        // Get recent activities (last 5 points earned)
        $recentActivities = VolunteerPoint::with(['booking.project'])
            ->where('user_public_id', $user->public_id)
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
        $user = Auth::user();

        $bookings = VolunteerBooking::with(['project', 'reminders', 'payments', 'pointTransactions', 'project.user'])
            ->where('user_public_id', $user->public_id)
            ->orderBy('created_at', 'desc') // Add this line for descending order
            ->get()
            ->map(function ($booking) use ($user) {
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

                // Get contact requests for this specific booking
                $booking->contact_requests = ShareContact::with(['organization.organizationProfile'])
                    ->where('volunteer_public_id', $user->public_id)
                    ->where('booking_public_id', $booking->public_id)
                    ->where('status', 'pending')
                    ->get();

                // Get shared contacts for this specific booking
                $booking->shared_contacts = ShareContact::with(['organization.organizationProfile'])
                    ->where('volunteer_public_id', $user->public_id)
                    ->where('booking_public_id', $booking->public_id)
                    ->where('status', 'approved')
                    ->get();

                return $booking;
            });

        $earnedPoints = VolunteerPoint::where('user_public_id', $user->public_id)
            ->sum('points_earned');

        $earnedReferralPoints = PointTransaction::where('user_public_id', $user->public_id)
            ->where('type', 'credit')
            ->sum('points');

        $grandEarnedPoints = $earnedPoints + $earnedReferralPoints;

        $spentPoints = PointTransaction::where('user_public_id', $user->public_id)
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
    public function messages(Request $request)
    {
        $user = Auth::user();

        // Check if this is a polling request
        if ($request->has('polling') && $request->polling) {
            $senderId = $request->get('sender_id');
            $lastMessageId = $request->get('last_message_id');

            // Get messages for specific conversation since last message ID
            $messages = Message::with(['sender', 'receiver', 'originalMessage.sender', 'booking', 'project'])
                ->where(function ($query) use ($user, $senderId) {
                    $query->where(function ($q) use ($user, $senderId) {
                        $q->where('receiver_id', $user->id)
                            ->where('sender_id', $senderId);
                    })->orWhere(function ($q) use ($user, $senderId) {
                        $q->where('sender_id', $user->id)
                            ->where('receiver_id', $senderId);
                    });
                })
                ->when($lastMessageId, function ($query) use ($lastMessageId) {
                    // If we have a numeric ID, use greater than comparison
                    if (is_numeric($lastMessageId)) {
                        return $query->where('id', '>', $lastMessageId);
                    }
                    // Otherwise, get messages after a certain timestamp
                    return $query->where('created_at', '>', now()->subMinutes(5));
                })
                ->orderBy('created_at', 'asc')
                ->get();

            // Group messages by sender for the response format
            $conversations = [];
            if ($messages->count() > 0) {
                $otherUser = $messages->first()->sender_id === $user->id
                    ? $messages->first()->receiver
                    : $messages->first()->sender;

                $conversations[] = [
                    'sender' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                    ],
                    'messages' => $messages->map(function ($message) {
                        return [
                            'id' => $message->id,
                            'message' => $message->message,
                            'sender_id' => $message->sender_id,
                            'receiver_id' => $message->receiver_id,
                            'status' => $message->status,
                            'created_at' => $message->created_at,
                            'reply_to' => $message->reply_to,
                            'temp_id' => $message->temp_id,
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
                    }),
                    'unreadCount' => $messages->where('receiver_id', $user->id)
                        ->where('status', 'Unread')
                        ->count(),
                    'latestMessage' => $messages->sortByDesc('created_at')->first()
                ];
            }

            return response()->json([
                'messages' => $conversations
            ]);
        }

        // Get all messages where user is either sender or receiver - FIXED: use id not public_id
        $messages = Message::with(['sender', 'receiver', 'originalMessage.sender', 'booking', 'project'])
            ->where(function ($query) use ($user) {
                $query->where('receiver_id', $user->id)  // Changed from public_id to id
                    ->orWhere('sender_id', $user->id); // Changed from public_id to id
            })
            ->orderBy('created_at', 'asc')
            ->get();

        // Group messages by conversation partner
        $groupedMessages = $messages->groupBy(function ($message) use ($user) {
            // Use a composite key that includes booking_public_id if available
            $baseKey = $message->sender_id === $user->id
                ? $message->receiver_id
                : $message->sender_id;

            return $message->booking_public_id
                ? "{$baseKey}-{$message->booking_public_id}"
                : $baseKey;
        });

        // Prepare conversations with replied messages
        $conversations = $groupedMessages->map(function ($messages, $otherUserId) use ($user) {
            $otherUser = $messages->first()->sender_id === $user->id
                ? $messages->first()->receiver
                : $messages->first()->sender;

            // Count actual unread messages for this conversation
            $unreadCount = $messages->where('receiver_id', $user->id)
                ->where('status', 'Unread')
                ->count();

            // Add replied message data to each message
            $enhancedMessages = $messages->map(function ($message) {
                return [
                    'id' => $message->id, // Use regular id, not public_id
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
                    'id' => $otherUser->id, // Use regular id
                    'name' => $otherUser->name,
                    'email' => $otherUser->email,
                ],
                'messages' => $enhancedMessages,
                'unreadCount' => $unreadCount,
                'latestMessage' => $messages->sortByDesc('created_at')->first(),
                'actualUnreadMessages' => $unreadCount, // Add this for clarity
            ];
        })->sortByDesc(function ($conversation) {
            return $conversation['latestMessage']['created_at'];
        });

        // Calculate total unread messages across all conversations
        $totalUnreadMessages = $conversations->sum('unreadCount');

        return inertia('Volunteers/Messages', [
            'messages' => [  // Change this to an object
                'conversations' => $conversations->values()->all(),
                'totalUnreadMessages' => $totalUnreadMessages,
            ],
            'points' => $this->getTotalPoints(),
        ]);
    }

    public function getUnreadMessageCount()
    {
        $user = Auth::user();

        // Use 'status' field instead of 'read_at'
        $totalUnread = Message::where('receiver_id', $user->id)
            ->where('status', 'Unread') // Changed from whereNull('read_at')
            ->count();

        return response()->json([
            'totalUnread' => $totalUnread
        ]);
    }

    public function markAllRead($senderId)
    {
        $user = Auth::user();

        // FIXED: Use user->id instead of user->public_id
        $messages = Message::where('sender_id', $senderId)
            ->where('receiver_id', $user->id)  // Changed from $user->public_id to $user->id
            ->where('status', 'Unread')
            ->get();

        if ($messages->isEmpty()) {
            return response()->noContent();
        }

        // Mark all unread messages as read
        Message::where('sender_id', $senderId)
            ->where('receiver_id', $user->id)  // Changed from $user->public_id to $user->id
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
            'project_public_id' => 'nullable|exists:projects,public_id',
            'booking_public_id' => 'nullable|exists:volunteer_bookings,public_id',
        ]);

        $user = Auth::user();

        // Get the receiver user
        $receiverUser = User::find($request->receiver_id);

        if (!$receiverUser) {
            return response()->json([
                'success' => false,
                'message' => 'Receiver not found.'
            ], 404);
        }

        // Handle project and booking - make them optional
        $project = null;
        $booking = null;

        if ($request->project_public_id) {
            $project = Project::where('public_id', $request->project_public_id)->first();
        }

        if ($request->booking_public_id) {
            $booking = VolunteerBooking::where('public_id', $request->booking_public_id)->first();
        }

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

        // Use proper values for project and booking public IDs
        $projectPublicId = $project ? $project->public_id : null;
        $bookingPublicId = $booking ? $booking->public_id : null;

        try {
            $message = Message::create([
                'sender_id' => $user->id,
                'receiver_id' => $receiverUser->id,
                'message' => $filteredMessage,
                'status' => 'Unread',
                'reply_to' => $request->reply_to,
                'project_public_id' => $projectPublicId,
                'booking_public_id' => $bookingPublicId,
            ]);

            // Load relationships
            $message->load(['sender', 'receiver', 'originalMessage.sender', 'project', 'booking']);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully.',
                'hasRestrictedContent' => $hasRestrictedContent,
                'isPaidProject' => $isPaidProject,
                'hasPayment' => $hasPayment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }
    public function panelStoreMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'project_public_id' => 'required|exists:projects,id',
        ]);

        // $message = Message::create([
        //     'sender_id' => $request->sender_id,
        //     'receiver_id' => $request->receiver_id,
        //     'message' => $request->message,
        //     'project_public_id' => $request->project_public_id,
        //     'status' => 'Unread',
        // ]);

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function storeProjectReport(Request $request)
    {
        $validated = $request->validate([
            'project_public_id' => 'required|exists:projects,id',
            'report_category_id' => 'required|exists:report_categories,id',
            'report_subcategory_id' => 'required|exists:report_subcategories,id',
            'description' => 'required',
        ]);

        $user = Auth::user();

        $report_project = ReportProject::create([
            'user_public_id' => $user->public_id,
            'project_public_id' => $validated['project_public_id'],
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
            ->where('user_public_id', Auth::id())
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
            'receiver_id' => $booking->project->user_public_id,
            'message' => ucfirst($stage) . ' reminder sent about the bookingthat was made on ' . $booking->created_at->format('F j, Y'),
            'project_public_id' => $booking->project_public_id,
            'status' => 'Unread',
        ]);

        // Create reminder record
        Reminder::create([
            'user_public_id' => Auth::id(),
            'project_public_id' => $booking->project_public_id,
            'booking_public_id' => $booking->public_id,
            'stage' => $stage,
            'message' => ucfirst($stage) . ' reminder sent about the bookingthat was made on ' . $booking->created_at->format('F j, Y'),
        ]);

        return back()->with('success', ucfirst($stage) . ' reminder sent successfully!');
    }
    public function profile()
    {
        $user = Auth::user();
        $volunteer = VolunteerProfile::where('user_public_id', $user->public_id)->first();

        $verification = $volunteer
            ? VolunteerVerification::where('volunteer_public_id', $volunteer->public_id)->first()
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
        if ($volunteer->user_public_id !== $user->public_id) {
            abort(403);
        }

        return Inertia::render('Volunteers/Verification', [
            'profile' => $volunteer,
            'auth' => [
                'user' => $user,
            ],
            'volunteer' => $volunteer->public_id,
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
        $existingVerification = VolunteerVerification::where('volunteer_public_id', $volunteerProfile->public_id)->first();

        // Store the new document file
        if ($request->hasFile('document')) {
            // Delete the old document if it exists
            if ($existingVerification && $existingVerification->document) {
                Storage::disk('public')->delete($existingVerification->document);
            }

            $data['document'] = $request->file('document')->store('verification_document', 'public');
        }

        // Add the volunteer profile ID to the data
        $data['volunteer_public_id'] = $volunteerProfile->public_id;
        $data['status'] = 'Pending'; // Reset status to Pending for new submission

        // Update or create the verification record
        if ($existingVerification) {
            $existingVerification->update($data);
        } else {
            VolunteerVerification::create($data);
        }

        // Send notification to all admins
        $this->notifyAdminsAboutVerificationRequest(Auth::user(), $data);

        // Redirect to profile page with success message
        return redirect()->route('volunteer.profile')->with('success', 'Verification documents submitted successfully!');
    }

    /**
     * Notify all admins about verification request
     */
    private function notifyAdminsAboutVerificationRequest(User $user, array $verificationData = [])
    {
        try {
            // Get all admin emails
            $adminEmails = Admin::pluck('email')->toArray();

            if (empty($adminEmails)) {
                Log::warning('No admin emails found to send verification request notification');
                return;
            }

            // Send email to each admin
            foreach ($adminEmails as $email) {
                Mail::to($email)->send(new UserVerificationRequestNotification($user, $verificationData));
            }

            Log::info('Verification request notifications sent to admins', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'admins_notified' => count($adminEmails)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send verification request notifications to admins: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

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
        $volunteer = VolunteerProfile::firstOrNew(['user_public_id' => $user->public_id]);

        // Track changes for email notification
        $changes = [];
        $oldData = $volunteer->exists ? $volunteer->toArray() : [];

        // Handle profile picture upload/removal
        if ($request->hasFile('profile_picture')) {
            // Delete old picture if exists
            if ($volunteer->profile_picture) {
                Storage::disk('public')->delete($volunteer->profile_picture);
            }
            $data['profile_picture'] = $request->file('profile_picture')->store('volunteer/profile_pictures', 'public');
            $changes['profile_picture'] = [
                'old' => $volunteer->profile_picture ? 'Previous image' : 'No image',
                'new' => 'New image uploaded'
            ];
        } elseif ($request->input('remove_profile_picture', false)) {
            // Remove picture if requested
            if ($volunteer->profile_picture) {
                Storage::disk('public')->delete($volunteer->profile_picture);
            }
            $data['profile_picture'] = null;
            $changes['profile_picture'] = [
                'old' => 'Had profile picture',
                'new' => 'Profile picture removed'
            ];
        } elseif ($request->filled('current_profile_picture')) {
            // Keep existing picture if no changes
            $data['profile_picture'] = $request->input('current_profile_picture');
        }

        // Set user_public_id if creating new profile
        if (!$volunteer->exists) {
            $data['user_public_id'] = $user->public_id;
            $changes['profile_status'] = [
                'old' => 'No profile',
                'new' => 'Profile created'
            ];
        }

        // Track field changes
        $trackedFields = [
            'gender',
            'dob',
            'country',
            'state',
            'city',
            'postal',
            'phone',
            'facebook',
            'twitter',
            'instagram',
            'linkedin',
            'education_status',
            'nok',
            'nok_phone',
            'nok_relation'
        ];

        foreach ($trackedFields as $field) {
            if (isset($data[$field]) && isset($oldData[$field]) && $data[$field] != $oldData[$field]) {
                $changes[$field] = [
                    'old' => $oldData[$field] ?? 'Not set',
                    'new' => $data[$field]
                ];
            } elseif (!isset($oldData[$field]) && isset($data[$field])) {
                $changes[$field] = [
                    'old' => 'Not set',
                    'new' => $data[$field]
                ];
            }
        }

        // Track array field changes (hobbies, skills)
        if (isset($data['hobbies']) && json_encode($data['hobbies']) !== json_encode($oldData['hobbies'] ?? [])) {
            $changes['hobbies'] = [
                'old' => !empty($oldData['hobbies']) ? implode(', ', $oldData['hobbies']) : 'None',
                'new' => !empty($data['hobbies']) ? implode(', ', $data['hobbies']) : 'None'
            ];
        }

        if (isset($data['skills']) && json_encode($data['skills']) !== json_encode($oldData['skills'] ?? [])) {
            $changes['skills'] = [
                'old' => !empty($oldData['skills']) ? implode(', ', $oldData['skills']) : 'None',
                'new' => !empty($data['skills']) ? implode(', ', $data['skills']) : 'None'
            ];
        }

        // Update or create the volunteer profile
        $volunteer->fill($data);
        $volunteer->save();

        // Send email notification to all admins if there are changes
        if (!empty($changes)) {
            $admins = Admin::all();
            foreach ($admins as $admin) {
                Mail::to($admin->email)
                    ->send(new VolunteerProfileUpdated($volunteer, $user, $changes));
            }
        }

        return redirect()->back()->with('success', 'Profile saved successfully.');
    }

    public function points()
    {
        $user = Auth::user();

        // Get all point transactions
        $transactions = PointTransaction::with(['booking.project'])
            ->where('user_public_id', $user->public_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->public_id,
                    'source' => 'transaction', // identify type
                    'type' => $transaction->type,
                    'points' => $transaction->points,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                    'booking' => $transaction->booking,
                ];
            });

        // Get volunteer points
        $volunteerPoints = VolunteerPoint::where('user_public_id', $user->public_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($vp) {
                return [
                    'id' => $vp->public_id,
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
            ],
            'timestamp' => now()->timestamp // Add this to bust cache
        ]);
    }


    // public function points()
    // {
    //     $user = Auth::user();

    //     // Get all point transactions ordered by date
    //     $transactions = PointTransaction::with(['booking.project'])
    //         ->where('user_public_id', $user->public_id)
    //         ->orderBy('created_at', 'desc')
    //         ->get()
    //         ->map(function ($transaction) {
    //             return [
    //                 'id' => $transaction->public_id,
    //                 'type' => $transaction->type,
    //                 'points' => $transaction->points,
    //                 'description' => $transaction->description,
    //                 'created_at' => $transaction->created_at,
    //                 'booking' => $transaction->booking,
    //             ];
    //         });

    //     $volunteerPoints = VolunteerPoint::where('user_public_id', $user->public_id);


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
                $user->public_id,
                $organization->public_id,
                $booking->public_id,
                $pointsNeeded,
                'debit',
                'Points used for booking payment for project: ' . $booking->project->title
            );

            // 3. Add points to organization (credit transaction)
            $this->createPointTransaction(
                $organization->public_id,
                $organization->public_id,
                $booking->public_id,
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
            'user_public_id' => $userId,
            'organization_id' => $organizationId,
            'booking_public_id' => $bookingId,
            'points' => $points,
            'type' => $type,
            'description' => $description,
        ]);
    }
    protected function deductPoints($user, $points, $booking)
    {
        // Create debit transaction
        PointTransaction::create([
            'user_public_id' => $user->public_id,
            'organization_id' => $booking->project->user_public_id,
            'booking_public_id' => $booking->public_id,
            'points' => $points,
            'type' => 'debit',
            'description' => 'Points used for booking payment'
        ]);
    }

    protected function addOrganizationPoints($organization, $points, $booking)
    {
        // Create credit transaction
        PointTransaction::create([
            'user_public_id' => Auth::id(),
            'organization_id' => $organization->public_id,
            'booking_public_id' => $booking->public_id,
            'points' => $points,
            'type' => 'credit',
            'description' => 'Points received from volunteer'
        ]);
    }


    // Rating
    // Add this to your VolunteerController
    public function storeReview(Request $request)
    {
        $validated = $request->validate([
            'project_public_id' => 'required|exists:projects,public_id',
            'booking_public_id' => 'required|exists:volunteer_bookings,public_id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
            'status' => 'nullable|string'
        ]);

        $user = Auth::user();

        // Verify booking belongs to user
        $booking = VolunteerBooking::where('public_id', $validated['booking_public_id'])
            ->where('user_public_id', $user->public_id)
            ->firstOrFail();

        // Verify project matches booking
        if ($booking->project_public_id != $validated['project_public_id']) {
            return back()->with('error', 'Invalid project for this booking');
        }

        // Verify booking is completed
        if ($booking->booking_status !== 'Completed') {
            return back()->with('error', 'You can only review completed projects');
        }

        // Check for existing review
        if (ProjectRemark::where('user_public_id', $user->public_id)
            ->where('project_public_id', $validated['project_public_id'])
            ->exists()
        ) {
            return back()->with('error', 'You have already reviewed this project');
        }

        // Create review
        ProjectRemark::create([
            'user_public_id' => Auth::id(),
            'project_public_id' => $validated['project_public_id'],
            'booking_public_id' => $validated['booking_public_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => 'Pending'
        ]);

        return back()->with('success', 'Thank you for your review!');
    }

    public function platformReview(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'message' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        // Check if user already submitted a review
        $existingReview = PlatformReview::where('user_public_id', $user->public_id)->first();
        if ($existingReview) {
            return back()->with('error', 'You have already submitted a review for our platform.');
        }

        // Create review
        $platformReview = PlatformReview::create([
            'user_public_id' => $user->public_id,
            'rating' => $validated['rating'],
            'message' => $validated['message'] ?? null,
            'status' => 'Pending',
        ]);

        // Notify all admins
        $admins = Admin::all();
        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new PlatformReviewMail($platformReview));
        }

        return back()->with('success', 'Thank you for your review! Your feedback helps us improve our platform.');
    }

    // public function getContactRequests(Request $request)
    // {
    //     $user = Auth::user();

    //     $requests = ShareContact::with(['organization.organizationProfile'])
    //         ->where('volunteer_public_id', $user->public_id)
    //         ->orderBy('created_at', 'desc')
    //         ->get();

    //     return response()->json([
    //         'requests' => $requests
    //     ]);
    // }

    public function respondContactRequest(Request $request, $requestId)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'response_message' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        $contactRequest = ShareContact::where([
            'public_id' => $requestId,
            'volunteer_public_id' => $user->public_id,
        ])->firstOrFail();

        if (!$contactRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'This request has already been processed.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $contactRequest->update([
                'status' => $validated['status'],
                'approved_at' => $validated['status'] === 'approved' ? now() : null,
            ]);

            // Create notification for organization
            if ($validated['status'] === 'approved') {
                // TODO: Send notification to organization about approval
                // You can create a notification system here
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contact request ' . $validated['status'] . ' successfully.',
                'request' => $contactRequest
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to process request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getContactRequests()
    {
        $user = Auth::user();

        $contactRequests = $user->contactRequests()
            ->with('organization')
            ->where('status', 'pending')
            ->get();

        $sharedContacts = $user->sharedContacts()
            ->with('organization')
            ->where('status', 'approved')
            ->get();

        return response()->json([
            'requests' => $contactRequests,
            'shared_contacts' => $sharedContacts
        ]);
    }

    public function requestContactAccess(Request $request)
    {
        $validated = $request->validate([
            'organization_public_id' => 'required|exists:users,public_id',
            'message' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        // Check if there's already a pending or approved request
        $existingRequest = ShareContact::where('volunteer_public_id', $user->public_id)
            ->where('organization_public_id', $validated['organization_public_id'])
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingRequest) {
            return back()->with('error', 'You already have a pending or approved request for this organization.');
        }

        // Create new contact request
        ShareContact::create([
            'volunteer_public_id' => $user->public_id,
            'organization_public_id' => $validated['organization_public_id'],
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Contact access request sent successfully.');
    }

    public function sponsorships()
    {
        $user = Auth::user();

        // Get sponsorships where the volunteer is the recipient
        $sponsorships = Sponsorship::with([
            'booking.project',
            'booking.project.organizationProfile',
            'user', // The donor
            'appreciations' // Load appreciations to check if already sent
        ])
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('user_public_id', $user->public_id);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($sponsorship) use ($user) {
                $hasSentAppreciation = $sponsorship->appreciations
                    ->where('volunteer_public_id', $user->public_id)
                    ->isNotEmpty();

                return [
                    'id' => $sponsorship->public_id,
                    'project' => $sponsorship->booking->project->title ?? 'Unknown Project',
                    'organization' => $sponsorship->booking->project->organizationProfile->name ?? 'Unknown Organization',
                    'donor' => $sponsorship->user ? [
                        'name' => $sponsorship->user->name,
                        'is_anonymous' => $sponsorship->is_anonymous,
                    ] : null,
                    'amount' => (float) $sponsorship->amount,
                    'processed_amount' => (float) $sponsorship->processed_amount,
                    'date' => $sponsorship->created_at->format('M d, Y'),
                    'status' => $sponsorship->status,
                    'is_anonymous' => $sponsorship->is_anonymous,
                    'appreciation_sent' => $hasSentAppreciation, // Add this flag
                ];
            });

        // Get volunteer sponsorship applications
        $volunteer_sponsorships = VolunteerSponsorship::with([
            'booking.project',
            'sponsorships'
        ])
            ->where('user_public_id', $user->public_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($application) {
                return [
                    'public_id' => $application->public_id,
                    'total_amount' => (float) $application->total_amount,
                    'travel' => (float) $application->travel,
                    'accommodation' => (float) $application->accommodation,
                    'meals' => (float) $application->meals,
                    'living_expenses' => (float) $application->living_expenses,
                    'visa_fees' => (float) $application->visa_fees,
                    'project_fees_amount' => (float) $application->project_fees_amount,
                    'self_introduction' => $application->self_introduction,
                    'impact' => $application->impact,
                    'aspect_needs_funding' => $application->aspect_needs_funding ?? [],
                    'skills' => $application->skills ?? [],
                    'status' => $application->status ?? 'submitted',
                    'created_at' => $application->created_at,
                    'booking' => $application->booking ? [
                        'project' => $application->booking->project ? [
                            'title' => $application->booking->project->title,
                        ] : null,
                    ] : null,
                    'funded_amount' => (float) $application->funded_amount,
                ];
            });

        // Calculate stats with default values
        $completedSponsorships = $sponsorships->where('status', 'completed');
        $totalSponsored = $completedSponsorships->sum('amount');
        $totalSponsorships = $sponsorships->count();
        $completedCount = $completedSponsorships->count();

        $stats = [
            'total_sponsored' => $totalSponsored ?? 0,
            'total_sponsorships' => $totalSponsorships ?? 0,
            'completed_sponsorships' => $completedCount ?? 0,
        ];

        return inertia('Volunteers/Sponsorships', [
            'sponsorships' => $sponsorships,
            'volunteer_sponsorships' => $volunteer_sponsorships,
            'stats' => $stats,
            'auth' => [
                'user' => $user->toArray(),
            ],
        ]);
    }

    public function updateSponsorshipApplication(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'public_id' => 'required|exists:volunteer_sponsorships,public_id',
            'travel' => 'required|numeric|min:0',
            'accommodation' => 'required|numeric|min:0',
            'meals' => 'required|numeric|min:0',
            'living_expenses' => 'required|numeric|min:0',
            'visa_fees' => 'required|numeric|min:0',
            'project_fees_amount' => 'required|numeric|min:0',
            'self_introduction' => 'required|string|max:2000',
            'impact' => 'required|string|max:2000',
            'aspect_needs_funding' => 'nullable|array',
            'skills' => 'nullable|array',
            'commitment' => 'required|boolean',
            'agreement' => 'required|boolean',
            'has_changes' => 'sometimes|boolean',
            'original_status' => 'sometimes|string',
        ]);

        // Verify the application belongs to the user
        $application = VolunteerSponsorship::where('public_id', $validated['public_id'])
            ->where('user_public_id', $user->public_id)
            ->firstOrFail()
            ->update(['status' => 'Pending']);

        // Calculate total amount
        $validated['total_amount'] = $validated['travel'] +
            $validated['accommodation'] +
            $validated['meals'] +
            $validated['living_expenses'] +
            $validated['visa_fees'] +
            $validated['project_fees_amount'];

        // Track changes and update status if there are changes
        $updateData = $validated;

        // If changes were detected, set status to Pending
        if ($request->has_changes) {
            $updateData['status'] = 'Pending';
            $updateData['submitted_at'] = now();
            $updateData['last_updated_at'] = now();

            // You might want to track what was changed
            $updateData['changes_made'] = true;
        }

        // Update the application
        $application->update($updateData);

        return back()->with('success', 'Application updated successfully!' .
            ($request->has_changes ? ' Application has been resubmitted for review.' : ''));
    }

    public function submitSponsorshipApplication($applicationId)
    {
        $user = Auth::user();

        // Verify the application belongs to the user and has Rejected status
        $application = VolunteerSponsorship::where('public_id', $applicationId)
            ->where('user_public_id', $user->public_id)
            ->where('status', 'Rejected')
            ->firstOrFail();

        // Update status to Pending
        $application->update([
            'status' => 'Pending',
            'submitted_at' => now(),
        ]);

        return back()->with('success', 'Application submitted for review successfully!');
    }


    public function sendAppreciation(Request $request)
    {
        $validated = $request->validate([
            'sponsorship_public_id' => 'required|exists:sponsorships,public_id',
            'message' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        // Get the sponsorship with donor information
        $sponsorship = Sponsorship::with(['user', 'booking.project'])
            ->where('public_id', $validated['sponsorship_public_id'])
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('user_public_id', $user->public_id);
            })
            ->firstOrFail();

        // Check if donor is anonymous
        if ($sponsorship->is_anonymous) {
            return back()->with('error', 'Cannot send appreciation to anonymous donors.');
        }

        // Check if appreciation was already sent for this sponsorship
        $existingAppreciation = Appreciation::where('sponsorship_public_id', $sponsorship->public_id)
            ->where('volunteer_public_id', $user->public_id)
            ->first();

        if ($existingAppreciation) {
            return back()->with('error', 'You have already sent an appreciation message for this sponsorship.');
        }

        // Filter restricted content
        $filteredMessage = $this->filterRestrictedContent($validated['message']);

        DB::beginTransaction();
        try {
            // Create appreciation record
            $appreciation = Appreciation::create([
                'public_id' => (string) Str::ulid(),
                'volunteer_public_id' => $user->public_id,
                'donor_public_id' => $sponsorship->user_public_id,
                'sponsorship_public_id' => $sponsorship->public_id,
                'message' => $filteredMessage,
                'status' => 'sent',
            ]);

            // Send email to donor
            Mail::to($sponsorship->user->email)
                ->send(new AppreciationMessage(
                    $user->name,
                    $sponsorship->user->name,
                    $filteredMessage,
                    $sponsorship->booking->project->title,
                    $sponsorship->amount
                ));

            DB::commit();

            // Return to the same page with success data
            return redirect()->route('volunteer.sponsorships')->with([
                'success' => 'Appreciation message sent successfully!',
                'show_success_modal' => true
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to send appreciation message: ' . $e->getMessage());
        }
    }

    // Helper method to filter restricted content
    private function filterRestrictedContent($message)
    {
        $patterns = [
            'phone' => '/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/',
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'url' => '/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/',
            'social_media' => '/(facebook|twitter|instagram|linkedin|tiktok)\.com\/[a-zA-Z0-9._-]+/i'
        ];

        $filteredMessage = $message;
        $hasRestrictedContent = false;

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $filteredMessage)) {
                $filteredMessage = preg_replace($pattern, '[content removed]', $filteredMessage);
                $hasRestrictedContent = true;
            }
        }

        return $filteredMessage;
    }
}
