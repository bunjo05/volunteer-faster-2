<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectRemark extends Model
{
    protected $fillable = [
        'project_public_id',
        'booking_public_id',
        'user_public_id',
        'comment',
        'status',
        'rating'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_public_id', 'public_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    // public function booking()
    // {
    //     return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    // }

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
