<?php
// app/Services/VolunteerPointsService.php

namespace App\Services;

use App\Models\VolunteerBooking;
use App\Models\VolunteerPoint;

class VolunteerPointsService
{
    public function awardPointsForCompletedBooking(VolunteerBooking $booking)
    {
        // Check if points already awarded for this booking
        if (VolunteerPoint::where('booking_id', $booking->id)->exists()) {
            return false;
        }

        $days = $booking->calculateDaysSpent();

        return VolunteerPoint::create([
            'user_id' => $booking->user_id,
            'booking_id' => $booking->id,
            'points_earned' => $days,
            'notes' => "Awarded for completed booking from {$booking->start_date} to {$booking->end_date}"
        ]);
    }
}
