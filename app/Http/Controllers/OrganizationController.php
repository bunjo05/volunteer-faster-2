<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Message;
use App\Models\Project;
use App\Models\Category;
use App\Events\NewMessage;
use Illuminate\Support\Str;
use App\Models\GalleryImage;
use App\Models\ShareContact;
use Illuminate\Http\Request;
use App\Mail\BookingCompleted;
use App\Models\PointTransaction;
use App\Models\VolunteerBooking;
use App\Models\OrganizationProfile;
use App\Mail\ProjectReviewRequested;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Storage;
use App\Models\OrganizationVerification;
use App\Services\VolunteerPointsService;
use Illuminate\Validation\ValidationException;

class OrganizationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $projects = Project::where('user_public_id', $user->public_id)
            ->with('category', 'subcategory')
            ->latest()
            ->get();

        return inertia('Organizations/Dashboard', [
            'projectsCount' => $projects->count(),
            'projectStatusCount' => [
                'approved' => $projects->where('status', 'Active')->count(),
                'pending' => $projects->where('status', 'Pending')->count(),
                'rejected' => $projects->where('status', 'Rejected')->count(),
                'completed' => $projects->where('status', 'Completed')->count(),
                'cancelled' => $projects->where('status', 'Cancelled')->count(),
            ],
            'messagesCount' => 0, // Add this if you have messages
            'recentMessages' => [], // Add this if you have messages
        ]);
    }

    public function volunteerBookings()
    {
        $user = Auth::user();

        $bookings = VolunteerBooking::with([
            'project' => function ($query) use ($user) {
                $query->where('user_public_id', $user->public_id);
            },
            'user.volunteerProfile',
            'user',
            'user.volunteerProfile.verification', // Add this to load verification
            'payments',
            'pointTransactions' => function ($query) use ($user) {
                $query->where('organization_public_id', $user->public_id)
                    ->where('type', 'credit');
            }
        ])
            ->whereHas('project', function ($query) use ($user) {
                $query->where('user_public_id', $user->public_id);
            })
            ->latest()
            ->get()
            ->filter(function ($booking) {
                return $booking->project !== null;
            });

        return Inertia::render('Organizations/Bookings', [
            'bookings' => $bookings->map(function ($booking) {
                $hasPointsPayment = $booking->pointTransactions->isNotEmpty();
                $pointsAmount = $hasPointsPayment ? $booking->pointTransactions->sum('points') : 0;

                return [
                    'public_id' => $booking->public_id, // Make sure this is included
                    // 'id' => $booking->id,
                    'start_date' => $booking->start_date,
                    'end_date' => $booking->end_date,
                    'number_of_travellers' => $booking->number_of_travellers,
                    'booking_status' => $booking->booking_status,
                    'message' => $booking->message,
                    'created_at' => $booking->created_at->format('M d, Y'),
                    'has_points_payment' => $hasPointsPayment,
                    'points_amount' => $pointsAmount,
                    'payments' => $booking->payments->map(function ($payment) {
                        return [
                            'public_id' => $payment->public_id,
                            'amount' => $payment->amount,
                            'status' => $payment->status,
                            'created_at' => $payment->created_at->format('M d, Y'),
                        ];
                    }),
                    'volunteer' => [
                        'name' => $booking->user->name,
                        'email' => $booking->user->email,
                        'public_id' => $booking->user->public_id,
                        'volunteer_profile' => $booking->user->volunteerProfile ? [
                            'public_id' => $booking->user->volunteerProfile->public_id,
                            'gender' => $booking->user->volunteerProfile->gender,
                            'dob' => $booking->user->volunteerProfile->dob,
                            'country' => $booking->user->volunteerProfile->country,
                            'city' => $booking->user->volunteerProfile->city,
                            'phone' => $booking->user->volunteerProfile->phone,
                            'profile_picture' => $booking->user->volunteerProfile->profile_picture,
                            'education_status' => $booking->user->volunteerProfile->education_status,
                            'skills' => $booking->user->volunteerProfile->skills,
                            'hobbies' => $booking->user->volunteerProfile->hobbies,
                            'nok' => $booking->user->volunteerProfile->nok,
                            'nok_phone' => $booking->user->volunteerProfile->nok_phone,
                            'nok_relation' => $booking->user->volunteerProfile->nok_relation,
                            'verification_status' => $booking->user->volunteerProfile->verification?->status,
                        ] : null
                    ],
                    'project' => [
                        'public_id' => $booking->project->public_id,
                        'title' => $booking->project->title,
                        'slug' => $booking->project->slug,
                        'location' => $booking->project->location,
                        'start_date' => $booking->project->start_date,
                        'end_date' => $booking->project->end_date,
                        'fees' => $booking->project->fees,
                    ],
                ];
            }),
        ]);
    }
    public function updateBookingStatus(VolunteerBooking $booking, Request $request)
    {
        $validated = $request->validate([
            'booking_status' => 'required|string|in:Pending,Approved,Rejected,Cancelled,Completed',
            'send_completion_email' => 'sometimes|boolean'
        ]);

        $previousStatus = $booking->booking_status;
        $booking->update(['booking_status' => $validated['booking_status']]);

        // Award points if status changed to Completed
        if ($validated['booking_status'] === 'Completed' && $previousStatus !== 'Completed') {
            $pointsService = new VolunteerPointsService();
            $pointsService->awardPointsForCompletedBooking($booking);

            // Add notification
            NotificationService::notifyBookingCompleted($booking);
        } elseif ($validated['booking_status'] === 'Cancelled' && $previousStatus !== 'Cancelled') {
            NotificationService::notifyBookingCancelled($booking);
        } elseif ($validated['booking_status'] === 'Rejected' && $previousStatus !== 'Rejected') {
            NotificationService::notifyBookingRejected($booking);
        } elseif ($validated['booking_status'] === 'Approved' && $previousStatus !== 'Approved') {
            NotificationService::notifyBookingApproved($booking);
        }


        // NotificationService::notifyBookingCompleted($booking);

        // Send completion email if status is Completed and flag is set
        if ($validated['booking_status'] === 'Completed' && ($request->send_completion_email ?? false)) {
            // Load the necessary relationships

            $booking->load(['user', 'project.user']);
            Mail::to($booking->user->email)
                ->send(new BookingCompleted($booking));
        }

        return back()->with('success', 'Booking status updated successfully');
    }

    public function profile()
    {
        $user = Auth::user();
        $organization = OrganizationProfile::where('user_public_id', $user->public_id)->first();

        $organization_verification = $organization
            ? OrganizationVerification::where('organization_profile_public_id', $organization->public_id)->first()
            : null;

        return Inertia::render('Organizations/Profile', [
            'organization' => $organization,
            'organization_verification' => $organization_verification,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }



    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:organization_profiles,slug,' . ($user->organization ? $user->organization->id : 'NULL'),
            'city' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'foundedYear' => 'required|integer|min:1900|max:' . date('Y'),
            'phone' => 'required|string|max:20',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            // 'email' => 'required|email',
            'description' => 'nullable|string',
            'mission_statement' => 'nullable|string|max:500',
            'vision_statement' => 'nullable|string|max:500',
            'values' => 'nullable|string|max:500',
            // 'address' => 'nullable|string|max:255',
            'postal' => 'nullable|string|max:20',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'current_logo' => 'nullable|string',
            'remove_logo' => 'nullable|boolean',
        ]);

        // Handle logo upload/removal
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($user->organization && $user->organization->logo) {
                Storage::disk('public')->delete($user->organization->logo);
            }
            $data['logo'] = $request->file('logo')->store('organization/logos', 'public');
        } elseif ($request->input('remove_logo', false)) {
            // Remove logo if requested
            if ($user->organization && $user->organization->logo) {
                Storage::disk('public')->delete($user->organization->logo);
            }
            $data['logo'] = null;
        } elseif ($request->filled('current_logo')) {
            // Keep existing logo if no changes
            $data['logo'] = $request->input('current_logo');
        }


        // Update or create organization profile
        if ($user->organization) {
            $user->organization->update($data);
        } else {
            $data['user_public_id'] = $user->public_id;
            OrganizationProfile::create($data);
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
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

        return inertia('Organizations/Messages', [
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
            'project_id' => 'nullable|exists:projects,id',
            'booking_id' => 'nullable|exists:volunteer_bookings,id',
        ]);

        $user = Auth::user();
        $project = $request->project_id ? Project::find($request->project_id) : null;
        $booking = $request->booking_id ? VolunteerBooking::find($request->booking_id) : null;


        // Check if this is a paid project conversation
        $isPaidProject = $project && $project->type_of_project === 'Paid';

        // Check if user has made payment for paid projects
        $hasPayment = false;
        if ($isPaidProject) {
            $hasPayment = VolunteerBooking::where('user_public_id', $user->public_id)
                ->where('project_id', $project->id)
                ->where('booking_status', 'Approved')
                ->whereHas('payments', function ($query) {
                    $query->where('status', 'completed');
                })
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

        // Load relationships before broadcasting
        $message->load(['sender', 'receiver', 'originalMessage.sender', 'project', 'booking']);

        // Single broadcast call
        broadcast(new NewMessage($message))->toOthers();

        return back()->with([
            'success' => 'Message sent successfully.',
            'hasRestrictedContent' => $hasRestrictedContent,
            'isPaidProject' => $isPaidProject,
            'hasPayment' => $hasPayment,
        ]);
    }


    public function projects()
    {
        $user = Auth::user();

        $projects = Project::with([
            'category',
            'subcategory',
            'featuredProjects' => function ($query) {
                $query->where('status', 'pending')
                    ->orWhere('is_active', true);
            }
        ])
            ->where('user_public_id', $user->public_id)
            ->latest()
            ->get();

        return inertia('Organizations/Projects', [
            'userStatus' => $user->status,
            'organizationProfile' => $user->organization, // Pass the organization profile
            'projects' => $projects->map(function ($project) {
                return [
                    ...$project->toArray(),
                    'is_featured' => $project->featuredProjects
                        ->where('is_active', true)
                        ->isNotEmpty(),
                    'featured_projects' => $project->featuredProjects,
                ];
            }),
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function requestReview($projectPublicId)
    {
        $project = Project::where('public_id', $projectPublicId)->first();

        if (!$project || $project->user_public_id !== Auth::user()->public_id) {
            return back()->with('error', 'Unauthorized.');
        }

        if ($project->request_for_approval) {
            return back()->with('error', 'Review already requested.');
        }

        $project->update(['request_for_approval' => true]);

        $adminEmails = Admin::pluck('email')->toArray();
        foreach ($adminEmails as $email) {
            Mail::to($email)->send(new ProjectReviewRequested($project));
        }

        return back()->with('success', 'Review requested successfully.');
    }



    public function createProject()
    {
        $categories = Category::with('subcategories')->get();

        return Inertia::render('Organizations/Projects/Form', [
            'categories' => $categories,
        ]);
    }
    public function storeProject(Request $request, $slug = null)
    {
        // Determine if we're creating or updating
        $isEdit = $slug !== null;

        if ($isEdit) {
            $project = Project::where('slug', $slug)
                ->where('user_public_id', Auth::user()->public_id)
                ->firstOrFail();
        } else {
            $project = new Project();
        }

        $slugChanged = $request->has('slug') && $isEdit && $request->input('slug') !== $project->slug;

        $rules = [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'country' => 'required|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'min_duration' => 'required|integer',
            'max_duration' => 'required|integer',
            'duration_type' => 'required|in:Days,Weeks,Months',
            'daily_routine' => 'required|string',
            'type_of_project' => 'required|in:Paid,Free',
            'fees' => 'nullable|required_if:type_of_project,Paid|numeric',
            'currency' => 'nullable|required_if:type_of_project,Paid|string',
            'category_of_charge' => 'nullable|required_if:type_of_project,Paid|string',
            'includes' => 'nullable|array',
            'includes.*' => 'string',
            'excludes' => 'nullable|array',
            'excludes.*' => 'string',
            'activities' => 'required|string',
            'suitable' => 'nullable|array',
            'suitable.*' => 'string|in:Adults,Students,Families,Retirees',
            'skills' => 'nullable|array',
            'skills*' => 'string|in:',
            'availability_months' => 'required|array',
            'availability_months.*' => 'string|in:January,February,March,April,May,June,July,August,September,October,November,December',
            'start_date' => 'nullable|date',
            'point_exchange' => 'nullable|boolean',
            'existing_featured_image' => 'nullable|string',
        ];

        if ($isEdit) {
            $rules['gallery_images'] = 'nullable|array';
            $rules['gallery_images.*'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            // Only require existing_gallery_images if there were existing images
            if ($project->galleryImages()->count() > 0) {
                $rules['existing_gallery_images'] = 'required|array';
                $rules['existing_gallery_images.*'] = 'string';
            }
        } else {
            $rules['gallery_images'] = 'required|array|min:1';
            $rules['gallery_images.*'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        }

        // Featured image validation
        if ($request->hasFile('featured_image')) {
            $rules['featured_image'] = 'image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        }

        // Validate slug only if changed or new project
        if ($slugChanged || !$isEdit) {
            $rules['slug'] = 'required|string|max:255|unique:projects,slug';
        }

        $data = $request->validate($rules);

        if (!$slugChanged && $isEdit) {
            $data['slug'] = $project->slug;
        }

        $data = $request->validate($rules);
        $data['skills'] = $request->input('skills', []);

        $data['user_public_id'] = Auth::user()->public_id;
        $data['status'] = $isEdit ? $project->status : 'Pending';

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($isEdit && $project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        } elseif ($request->filled('existing_featured_image')) {
            $data['featured_image'] = $request->input('existing_featured_image');
        } elseif ($isEdit && $project->featured_image) {
            // Keep existing image if not changed
            $data['featured_image'] = $project->featured_image;
        } else {
            $data['featured_image'] = null;
        }

        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        $project->fill($data);
        $project->save();

        // Handle gallery images
        if ($isEdit) {
            // Get existing gallery image IDs from request
            $existingImageIds = $request->input('existing_gallery_images', []);

            // Delete images that were removed
            $imagesToDelete = $project->galleryImages()
                ->whereNotIn('id', $existingImageIds)
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        // Add new gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');
                GalleryImage::create([
                    'project_public_id' => $project->public_id,
                    'image_path' => $path,
                ]);
            }
        }

        // For new projects, ensure at least one gallery image exists
        if (!$isEdit && $project->galleryImages()->count() === 0) {
            throw ValidationException::withMessages([
                'gallery_images' => 'At least one gallery image is required.'
            ]);
        }


        $message = $isEdit
            ? 'Project updated successfully.'
            : 'Project created successfully.';

        return redirect()->route('organization.projects')->with('success', $message);
    }

    public function editProject($slug)
    {
        $project = Project::with(['category', 'subcategory', 'galleryImages'])
            ->where('slug', $slug)
            ->where('user_public_id', Auth::user()->public_id)
            ->firstOrFail();

        $categories = Category::with('subcategories')->get();

        return inertia('Organizations/Projects/Form', [
            'project' => $project,
            'categories' => $categories,
            'isEdit' => true,
        ]);
    }


    public function updateProject(Request $request, $slug)
    {
        $project = Project::where('slug', $slug)
            ->where('user_public_id', Auth::user()->public_id)
            ->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug,' . $project->id,
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'existing_featured_image' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'country' => 'required|string',
            'city' => 'required|string',
            'state' => 'nullable|string',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'min_duration' => 'required|integer',
            'max_duration' => 'required|integer',
            'duration_type' => 'required|in:Days,Weeks,Months',
            'daily_routine' => 'required|string',
            'type_of_project' => 'required|in:Paid,Free',
            'fees' => 'nullable|required_if:type_of_project,Paid|numeric',
            'currency' => 'nullable|required_if:type_of_project,Paid|string',
            'category_of_charge' => 'nullable|required_if:type_of_project,Paid|string',
            'includes' => 'nullable|required_if:type_of_project,Paid|string',
            'excludes' => 'nullable|required_if:type_of_project,Paid|string',
            'activities' => 'required|string',
            'suitable' => 'nullable|array',
            'suitable.*' => 'string|in:Adults,Students,Families,Retirees',
            'availability_months' => 'required|array',
            'availability_months.*' => 'string|in:January,February,March,April,May,June,July,August,September,October,November,December',
            'start_date' => 'nullable|date',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'existing_gallery_images' => 'nullable|array',
            'existing_gallery_images.*' => 'string',
            'point_exchange' => 'nullable|boolean',
            'remove_featured_image' => 'nullable|boolean',
        ]);


        // Handle featured image
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')
                ->store('projects/featured', 'public');
        } elseif ($request->remove_featured_image) {
            // Remove featured image if requested
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $data['featured_image'] = null;
        }

        // Handle gallery images
        $existingGalleryImages = $request->input('existing_gallery_images', []);

        // Delete removed images
        $project->galleryImages()
            ->whereNotIn('image_path', $existingGalleryImages)
            ->each(function ($image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            });

        // Add new images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');
                GalleryImage::create([
                    'project_public_id' => $project->public_id,
                    'image_path' => $path,
                ]);
            }
        }

        $project->update($data);

        return redirect()->route('organization.projects')
            ->with('success', 'Project updated successfully.');
    }

    public function deleteProject($slug)
    {
        $project = Project::where('slug', $slug)->where('user_public_id', Auth::user()->public_id)->firstOrFail();

        // Delete gallery images
        foreach ($project->galleryImages as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        // Delete featured image
        if ($project->featured_image) {
            Storage::disk('public')->delete($project->featured_image);
        }

        $project->delete();

        return redirect()->route('organization.projects')->with('success', 'Project deleted successfully.');
    }

    public function deleteGalleryImage(Request $request)
    {
        $request->validate([
            'image_id' => 'required|exists:gallery_images,id',
        ]);

        $galleryImage = GalleryImage::findOrFail($request->image_id);

        // Delete the image from storage
        Storage::disk('public')->delete($galleryImage->image_path);

        // Delete the record from the database
        $galleryImage->delete();

        return response()->json(['message' => 'Gallery image deleted successfully.']);
    }

    public function getTotalPoints()
    {
        $user = Auth::user();

        // Get total earned points (credits)
        $earnedPoints = PointTransaction::where('user_public_id', $user->public_id)
            ->where('type', 'credit')
            ->sum('points');

        // Get total spent points (debits)
        $spentPoints = PointTransaction::where('user_public_id', $user->public_id)
            ->where('type', 'debit')
            ->sum('points');

        return $earnedPoints - $spentPoints;
    }


    public function points()
    {
        $user = Auth::user();

        // Get all point transactions where organization received points (credits)
        $transactions = PointTransaction::with([
            'user.volunteerProfile',
            'booking.project',
            'user' // Ensure user relationship is loaded
        ])
            ->where('user_public_id', $user->public_id)
            ->where('type', 'credit')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'points' => $transaction->points,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                    'user' => [
                        'name' => $transaction->user?->name,
                        'email' => $transaction->user?->email,
                        'volunteer_profile' => $transaction->user?->volunteerProfile
                    ],
                    'booking' => $transaction->booking ? [
                        'start_date' => $transaction->booking->start_date,
                        'end_date' => $transaction->booking->end_date,
                        'project' => $transaction->booking->project
                    ] : null
                ];
            });

        // Calculate total points (only credits count for user)
        $totalPoints = PointTransaction::where('user_public_id', $user->public_id)
            ->where('type', 'credit')
            ->sum('points');

        return inertia('Organizations/Points', [
            'auth' => [
                'user' => $user->toArray(),
            ],
            'totalPoints' => $totalPoints,
            'pointsHistory' => $transactions
        ]);
    }


    public function verification()
    {
        $user = Auth::user();
        $organization_profile = OrganizationProfile::where('user_public_id', $user->public_id)->first();

        if (!$organization_profile) {
            return redirect()->route('organization.profile')->with('error', 'Organization profile not found.');
        }

        return Inertia::render('Organizations/Verification', [
            'profile' => $organization_profile,
            'auth' => [
                'user' => $user,
            ],
            'organization_profile' => $organization_profile->slug,
        ]);
    }

    public function storeVerification(Request $request, $organization_profile)
    {
        $organizationProfile = OrganizationProfile::where('slug', $organization_profile)->firstOrFail();

        $data = $request->validate([
            'type_of_document' => 'required|string|max:255',
            'certificate' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'type_of_document_2' => 'nullable|string|max:255',
            'another_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Store the certificate files
        if ($request->hasFile('certificate')) {
            $data['certificate'] = $request->file('certificate')->store('verification_certificates', 'public');
        }

        if ($request->hasFile('another_document')) {
            $data['another_document'] = $request->file('another_document')->store('other_verification_documents', 'public');
        }

        // Add the organization profile ID to the data
        $data['organization_profile_id'] = $organizationProfile->id;

        // Create the verification record
        OrganizationVerification::create($data);

        // Redirect to profile page with success message
        return redirect()->route('organization.profile')->with('success', 'Verification documents submitted successfully!');
    }

    public function requestContactAccess(Request $request)
    {
        $validated = $request->validate([
            'volunteer_public_id' => 'required|exists:users,public_id',
            'project_public_id' => 'required|exists:projects,public_id',
            'message' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        // Check if volunteer exists and is actually a volunteer
        $volunteer = User::where('public_id', $validated['volunteer_public_id'])
            ->where('role', 'Volunteer')
            ->firstOrFail();

        // Check if a request already exists
        $existingRequest = ShareContact::where([
            'organization_public_id' => $user->public_id,
            'volunteer_public_id' => $volunteer->public_id,
        ])->first();

        if ($existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'A contact request already exists for this volunteer.'
            ], 409);
        }

        // Create the contact share request
        $contactShare = ShareContact::create([
            'public_id' => (string) Str::ulid(),
            'organization_public_id' => $user->public_id,
            'volunteer_public_id' => $volunteer->public_id,
            'status' => 'pending',
            'message' => $validated['message'] ?? null, // Use null if message is empty
            'requested_at' => now(),
        ]);

        // TODO: Send notification to volunteer (email, in-app notification, etc.)

        return response()->json([
            'success' => true,
            'message' => 'Contact request sent successfully.',
            'request' => $contactShare
        ]);
    }

    public function getContactRequests(Request $request)
    {
        $user = Auth::user();

        $requests = ShareContact::with(['volunteer.volunteerProfile'])
            ->where('organization_public_id', $user->public_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'requests' => $requests
        ]);
    }

    public function getSharedContacts(Request $request)
    {
        $user = Auth::user();

        $sharedContacts = ShareContact::with(['volunteer.volunteerProfile'])
            ->where('organization_public_id', $user->public_id)
            ->where('status', 'approved')
            ->orderBy('approved_at', 'desc')
            ->get();

        return response()->json([
            'shared_contacts' => $sharedContacts
        ]);
    }
}
