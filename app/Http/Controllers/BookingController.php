<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\VolunteerBooking;
use App\Models\VolunteerProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6',
            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
            'postal' => 'nullable|string',
            'phone' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_travellers' => 'required|integer',
            'message' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'booking_status' => 'required'
        ]);

        // Check if user already has a pending booking for this project
        $existingBooking = VolunteerBooking::where('user_id', $user->id)
            ->where('project_id', $validated['project_id'])
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

        // 1. Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'Volunteer',
            'is_active' => 1,
            'status' => 'Active',
        ]);



        // 2. Create profile
        $profile = VolunteerProfile::create([
            'user_id' => $user->id,
            'gender' => $validated['gender'],
            'dob' => $validated['dob'],
            'country' => $validated['country'],
            'address' => $validated['address'],
            'city' => $request->city,
            'postal' => $request->postal,
            'phone' => $validated['phone'],
        ]);

        // 3. Create booking
        $booking = VolunteerBooking::create([
            'user_id' => $user->id,
            'project_id' => $validated['project_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_travellers' => $validated['number_of_travellers'],
            'message' => $filteredMessage ?? null,
            'booking_status' => $validated['booking_status']
        ]);

        // Get project details
        $project = Project::with('organizationProfile')->find($validated['project_id']);

        // Send confirmation email to volunteer
        Mail::to($user->email)->send(new VolunteerBookingConfirmation($booking, $project));

        // Send notification to project owner (use user's email as fallback)
        $ownerEmail = $project->user->email;
        if ($ownerEmail) {
            Mail::to($ownerEmail)
                ->send(new ProjectOwnerBookingNotification($booking, $project, $user));
        }

        return redirect(route('projects'))->with('success', 'Booking made successfully. A confirmation has been sent to your email.');
    }

    public function authStore(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'number_of_travellers' => 'required|integer',
            'message' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'booking_status' => 'required',
            'sender_id' => 'nullable',
            'receiver_id' => 'nullable',
            'status' => 'nullable'
        ]);

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



        $user = Auth::user();

        // Check if user already has a pending booking for this project
        $existingBooking = VolunteerBooking::where('user_id', $user->id)
            ->where('project_id', $validated['project_id'])
            ->where('booking_status', 'Pending')
            ->first();

        if ($existingBooking) {
            return redirect()->back()->withErrors([
                'booking' => 'You already have a pending booking for this project. Please wait until it is processed.'
            ]);
        }

        // Create booking
        $booking = VolunteerBooking::create([
            'user_id' => $user->id,
            'project_id' => $validated['project_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'number_of_travellers' => $validated['number_of_travellers'],
            'message' => $filteredMessage ?? null,
            'booking_status' => $validated['booking_status']
        ]);

        // Get project details
        $project = Project::with('organizationProfile')->find($validated['project_id']);

        // Send confirmation email to volunteer
        Mail::to($user->email)->send(new VolunteerBookingConfirmation($booking, $project));

        // Send notification to project owner (use user's email as fallback)
        $ownerEmail = $project->user->email;
        if ($ownerEmail) {
            Mail::to($ownerEmail)
                ->send(new ProjectOwnerBookingNotification($booking, $project, $user));
        }
        // Only create message if one was provided
        if (!empty($validated['message'])) {
            Message::create([
                'sender_id' => $user->id,
                'receiver_id' => $project->user_id,
                'message' => $filteredMessage,
                'project_id' => $validated['project_id'],
                'status' => 'Unread',
            ]);
        }

        return redirect(route('volunteer.projects'))->with('success', 'Booking made successfully. A confirmation has been sent to your email.');
    }
}
