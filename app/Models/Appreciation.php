<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appreciation extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'volunteer_public_id',
        'donor_public_id',
        'sponsorship_public_id',
        'message',
        'status'
    ];

    public function volunteer()
    {
        return $this->belongsTo(User::class, 'volunteer_public_id', 'public_id');
    }

    public function donor()
    {
        return $this->belongsTo(User::class, 'donor_public_id', 'public_id');
    }

    public function sponsorship()
    {
        return $this->belongsTo(Sponsorship::class, 'sponsorship_public_id', 'public_id');
    }
}
