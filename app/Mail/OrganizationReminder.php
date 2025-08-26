<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\VolunteerBooking;
use Illuminate\Queue\SerializesModels;

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
        $subjectPrefix = match ($this->stage) {
            'first' => '📌 First Reminder',
            'second' => '⏰ Second Reminder',
            'final' => '⚠️ Final Reminder',
            default => 'Volunteer Booking Reminder',
        };

        $subject = "{$subjectPrefix}: {$this->booking->project->title}";

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
