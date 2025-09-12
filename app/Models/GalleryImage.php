<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = ['project_public_id', 'image_path'];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }
}
