<?php

// app/Services/ReferralService.php
namespace App\Services;

use App\Models\Referral;
use App\Models\User;
use App\Models\PointTransaction;
use Illuminate\Support\Facades\DB;

class ReferralService
{
    public function approveReferral(Referral $referral, $referrerPoints = 20, $refereePoints = 10)
    {
        return DB::transaction(function () use ($referral, $referrerPoints, $refereePoints) {
            $referral->update([
                'status' => 'approved',
                'referrer_points' => $referrerPoints,
                'referee_points' => $refereePoints,
            ]);

            // Award points to referrer
            PointTransaction::create([
                'user_id' => $referral->referrer_id,
                'points' => $referrerPoints,
                'type' => 'credit',
                'description' => 'Referral bonus for referring ' . $referral->referee->email,
            ]);

            // Award points to referee
            PointTransaction::create([
                'user_id' => $referral->referee_id,
                'points' => $refereePoints,
                'type' => 'credit',
                'description' => 'Sign-up bonus via referral from ' . $referral->referrer->email,
            ]);

            return $referral;
        });
    }

    public function rejectReferral(Referral $referral, $reason = '')
    {
        return $referral->update([
            'status' => 'rejected',
            'notes' => $reason,
        ]);
    }

    public function getReferralStats(User $user)
    {
        return [
            'total_referrals' => $user->referrals()->count(),
            'approved_referrals' => $user->referrals()->where('status', 'approved')->count(),
            'pending_referrals' => $user->referrals()->where('status', 'pending')->count(),
            'total_earned_points' => $user->referrals()->where('status', 'approved')->sum('referrer_points'),
        ];
    }
}
