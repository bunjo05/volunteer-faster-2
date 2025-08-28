<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserDevice;
use Inertia\Inertia;

class OtpVerificationController extends Controller
{
    public function show(Request $request)
    {
        if (!session()->has('email')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/OtpVerify', [
            'email' => session('email'),
            'message' => session('message'),
            'redirect_to' => session('redirect_to'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $user = User::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        // Mark device as trusted
        $user->devices()->create([
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
        ]);

        // Clear OTP
        $user->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        Auth::login($user);

        // Redirect to the stored URL or default dashboard
        $redirectTo = session('redirect_to') ?? $this->getDefaultRedirectForUser($user);

        return redirect()->to($redirectTo)->with('success', 'OTP verified successfully!');
    }

    protected function getDefaultRedirectForUser($user)
    {
        switch (strtolower($user->role)) {
            case 'volunteer':
                return route('volunteer.dashboard');
            case 'organization':
                return route('organization.dashboard');
            case 'sponsor':
                return route('sponsor.dashboard');
            default:
                return route('home');
        }
    }
}
