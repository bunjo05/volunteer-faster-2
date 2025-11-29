<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $status;

    public function __construct(User $user, $status)
    {
        $this->user = $user;
        $this->status = $status;
    }

    public function build()
    {
        $subject = match ($this->status) {
            'Active' => 'Your account has been Approved 🎉🎉🎉',
            'Suspended' => 'Your account has been Suspended 🚫🚫🚫',
            'Pending' => 'Your account is Pending Approval ⏳⏳⏳',
        };

        return $this->subject($subject)
            ->markdown('emails.user_status.user-status-changed')
            ->with([
                'user' => $this->user,
                'status' => $this->status,
            ]);
    }
}
