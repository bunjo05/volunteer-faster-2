<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendOtp extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;

    /**
     * Create a new message instance.
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // dd($this->otp); // Dump and die to see the OTP
        return $this->subject('Your OTP Verification Code')
            ->markdown('emails.otp')
            ->with(['code' => $this->otp]);
    }
}
