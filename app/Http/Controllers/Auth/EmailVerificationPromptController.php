<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            switch ($user->role) {
                case 'Volunteer':
                    return redirect()->intended(route('volunteer.dashboard'))->with('success', 'Device verified!');
                case 'Organization':
                    return redirect()->intended(route('organization.dashboard'))->with('success', 'Device verified!');
                default:
                    Auth::logout(); // Optional: log out for unknown roles
                    return redirect('/')->withErrors(['role' => 'Unknown user role. Access denied.']);
            }
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    }
}
