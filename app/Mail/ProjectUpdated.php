<?php

namespace App\Mail;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $project;
    public $newStatus;
    public $oldStatus;
    public $remark;

    /**
     * Create a new message instance.
     */
    public function __construct(Project $project, $newStatus, $oldStatus = null, $remark = null)
    {
        $this->project = $project;
        $this->newStatus = $newStatus;
        $this->oldStatus = $oldStatus;
        $this->remark = $remark;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if ($this->newStatus === 'Active') {
            $subject = "🎉🎉🎉 Congratulations! Your Project Has Been Approved";
        } elseif ($this->newStatus === 'Rejected') {
            $subject = "Project Status Update: Your Project Requires Attention";
        } else {
            $subject = "Project Status Updated: {$this->project->title}";
        }

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.project-updated',
            with: [
                'project' => $this->project,
                'newStatus' => $this->newStatus,
                'oldStatus' => $this->oldStatus,
                'remark' => $this->remark,
                'user' => $this->project->user,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
