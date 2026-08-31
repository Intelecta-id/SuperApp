# Arsitektur Intelecta SuperApp

## 1. Ikhtisar Arsitektur
Intelecta SuperApp menggunakan arsitektur **Decoupled Monorepo** yang memisahkan core backend API dan frontend SPA demi fleksibilitas skalabilitas dan kecepatan pengembangan.

```
SuperAppIntelecta/
├── backend/                  # Laravel 11 API Backend (PHP 8.3+)
│   ├── app/
│   │   ├── Http/Controllers/API/V1/ (REST API Controllers)
│   │   ├── Models/           (Eloquent Models)
│   │   ├── Services/         (InstagramService, FirebaseService, WebhookService)
│   │   ├── Jobs/             (Background Queues)
│   │   └── Events/           (Domain Events)
│   ├── routes/api.php        (Protected & Webhook Endpoints)
│   └── config/services.php   (Meta, Firebase, Corporate Web Config)
│
├── frontend/                 # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/       (Layout, Chat, Projects, Leads, UI)
│   │   ├── hooks/            (Firebase Auth, Realtime Listeners, FCM)
│   │   ├── contexts/         (Global Auth, Notifications, Theme)
│   │   ├── services/         (Axios API Client, Firebase SDK)
│   │   └── pages/            (Dashboard, Omnichannel, Clients, Projects, Settings)
│   └── tailwind.config.js    (Dark Obsidian Tokens)
│
└── docs/                     # Dokumentasi API & Schema
```

## 2. Pola Integrasi
1. **Autentikasi**: Laravel Sanctum mengelola stateful / token-based auth, sekaligus berinteraksi dengan Firebase Admin SDK untuk men-generate Custom Token.
2. **Realtime Engine**: Frontend menggunakan Firebase Client SDK untuk mendengarkan stream chat Firestore secara sub-100ms.
3. **Omnichannel Ingestion**: Webhook receiver di Laravel memproses pesan Meta Graph API (Instagram DM) dan Form Kontak Corporate Web secara asinkronus via queue.
