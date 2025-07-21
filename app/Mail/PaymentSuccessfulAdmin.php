<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessfulAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $payment;
    public $adminEmail;

    public function __construct($booking, $payment, $adminEmail)
    {
        $this->booking = $booking;
        $this->payment = $payment;
        $this->adminEmail = $adminEmail;
    }

    public function build()
    {
        return $this->markdown('emails.payments.admin')
            ->to($this->adminEmail) // Explicitly set the "To" header
            ->subject('[Admin] New Payment Received - ' . $this->booking->project->title)
            ->with([
                'title' => 'New Payment Notification'
            ]);
    }
}
