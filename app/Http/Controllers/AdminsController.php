<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\Project;

use App\Models\Category;
use App\Models\Referral;
use App\Mail\ContactReply;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Models\ProjectRemark;
use App\Models\ReportProject;
use App\Models\PlatformReview;
use App\Models\ReportCategory;
use App\Mail\UserStatusChanged;
use App\Models\FeaturedProject;
use App\Models\VolunteerProfile;
use App\Models\ReportSubcategory;
use App\Services\ReferralService;
use App\Models\OrganizationProfile;
use App\Models\VolunteerSponsorship;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeaturedProjectApproved;
use App\Mail\FeaturedProjectRejected;
use App\Models\VolunteerVerification;
use App\Services\NotificationService;
use App\Mail\VolunteerVerificationMail;
use App\Models\OrganizationVerification;
use Illuminate\Support\Facades\Validator;
use App\Mail\OrganizationVerificationMail;
use Illuminate\Support\Facades\Auth;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

class AdminsController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', 'Active')->count(),
                'pending' => User::where('status', 'Pending')->count(),
                'suspended' => User::where('status', 'Suspended')->count(),
            ],
            'projects' => [
                'total' => Project::count(),
                'approved' => Project::where('status', 'Approved')->count(),
                'pending' => Project::where('status', 'Pending')->count(),
                'rejected' => Project::where('status', 'Rejected')->count(),
            ],
            'organizations' => OrganizationProfile::count(),
            'payments' => [
                'total' => Payment::sum('amount'),
                'count' => Payment::count(),
                'successful' => Payment::where('status', 'succeeded')->count(),
            ],
            'messages' => [
                'total' => Contact::count(),
                'unread' => Contact::where('is_read', false)->count(),
                'replied' => Contact::where('is_replied', true)->count(),
            ],
        ];

        $recentActivities = [
            'users' => User::latest()->take(5)->get(),
            'projects' => Project::with('user')->latest()->take(5)->get(),
            'payments' => Payment::with('user')->latest()->take(5)->get(),
            'messages' => Contact::latest()->take(5)->get(),
        ];

        return inertia('Admins/Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }

    public function users()
    {
        $users = User::all(); // If using spatie roles

        return Inertia::render('Admins/Users', [
            'users' => $users,
        ]);
    }
    public function organizations()
    {
        $organizations = OrganizationProfile::latest()->get(); // Add pagination if needed
        $verifications = OrganizationVerification::all();

        return inertia('Admins/Organizations/Index', [
            'organizations' => $organizations,
            'verifications' => $verifications,
        ]);
    }

    public function viewOrganization($slug)
    {
        $organization = OrganizationProfile::where('slug', $slug)->firstOrFail();
        $organization_verification = OrganizationVerification::where('organization_profile_id', $organization->id)->first();

        return inertia('Admins/Organizations/View', [
            'organization' => $organization,
            'organization_verification' => $organization_verification,
        ]);
    }

    public function organizationVerifications($slug)
    {
        $organization = OrganizationProfile::where('slug', $slug)->firstOrFail();
        $verification = OrganizationVerification::where('organization_profile_id', $organization->id)->first();

        return inertia('Admins/Organizations/Verification', [
            'organization' => $organization,
            'verification' => $verification,
        ]);
    }

    public function updateVerification(Request $request, $slug, $verification_id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'comments' => 'nullable|string|max:1000',
        ]);

        $verification = OrganizationVerification::findOrFail($verification_id);
        $organization = OrganizationProfile::where('slug', $slug)->firstOrFail();

        // Update verification status
        $status = $request->action === 'approve' ? 'Approved' : 'Rejected';
        $verification->status = $status;
        $verification->comments = $request->comments;
        $verification->verified_at = now();
        $verification->admin_id = auth('admin')->id();
        $verification->save();

        // Send email notification to organization owner
        if ($organization->user) {
            Mail::to($organization->user->email)
                ->send(new OrganizationVerificationMail($verification, $organization, $status));
        }

        // Add notification
        NotificationService::notifyOrganizationVerification($organization, $status);

        return redirect()->back()->with('success', 'Verification status updated successfully.');
    }

    // Volunteer Verification


    public function volunteerVerifications($id)
    {
        $volunteer = VolunteerProfile::where('id', $id)->with('user')->firstOrFail();
        $verification = VolunteerVerification::where('volunteer_id', $volunteer->id)->first();

        return inertia('Admins/Volunteers/Verify', [
            'volunteer' => $volunteer,  // Changed from 'organization' to 'volunteer' to match what you're actually returning
            'verification' => $verification,
        ]);
    }

    public function updateVolunteerVerification(Request $request, VolunteerProfile $volunteer, VolunteerVerification $verification)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'comments' => 'nullable|string|max:1000',
        ]);

        $status = $request->action === 'approve' ? 'Approved' : 'Rejected';

        $verification->update([
            'status' => $status,
            'comments' => $request->comments,
            'verified_at' => now(),
            'admin_id' => auth('admin')->id()
        ]);

        // In your updateVolunteerVerification method
        if ($volunteer->user) {
            Mail::to($volunteer->user->email)
                ->send(new VolunteerVerificationMail(
                    $verification,
                    $volunteer,
                    $status,
                    $volunteer->user  // Pass the user explicitly
                ));
        }

        // Add notification
        NotificationService::notifyVolunteerVerification($volunteer, $status);

        return redirect()->back()->with('success', 'Verification updated successfully');
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = Validator::make($request->all(), [
            'status' => ['required', 'in:Active,Pending,Suspended'],
        ])->validate();

        $user->status = $validated['status'];
        $user->save();

        // Send email to the user
        Mail::to($user->email)->send(new UserStatusChanged($user, $validated['status']));

        return redirect()->route('admin.dashboard')->with('Status updated and email sent successfully.');
    }

    public function categories()
    {
        $categories = Category::latest()->get();

        return inertia('Admins/Categories', [
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.categories')->with('success', 'Category added successfully!');
    }
    public function subcategories()
    {
        return Inertia::render('Admins/Subcategories', [
            'subcategories' => Subcategory::with('category')->latest()->get(),
            'categories' => Category::latest()->get(),
        ]);
    }

    public function storeSubcategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        Subcategory::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('admin.subcategories')->with('success', 'Subcategory added successfully!');
    }


    public function volunteers()
    {
        $volunteers = VolunteerProfile::with('user')->latest()->get();
        $verifications = VolunteerVerification::all();

        return inertia('Admins/Volunteers/Volunteers', [
            'volunteers' => $volunteers,
            'verifications' => $verifications
        ]);
    }

    public function projects()
    {
        $projects = Project::with(['user', 'organizationProfile']) // eager load user relationship too
            ->latest()
            ->get();

        return inertia('Admins/Projects/Projects', [
            'projects' => $projects,
        ]);
    }

    public function viewProject($slug)
    {
        $project = Project::with(['user', 'organizationProfile', 'category', 'subcategory', 'galleryImages', 'projectRemarks'])
            ->where('slug', $slug)
            ->firstOrFail();

        $reportCategories = ReportCategory::with('subcategories')->get();

        return inertia('Admins/Projects/ViewProject', [
            'project' => $project,
            'reportCategories' => $reportCategories,
            'projectRemarks' => $project->projectRemarks->map(function ($remark) {
                return [
                    'id' => $remark->id,
                    'remark' => $remark->remark,
                    'status' => $remark->status,
                ];
            }),
        ]);
    }

    public function storeRemark(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'remark' => 'required|string|max:1000',
        ]);

        // Get the project to access its user_public_id
        $project = Project::findOrFail($request->project_id);

        ProjectRemark::create([
            'user_public_id' => $project->user_public_id, // Add this
            'project_public_id' => $project->public_id, // Add this
            'admin_public_id' => auth('admin')->user()->public_id, // Add this
            'project_id' => $request->project_id,
            'admin_id' => auth('admin')->id(),
            'remark' => $request->remark,
            'status' => null,
            'comment' => $request->remark, // Map remark to comment
            'rating' => 0, // Provide default rating
        ]);

        // Update project status
        $project->status = 'Rejected';
        $project->save();

        return redirect()->back()->with('success', 'Project rejected with remark.');
    }

    public function updateRemark(Request $request, $id)
    {
        $remark = ProjectRemark::findOrFail($id);
        $remark->status = $request->status;
        $remark->save();

        return back()->with('success', 'Remark status updated.');
    }

    public function updateProjectStatus(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->status = $request->status;
        $project->save();

        // Add notification
        if ($request->status === 'Approved') {
            NotificationService::notifyProjectApproved($project);
        }

        return redirect()->back()->with('success', 'Project approved successfully.');
    }


    public function messages()
    {
        return inertia('Admins/Messages');
    }

    public function projectReports()
    {
        // $projects = Project::with(['user', 'organizationProfile']) // eager load user relationship too
        //     ->latest()
        //     ->get();
        $reports = ReportProject::with(['project', 'user', 'reportCategory', 'reportSubcategory'])->latest()->get();
        return inertia('Admins/Reports/Index', [
            'reports' => $reports
        ]);
    }

    // public function createReportCategory()
    // {
    //     return inertia('Admins/Reports/CreateCategory');
    // }

    // public function storeReportCategory(Request $request)
    // {
    //     ReportCategory::create([
    //         'name' => $request->name,
    //     ]);
    //     return redirect()->back()->with('success', 'Project rejected with remark.');
    // }

    /**
     * Report Categories Section
     */
    public function reportCategories()
    {
        $categories = ReportCategory::latest()->get();

        return inertia('Admins/Reports/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function createReportCategory()
    {
        return inertia('Admins/Reports/Categories/Form');
    }

    public function storeReportCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:report_categories',
        ]);

        ReportCategory::create($validated);

        return redirect()->route('admin.report-categories')
            ->with('message', 'Category created successfully')
            ->with('type', 'success');
    }

    public function editReportCategory(ReportCategory $reportCategory)
    {
        return inertia('Admins/Reports/Categories/Form', [
            'reportCategory' => $reportCategory
        ]);
    }

    public function updateReportCategory(Request $request, ReportCategory $reportCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:report_categories,name,' . $reportCategory->id,
        ]);

        $reportCategory->update($validated);

        return redirect()->route('admin.report-categories')
            ->with('message', 'Category updated successfully')
            ->with('type', 'success');
    }

    public function destroyReportCategory(ReportCategory $reportCategory)
    {
        $reportCategory->delete();

        return redirect()->back()
            ->with('message', 'Category deleted successfully')
            ->with('type', 'success');
    }

    // Report Subcategories Section
    public function reportSubcategories()
    {
        $subcategories = ReportSubcategory::with('category')
            ->latest()
            ->get();

        return inertia('Admins/Reports/Subcategories/Index', [
            'subcategories' => $subcategories
        ]);
    }

    public function createReportSubcategory()
    {
        $categories = ReportCategory::all();

        return inertia('Admins/Reports/Subcategories/Form', [
            'reportCategories' => $categories
        ]);
    }

    public function storeReportSubcategory(Request $request)
    {
        $validated = $request->validate([
            'report_category_id' => 'required|exists:report_categories,id',
            'name' => 'required|string|max:255|unique:report_subcategories',

        ]);

        ReportSubcategory::create($validated);

        return redirect()->route('admin.report-subcategories.index')
            ->with('message', 'Subcategory created successfully')
            ->with('type', 'success');
    }

    public function editReportSubcategory(ReportSubcategory $reportSubcategory)
    {
        $categories = ReportCategory::all();

        return inertia('Admins/Reports/Subcategories/Form', [
            'reportSubcategory' => $reportSubcategory,
            'reportCategories' => $categories
        ]);
    }

    public function updateReportSubcategory(Request $request, ReportSubcategory $reportSubcategory)
    {
        $validated = $request->validate([
            'report_category_id' => 'required|exists:report_categories,id',
            'name' => 'required|string|max:255|unique:report_subcategories,name,' . $reportSubcategory->id,
        ]);

        $reportSubcategory->update($validated);

        return redirect()->route('admin.report-subcategories.index')
            ->with('message', 'Subcategory updated successfully')
            ->with('type', 'success');
    }

    public function destroyReportSubcategory(ReportSubcategory $reportSubcategory)
    {
        $reportSubcategory->delete();

        return redirect()->back()
            ->with('message', 'Subcategory deleted successfully')
            ->with('type', 'success');
    }

    public function payments(Request $request)
    {
        $payments = Payment::query()
            ->with(['user', 'booking.project.organizationProfile'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('stripe_payment_id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('booking.project', function ($q) use ($search) {
                            $q->where('title', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->payment_type, fn($q, $type) => $q->where('payment_type', $type))
            ->when($request->date_from, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($request->date_to, fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15);

        // Admins/Reports/Subcategories/Form

        return Inertia::render('Admins/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'payment_type', 'date_from', 'date_to']),
            'sort' => $request->sort ?? 'created_at',
            'direction' => $request->direction ?? 'desc',
        ]);
    }

    public function featuredProjects()
    {
        $featuredProjects = FeaturedProject::with(['project', 'user'])
            ->latest()
            ->get()
            ->map(function ($project) {
                // Ensure amount is cast to float
                $project->amount = (float)$project->amount;
                return $project;
            });

        return inertia('Admins/Projects/FeaturedProject', [
            'featuredProjects' => $featuredProjects,
        ]);
    }
    public function updateFeaturedProjectStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
        ]);

        $featuredProject = FeaturedProject::with(['project', 'user'])->findOrFail($id);

        if ($validated['status'] === 'approved') {
            $featuredProject->status = 'approved';
            $featuredProject->start_date = now();

            // Calculate end date based on plan type
            $endDate = now();
            switch ($featuredProject->plan_type) {
                case '1_month':
                    $endDate = $endDate->addMonth();
                    break;
                case '3_months':
                    $endDate = $endDate->addMonths(3);
                    break;
                case '6_months':
                    $endDate = $endDate->addMonths(6);
                    break;
                case '1_year':
                    $endDate = $endDate->addYear();
                    break;
            }

            $featuredProject->end_date = $endDate;
            $featuredProject->is_active = true;
            $featuredProject->rejection_reason = null;


            // Add notification
            NotificationService::notifyFeaturedProjectApproved($featuredProject);

            // Send approval email
            Mail::to($featuredProject->user->email)
                ->send(new FeaturedProjectApproved($featuredProject));
        } else {
            $featuredProject->status = 'rejected';
            $featuredProject->rejection_reason = $validated['rejection_reason'];
            $featuredProject->is_active = false;
            $featuredProject->start_date = null;
            $featuredProject->end_date = null;

            // Add notification
            NotificationService::notifyFeaturedProjectRejected($featuredProject);

            // Send rejection email
            Mail::to($featuredProject->user->email)
                ->send(new FeaturedProjectRejected($featuredProject));
        }

        $featuredProject->save();

        return redirect()->back()->with('success', 'Featured project status updated and user notified.');
    }

    public function adminChatIndex()
    {
        $messages = Contact::latest()->paginate(10);
        return Inertia::render('Admins/Contacts/Index', [
            'messages' => $messages
        ]);
    }

    public function adminShow(Contact $contact)
    {
        // Mark as read when admin opens the message
        if (!$contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return Inertia::render('Admins/Contacts/Show', [
            'message' => $contact->load('admin')
        ]);
    }

    public function adminReply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'reply_subject' => 'required|string|max:255',
            'reply_message' => 'required|string|max:5000',
        ]);

        $updateData = [
            'is_replied' => true,
            'replied_at' => now(),
            'reply_subject' => $validated['reply_subject'],
            'reply_message' => $validated['reply_message'],
            'admin_id' => auth()->guard('admin')->id()
        ];

        $contact->update($updateData);

        // Send reply email to the original sender
        Mail::to($contact->email)->send(new ContactReply($contact));

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Reply sent successfully!');
    }

    public function updateContactStatus(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'is_suspended' => 'required|boolean',
        ]);

        $contact->update(['is_suspended' => $validated['is_suspended']]);

        return redirect()->back()->with('success', 'Message status updated successfully.');
    }

    protected $referralService;

    public function __construct(ReferralService $referralService)
    {
        $this->referralService = $referralService;
    }

    public function userReferral()
    {
        $referrals = Referral::with(['referrer', 'referee'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        return Inertia::render('Admins/Referral', [
            'referrals' => $referrals,
        ]);
    }

    // app/Http/Controllers/AdminsController.php

    public function approve(Referral $referral)
    {
        $this->referralService->approveReferral($referral);

        return redirect()->route('admin.referrals.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Referral approved and points awarded.',
                'type' => 'success'
            ]);
    }

    public function reject(Referral $referral, Request $request)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:255'
        ]);

        $this->referralService->rejectReferral($referral, $validated['reason'] ?? '');

        return redirect()->route('admin.referrals.index')
            ->with('toast', [
                'title' => 'Success',
                'message' => 'Referral rejected.',
                'type' => 'success'
            ]);
    }

    public function Reviews(Request $request)
    {
        $reviews = ProjectRemark::with(['project', 'user', 'admin'])->latest()->get();

        return inertia('Admins/Remarks', [
            'reviews' => $reviews
        ]);
    }

    public function updateReviewStatus(Request $request, ProjectRemark $review)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Resolved,Rejected'
        ]);

        $review->update([
            'status' => $validated['status'],
            'admin_id' => auth('admin')->id()
        ]);

        return redirect()->back()->with('success', 'Review status updated successfully.');
    }

    public function platformReview(Request $request)
    {
        $query = PlatformReview::with('user')
            ->latest();

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('rating') && $request->rating !== 'all') {
            $query->where('rating', $request->rating);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('message', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'like', '%' . $request->search . '%')
                            ->orWhere('email', 'like', '%' . $request->search . '%');
                    });
            });
        }

        $reviews = $query->paginate(15);

        // Get statistics
        $stats = [
            'total' => PlatformReview::count(),
            'pending_count' => PlatformReview::where('status', 'pending')->count(),
            'approved_count' => PlatformReview::where('status', 'approved')->count(),
            'average_rating' => PlatformReview::avg('rating'),
        ];

        return Inertia::render('Admins/PlatformReviews', [
            'reviews' => array_merge($reviews->toArray(), $stats),
            'filters' => $request->only(['status', 'rating', 'search'])
        ]);
    }

    public function updatePlatformStatus(PlatformReview $review, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $review->update([
            'status' => $request->status,
            'admin_id' => Auth::id()
            // 'admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Review status updated successfully.');
    }

    public function sponsorIndex(Request $request)
    {
        $sponsorships = VolunteerSponsorship::with(['user', 'booking.project'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($sponsorship) {
                return [
                    'id' => $sponsorship->id,
                    'user_name' => $sponsorship->user->name,
                    'user_email' => $sponsorship->user->email,
                    'project_title' => $sponsorship->booking->project->title ?? 'N/A',
                    'start_date' => $sponsorship->booking?->start_date
                        ? \Carbon\Carbon::parse($sponsorship->booking->start_date)->format('M d, Y')
                        : 'N/A',
                    'end_date' => $sponsorship->booking?->end_date
                        ? \Carbon\Carbon::parse($sponsorship->booking->end_date)->format('M d, Y')
                        : 'N/A',
                    'total_amount' => $sponsorship->total_amount,
                    'travel' => $sponsorship->travel,
                    'accommodation' => $sponsorship->accommodation,
                    'meals' => $sponsorship->meals,
                    'living_expenses' => $sponsorship->living_expenses,
                    'visa_fees' => $sponsorship->visa_fees,
                    'project_fees_amount' => $sponsorship->project_fees_amount,
                    'aspect_needs_funding' => $sponsorship->aspect_needs_funding,
                    'self_introduction' => $sponsorship->self_introduction,
                    'skills' => $sponsorship->skills,
                    'impact' => $sponsorship->impact,
                    'commitment' => $sponsorship->commitment,
                    'status' => $sponsorship->status,
                    'agreement' => $sponsorship->agreement,
                    'created_at' => $sponsorship->created_at->format('M d, Y H:i'),
                    'updated_at' => $sponsorship->updated_at->format('M d, Y H:i'),
                ];
            });

        return Inertia::render('Admins/Sponsors/Index', [
            'sponsorships' => $sponsorships
        ]);
    }


    public function updateSponsorStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected'
        ]);

        $sponsorship = VolunteerSponsorship::findOrFail($id);
        $sponsorship->status = $request->status;
        $sponsorship->save();

        return redirect()->back()->with('success', 'Sponsorship status updated successfully.');
    }

    public function destroySponsor($id)
    {
        $sponsorship = VolunteerSponsorship::findOrFail($id);
        $sponsorship->delete();

        return redirect()->back()->with('success', 'Sponsorship request deleted successfully.');
    }
}
