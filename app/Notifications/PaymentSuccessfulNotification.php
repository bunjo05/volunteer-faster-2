<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Mail\PaymentSuccessfulUser;
use App\Mail\PaymentSuccessfulOwner;
use App\Mail\PaymentSuccessfulAdmin;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentSuccessfulNotification extends Notification
{
    use Queueable;

    public $booking;
    public $payment;
    public $recipientType;

    public function __construct($booking, $payment, $recipientType = 'user')
    {
        $this->booking = $booking;
        $this->payment = $payment;
        $this->recipientType = $recipientType;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable)
    {
        switch ($this->recipientType) {
            case 'admin':
                return new PaymentSuccessfulAdmin($this->booking, $this->payment, $notifiable->email);

            case 'owner':
                return new PaymentSuccessfulOwner($this->booking, $this->payment);

            default: // user
                return new PaymentSuccessfulUser($this->booking, $this->payment);
        }
    }
}
