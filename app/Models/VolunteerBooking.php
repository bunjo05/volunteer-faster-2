<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerBooking extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'start_date',
        'end_date',
        'number_of_travellers',
        'booking_status'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'booking_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'booking_id'); // Explicitly set the foreign key
    }

    public function project()
    {
        return $this->belongsTo(Project::class)->with('user'); // Add with('user') to always load the user
    }

    public function calculateDaysSpent()
    {
        $start = new \DateTime($this->start_date);
        $end = new \DateTime($this->end_date);
        $interval = $start->diff($end);
        return $interval->days + 1; // +1 to include both start and end days
    }

    // In app/Models/VolunteerBooking.php
    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class, 'booking_id'); // Explicitly set the foreign key
    }
}
