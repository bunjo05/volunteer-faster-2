<?php

namespace App\Mail;

use App\Models\FeaturedProject;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeaturedProjectExpiring extends Mailable
{
    use Queueable, SerializesModels;

    public $featuredProject;
    public $daysLeft;

    public function __construct(FeaturedProject $featuredProject, $daysLeft)
    {
        $this->featuredProject = $featuredProject;
        $this->daysLeft = $daysLeft;
    }

    public function build()
    {
        $subject = $this->daysLeft === 1
            ? "Your Featured Project Expires Tomorrow: {$this->featuredProject->project->title}"
            : "Your Featured Project Expires in {$this->daysLeft} Days: {$this->featuredProject->project->title}";

        return $this->subject($subject)
            ->markdown('emails.featured-project-expiring')
            ->with([
                'project' => $this->featuredProject->project,
                'featuredProject' => $this->featuredProject,
                'daysLeft' => $this->daysLeft
            ]);
    }
}
