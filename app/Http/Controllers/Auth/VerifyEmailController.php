<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke($ulid, $hash): RedirectResponse
    {
        // Find user by ULID instead of ID
        $user = User::where('public_id', $ulid)->firstOrFail();

        // Verify the hash matches
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Invalid verification link');
        }

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
            case 'Sponsor':
                return redirect()->intended(route('sponsor.dashboard'))->with('success', 'Email verified!');
            default:
                Auth::logout();
                return redirect('/')->withErrors(['role' => 'Unknown user role. Access denied.']);
        }
    }
}
