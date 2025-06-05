<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use App\Mail\SendOtp;
use Inertia\Response;
use App\Models\UserDevice;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Invalid credentials']);
        }

        $user = Auth::user();
        $agent = $request->userAgent();
        $ip = $request->ip();

        $deviceKnown = $user->devices()
            ->where('user_agent', $agent)
            ->where('ip_address', $ip)
            ->exists();

        if (!$deviceKnown) {
            // Generate OTP with leading zeros
            $user->otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->otp_expires_at = now()->addMinutes(10);
            $user->save();

            // Send OTP
            Mail::to($user->email)->send(new SendOtp($user->otp));

            // Logout user temporarily
            Auth::logout();

            // Redirect to OTP verification page
            return redirect()->route('otp.verify')->with([
                'email' => $user->email,
                'message' => 'A new device was detected. Please enter the OTP sent to your email.'
            ]);
        }

        // Check for redirect_to parameter and validate it's a local URL
        if ($request->has('redirect_to') && $this->isLocalUrl($request->input('redirect_to'))) {
            return redirect()->to($request->input('redirect_to'));
        }

        // Device is known, redirect based on role
        switch ($user->role) {
            case 'Volunteer':
                return redirect()->route('volunteer.dashboard')->with('success', 'Welcome back!');
            case 'Organization':
                return redirect()->route('organization.dashboard')->with('success', 'Welcome back!');
            default:
                Auth::logout(); // fallback for unknown roles
                return redirect()->route('error.unauthorized')->withErrors(['role' => 'Unknown user role. Access denied.']);
        }
    }

    // Add this helper method to validate local URLs
    protected function isLocalUrl($url)
    {
        if (empty($url)) {
            return false;
        }

        // Check if the URL is relative
        if (str_starts_with($url, '/')) {
            return true;
        }

        // Check if the URL belongs to your domain
        $host = parse_url($url, PHP_URL_HOST);
        $appHost = parse_url(config('app.url'), PHP_URL_HOST);

        return $host === $appHost;
    }



    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function resend(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Expire the old OTP first
            $user->update([
                'otp' => null,
                'otp_expires_at' => now(), // mark it as expired
            ]);

            // Generate and store a new OTP
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->update([
                'otp' => $otp,
                'otp_expires_at' => now()->addMinutes(10),
            ]);

            Mail::to($user->email)->send(new SendOtp($otp));
        }

        return back()->with('message', 'A new OTP has been sent to your email.');
    }
}
