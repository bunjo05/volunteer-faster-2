<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ReportCategory;

class HomeController extends Controller
{
    public function index()
    {
        return inertia('Home');
    }

    public function projects()
    {
        $projects = Project::where('status', 'Active')
            ->with(['category', 'subcategory'])
            ->latest()->get();

        return inertia('Projects/Projects', [
            'projects' => $projects,
        ]);
    }

    public function viewProject($slug)
    {
        $project = Project::where('slug', $slug)
            ->with(['category', 'subcategory', 'galleryImages', 'organizationProfile'])
            ->firstOrFail();

        // Load report categories with their subcategories
        $reportCategories = ReportCategory::with('subcategories')->get();
        return inertia('Projects/ViewProject', [
            'project' => $project,
            'reportCategories' => $reportCategories, // Add this line
        ]);
    }
    public function about()
    {
        return inertia('Home/About');
    }
    public function contact()
    {
        return inertia('Home/Contact');
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
}
