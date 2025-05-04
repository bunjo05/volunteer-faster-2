<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OrganizationProfile;
use App\Mail\ProjectReviewRequested;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    public function index()
    {
        return inertia('Organizations/Dashboard');
    }

    public function profile()
    {
        $organization = auth()->user()->organization;
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
        $user = auth()->user();

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

        // Notify all admins
        // $adminEmails = Admin::pluck('email')->toArray(); // Adjust model if needed
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
            'featured_image' => 'nullable|image|max:2048',
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
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|max:2048',
            'start_date' => 'required|date',
            'status' => 'required|in:Active,Pending,Suspended',
        ]);

        $data['user_id'] = Auth::id();

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
        }

        // Handle multi-select fields
        $data['suitable'] = $request->input('suitable', []);
        $data['availability_months'] = $request->input('availability_months', []);

        // Handle gallery images
        $gallery = $request->file('gallery_images', []);
        $galleryPaths = [];
        foreach ($gallery as $image) {
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/gallery', $filename);
            $galleryPaths[] = str_replace('public/', 'storage/', $path);
        }

        $data['gallery_images'] = $galleryPaths;

        Project::create($data);

        return redirect()->route('organization.projects')->with('success', 'Project created successfully.');
    }

    public function editProject($slug)
{
    $project = Project::with('category', 'subcategory')->where('slug', $slug)->where('user_id', auth()->id())->firstOrFail();
    $categories = Category::with('subcategories')->get();

    return Inertia::render('Organizations/Projects/Edit', [
        'project' => $project,
        'categories' => $categories,
    ]);
}

public function updateProject(Request $request, $slug)
{
    $project = Project::where('slug', $slug)->where('user_id', auth()->id())->firstOrFail();

    $data = $request->validate([
        'title' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:projects,slug,' . $project->id,
        'featured_image' => 'nullable|image|max:2048',
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
        'gallery_images' => 'nullable|array',
        'gallery_images.*' => 'image|max:2048',
        'start_date' => 'required|date',
        'status' => 'required|in:Active,Pending,Suspended',
    ]);

    // Handle featured image update
    if ($request->hasFile('featured_image')) {
        if ($project->featured_image) {
            Storage::disk('public')->delete($project->featured_image);
        }
        $data['featured_image'] = $request->file('featured_image')->store('projects/featured', 'public');
    }

    $data['suitable'] = $request->input('suitable', []);
    $data['availability_months'] = $request->input('availability_months', []);

    // Handle gallery images
    $gallery = $request->file('gallery_images', []);
    $galleryPaths = [];
    foreach ($gallery as $image) {
        $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('public/gallery', $filename);
        $galleryPaths[] = str_replace('public/', 'storage/', $path);
    }

    if (!empty($galleryPaths)) {
        $data['gallery_images'] = $galleryPaths;
    }

    $project->update($data);

    return redirect()->route('organization.projects')->with('success', 'Project updated successfully.');
}
}
