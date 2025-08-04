<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Payment;
use App\Models\Project;

use App\Models\Category;
use App\Mail\ContactReply;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Models\ProjectRemark;
use App\Models\ReportProject;
use App\Models\ReportCategory;
use App\Mail\UserStatusChanged;
use App\Models\FeaturedProject;
use App\Models\ReportSubcategory;
use App\Models\OrganizationProfile;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeaturedProjectApproved;
use App\Mail\FeaturedProjectRejected;
use Illuminate\Support\Facades\Validator;
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
        return inertia('Admins/Organizations', [
            'organizations' => $organizations,
        ]);
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
        return inertia('Admins/Volunteers');
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

        ProjectRemark::create([
            'project_id' => $request->project_id,
            'admin_id' => auth('admin')->id(),
            'remark' => $request->remark,
            'status' => null,
        ]);

        // Optionally update the project status
        $project = Project::find($request->project_id);
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
        // dd($project->status);
        $project->save();

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

            // Send approval email
            Mail::to($featuredProject->user->email)
                ->send(new FeaturedProjectApproved($featuredProject));
        } else {
            $featuredProject->status = 'rejected';
            $featuredProject->rejection_reason = $validated['rejection_reason'];
            $featuredProject->is_active = false;
            $featuredProject->start_date = null;
            $featuredProject->end_date = null;

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
}
