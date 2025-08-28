<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        switch ($user->role) {
            case 'Volunteer':
                return redirect()->route('volunteer.dashboard')->with('success', 'Device verified!');
            case 'Organization':
                return redirect()->route('organization.dashboard')->with('success', 'Device verified!');
            case 'Sponsor':
                return redirect()->route('sponsor.dashboard')->with('success', 'Device verified!');
            default:
                Auth::logout(); // optional security fallback
                return redirect('/')->withErrors(['role' => 'Unknown user role. Access denied.']);
        }
        // return redirect()->intended(route('dashboard', absolute: false));
    }
}
