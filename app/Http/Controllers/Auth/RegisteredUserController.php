<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Referral;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {

        $referralCode = request()->cookie('referral') ?? request()->query('ref');

        return Inertia::render('Auth/Register', [
            'referralCode' => $referralCode,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:Volunteer,Organization,Sponsor',
            'referral_code' => 'nullable|string|exists:users,referral_code',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Pending',
        ];

        // Handle referral if code is provided
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)->first();

            // Prevent self-referralb
            if ($referrer && $referrer->email !== $request->email) {
                $userData['referred_by'] = $referrer->public_id;
            }
        }

        $user = User::create($userData);

        // Create referral record if applicable
        if ($user->referred_by) {
            Referral::create([
                'referrer_public_id' => $user->referred_by,
                'referee_public_id' => $user->public_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('verification.notice', absolute: false));
    }
}
