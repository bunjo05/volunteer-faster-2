<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\VolunteerSponsorship;
use App\Models\Sponsorship as SponsorshipDonation;

class SponsorshipPaymentReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $sponsorship;
    public $donation;
    public $recipientType;

    /**
     * Create a new message instance.
     */
    public function __construct(VolunteerSponsorship $sponsorship, SponsorshipDonation $donation, $recipientType = 'volunteer')
    {
        $this->sponsorship = $sponsorship;
        $this->donation = $donation;
        $this->recipientType = $recipientType;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $subject = $this->getSubject();

        return $this->subject($subject)
            ->markdown('emails.sponsorship.payment-received')
            ->with([
                'sponsorship' => $this->sponsorship,
                'donation' => $this->donation,
                'recipientType' => $this->recipientType,
            ]);
    }

    private function getSubject()
    {
        switch ($this->recipientType) {
            case 'volunteer':
                return '🎉 You Received a Sponsorship Donation!';
            case 'donor':
                return 'Thank You for Your Sponsorship Donation!';
            case 'admin':
                return 'New Sponsorship Donation Received';
            default:
                return 'Sponsorship Payment Notification';
        }
    }
}
