<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\VolunteerBooking;
use App\Models\VolunteerProfile;
use App\Models\VolunteerSponsorship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Cache;
use App\Mail\VolunteerBookingConfirmation;
use App\Mail\EmailVolunteerVerificationCode;
use App\Mail\ProjectOwnerBookingNotification;

class BookingController extends Controller
{
    public function index($slug)
    {
        $project = Project::where('slug', $slug)
            ->with('organizationProfile')
            ->firstOrFail();
        return inertia('Projects/Booking', [
            'project' => $project,
        ]);
    }

    public function volunteerEmailSend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $code = rand(100000, 999999);

        // Cache code for 10 minutes
        Cache::put('email_verification_' . $request->email, $code, now()->addMinutes(10));

        // Send email (you must configure this properly)
        Mail::to($request->email)->send(new EmailVolunteerVerificationCode($code));

        return redirect()->back()->with('success', 'Email Verified successfully.');
    }

    public function checkEmailExists(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $exists = User::where('email', $request->email)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
        ]);

        $cachedCode = Cache::get('email_verification_' . $request->email);

        if ($cachedCode && $cachedCode == $request->code) {
            // Optionally delete the code
            Cache::forget('email_verification_' . $request->email);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string', // Changed from nullable to required
            'email' => 'required|email|unique:users,email', // Changed from nullable to required
            'password' => 'required|string|min:6', // Changed from nullable to required
            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
            'postal' => 'nullable|string',
            'phone' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_travellers' => 'nullable|integer',
            'message' => 'nullable|string',
            'project_public_id' => 'required|exists:projects,public_id',
            'booking_status' => 'required',

            // Sponsorship fields
            'total_amount' => 'nullable|numeric|min:0',
            'accommodation' => 'nullable|numeric|min:0',
            'meals' => 'nullable|numeric|min:0',
            'travel' => 'nullable|numeric|min:0',
            'living_expenses' => 'nullable|numeric|min:0',
            'visa_fees' => 'nullable|numeric|min:0',
            'project_fees_amount' => 'nullable|numeric|min:0',
            'self_introduction' => 'nullable|string',
            'impact' => 'nullable|string',
            'commitment' => 'nullable|boolean',
            'agreement' => 'nullable|boolean',
            'privacy' => 'nullable|boolean',
            'aspect_needs_funding' => 'nullable|array',
            'skills' => 'nullable|array',
        ]);

        // 1. Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'Volunteer',
            'is_active' => 1,
            'status' => 'Active',
        ]);

        // Check if user already has a pending booking for this project
        $existingBooking = VolunteerBooking::where('user_public_id', $user->public_id)
            ->where('project_public_id', $validated['project_public_id'])
            ->where('booking_status', 'Pending')
            ->first();

        if ($existingBooking) {
            return redirect()->back()->withErrors([
                'booking' => 'You already have a pending booking for this project. Please wait until it is processed.'
            ]);
        }

        // Filter restricted content
        $patterns = [
            'phone' => '/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/',
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'url' => '/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/'
        ];

        $filteredMessage = $request->message;
        $hasRestrictedContent = false;

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $filteredMessage)) {
                $filteredMessage = preg_replace($pattern, '[content removed]', $filteredMessage);
                $hasRestrictedContent = true;
            }
        }

        // 2. Create profile
        $profile = VolunteerProfile::create([
            'user_public_id' => $user->public_id,
            'gender' => $validated['gender'],
            'dob' => $validated['dob'],
            'country' => $validated['country'],
            'address' => $validated['address'],
            'city' => $request->city,
            'postal' => $request->postal,
            'phone' => $validated['phone'],
        ]);

        // 3. Create booking - Use the newly created user's public_id
        $booking = VolunteerBooking::create([
            'user_public_id' => $user->public_id, // Use $user->public_id instead of Auth::user()->public_id
            'project_public_id' => $validated['project_public_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_travellers' => $validated['number_of_travellers'] ?? 1,
            'message' => $filteredMessage ?? null,
            'booking_status' => $validated['booking_status']
        ]);

        // 4. Create sponsorship if sponsorship data is provided
        $sponsorship = VolunteerSponsorship::create([
            'user_public_id' => $user->public_id, // Use $user->public_id instead of Auth::user()->public_id
            'booking_public_id' => $booking->public_id, // Add this back since it's required in the model
            'total_amount' => $validated['total_amount'] ?? 0,
            'accommodation' => $validated['accommodation'] ?? 0,
            'meals' => $validated['meals'] ?? 0,
            'living_expenses' => $validated['living_expenses'] ?? 0,
            'travel' => $validated['travel'] ?? 0,
            'visa_fees' => $validated['visa_fees'] ?? 0,
            'project_fees_amount' => $validated['project_fees_amount'] ?? 0,
            'self_introduction' => $validated['self_introduction'] ?? '',
            'impact' => $validated['impact'] ?? '',
            'commitment' => $validated['commitment'] ?? false,
            'agreement' => $validated['agreement'] ?? false,
            'privacy' => $validated['privacy'] ?? false,
            'aspect_needs_funding' => $validated['aspect_needs_funding'] ?? [],
            'skills' => $validated['skills'] ?? [],
        ]);

        // Get project details
        $project = Project::with('organizationProfile')->where('public_id', $validated['project_public_id'])->first();

        if (!$project) {
            return redirect()->back()->withErrors(['project' => 'Project not found.']);
        }

        // Get the project owner (receiver)
        $projectOwner = User::where('public_id', $project->user_public_id)->first();

        // After creating booking
        NotificationService::notifyNewBooking($booking);

        // Send confirmation email to volunteer
        Mail::to($user->email)->send(new VolunteerBookingConfirmation($booking, $project));

        // Send notification to project owner
        if ($projectOwner && $projectOwner->email) {
            Mail::to($projectOwner->email)
                ->send(new ProjectOwnerBookingNotification($booking, $project, $user));
        }

        // Only create message if one was provided
        if (!empty($filteredMessage) && $projectOwner) {
            Message::create([
                'sender_id' => $user->id,
                'receiver_id' => $projectOwner->id,
                'message' => $filteredMessage,
                'project_public_id' => $validated['project_public_id'],
                'booking_public_id' => $booking->public_id,
                'status' => 'Unread',
            ]);
        }

        // Auto-login the user after registration
        Auth::login($user);

        return redirect(route('volunteer.projects'))->with('success', 'Booking made successfully. A confirmation has been sent to your email.');
    }
    public function authStore(Request $request)
    {
        $user = Auth::user();

        // Add validation to ensure user is authenticated
        if (!$user) {
            return redirect()->route('login')->withErrors([
                'auth' => 'Please log in to make a booking.'
            ]);
        }

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_travellers' => 'required|integer',
            'message' => 'nullable|string',
            'project_public_id' => 'required|exists:projects,public_id',
            'booking_status' => 'required',

            // Sponsorship fields
            'total_amount' => 'nullable|numeric|min:0',
            'travel' => 'nullable|numeric|min:0',
            'accommodation' => 'nullable|numeric|min:0',
            'meals' => 'nullable|numeric|min:0',
            'living_expenses' => 'nullable|numeric|min:0',
            'visa_fees' => 'nullable|numeric|min:0',
            'project_fees_amount' => 'nullable|numeric|min:0',
            'self_introduction' => 'nullable|string',
            'impact' => 'nullable|string',
            'commitment' => 'nullable|boolean',
            'agreement' => 'nullable|boolean',
            'privacy' => 'nullable|boolean',
            'aspect_needs_funding' => 'nullable|array',
            'skills' => 'nullable|array',
        ]);

        // Check if user already has a pending booking for this project
        $existingBooking = VolunteerBooking::where('user_public_id', $user->public_id)
            ->where('project_public_id', $validated['project_public_id'])
            ->where('booking_status', 'Pending')
            ->first();

        if ($existingBooking) {
            return redirect()->back()->withErrors([
                'booking' => 'You already have a pending booking for this project. Please wait until it is processed.'
            ]);
        }

        // Filter restricted content
        $patterns = [
            'phone' => '/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/',
            'email' => '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/',
            'url' => '/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/'
        ];

        $filteredMessage = $request->message;
        $hasRestrictedContent = false;

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $filteredMessage)) {
                $filteredMessage = preg_replace($pattern, '[content removed]', $filteredMessage);
                $hasRestrictedContent = true;
            }
        }

        // Create booking
        $booking = VolunteerBooking::create([
            'user_public_id' => $user->public_id,
            'project_public_id' => $validated['project_public_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_travellers' => $validated['number_of_travellers'] ?? 1,
            'message' => $filteredMessage ?? null,
            'booking_status' => $validated['booking_status']
        ]);

        // Create sponsorship if sponsorship data is provided
        $sponsorship = VolunteerSponsorship::create([
            'user_public_id' => $user->public_id,
            'booking_public_id' => $booking->public_id, // Add this back
            'total_amount' => $validated['total_amount'] ?? 0,
            'travel' => $validated['travel'] ?? 0,
            'accommodation' => $validated['accommodation'] ?? 0,
            'meals' => $validated['meals'] ?? 0,
            'living_expenses' => $validated['living_expenses'] ?? 0,
            'visa_fees' => $validated['visa_fees'] ?? 0,
            'project_fees_amount' => $validated['project_fees_amount'] ?? 0,
            'self_introduction' => $validated['self_introduction'] ?? '',
            'impact' => $validated['impact'] ?? '',
            'commitment' => $validated['commitment'] ?? false,
            'agreement' => $validated['agreement'] ?? false,
            'privacy' => $validated['privacy'] ?? false,
            'aspect_needs_funding' => $validated['aspect_needs_funding'] ?? [],
            'skills' => $validated['skills'] ?? [],
        ]);

        // Get project details
        $project = Project::with('organizationProfile')->where('public_id', $validated['project_public_id'])->first();

        if (!$project) {
            return redirect()->back()->withErrors(['project' => 'Project not found.']);
        }

        // Get the project owner (receiver)
        $projectOwner = User::where('public_id', $project->user_public_id)->first();

        if (!$projectOwner) {
            return redirect()->back()->withErrors(['project' => 'Project owner not found.']);
        }

        // After creating booking
        NotificationService::notifyNewBooking($booking);

        // Send confirmation email to volunteer
        Mail::to($user->email)->send(new VolunteerBookingConfirmation($booking, $project));

        // Send notification to project owner
        if ($projectOwner->email) {
            Mail::to($projectOwner->email)
                ->send(new ProjectOwnerBookingNotification($booking, $project, $user));
        }

        // Only create message if one was provided
        if (!empty($filteredMessage)) {
            Message::create([
                'sender_id' => $user->id,
                'receiver_id' => $projectOwner->id,
                'message' => $filteredMessage,
                'project_public_id' => $validated['project_public_id'],
                'booking_public_id' => $booking->public_id,
                'status' => 'Unread',
            ]);
        }

        return redirect(route('volunteer.projects'))->with('success', 'Booking made successfully. A confirmation has been sent to your email.');
    }
}
