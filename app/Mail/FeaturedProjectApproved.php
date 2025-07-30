<?php

// app/Mail/FeaturedProjectApproved.php
namespace App\Mail;

use App\Models\FeaturedProject;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeaturedProjectApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $featuredProject;

    public function __construct(FeaturedProject $featuredProject)
    {
        $this->featuredProject = $featuredProject;
    }

    public function build()
    {
        return $this->subject('🎉 Congratulations! Your Project Has Been Featured')
            ->markdown('emails.featured_project.status.approved');
    }
}
