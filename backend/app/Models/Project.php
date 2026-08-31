<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'client_id',
        'project_code',
        'title',
        'description',
        'category',
        'status',
        'contract_value',
        'start_date',
        'target_completion_date',
        'git_repository_url',
        'staging_url',
        'production_url',
        'is_featured_case_study',
        'case_study_metrics_json',
    ];

    protected function casts(): array
    {
        return [
            'contract_value' => 'decimal:2',
            'start_date' => 'date',
            'target_completion_date' => 'date',
            'is_featured_case_study' => 'boolean',
            'case_study_metrics_json' => 'array',
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

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function sprints()
    {
        return $this->hasMany(Sprint::class)->orderBy('order', 'asc');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class)->orderBy('order_position', 'asc');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
