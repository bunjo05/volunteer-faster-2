<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\PlatformReview;

class PlatformReviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public $review;

    /**
     * Create a new message instance.
     */
    public function __construct(PlatformReview $review)
    {
        $this->review = $review;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('📝 New Platform Review Submitted')
            ->markdown('emails.platform-review')
            ->with([
                'review' => $this->review,
                'user' => $this->review->user,
            ]);
    }
}
