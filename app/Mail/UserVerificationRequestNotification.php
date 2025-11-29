<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope; // Add this import
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\OrganizationProfile;
use App\Models\VolunteerProfile;
use Illuminate\Support\Str; // Add this import

class UserVerificationRequestNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $userRole;
    public $organizationProfile;
    public $volunteerProfile;
    public $verificationData;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $verificationData = null)
    {
        $this->user = $user;
        $this->userRole = $user->role;
        $this->verificationData = $verificationData;

        // Load role-specific profiles
        if ($user->role === 'Organization') {
            $this->organizationProfile = OrganizationProfile::where('user_public_id', $user->public_id)->first();
        } elseif ($user->role === 'Volunteer') {
            $this->volunteerProfile = VolunteerProfile::where('user_public_id', $user->public_id)->first();
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Fix: Handle case where organization profile might be null
        $subject = $this->userRole === 'Organization' && $this->organizationProfile
            ? "Organization Verification Request: {$this->organizationProfile->name}"
            : ($this->userRole === 'Volunteer'
                ? "Volunteer Verification Request: {$this->user->name}"
                : "User Verification Request: {$this->user->name}");

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.user-verification-request',
            with: [
                'user' => $this->user,
                'userRole' => $this->userRole,
                'organizationProfile' => $this->organizationProfile,
                'volunteerProfile' => $this->volunteerProfile,
                'verificationData' => $this->verificationData,
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
