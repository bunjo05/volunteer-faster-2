<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectRemark extends Model
{
    protected $fillable = ['project_id', 'admin_id', 'remark', 'status'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
