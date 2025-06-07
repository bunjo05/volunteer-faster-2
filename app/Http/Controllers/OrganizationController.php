<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use App\Models\VolunteerBooking;
use App\Models\OrganizationProfile;
use App\Mail\ProjectReviewRequested;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

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
                'approved' => $projects->where('status', 'Approved')->count(),
                'pending' => $projects->where('status', 'Pending')->count(),
                'rejected' => $projects->where('status', 'Rejected')->count(),
                'completed' => $projects->where('status', 'Completed')->count(),
                'cancelled' => $projects->where('status', 'Cancelled')->count(),
            ],
            // 'messagesCount' => Message::where('receiver_id', $user->id)->count(),
            // 'recentMessages' => $messages->map(function ($msg) {
            //     return [
            //         'id' => $msg->id,
            //         'subject' => $msg->subject,
            //         'body' => $msg->body,
            //         'status' => $msg->status,
            //     ];
            // }),
        ]);
    }

    public function volunteerBookings()
    {
        $user = Auth::user();

        // Get bookings for projects owned by this organization
        $bookings = VolunteerBooking::with(['project', 'user'])
            ->whereHas('project', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Organizations/Bookings', [
            'bookings' => $bookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'start_date' => $booking->start_date,
                    'end_date' => $booking->end_date,
                    'number_of_travellers' => $booking->number_of_travellers,
                    'status' => $booking->booking_status,
                    'message' => $booking->message,
                    'created_at' => $booking->created_at->format('M d, Y'),

                    'volunteer' => [
                        'name' => $booking->user->name,
                        'email' => $booking->user->email,
                        // Add more volunteer details as needed
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
        return inertia('Organizations/Messages');
    }

    public function projects()
    {
        $user = Auth::user();

        $projects = Project::with('category', 'subcategory')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return inertia('Organizations/Projects', [
            'userStatus' => $user->status,
            'projects' => $projects,
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
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Adjust file size limit as needed
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'address' => 'required|string',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'duration' => 'required|string',
            'duration_type' => 'required|in:Days,Weeks,Months,Years',
            'daily_routine' => 'required|string',
            'fees' => 'nullable|numeric',
            'currency' => 'nullable|string',
            'activities' => 'required|string',
            'suitable' => 'nullable|array',
            'suitable.*' => 'string',
            'availability_months' => 'required|array',
            'availability_months.*' => 'string|in:January,February,March,April,May,June,July,August,September,October,November,December',
            'start_date' => 'required|date',
            'status' => 'required|in:Active,Pending,Suspended',
        ]);

        $data['user_id'] = Auth::id();

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        }

        // Handle multi-select fields (ensure arrays are stored as JSON if needed)
        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        // Create the project
        $project = Project::create($data);

        // Save gallery images (if any)
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $filename = uniqid() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('projects/gallery', $filename, 'public');

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
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Adjust file size limit as needed
            'featured_image_existing' => 'nullable|string',

            'gallery_images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'existing_gallery_images' => 'array',
            'existing_gallery_images.*' => 'string',

            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'address' => 'required|string',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'duration' => 'required|string',
            'duration_type' => 'required|in:Days,Weeks,Months,Years',
            'daily_routine' => 'required|string',
            'fees' => 'nullable|numeric',
            'currency' => 'nullable|string',
            'activities' => 'required|string',
            'suitable' => 'nullable|array',
            'suitable.*' => 'string',
            'availability_months' => 'array',
            'availability_months.*' => 'string|in:January,February,March,April,May,June,July,August,September,October,November,December',
            'start_date' => 'required|date',
            'status' => 'required|in:Active,Pending,Suspended',
            'request_for_approval' => 'nullable|boolean',
        ]);

        // Handle the featured image upload
        if ($request->hasFile('featured_image')) {
            if ($project->featured_image) {
                Storage::disk('public')->delete($project->featured_image);
            }
            // Store the new image and get the file path
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        } elseif ($request->has('featured_image_existing')) {
            // If no new image, use the existing one
            $data['featured_image'] = $request->input('featured_image_existing');
        }

        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        // ⚠️ Delete gallery images removed by the user
        $existingGalleryImages = $request->input('existing_gallery_images', []);
        $project->galleryImages()->get()->each(function ($image) use ($existingGalleryImages) {
            if (!in_array($image->image_path, $existingGalleryImages)) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        });

        // ✅ Store new uploaded gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $image) {
                $filename = uniqid() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('projects/gallery', $filename, 'public');

                $project->galleryImages()->create([
                    'image_path' => $path,
                ]);
            }
        }

        // ✅ Update the project itself
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
}
