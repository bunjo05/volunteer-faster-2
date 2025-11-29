<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'user_public_id',
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
        'request_for_approval',
        'point_exchange', // Added point exchange column
        'skills',

        'reason_for_rejection',

        // 'user_public_id'
    ];

    protected $casts = [
        'suitable' => 'array',
        'includes' => 'array',
        'excludes' => 'array',
        'availability_months' => 'array',
        'skills' => 'array',
        'min_duration' => 'integer',
        'max_duration' => 'integer',
    ];

    protected static function booted()
    {
        // parent::booted();
        static::creating(function ($project) {
            if (!$project->public_id) {
                $project->public_id = (string) Str::ulid();
            }
        });
    }

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
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }
    public function organizationProfile()
    {
        return $this->hasOneThrough(
            OrganizationProfile::class,
            User::class,
            'public_id',          // Foreign key on User table (changed from 'id')
            'user_public_id',           // Foreign key on OrganizationProfile table
            'user_public_id',    // Local key on Project table (changed from 'user_id')
            'id'                 // Local key on User table
        );
    }

    public function galleryImages()
    {
        return $this->hasMany(GalleryImage::class, 'project_public_id', 'public_id');
    }

    public function projectRemarks()
    {
        return $this->hasMany(ProjectRemark::class, 'project_public_id', 'public_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }
    public function featured()
    {
        return $this->hasOne(FeaturedProject::class, 'project_public_id', 'public_id')
            ->where('is_active', true);
    }

    public function featuredRequests()
    {
        return $this->hasMany(FeaturedProject::class, 'project_public_id', 'public_id');
    }

    public function featuredProjects()
    {
        return $this->hasMany(FeaturedProject::class, 'project_public_id', 'public_id');
    }

    public function getIsFeaturedAttribute()
    {
        return $this->featuredProjects()->where('is_active', true)->exists();
    }

    public function updateAverageRating()
    {
        $this->average_rating = $this->reviews()->avg('rating');
        $this->save();
    }

    public function reviews()
    {
        return $this->hasMany(ProjectRemark::class);
    }
}
