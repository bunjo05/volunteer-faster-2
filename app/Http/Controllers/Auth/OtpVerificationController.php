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
        return Inertia::render('Auth/OtpVerify', [
            'email' => session('email'),
            'message' => session('message'),
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

        // $user = User::where('email', $request->email)->first();

        // if (
        //     !$user ||
        //     !hash_equals((string) $user->otp, (string) $request->otp) ||
        //     now()->gt($user->otp_expires_at)
        // ) {
        //     return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        // }


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

        return redirect()->route('dashboard')->with('success', 'Device verified!');
    }

}

