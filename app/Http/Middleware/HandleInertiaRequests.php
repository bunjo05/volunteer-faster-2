<?php

namespace App\Http\Middleware;

use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\VolunteerController;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $messagesData = ['conversations' => []];

        // Only fetch messages if user is authenticated and is Organization or Volunteer
        if ($user) {
            if ($user->role === 'Organization') {
                $organizationController = new OrganizationController();
                $messagesData = $organizationController->shareMessages();
            } elseif ($user->role === 'Volunteer') {
                $volunteerController = new VolunteerController();
                $messagesData = $volunteerController->shareMessages();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'stripeKey' => env('VITE_STRIPE_KEY'),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'messages' => $messagesData, // Add messages data here
        ];
    }
}
