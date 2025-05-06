<?php

namespace App\Models;

use App\Models\GalleryImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'featured_image',
        'category_id',
        'subcategory_id',
        'address',
        'short_description',
        'detailed_description',
        'duration',
        'daily_routine',
        'fees',
        'currency',
        'activities',
        'suitable',
        'availability_months',
        // 'gallery_images',
        'start_date',
        'end_date',
        'status',
        'user_id',
        'request_for_approval',
    ];

    protected $casts = [
        'suitable' => 'array',
        'availability_months' => 'array',
        // 'gallery_images' => 'array',
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
            \App\Models\OrganizationProfile::class,
            \App\Models\User::class,
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

}
