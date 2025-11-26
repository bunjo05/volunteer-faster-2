<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppreciationMessage extends Mailable
{
    use Queueable, SerializesModels;

    public $volunteerName;
    public $donorName;
    public $message;
    public $projectName;
    public $amount;

    public function __construct($volunteerName, $donorName, $message, $projectName, $amount)
    {
        $this->volunteerName = $volunteerName;
        $this->donorName = $donorName;
        $this->message = $message;
        $this->projectName = $projectName;
        $this->amount = $amount;
    }

    public function build()
    {
        return $this->subject('Thank You for Your Sponsorship!')
            ->view('emails.appreciation')
            ->with([
                'volunteerName' => $this->volunteerName,
                'donorName' => $this->donorName,
                'appreciationMessage' => $this->message,
                'projectName' => $this->projectName,
                'amount' => $this->amount,
            ]);
    }
}
