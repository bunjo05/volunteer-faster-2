<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\VolunteerProfile;
use App\Models\VolunteerVerification;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class VolunteerVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;
    public $volunteer;
    public $status;

    /**
     * Create a new message instance.
     */

    public function __construct(VolunteerVerification $verification, VolunteerProfile $volunteer, string $status)
    {
        $this->verification = $verification;
        $this->volunteer = $volunteer;
        $this->status = $status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status === 'Approved'
            ? '🎉🎉🎉Your Volunteer Verification Has Been Approved'
            : '❌❌❌Your Volunteer Verification Has Been Rejected';

        return new Envelope(
            subject: $subject,
        );
    }

    public function build()
    {
        return $this->markdown('emails.volunteer_verification')
            ->with([
                'verification' => $this->verification,
                'volunteer' => $this->volunteer,
                'status' => $this->status,
            ]);
    }
}
