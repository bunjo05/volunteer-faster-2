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
        $subject = match($this->status) {
            'Active' => 'Your account has been Approved 🎉🎉🎉',
            'Suspended' => 'Your account has been Suspended 🚫🚫🚫',
            'Pending' => 'Your account is Pending Approval ⏳⏳⏳',
        };

        // Choose the appropriate view based on status or role
        $view = match ($this->status) {
            'Active' => 'emails.user_status.approved',
            'Suspended' => 'emails.user_status.suspended',
            'Pending' => 'emails.user_status.user-status-changed',
            // default => 'emails.user-status-default',
        };

        return $this->subject($subject)
                    ->view($view)
                    ->with([
                        'user' => $this->user,
                        'status' => $this->status,
                    ]);
    }
}
