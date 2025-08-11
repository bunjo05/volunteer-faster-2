<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\VolunteerBooking;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'status',
        'referral_code',
        'referred_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->referral_code = self::generateUniqueReferralCode();
        });
    }

    public static function generateUniqueReferralCode()
    {
        $code = strtoupper(substr(md5(uniqid()), 0, 8));

        while (self::where('referral_code', $code)->exists()) {
            $code = strtoupper(substr(md5(uniqid()), 0, 8));
        }

        return $code;
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    public function referee()
    {
        return $this->hasMany(Referral::class, 'referee_id');
    }

    public function devices()
    {
        return $this->hasMany(UserDevice::class);
    }

    public function organization()
    {
        return $this->hasOne(OrganizationProfile::class);
    }

    public function organizationProfile()
    {
        return $this->hasOne(OrganizationProfile::class);
    }

    public function volunteerProfile()
    {
        return $this->hasOne(VolunteerProfile::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function volunteerBookings()
    {
        return $this->hasMany(VolunteerBooking::class);
    }

    // Add these to your User model
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_participants', 'user_id', 'chat_id');
    }
    public function bookings()
    {
        return $this->hasMany(VolunteerBooking::class);
    }

    public function volunteerPoints()
    {
        return $this->hasMany(VolunteerPoint::class);
    }

    public function completedBookings()
    {
        return $this->hasMany(VolunteerBooking::class)->where('booking_status', 'Completed');
    }

    // In User model
    // public function followingOrganizations()
    // {
    //     return $this->hasMany(VolunteerFollowingOrganization::class, 'user_id');
    // }

    public function isFollowing(OrganizationProfile $organization)
    {
        return $this->followingOrganizations()
            ->where('organization_id', $organization->id)
            ->exists();
    }

    public function followingOrganizations()
    {
        return $this->belongsToMany(OrganizationProfile::class, 'volunteer_following_organizations', 'user_id', 'organization_id')
            ->withTimestamps();
    }
}
