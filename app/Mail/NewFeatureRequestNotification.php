<?php

// app/Mail/NewFeatureRequestNotification.php
namespace App\Mail;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewFeatureRequestNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    public function build()
    {
        return $this->subject('New Project Feature Request - Requires Approval')
            ->markdown('emails.featured_project.admin_notification');
    }
}
