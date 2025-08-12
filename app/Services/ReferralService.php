<?php

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

            // Award points to referrer (credit)
            $this->createPointTransaction(
                $referral->referrer_id,
                $referrerPoints,
                'credit',
                'Referral bonus for referring ' . $referral->referee->email
            );

            // Award points to referee (credit)
            $this->createPointTransaction(
                $referral->referee_id,
                $refereePoints,
                'credit',
                'Sign-up bonus via referral from ' . $referral->referrer->email
            );

            return $referral;
        });
    }

    protected function createPointTransaction($userId, $points, $type, $description)
    {
        return PointTransaction::create([
            'user_id' => $userId,
            'organization_id' => null, // Not applicable for referrals
            'booking_id' => null, // Not applicable for referrals
            'points' => $points,
            'type' => $type,
            'description' => $description,
        ]);
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
