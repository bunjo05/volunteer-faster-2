<?php

namespace App\Mail;

use App\Models\FeaturedProject;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeaturedProjectExpired extends Mailable
{
    use Queueable, SerializesModels;

    public $featuredProject;

    public function __construct(FeaturedProject $featuredProject)
    {
        $this->featuredProject = $featuredProject;
    }

    public function build()
    {
        return $this->subject("🌟 Your Featured Project Has Expired: {$this->featuredProject->project->title}")
            ->markdown('emails.featured-project-expired')
            ->with([
                'project' => $this->featuredProject->project,
                'featuredProject' => $this->featuredProject
            ]);
    }
}
