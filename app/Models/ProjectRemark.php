<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectRemark extends Model
{
    protected $fillable = [
        'project_id',
        'admin_id',
        'booking_id',
        'user_id',
        'comment',
        'status',
        'rating'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class);
    }

    public function comments()
    {
        return $this->hasMany(ProjectRemarkComment::class)
            ->whereNull('parent_id')
            ->with('replies');
    }

    public function allComments()
    {
        return $this->hasMany(ProjectRemarkComment::class)
            ->with('user', 'replies.user');
    }
}
