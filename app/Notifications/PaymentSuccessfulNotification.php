<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessfulNotification extends Notification
{
    use Queueable;

    public $booking;
    public $payment;
    public $recipientType;

    /**
     * Create a new notification instance.
     */
    public function __construct($booking, $payment, $recipientType = 'user')
    {
        $this->booking = $booking;
        $this->payment = $payment;
        $this->recipientType = $recipientType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = '';
        $greeting = '';
        $content = '';

        switch ($this->recipientType) {
            case 'admin':
                $subject = 'New Payment Received for Project: ' . $this->booking->project->title;
                $greeting = 'Hello Admin,';
                $content = 'A new payment has been received for the project booking:';
                break;

            case 'owner':
                $subject = 'New Payment Received for Your Project: ' . $this->booking->project->title;
                $greeting = 'Hello Project Owner,';
                $content = 'A new payment has been received for your project:';
                break;

            default: // user
                $subject = 'Payment Confirmation for Project: ' . $this->booking->project->title;
                $greeting = 'Hello ' . $this->booking->user->name . ',';
                $content = 'Thank you for your payment. Here are your booking details:';
        }

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($content)
            ->line('Project: ' . $this->booking->project->title)
            ->line('Amount Paid: $' . number_format($this->payment->amount, 2))
            ->line('Total Amount: $' . number_format($this->payment->full_amount, 2))
            ->line('Payment Status: ' . ucfirst(str_replace('_', ' ', $this->payment->status)))
            ->action('View Booking', url('/volunteer-programs/' . $this->booking->project->slug))
            ->line('Thank you for using our platform!');
    }
}
