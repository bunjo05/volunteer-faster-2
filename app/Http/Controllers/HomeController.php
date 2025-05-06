<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return inertia('Home');
    }

    public function projects()
    {
        $projects = Project::where('status', 'Active')->latest()->get();
        return inertia('Projects', [
            'projects' => $projects,
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
