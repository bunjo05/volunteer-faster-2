<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\PlatformReview;
use App\Models\ReportCategory;
use App\Mail\NewContactMessage;
use App\Models\FeaturedProject;
use App\Models\VolunteerBooking;
use App\Models\OrganizationProfile;
use App\Models\ProjectRemarkComment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\OrganizationVerification;

class HomeController extends Controller
{
    public function index()
    {
        // Check for any expired featured projects
        FeaturedProject::checkAllExpirations();

        $featuredProjects = Project::whereHas('featuredProjects', function ($query) {
            $query->where('status', 'approved')
                ->where('is_active', true)
                ->where('end_date', '>', now()); // Add this condition
        })
            ->with(['category', 'subcategory', 'featuredProjects' => function ($query) {
                $query->where('status', 'approved')
                    ->where('is_active', true)
                    ->where('end_date', '>', now());
            }])
            ->latest()
            ->get();

        $platformReviews = PlatformReview::where('status', 'Approved')->with('user', 'volunteer_profile')->latest()->get();

        return inertia('Home', [
            'projects' => $featuredProjects,
            'auth' => Auth::user() ? [
                'user' => Auth::user()->only('id', 'name', 'email')
            ] : null,
            'platformReviews' => $platformReviews,
        ]);
    }

    public function projects()
    {
        $projects = Project::where('status', 'Active')
            ->with([
                'category',
                'subcategory',
                'organizationProfile',
                'organizationProfile.verification'
            ])
            ->latest()
            ->get();

        return inertia('Projects/Projects', [
            'projects' => $projects,
        ]);
    }

    public function viewProject($slug)
    {
        $project = Project::where('slug', $slug)
            ->with([
                'category',
                'subcategory',
                'galleryImages',
                'organizationProfile',
                'projectRemarks' => function ($query) {
                    $query->where('status', 'Resolved')
                        ->with(['user', 'admin', 'comments' => function ($q) {
                            $q->with(['user', 'replies' => function ($q) {
                                $q->with('user');
                            }]);
                        }]);
                }
            ])
            ->firstOrFail();

        // Initialize suggested projects query
        $suggestedQuery = Project::where('status', 'Active')
            ->where('id', '!=', $project->id)
            ->with(['category', 'organizationProfile']);

        // Check if user is logged in and has volunteer profile with skills
        if (auth()->check() && auth()->user()->volunteerProfile && !empty(auth()->user()->volunteerProfile->skills)) {
            $volunteerSkills = auth()->user()->volunteerProfile->skills;

            // Get projects that match any of the volunteer's skills
            $suggestedQuery->where(function ($query) use ($volunteerSkills) {
                foreach ($volunteerSkills as $skill) {
                    $query->orWhereJsonContains('skills', $skill);
                }
            });
        } else {
            // Fall back to category-based suggestions
            $suggestedQuery->where(function ($query) use ($project) {
                $query->where('category_id', $project->category_id)
                    ->orWhere('subcategory_id', $project->subcategory_id);
            });
        }

        $suggestedProjects = $suggestedQuery
            ->inRandomOrder()
            ->limit(2)
            ->get();

        // Check if user is following the organization
        $isFollowing = false;
        if (auth()->check()) {
            $isFollowing = auth()->user()->followingOrganizations()
                ->where('organization_id', $project->organizationProfile->id)
                ->exists();
        }

        // Load report categories with their subcategories
        $reportCategories = ReportCategory::with('subcategories')->get();

        return inertia('Projects/ViewProject', [
            'project' => $project,
            'reportCategories' => $reportCategories,
            'isFollowing' => $isFollowing,
            'suggestedProjects' => $suggestedProjects,
        ]);
    }

    public function about()
    {
        return inertia('Home/About');
    }

    public function privacyPolicy()
    {
        return inertia('Home/PrivacyPolicy');
    }
    public function termsAndConditions()
    {
        return inertia('Home/TermsAndConditions');
    }
    public function faq()
    {
        return inertia('Home/Faq');
    }
    public function volunteer()
    {
        return inertia('Home/Volunteer');
    }
    public function organization()
    {
        return inertia('Home/Organization');
    }

    public function verifyCertificate($id, $hash)
    {
        $booking = VolunteerBooking::with(['user', 'project'])->findOrFail($id);

        $valid = sha1($booking->id . config('app.key')) === $hash;

        return view('certificates.verification', [
            'booking' => $booking,
            'valid' => $valid,
        ]);
    }

    public function contactUs()
    {
        return inertia('Contact');
    }

    public function storeContactMessage(Request $request)
    {
        // First check if email is suspended
        $suspendedContact = Contact::where('email', $request->email)
            ->where('is_suspended', 1)
            ->first();

        if ($suspendedContact) {
            return back()->withErrors([
                'email_suspended' => 'This email address has been suspended from sending messages. Please contact support if you believe this is an error.'
            ]);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $contact = Contact::create($data);

        // Notify all admins
        $admins = Admin::all();
        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new NewContactMessage($contact));
        }

        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }

    public function OrganizationProfile($slug, $organization_profile)
    {
        $project = Project::where('slug', $slug)
            ->with(['user.organizationProfile', 'user.organizationProfile.verification'])
            ->firstOrFail();

        // Check if user exists and has organization profile
        if (!$project->user || !$project->user->organizationProfile) {
            abort(404);
        }

        // Check if the organization profile slug matches
        if ($project->user->organizationProfile->slug !== $organization_profile) {
            abort(404);
        }

        // Add follow status check
        $isFollowing = false;
        if (auth()->check()) {
            $isFollowing = auth()->user()->followingOrganizations()
                ->where('organization_id', $project->user->organizationProfile->id)
                ->exists();
        }

        // Get followers count
        $followersCount = $project->user->organizationProfile->followers()->count();

        return inertia('Projects/OrganizationProfile', [
            'organization' => $project->user->organizationProfile,
            'project' => $project,
            'isVerified' => $project->user->organizationProfile->verification?->status === 'Approved',
            'isFollowing' => $isFollowing,
            'followersCount' => $followersCount, // Add this line
        ]);
    }

    public function storeReviews(Request $request)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:2000',
            'project_remark_id' => 'required|exists:project_remarks,id',
            'parent_id' => 'nullable|exists:project_remark_comments,id'
        ]);

        $comment = ProjectRemarkComment::create([
            'user_id' => Auth::id(),
            'project_remark_id' => $validated['project_remark_id'],
            'parent_id' => $validated['parent_id'],
            'comment' => $validated['comment'],
            'is_approved' => true
        ]);

        // Load the comment with user and any relationships needed for the frontend
        $comment->load('user');

        return back()->with('success', 'Comment posted successfully!');
    }
}
