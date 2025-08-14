<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectRemarkComment extends Model
{
    protected $fillable = [
        'user_id',
        'project_remark_id',
        'parent_id',
        'comment',
        'is_approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(ProjectRemarkComment::class, 'parent_id')
            ->with('user');
    }

    public function remark()
    {
        return $this->belongsTo(ProjectRemark::class);
    }
}
