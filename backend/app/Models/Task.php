<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'project_id',
        'sprint_id',
        'assigned_to_user_id',
        'title',
        'description',
        'status',
        'priority',
        'story_points',
        'due_date',
        'order_position',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'story_points' => 'integer',
            'order_position' => 'integer',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }
}
