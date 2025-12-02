<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\VolunteerSponsorship;

class SponsorshipStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $sponsorship;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new message instance.
     */
    public function __construct(VolunteerSponsorship $sponsorship, string $newStatus, string $oldStatus = null)
    {
        $this->sponsorship = $sponsorship;
        $this->newStatus = $newStatus;
        $this->oldStatus = $oldStatus;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = "Your Sponsorship Application Status Has Been Updated";

        if ($this->newStatus === 'Approved') {
            $subject = "🎉🎉🎉 Congratulations! Your Sponsorship Application Has Been Approved";
        } elseif ($this->newStatus === 'Rejected') {
            $subject = "❌❌❌ Your Sponsorship Application has been Rejected.";
        }

        return $this->subject($subject)
            ->markdown('emails.sponsorship.status-changed')
            ->with([
                'sponsorship' => $this->sponsorship,
                'oldStatus' => $this->oldStatus,
                'newStatus' => $this->newStatus,
            ]);
    }
}
