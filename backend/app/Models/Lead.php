<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'source',
        'external_sender_id',
        'sender_name',
        'sender_contact',
        'company_name',
        'subject_or_intent',
        'initial_message',
        'status',
        'assigned_to_user_id',
        'converted_to_client_id',
        'converted_to_project_id',
        'ai_sentiment_score',
        'ai_suggested_reply',
        'metadata_json',
    ];

    protected function casts(): array
    {
        return [
            'ai_sentiment_score' => 'decimal:2',
            'metadata_json' => 'array',
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

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function convertedClient()
    {
        return $this->belongsTo(Client::class, 'converted_to_client_id');
    }

    public function convertedProject()
    {
        return $this->belongsTo(Project::class, 'converted_to_project_id');
    }

    public function activities()
    {
        return $this->hasMany(LeadActivity::class)->orderBy('created_at', 'desc');
    }
}
