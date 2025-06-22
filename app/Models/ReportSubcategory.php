<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportSubcategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'report_category_id',
    ];

    public function category()
    {
        return $this->belongsTo(ReportCategory::class,  'report_category_id');
    }
}
