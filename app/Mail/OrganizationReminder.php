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
    public $stage;

    public function __construct(VolunteerBooking $booking, string $stage)
    {
        $this->booking = $booking;
        $this->stage = $stage;
    }
    public function build()
    {
        $subject = '';
        switch ($this->stage) {
            case 'first':
                $subject = 'First Reminder: Volunteer Booking for ' . $this->booking->project->title;
                break;
            case 'second':
                $subject = 'Second Reminder: Volunteer Booking for ' . $this->booking->project->title;
                break;
            case 'final':
                $subject = 'Final Reminder: Volunteer Booking for ' . $this->booking->project->title;
                break;
        }

        return $this->subject($subject)
            ->markdown('emails.organization-reminder')
            ->with([
                'booking' => $this->booking,
                'project' => $this->booking->project,
                'volunteer' => $this->booking->user,
                'stage' => $this->stage,
            ]);
    }
}
