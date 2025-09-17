<?php

namespace App\Http\Controllers;

use App\Models\Sponsorship;
use App\Models\VolunteerBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SponsorController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);

        $sponsorships = Sponsorship::where('user_public_id', Auth::user()->public_id)
            ->with([
                'booking.project.organizationProfile',
                'booking.user',
                'booking.project' => function ($query) {
                    $query->with('organizationProfile');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('Sponsors/Index', [
            'sponsorships' => $sponsorships,
            'filters' => $request->only(['perPage']),
        ]);
    }

    public function dashboard(Request $request)
    {
        $perPage = $request->get('perPage', 10);

        // Get paginated sponsorships for the table
        $paginatedSponsorships = Sponsorship::where('user_public_id', Auth::user()->public_id)
            ->with([
                'booking.organizationProfile',
                'booking.user',
                'booking.project' => function ($query) {
                    $query->with('organizationProfile');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Get all sponsorships for metrics calculation (without pagination)
        $allSponsorships = Sponsorship::where('user_public_id', Auth::user()->public_id)
            ->with([
                'booking.project.organizationProfile',
                'booking.user',
                'booking.project' => function ($query) {
                    $query->with('organizationProfile');
                }
            ])
            ->get();

        // Calculate additional metrics
        $totalSponsored = $allSponsorships->sum('amount');
        $activeProjects = $allSponsorships->where('status', 'completed')->count();

        return Inertia::render('Sponsors/Dashboard', [
            'sponsorships' => $paginatedSponsorships,
            'allSponsorships' => $allSponsorships,
            'sponsorData' => [
                'totalSponsored' => $totalSponsored,
                'activeProjects' => $activeProjects,
                'totalSponsorships' => $allSponsorships->count(),
            ],
            'filters' => $request->only(['perPage']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
