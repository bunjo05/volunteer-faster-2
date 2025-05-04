<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            switch ($user->role) {
                case 'Volunteer':
                    return redirect()->route('volunteer.dashboard')->with('success', 'Device verified!');
                case 'Organization':
                    return redirect()->route('organization.dashboard')->with('success', 'Device verified!');
                default:
                    Auth::logout(); // optional security fallback
                    return redirect('/')->withErrors(['role' => 'Unknown user role. Access denied.']);
            }
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
