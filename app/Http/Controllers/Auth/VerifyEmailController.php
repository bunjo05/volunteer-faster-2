<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->redirectByRole($user->role);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->redirectByRole($user->role);
    }

    /**
     * Redirect user based on their role.
     */
    protected function redirectByRole(string $role): RedirectResponse
    {
        switch ($role) {
            case 'Volunteer':
                return redirect()->intended(route('volunteer.dashboard'))->with('success', 'Email verified!');
            case 'Organization':
                return redirect()->intended(route('organization.dashboard'))->with('success', 'Email verified!');
            default:
                Auth::logout(); // optional security fallback
                return redirect('/')->withErrors(['role' => 'Unknown user role. Access denied.']);
        }
    }
}
