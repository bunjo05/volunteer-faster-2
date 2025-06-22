<?php

namespace App\Mail;

use App\Models\VolunteerBooking;
use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VolunteerBookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $project;

    public function __construct(VolunteerBooking $booking, Project $project)
    {
        $this->booking = $booking;
        $this->project = $project;
    }

    public function build()
    {
        return $this->subject('Your Volunteer Booking Confirmation')
            ->markdown('emails.volunteer.booking_confirmation');
    }
}
