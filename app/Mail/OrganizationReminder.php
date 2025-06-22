<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\VolunteerBooking;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrganizationReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;

    public function __construct(VolunteerBooking $booking)
    {
        $this->booking = $booking;
    }
    public function build()
    {
        return $this->subject('Reminder: Volunteer Booking for ' . $this->booking->project->title)
            ->markdown('emails.organization-reminder')
            ->with([
                'booking' => $this->booking,
                'project' => $this->booking->project,
                'volunteer' => $this->booking->user,
            ]);
    }
}
