<?php

namespace App\Mail;

use App\Models\VolunteerBooking;
use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProjectOwnerBookingNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $project;
    public $volunteer;
    public $ownerEmail;

    public function __construct(VolunteerBooking $booking, Project $project, User $volunteer)
    {
        $this->booking = $booking;
        $this->project = $project;
        $this->volunteer = $volunteer;
        $this->ownerEmail = $project->organizationProfile->email ?? $project->user->email;
    }

    public function build()
    {
        return $this->subject('New Volunteer Booking for Your Project: ' . $this->project->title)
            ->markdown('emails.project.owner_booking_notification');
    }
}
