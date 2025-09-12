<?php
// app/Services/VolunteerPointsService.php

namespace App\Services;

use App\Models\VolunteerPoint;
use App\Models\PointTransaction;
use App\Models\VolunteerBooking;
use Illuminate\Support\Facades\Auth;

class VolunteerPointsService
{
    public function awardPointsForCompletedBooking(VolunteerBooking $booking)
    {
        // Check if points already awarded for this booking
        if (VolunteerPoint::where('booking_public_id', $booking->public_id)->exists()) {
            return false;
        }

        $days = $booking->calculateDaysSpent();

        return VolunteerPoint::create([
            'user_public_id' => $booking->user_public_id,
            'booking_public_id' => $booking->public_id,
            'points_earned' => $days,
            'notes' => "Awarded for completed booking from {$booking->start_date} to {$booking->end_date}"
        ]);
    }

    protected function getTotalPoints()
    {
        $credited = PointTransaction::where('user_public_id', Auth::id())
            ->where('type', 'credit')
            ->sum('points');

        $debited = PointTransaction::where('user_public_id', Auth::id())
            ->where('type', 'debit')
            ->sum('points');

        return $credited - $debited;
    }

    public function getTotalPointsForOrganization($organizationPublicId)
    {
        return PointTransaction::where('organization_public_id', $organizationPublicId)
            ->where('type', 'credit')
            ->sum('points');
    }

    public function getPointsHistoryForOrganization($organizationPublicId)
    {
        return PointTransaction::with(['user', 'booking.project'])
            ->where('organization_public_id', $organizationPublicId)
            ->where('type', 'credit')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'points' => $transaction->points,
                    'type' => $transaction->type,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                    'user' => $transaction->user ? [
                        'name' => $transaction->user->name,
                        'email' => $transaction->user->email,
                    ] : null,
                    'booking' => $transaction->booking ? [
                        'start_date' => $transaction->booking->start_date,
                        'end_date' => $transaction->booking->end_date,
                        'project' => $transaction->booking->project ? [
                            'title' => $transaction->booking->project->title,
                        ] : null,
                    ] : null,
                ];
            });
    }
}
