<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessfulOwner extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $payment;

    public function __construct($booking, $payment)
    {
        $this->booking = $booking;
        $this->payment = $payment;
    }

    public function build()
    {
        return $this->markdown('emails.payments.owner')
            ->to($this->booking->project->user->email) // owner's email
            ->subject('Payment Confirmation - ' . $this->booking->project->title)
            ->with([
                'title' => 'Payment Confirmation' // Pass title to layout
            ]);
    }
}
