<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ReportCategory;
use App\Mail\NewContactMessage;
use Illuminate\Support\Facades\Mail;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProjects = Project::whereHas('featuredProjects', function ($query) {
            $query->where('status', 'approved')
                ->where('is_active', 1);
        })
            ->with(['category', 'subcategory', 'featuredProjects'])
            ->latest()
            ->get();

        return inertia('Home', [
            'projects' => $featuredProjects,
            'auth' => auth()->user() ? [
                'user' => auth()->user()->only('id', 'name', 'email')
            ] : null,
        ]);
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
        $booking = \App\Models\VolunteerBooking::with(['user', 'project'])->findOrFail($id);

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
}
