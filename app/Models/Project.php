<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'featured_image',
        'category_id',
        'subcategory_id',
        'country',
        'city',
        'state',
        'short_description',
        'detailed_description',
        'min_duration',
        'max_duration',
        'duration_type',
        'daily_routine',
        'type_of_project',
        'fees',
        'currency',
        'category_of_charge',
        'includes',
        'excludes',
        'activities',
        'suitable',
        'availability_months',
        'start_date',
        'status',
        'user_id',
        'request_for_approval',
        'point_exchange', // Added point exchange column
        'skills'
    ];

    protected $casts = [
        'suitable' => 'array',
        'availability_months' => 'array',
        'skills' => 'array',
        'min_duration' => 'integer',
        'max_duration' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function organizationProfile()
    {
        return $this->hasOneThrough(
            OrganizationProfile::class,
            User::class,
            'id',               // Foreign key on User table
            'user_id',          // Foreign key on OrganizationProfile table
            'user_id',          // Local key on Project table
            'id'                // Local key on User table
        );
    }

    public function galleryImages()
    {
        return $this->hasMany(GalleryImage::class);
    }

    public function projectRemarks()
    {
        return $this->hasMany(ProjectRemark::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function featured()
    {
        return $this->hasOne(FeaturedProject::class)->where('is_active', true);
    }

    public function featuredRequests()
    {
        return $this->hasMany(FeaturedProject::class);
    }
    public function featuredProjects()
    {
        return $this->hasMany(FeaturedProject::class);
    }

    public function getIsFeaturedAttribute()
    {
        return $this->featuredProjects()->where('is_active', true)->exists();
    }
}
