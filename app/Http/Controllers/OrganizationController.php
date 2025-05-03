<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\OrganizationProfile;
use Illuminate\Support\Facades\Auth;

class OrganizationController extends Controller
{
    public function index()
    {
        return inertia('Organizations/Dashboard');
    }
    public function profile()
    {
        $organization = auth()->user()->organization; // Retrieve organization related to the logged-in user
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
        'logo' => 'nullable|image|max:2048', // Validate image
    ]);

    // Handle logo upload if it exists
    if ($request->hasFile('logo')) {
        $data['logo'] = $request->file('logo')->store('logos', 'public');
    }

        $profile = OrganizationProfile::firstOrNew(['user_id' => auth()->id()]);
        $profile->fill($request->except('logo'));

        // 🚨 Set user_id if it's a new profile
        if (!$profile->exists) {
            $profile->user_id = auth()->id();
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $profile->logo = $path;
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
        return inertia('Organizations/Projects');
    }
}
