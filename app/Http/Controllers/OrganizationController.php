<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

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
        ]);
    }
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'slug' => 'required|string|max:255', // Add validation for other fields as necessary
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'foundedYear' => 'nullable|integer',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
        ]);

        $organization = auth()->user()->organization; // Get the organization associated with the logged-in user
        $organization->update($request->only([
            'name', 'slug', 'city', 'country', 'foundedYear', 'phone', 'email', 'website', 'description'
        ]));

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
