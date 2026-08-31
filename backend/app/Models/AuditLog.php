<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'auditable_type',
        'auditable_id',
        'ip_address',
        'user_agent',
        'state_diff_json',
    ];

    protected function casts(): array
    {
        return [
            'state_diff_json' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
