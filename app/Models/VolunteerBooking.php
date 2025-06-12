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
        'status'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
