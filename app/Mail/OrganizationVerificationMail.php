<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\OrganizationVerification;
use App\Models\OrganizationProfile;

class OrganizationVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;
    public $organization;
    public $status;

    /**
     * Create a new message instance.
     */
    public function __construct(OrganizationVerification $verification, OrganizationProfile $organization, string $status)
    {
        $this->verification = $verification;
        $this->organization = $organization;
        $this->status = $status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status === 'Approved'
            ? '🎉🎉🎉Your Organization Verification Has Been Approved'
            : '❌❌❌Your Organization Verification Has Been Rejected';

        return new Envelope(
            subject: $subject,
        );
    }

    public function build()
    {
        return $this->markdown('emails.organization_verification')
            ->with([
                'verification' => $this->verification,
                'organization' => $this->organization,
                'status' => $this->status,
            ]);
    }
}
