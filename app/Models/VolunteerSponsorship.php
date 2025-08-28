<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerSponsorship extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'booking_id',
        'total_amount',
        'accommodation',
        'meals',
        'living_expenses',
        'visa_fees',
        'travel',
        'project_fees_amount',
        'self_introduction',
        'impact',
        'commitment',
        'agreement',
        'aspect_needs_funding',
        'skills',
        // 'updates'
    ];

    protected $casts = [
        'aspect_needs_funding' => 'array',
        'skills' => 'array',
        'commitment' => 'boolean',
        'agreement' => 'boolean',
        'total_amount' => 'decimal:2',
        'travel' => 'decimal:2',
        'accommodation' => 'decimal:2',
        'meals' => 'decimal:2',
        'living_expenses' => 'decimal:2',
        'visa_fees' => 'decimal:2',
        'project_fees_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class)->with('user'); // Add with('user') to always load the user
    }
}
