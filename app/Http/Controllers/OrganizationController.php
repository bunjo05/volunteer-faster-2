<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Message;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use App\Mail\BookingCompleted;
use App\Models\VolunteerBooking;
use App\Models\OrganizationProfile;
use App\Mail\ProjectReviewRequested;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Services\VolunteerPointsService;

class OrganizationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $projects = Project::where('user_id', $user->id)
            ->with('category', 'subcategory')
            ->latest()
            ->get();
        // $messages = Message::where('receiver_id', $user->id)->latest()->take(3)->get();

        return inertia('Organizations/Dashboard', [
            'projectsCount' => $projects->count(),
            'projectStatusCount' => [
                'approved' => $projects->where('booking_status', 'Approved')->count(),
                'pending' => $projects->where('booking_status', 'Pending')->count(),
                'rejected' => $projects->where('booking_status', 'Rejected')->count(),
                'completed' => $projects->where('booking_status', 'Completed')->count(),
                'cancelled' => $projects->where('booking_status', 'Cancelled')->count(),
            ],
        ]);
    }

    public function volunteerBookings()
    {
        $user = Auth::user();

        // Get bookings with eager loading and filtering
        $bookings = VolunteerBooking::with([
            'project' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            },
            'user',
            'payments',
            'pointTransactions' => function ($query) use ($user) {
                $query->where('organization_id', $user->id)
                    ->where('type', 'credit');
            }
        ])
            ->whereHas('project', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get()
            ->filter(function ($booking) {
                return $booking->project !== null; // Ensure project exists
            });

        return Inertia::render('Organizations/Bookings', [
            'bookings' => $bookings->map(function ($booking) {
                $hasPointsPayment = $booking->pointTransactions->isNotEmpty();
                $pointsAmount = $hasPointsPayment ? $booking->pointTransactions->sum('points') : 0;

                return [
                    'id' => $booking->id,
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
                            'id' => $payment->id,
                            'amount' => $payment->amount,
                            'status' => $payment->status,
                            'created_at' => $payment->created_at->format('M d, Y'),
                        ];
                    }),
                    'volunteer' => [
                        'name' => $booking->user->name,
                        'email' => $booking->user->email,
                    ],
                    'project' => [
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
        }

        // Send completion email if status is Completed and flag is set
        if ($validated['booking_status'] === 'Completed' && ($request->send_completion_email ?? false)) {
            Mail::to($booking->user->email)
                ->send(new BookingCompleted($booking));
        }

        return back()->with('success', 'Booking status updated successfully');
    }

    public function profile()
    {
        $organization = Auth::user()->organization;
        return Inertia::render('Organizations/Profile', [
            'organization' => $organization,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'foundedYear' => 'required|integer',
            'phone' => 'required|string',
            'email' => 'required|email',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        $profile = OrganizationProfile::firstOrNew(['user_id' => auth()->id()]);
        $profile->fill($data);

        // Set user_id if it's a new profile
        if (!$profile->exists) {
            $profile->user_id = auth()->id();
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $profile->logo = $request->file('logo')->store('logos', 'public');
        }

        $profile->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
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

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'message' =>  $filteredMessage,
            'status' => 'Unread',
            'reply_to' => $request->reply_to,
        ]);

        // Load relationships
        $message->load(['sender', 'receiver', 'originalMessage.sender']);

        return back()->with([
            'success' => 'Message sent successfully.',
            'hasRestrictedContent' => $hasRestrictedContent
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
            ->where('user_id', $user->id)
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

    public function requestReview(Project $project)
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($project->request_for_approval) {
            return response()->json(['message' => 'Review already requested.'], 409);
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

        return Inertia::render('Organizations/Projects/Create', [
            'categories' => $categories,
        ]);
    }
    public function storeProject(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'address' => 'required|string',
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
            'start_date' => 'required|date',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'point_exchange' => 'nullable|boolean',
        ]);

        $data['user_id'] = Auth::id();
        $data['status'] = 'Pending';

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        }

        // Handle multi-select fields
        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        // Create the project
        $project = Project::create($data);

        // Save gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');

                GalleryImage::create([
                    'project_id' => $project->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->route('organization.projects')->with('success', 'Project created successfully.');
    }


    public function editProject($slug)
    {
        $project = Project::with(['category', 'subcategory', 'galleryImages', 'projectRemarks'])
            ->where('slug', $slug)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $categories = Category::with('subcategories')->get();

        return Inertia::render('Organizations/Projects/Edit', [
            'project' => $project,
            'categories' => $categories,
            'subcategories' => $project->category->subcategories,
            'selectedSubcategory' => $project->subcategory_id,
            'selectedCategory' => $project->category_id,
            'projectRemarks' => $project->projectRemarks->map(function ($remark) {
                return [
                    'id' => $remark->id,
                    'remark' => $remark->remark,
                    'status' => $remark->status,
                    'created_at' => $remark->created_at->format('Y-m-d H:i:s'),
                ];
            }),
            'galleryImages' => $project->galleryImages->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => asset('storage/' . $image->image_path),
                ];
            }),
        ]);
    }


    public function updateProject(Request $request, $slug)
    {
        $project = Project::where('slug', $slug)->where('user_id', auth()->id())->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug,' . $project->id,
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'address' => 'required|string',
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
            'start_date' => 'required|date',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'existing_gallery_images' => 'nullable|array',
            'existing_gallery_images.*' => 'string',
            'status' => 'required|in:Active,Pending,Suspended',
        ]);

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        }

        // Handle multi-select fields
        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        // Handle gallery images
        $existingGalleryImages = $request->input('existing_gallery_images', []);

        // Delete removed images
        $project->galleryImages()->whereNotIn('image_path', $existingGalleryImages)->each(function ($image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        });

        // Add new images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('projects/gallery', 'public');

                GalleryImage::create([
                    'project_id' => $project->id,
                    'image_path' => $path,
                ]);
            }
        }

        $project->update($data);

        return redirect()->route('organization.projects')->with('success', 'Project updated successfully.');
    }



    public function deleteProject($slug)
    {
        $project = Project::where('slug', $slug)->where('user_id', auth()->id())->firstOrFail();

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

    public function points()
    {
        $user = Auth::user();
        $pointsService = new VolunteerPointsService();

        return Inertia::render('Organizations/Points', [
            'auth' => [
                'user' => $user->toArray(),
            ],
            'totalPoints' => $pointsService->getTotalPointsForOrganization($user->id),
            'pointsHistory' => $pointsService->getPointsHistoryForOrganization($user->id),
        ]);
    }
}
