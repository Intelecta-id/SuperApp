<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use App\Models\AuditLog;
use App\Services\FirebaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseApiController
{
    protected FirebaseService $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

    /**
     * Internal User Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'fcm_token' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->jsonError('Kredensial login tidak valid.', 401);
        }

        if ($user->status !== 'active') {
            return $this->jsonError('Akun Anda sedang dinonaktifkan atau disuspend.', 403);
        }

        // Generate Sanctum Bearer Token
        $sanctumToken = $user->createToken('intelecta_superapp_session')->plainTextToken;

        // Generate Firebase Custom Token
        $firebaseCustomToken = $this->firebaseService->createCustomToken($user->uuid, [
            'name' => $user->name,
            'email' => $user->email,
        ]);

        // Update user state
        $user->last_active_at = now();
        if ($request->fcm_token) {
            $user->fcm_token = $request->fcm_token;
        }
        $user->save();

        // Audit Log
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'auth.login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->jsonResponse([
            'user' => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar_url' => $user->avatar_url,
                'status' => $user->status,
                'team_profile' => $user->teamProfile,
            ],
            'access_token' => $sanctumToken,
            'token_type' => 'Bearer',
            'firebase_custom_token' => $firebaseCustomToken,
        ], 'Login berhasil.');
    }

    /**
     * Get Current Authenticated User
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('teamProfile');

        return $this->jsonResponse([
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'avatar_url' => $user->avatar_url,
            'status' => $user->status,
            'last_active_at' => $user->last_active_at,
            'team_profile' => $user->teamProfile,
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()->delete();

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'auth.logout',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $this->jsonResponse(null, 'Logout berhasil.');
    }
}
