<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;

use App\Mail\UserStatusChanged;
use App\Models\OrganizationProfile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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

        return redirect()->back()->with('Status updated and email sent successfully.');
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
        return inertia('Admins/Projects');
    }
    public function messages()
    {
        return inertia('Admins/Messages');
    }
}
