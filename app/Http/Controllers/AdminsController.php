<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Category;
use App\Models\Subcategory;

use Illuminate\Http\Request;
use App\Models\ProjectRemark;
use App\Models\ReportCategory;
use App\Mail\UserStatusChanged;
use App\Models\ReportSubcategory;
use App\Models\OrganizationProfile;
use App\Models\ReportProject;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use SebastianBergmann\CodeCoverage\Report\Xml\Report;

class AdminsController extends Controller
{
    public function index()
    {
        return inertia('Admins/Dashboard');
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

        $reportCategories = ReportCategory::with('subcategories')->all();

        return inertia('Projects/ViewProject', [
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
}
