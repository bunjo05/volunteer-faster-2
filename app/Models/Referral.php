<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = [
        'referrer_public_id',
        'referee_public_id',
        'referrer_points',
        'referee_points',
        'status',
        'ip_address',
        'user_agent'
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_public_id', 'public_id');
    }

    public function referee()
    {
        return $this->belongsTo(User::class, 'referee_public_id', 'public_id');
    }
}
