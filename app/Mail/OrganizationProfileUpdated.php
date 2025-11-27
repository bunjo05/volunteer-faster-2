<?php

namespace App\Mail;

use App\Models\User;
use App\Models\OrganizationProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrganizationProfileUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $organization;
    public $originalData;
    public $isNewProfile;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, OrganizationProfile $organization, ?array $originalData = null)
    {
        $this->user = $user;
        $this->organization = $organization;
        $this->originalData = $originalData;
        $this->isNewProfile = is_null($originalData);
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = $this->isNewProfile
            ? "New Organization Profile Created: {$this->organization->name}"
            : "Organization Profile Updated: {$this->organization->name}";

        return $this->subject($subject)
            ->markdown('emails.organization-profile-updated')
            ->with([
                'user' => $this->user,
                'organization' => $this->organization,
                'isNewProfile' => $this->isNewProfile,
                'originalData' => $this->originalData,
            ]);
    }
}
