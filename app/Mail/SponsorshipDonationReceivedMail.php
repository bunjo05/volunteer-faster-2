<?php

namespace App\Mail;

use App\Models\VolunteerSponsorship;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SponsorshipDonationReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $sponsorship;
    public $amount;

    public function __construct(VolunteerSponsorship $sponsorship, float $amount)
    {
        $this->sponsorship = $sponsorship->load('booking.project');
        $this->amount = $amount;
    }

    public function build()
    {
        return $this->subject('You received a new sponsorship donation')
            ->view('emails.sponsorship_donation_received');
    }
}
