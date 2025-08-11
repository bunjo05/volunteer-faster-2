<?php

// app/Http/Controllers/Admin/ReferralController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Referral;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReferralController extends Controller
{
    protected $referralService;

    public function __construct(ReferralService $referralService)
    {
        $this->referralService = $referralService;
    }

    public function index()
    {
        $referrals = Referral::with(['referrer', 'referee'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Referrals/Index', [
            'referrals' => $referrals,
        ]);
    }

    public function approve(Referral $referral)
    {
        $this->referralService->approveReferral($referral);

        return redirect()->back()->with('success', 'Referral approved and points awarded.');
    }

    public function reject(Referral $referral, Request $request)
    {
        $this->referralService->rejectReferral($referral, $request->reason);

        return redirect()->back()->with('success', 'Referral rejected.');
    }
}
