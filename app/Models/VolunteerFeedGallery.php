<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerFeedGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'volunteer_feed_public_id',
        'image_path'
    ];
    public function volunteerFeed()
    {
        return $this->belongsTo(VolunteerFeed::class, 'volunteer_feed_public_id', 'public_id');
    }
}
