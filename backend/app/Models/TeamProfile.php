<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'job_title',
        'tagline',
        'bio_id',
        'skills_json',
        'certifications_json',
        'social_links_json',
        'is_public_showcase',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'skills_json' => 'array',
            'certifications_json' => 'array',
            'social_links_json' => 'array',
            'is_public_showcase' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
