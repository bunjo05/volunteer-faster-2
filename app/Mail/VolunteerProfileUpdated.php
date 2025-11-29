<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\VolunteerProfile;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;

class VolunteerProfileUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $volunteer;
    public $user;
    public $changes;

    /**
     * Create a new message instance.
     */
    public function __construct(VolunteerProfile $volunteer, User $user, array $changes = [])
    {
        $this->volunteer = $volunteer;
        $this->user = $user;
        $this->changes = $changes;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Volunteer Profile Updated: ' . $this->user->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.volunteer-profile-updated',
            with: [
                'volunteer' => $this->volunteer,
                'user' => $this->user,
                'changes' => $this->changes,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
