<?php

namespace App\Mail;

use App\Models\VolunteerBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingCompleted extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;

    public function __construct(VolunteerBooking $booking)
    {
        $this->booking = $booking;
    }

    public function build()
    {
        return $this->subject('🎉🎉🎉 Congratulations on Completing Your Volunteer Program!')
            ->markdown('emails.booking.completed');
    }
}
