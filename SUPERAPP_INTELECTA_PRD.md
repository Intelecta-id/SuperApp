# Product Requirement Document (PRD) & Technical Specification
# Intelecta SuperApp — Enterprise Digital Operations & Client Management Ecosystem

> **Versi**: 1.0.0  
> **Tanggal Rilis**: 31 Agustus 2026  
> **Target Platform**: Web App (Desktop & Tablet Optimized, Mobile Responsive)  
> **Status**: Ready for Architecture & Development Phase  

---

## Daftar Isi

1. [Eksekutif & Visi Produk](#1-eksekutif--visi-produk)
2. [Tech Stack & Arsitektur Sistem](#2-tech-stack--arsitektur-sistem)
3. [Model Pengguna & Manajemen Klien](#3-model-pengguna--manajemen-klien)
4. [Skema Basis Data (MySQL & Firestore NoSQL)](#4-skema-basis-data-mysql--firestore-nosql)
5. [Arsitektur Realtime Chat & Notifikasi (Firebase SDK)](#5-arsitektur-realtime-chat--notifikasi-firebase-sdk)
6. [Integrasi Ekosistem Eksternal (Instagram & Corporate Web)](#6-integrasi-ekosistem-eksternal-instagram--corporate-web)
7. [Spesifikasi Fitur & Modul Fungsional](#7-spesifikasi-fitur--modul-fungsional)
8. [UI/UX Design System & Tata Letak Antarmuka](#8-uiux-design-system--tata-letak-antarmuka)
9. [API Contract & Webhook Specifications](#9-api-contract--webhook-specifications)
10. [Keamanan, Audit Log & Non-Functional Requirements](#10-keamanan-audit-log--non-functional-requirements)
11. [Roadmap Implementasi & Checklist Pengembangan](#11-roadmap-implementasi--checklist-pengembangan)

---

## 1. Eksekutif & Visi Produk

### 1.1 Latar Belakang & Visi
**Intelecta** adalah entitas penyedia solusi teknologi digital terdepan yang berfokus pada **3 Layanan Inti**:
1. **Web Development** (Company Profile, High-Performance Landing Pages, E-Commerce, Custom CMS).
2. **Mobile App Development** (Aplikasi Mobile iOS & Android menggunakan Flutter / React Native / Native).
3. **Web App Development** (SaaS Platforms, Custom ERP/CRM, Dashboard Portals, B2B Internal Tools).

Seiring dengan peluncuran *Intelecta Corporate Web* (Next.js 15), dibangun platform internal terpusat (**Intelecta SuperApp**) yang mengorkestrasi seluruh operasional pengerjaan proyek, pengelolaan data klien, penagihan, dan manajemen prospek (lead) secara *end-to-end*.

**Intelecta SuperApp** dirancang khusus sebagai **Internal Operations & Client Management Hub** (tanpa kompleksitas multi-role user). SuperApp ini menyatukan:
1. **Omnichannel Communication Center**: Penyatuan pesan masuk & notifikasi dari Instagram Direct Message (Meta Graph API), formulir kontak & terminal pada Corporate Web, WhatsApp Business, dan obrolan internal.
2. **Client Management & Project Command Center**: Pengelolaan data direktori klien korporat B2B, pelacakan milestone & sprint proyek, deliverable, penagihan invoice, dan SLA ticketing.
3. **Internal Project & Talent Management**: Alokasi engineer/konsultan, sprint tracking, otomatisasi sinkronisasi profil publik ke halaman `/tim/[slug]` pada Corporate Web.
4. **Realtime Chat & Incident Escalation**: Komunikasi instan berbasis Firebase Realtime / Firestore & Push Notifications (FCM) untuk koordinasi cepat antar tim operasional.

```
                    ┌────────────────────────────────────────┐
                    │      INTELECTA CORPORATE WEB (Next.js) │
                    │   (Showcase, Contact Form, /tim, CLI)  │
                    └───────────────────┬────────────────────┘
                                        │ Webhook / REST Sync
                                        ▼
┌──────────────────┐    ┌───────────────────────────────────┐
│  INSTAGRAM /     │───▶│       INTELECTA SUPERAPP          │◀─── [ TIM / OPERATOR INTELECTA ]
│  META GRAPH API  │    │     (Laravel + React + MySQL)     │     (Kelola Klien & Operasional)
└──────────────────┘    └─────────────────┬─────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
        ┌─────────────────────────┐               ┌─────────────────────────┐
        │  FIREBASE REALTIME SDK  │               │   CLIENTS & LEADS DATA  │
        │ (Chat, Presence, FCM)   │               │(B2B Profiles, Contracts)│
        └─────────────────────────┘               └─────────────────────────┘
```

---

## 2. Tech Stack & Arsitektur Sistem

### 2.1 Ringkasan Teknologi

| Layer | Teknologi | Versi | Peran & Justifikasi |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | **Laravel** | 11.x (PHP 8.3+) | REST API Core, Business Logic, Webhooks Dispatcher, Queues (Redis), Auth (Sanctum/JWT) |
| **Frontend Framework** | **React** + **Vite** | React 19 / 18 | SPA dinamis modern, state management terpusat, modularitas tinggi, fast build time |
| **Styling & UI** | **Tailwind CSS** + **Shadcn/Radix UI** | Tailwind v3.4+ | Monochromatic dark theme tokens (`#030303`, `#0D0D11`), glassmorphism, konsistensi token dengan Corporate Web |
| **Database** | **MySQL** | 8.0+ | Relational data integrity, ACID transactions untuk billing & kontrak, JSON fields untuk konfigurasi dinamis |
| **Realtime Engine** | **Firebase SDK** | 10.x+ (Client & Admin) | Realtime chat channels, Firestore/Realtime DB sync, Firebase Cloud Messaging (FCM) push notifications |
| **Queue & Cache** | **Redis** | 7.x | Asynchronous webhook processing (Instagram & Web), rate limiting, fast caching |
| **Icons & Animasi** | **Lucide React** + **Framer Motion** | — | Visual interface interaktif dan konsisten |

### 2.2 Struktur Arsitektur Monorepo / Decoupled
*(Sesuai dengan dokumen `docs/architecture.md`)*

```
SuperAppIntelecta/
├── backend/                  # Laravel 11 API Backend (PHP 8.3+)
│   ├── app/
│   │   ├── Http/Controllers/API/V1/ (REST API Controllers: Auth, Clients, Projects, Leads, etc.)
│   │   ├── Models/           (Eloquent Models: User, Client, Project, Lead, Invoice, Ticket, TeamProfile)
│   │   ├── Services/         (InstagramService, FirebaseService, WebhookService)
│   │   ├── Jobs/             (Background Queues / ProcessInstagramWebhook, SendFCMNotification)
│   │   └── Events/           (Domain Events / LeadReceivedEvent, ProjectUpdatedEvent)
│   ├── routes/api.php        (Protected & Webhook Endpoints)
│   └── config/services.php   (Meta, Firebase, Corporate Web Config)
│
├── frontend/                 # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/       (Layout, Chat, Clients, Projects, Leads, UI Bento Cards)
│   │   ├── hooks/            (Firebase Auth, Realtime Listeners, FCM)
│   │   ├── contexts/         (Global Auth, Notifications, Theme)
│   │   ├── services/         (Axios API Client, Firebase SDK)
│   │   └── pages/            (Dashboard, Omnichannel, Clients, Projects, Financial, Team, Settings)
│   └── tailwind.config.js    (Dark Obsidian Tokens)
│
└── docs/                     # Dokumentasi API, Database Schema, & Arsitektur
    ├── README.md
    ├── architecture.md
    ├── database-schema.md
    └── api-endpoints.md
```

---

## 3. Model Pengguna & Manajemen Klien

### 3.1 Konsep Akses (Internal Client Management Hub — No User Roles)
Intelecta SuperApp dibangun khusus sebagai **alat operasional internal untuk mengelola klien (*Client Management Tool*)**. Dalam sistem ini **tidak terdapat tingkatan role-role user (*No User Roles / No RBAC*)**:
1. **Akses Internal Terpadu**: Seluruh anggota tim Intelecta yang login memiliki akses setara ke seluruh fungsi SuperApp (melihat dan mengelola klien, proyek, leads, invoice, dan tiket).
2. **Klien Sebagai Data Kelolaan**: Klien korporat tidak memiliki akun login/portal ke dalam aplikasi; seluruh data profil perusahaan klien, nama PIC, email, nomor telepon, dan histori proyek dicatat dalam tabel `clients` sebagai data yang dikelola oleh tim Intelecta.
3. **Autentikasi Aman**:
   - Backend menggunakan **Laravel Sanctum Token** untuk otentikasi REST API.
   - Frontend dihubungkan ke Firestore menggunakan **Firebase Custom Token** yang digenerate oleh Laravel saat login.

---

## 4. Skema Basis Data (MySQL & Firestore NoSQL)
*(Sesuai dengan dokumen `docs/database-schema.md`)*

### 4.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ TEAM_PROFILES : has
    USERS ||--o{ AUDIT_LOGS : triggers
    USERS ||--o{ LEADS : assigned_to
    USERS ||--o{ PROJECT_MEMBERS : member_of
    USERS ||--o{ TICKETS : assigned_to

    CLIENTS ||--o{ PROJECTS : commissions
    CLIENTS ||--o{ INVOICES : billed_to
    CLIENTS ||--o{ TICKETS : pertains_to

    PROJECTS ||--o{ PROJECT_MEMBERS : assigns
    PROJECTS ||--o{ SPRINTS : contains
    PROJECTS ||--o{ MILESTONES : tracks
    PROJECTS ||--o{ INVOICES : generates

    SPRINTS ||--o{ TASKS : divides_into
    TASKS ||--o{ TASK_ATTACHMENTS : includes

    LEADS ||--o{ LEAD_ACTIVITIES : logs
    LEADS ||--o{ PROJECTS : converts_to

    TICKETS ||--o{ TICKET_REPLIES : receives

    INTEGRATION_SETTINGS ||--o{ WEBHOOK_LOGS : registers
```

### 4.2 Spesifikasi Entitas Relasional MySQL

#### 1. Tabel `users` (Internal Staff & Operators)
```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `avatar_url` VARCHAR(500) NULL,
  `status` ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
  `firebase_uid` VARCHAR(128) NULL UNIQUE,
  `fcm_token` TEXT NULL,
  `last_active_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 2. Tabel `team_profiles` (Talent Showcase & `/tim` Sync)
```sql
CREATE TABLE `team_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,          -- sync ke /tim/[slug]
  `job_title` VARCHAR(255) NOT NULL,            -- e.g. "Senior Fullstack & WebApp Engineer"
  `tagline` VARCHAR(255) NULL,
  `bio_id` TEXT NULL,                           -- Bio Bahasa Indonesia
  `skills_json` JSON NOT NULL,                  -- ["React", "Laravel", "Next.js", "Flutter", "Tailwind CSS", "MySQL"]
  `certifications_json` JSON NULL,              -- [{"name": "Meta Certified Developer", "badge_url": "..."}]
  `social_links_json` JSON NULL,                -- {"linkedin": "...", "github": "..."}
  `is_public_showcase` BOOLEAN DEFAULT TRUE,    -- Tampil di Corporate Web atau tidak
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 3. Tabel `clients` (Direktori Klien B2B)
```sql
CREATE TABLE `clients` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `pic_name` VARCHAR(255) NOT NULL,            -- Kontak PIC Klien
  `pic_email` VARCHAR(255) NOT NULL,           -- Email PIC
  `pic_phone` VARCHAR(30) NULL,                -- Telepon/WhatsApp PIC
  `pic_position` VARCHAR(100) NULL,            -- Jabatan PIC (CTO, Direktur, dsb)
  `industry` VARCHAR(100) NULL,
  `address` TEXT NULL,
  `website` VARCHAR(255) NULL,
  `tax_id` VARCHAR(100) NULL,                  -- NPWP / Tax Reg
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 4. Tabel `projects` (Portofolio Proyek Digital)
```sql
CREATE TABLE `projects` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `client_id` BIGINT UNSIGNED NOT NULL,
  `project_code` VARCHAR(50) NOT NULL UNIQUE,   -- e.g. "INTL-2026-008"
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('web_development', 'mobile_app_development', 'webapp_development') NOT NULL,
  `status` ENUM('scoping', 'active_sprint', 'uat', 'maintenance', 'completed') DEFAULT 'scoping',
  `contract_value` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `start_date` DATE NULL,
  `target_completion_date` DATE NULL,
  `git_repository_url` VARCHAR(500) NULL,
  `staging_url` VARCHAR(500) NULL,
  `production_url` VARCHAR(500) NULL,
  `is_featured_case_study` BOOLEAN DEFAULT FALSE,
  `case_study_metrics_json` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 5. Tabel `leads` (Omnichannel Inquiries)
```sql
CREATE TABLE `leads` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `source` ENUM('instagram_dm', 'instagram_comment', 'web_contact_form', 'web_terminal_cli', 'whatsapp', 'manual') NOT NULL,
  `external_sender_id` VARCHAR(255) NULL,       -- IG Scoped ID / Web Session UUID
  `sender_name` VARCHAR(255) NOT NULL,
  `sender_contact` VARCHAR(255) NULL,           -- Email / Phone / IG Handle
  `company_name` VARCHAR(255) NULL,
  `subject_or_intent` VARCHAR(255) NULL,
  `initial_message` TEXT NOT NULL,
  `status` ENUM('new', 'qualified', 'pitching', 'converted_to_project', 'dropped') DEFAULT 'new',
  `assigned_to_user_id` BIGINT UNSIGNED NULL,
  `ai_sentiment_score` DECIMAL(3,2) NULL,
  `ai_suggested_reply` TEXT NULL,
  `metadata_json` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 6. Tabel `invoices` & `tickets`
```sql
CREATE TABLE `invoices` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE, -- e.g. "INV/2026/08/0012"
  `client_id` BIGINT UNSIGNED NOT NULL,
  `project_id` BIGINT UNSIGNED NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `tax_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total_payable` DECIMAL(15,2) NOT NULL,
  `due_date` DATE NOT NULL,
  `payment_status` ENUM('unpaid', 'pending_gateway', 'paid', 'overdue', 'cancelled') DEFAULT 'unpaid',
  `payment_gateway_ref` VARCHAR(255) NULL,
  `paid_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_code` VARCHAR(50) NOT NULL UNIQUE,    -- e.g. "TCK-8821"
  `client_id` BIGINT UNSIGNED NOT NULL,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `priority` ENUM('low', 'medium', 'high', 'critical_sla_1hr') DEFAULT 'medium',
  `status` ENUM('open', 'investigating', 'resolved', 'closed') DEFAULT 'open',
  `assigned_engineer_id` BIGINT UNSIGNED NULL,
  `resolution_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_engineer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4.3 Struktur NoSQL Firestore (Realtime Chat)

```
firestore_root/
├── channels/                          # Collection
│   └── {channelId}/                   # Doc (e.g., "proj_INTL-2026-008" atau "lead_ig_99218")
│       ├── type: "project" | "direct" | "lead_omnichannel"
│       ├── name: "Logistics WebApp & Driver Mobile App"
│       ├── participants: ["uuid_user_1", "uuid_user_2"]
│       ├── last_message: "Build APK Android v1.2 sudah siap diuji."
│       ├── last_message_at: Timestamp
│       ├── unread_counts: { "uuid_user_1": 0, "uuid_user_2": 1 }
│       │
│       └── messages/                  # Sub-collection
│           └── {messageId}/           # Doc
│               ├── sender_id: "uuid_user_1"
│               ├── sender_name: "Rian (Lead Fullstack)"
│               ├── sender_avatar: "https://..."
│               ├── text: "Semua endpoint REST API autentikasi dan dashboard sudah siap di-review."
│               ├── attachments: [
│               │     { "type": "image", "url": "https://...", "filename": "preview.png" }
│               │   ]
│               ├── is_internal_note: false
│               └── created_at: Timestamp
│
└── presence/                          # Collection (Status Online/Typing)
    └── {userId}/                      # Doc
        ├── status: "online" | "away" | "offline"
        ├── typing_in_channel: "proj_INTL-2026-008" | null
        └── last_seen: Timestamp
```

---

## 5. Arsitektur Realtime Chat & Notifikasi (Firebase SDK)

### 5.1 Integrasi Hybrid Laravel + Firebase SDK
- **Autentikasi**: Laravel mengautentikasi pengguna via API Token (Sanctum). Saat login berhasil, backend Laravel menggunakan **Firebase Admin SDK** untuk menghasilkan *Firebase Custom Token* berbasis `uuid` user.
- **Frontend Sync**: Frontend React menginisialisasi Firebase SDK (`signInWithCustomToken()`) dan langsung terhubung dengan Firestore untuk mendengarkan perubahan stream chat secara instan (*sub-100ms latency*).

```
   [ User Login in React SPA ]
                │
                ▼
   [ POST /api/v1/auth/login ] ────────▶ [ Laravel API Controller ]
                                                 │
                                                 ▼ (Generate Custom Token)
                                          [ Firebase Admin SDK ]
                                                 │
   [ Sanctum Token + Firebase Custom Token ] ◀───┘
                │
                ▼
   [ React initializes Firebase Client SDK ]
                │
                ▼
   [ Direct Realtime Listeners to Firestore: /channels/{channelId}/messages ]
```

### 5.2 Push Notifications (Firebase Cloud Messaging / FCM)
- **Background Dispatcher**: Setiap lead baru atau perubahan status tiket dengan prioritas `critical_sla_1hr` memicu Laravel Event Listener `SendFCMNotificationJob`.
- **Target**: Browser web personil internal yang sedang aktif bertugas.
- **Audio Alert**: Sound alert modern monoline di dashboard web saat ada inquiry Instagram atau kontak baru dari Corporate Web.

---

## 6. Integrasi Ekosistem Eksternal (Instagram & Corporate Web)

### 6.1 Integrasi Instagram (Meta Graph API)

```
[ Instagram User ] ──( Kirim DM / Komentar )──▶ [ Instagram / Meta Server ]
                                                        │
                                                        ▼ (Webhook Event POST)
                                           [ Laravel: POST /api/webhooks/instagram ]
                                                        │
                                                        ├── 1. Validasi X-Hub-Signature-256
                                                        ├── 2. Simpan Lead & Pesan ke MySQL
                                                        ├── 3. Sync ke Firestore Channel
                                                        └── 4. Trigger FCM Notification ke Tim Internal
```

#### Alur Teknis:
1. **Webhook Registration**: Endpoint `https://superapp.intelecta.id/api/webhooks/instagram` diverifikasi via `hub.challenge` dan secret token.
2. **Payload Parsing**: Menangkap event `messages`, `messaging_postbacks`, dan `comments`.
3. **Conversational Sync**: Jika pengirim belum ada di tabel `leads`, buat data lead baru berkategori `instagram_dm`. Jika sudah ada, tambahkan pesan ke thread obrolan omnichannel yang sama.
4. **Balas dari SuperApp**: Tim internal dapat membalas pesan langsung dari SuperApp. Backend mengeksekusi `POST https://graph.facebook.com/v19.0/me/messages` dengan token akses resmi.

### 6.2 Integrasi Corporate Web (Next.js 15)

| Titik Integrasi | Arah Aliran | Mekanisme Teknis | Deskripsi Fungsional |
| :--- | :---: | :--- | :--- |
| **Contact Form Submissions** | Next.js ➔ SuperApp | Secure API Key + Webhook POST | Setiap visitor yang mengisi form kontak di landing page langsung masuk ke dashboard SuperApp sebagai Lead baru. |
| **Terminal CLI Interactions** | Next.js ➔ SuperApp | Lightweight Analytics Beacon | Riwayat command visitor di terminal interaktif (`services`, `contact`, `team`) di-stream untuk menangkap *user intent*. |
| **Team Profiles (`/tim`)** | SuperApp ➔ Next.js | On-Demand ISR Revalidation | Edit profil engineer (foto, bio, keahlian) di SuperApp langsung memicu *Next.js Revalidation Tag* (`revalidatePath('/tim/[slug]')`). |
| **Case Studies Showcase** | SuperApp ➔ Next.js | JSON API Feed | Proyek yang ditandai `is_featured_case_study = true` otomatis disajikan pada section Case Studies landing page. |

---

## 7. Spesifikasi Fitur & Modul Fungsional

### 7.1 Modul 1: Omnichannel Communication Command Center
- **Unified Inbox**: Tab terpadu untuk menyaring pesan masuk dari Instagram DM, Web Form, Terminal CLI, dan WhatsApp.
- **AI-Powered Quick Response**: Rekomendasi balasan cerdas otomatis (*LLM Inference*) berdasarkan portofolio layanan Intelecta.
- **Conversion Trigger**: 1-Click action untuk mengubah inquiry chat menjadi `Klien Baru` & `Proyek Resmi`.

### 7.2 Modul 2: Client Management & Project Command Center
- **Client Directory**: Manajemen direktori profil klien korporat B2B, PIC kontak, nilai kerja sama, dan riwayat proyek.
- **Milestone & Sprint Tracker**: Tampilan interaktif Gantt chart & Kanban board (Scrum/Agile style).
- **Deliverable & Asset Vault**: Penyimpanan dokumen arsitektur, NDA, OpenAPI swagger spec, dan file build yang aman.
- **Realtime Activity Log**: Jejak commit Git, deployment pipeline status, dan pengujian server live.

### 7.3 Modul 3: Financial, Retainer & Invoicing Hub
- **Automated Invoicing**: Pembuatan invoice otomatis format penomoran profesional PDF (`INV/2026/...`).
- **Payment Gateway Integration**: Tombol bayar instan (Virtual Account, QRIS, Credit Card) terintegrasi Midtrans / Xendit.
- **Revenue & Contract Run-Rate**: Grafik proyeksi cashflow dan realisasi SLA retainer bulanan.

### 7.4 Modul 4: Talent, Resource & Corporate Web Sync
- **Workload Matrix**: Dashboard kapasitas engineer (siapa yang sedang mengerjakan sprint aktif, siapa yang berstatus *idle* atau *available for consultation*).
- **Public Profile Editor**: Form WYSIWYG untuk mengatur tampilan halaman pribadi engineer di `/tim/[slug]` Corporate Web dengan preview langsung.

### 7.5 Modul 5: SLA Ticketing & Incident Management
- **Tiered SLA Alerts**: Countdown timer berbasis tingkat keparahan (P1 Critical = 60 menit respon wajib).
- **Root Cause Analysis (RCA) Logger**: Form pelaporan insiden pasca penyelesaian masalah.

---

## 8. UI/UX Design System & Tata Letak Antarmuka

### 8.1 Filosofi Visual (Monochromatic Dark Obsidian)
- **Background Utama**: Rich Pitch Black (`#030303`) dan Deep Obsidian Surface (`#0D0D11`).
- **Accent & Highlights**: Silver Glow gradient (`#FFFFFF` ➔ `#71717A`) dengan border ultra tipis `rgba(255, 255, 255, 0.08)`.
- **Typography**: `Space Grotesk` untuk judul modul dan metrik penting; `Inter` untuk tabel, form, dan teks obrolan; `JetBrains Mono` untuk kode tiket, JSON inspector, dan stack tags.

### 8.2 Layout Wireframe & Struktur Komponen

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] INTELECTA OS     [🔍 Cmd+K Search...]           [⚡ Systems: 99.99%] [🔔(3)] [👤] │
├──────────────┬─────────────────────────────────────────────────────────┬───────────────┤
│ 📁 NAVIGASI  │ 📊 AREA KONTEN UTAMA (Dynamic Workspace Tabs)           │ 💬 CHAT TRAY  │
│              │ ┌─────────────────────────────────────────────────────┐ │               │
│ • Dashboard  │ │ 🏷️ KLIEN: PT FinTech Nusantara Mandiri              │ │ # INTL-008    │
│ • Omnichannel│ ├─────────────────────────────────────────────────────┤ │               │
│   - IG Leads │ │ [Info Klien] [Proyek] [Invoices] [SLA Tickets] [Docs│ │ Rian (Lead):  │
│   - Web Form │ │                                                     │ │ Deployment    │
│ • Klien      │ │  KANBAN SPRINT TRACKER:                             │ │ sudah live di │
│ • Proyek     │ │  ┌───────────┐ ┌───────────┐ ┌───────────┐         │ │ staging! 🚀   │
│ • Finansial  │ │  │ TO DO (3) │ │IN PROGRESS│ │ DONE (14) │         │ │ 12:44 PM      │
│ • Tim (/tim) │ │  │ [Card...] │ │ [Card...] │ │ [Card...] │         │ │               │
│ • Helpdesk   │ │  └───────────┘ └───────────┘ └───────────┘         │ │ [Type msg...] │
│ • Settings   │ └─────────────────────────────────────────────────────┘ │ [📎] [Send]   │
└──────────────┴─────────────────────────────────────────────────────────┴───────────────┘
```

### 8.3 Fitur Interaktif Khusus
- **Command Palette (`Cmd + K` / `Ctrl + K`)**: Navigasi cepat tanpa mouse ke seluruh klien, proyek, tiket, atau fungsi Instagram DM.
- **Glassmorphic Quick Chat Drawer**: Tab percakapan yang dapat di-minimize ke bar bawah atau di-pin di samping layar kerja.
- **Live Status Indicator**: Pulse dot hijau realtime yang mendeteksi konektivitas WebSocket / Firebase.

---

## 9. API Contract & Webhook Specifications
*(Sesuai dengan dokumen `docs/api-endpoints.md`)*

### 9.1 REST API V1 Endpoints (Terproteksi Bearer Token)

| HTTP Method | Route | Fungsi & Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autentikasi dan penerbitan Firebase Custom Token. |
| `GET` | `/api/v1/omnichannel/leads` | Query daftar lead masuk. |
| `POST` | `/api/v1/omnichannel/instagram/reply` | Balas pesan DM Instagram melalui Meta Graph API. |
| `POST` | `/api/v1/team/sync-public-profile` | Pembaruan profil engineer + pemicu revalidasi ke Next.js `/tim/[slug]`. |
| `GET` | `/api/v1/projects/{uuid}/board` | Data hierarki Kanban sprint dan task. |
| `POST` | `/api/v1/invoices/{uuid}/generate-payment` | Gateway link generation. |
| `GET` | `/api/v1/clients` | Mengambil direktori data klien dan PIC. |
| `POST` | `/api/v1/clients` | Menambahkan data klien baru. |
| `GET` | `/api/v1/tickets` | Mengambil daftar tiket helpdesk. |

### 9.2 Webhook Ingress (Public Secured Endpoints)

| HTTP Method | Route | Fungsi & Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/webhooks/instagram` | Receiver resmi Meta Platform (challenge verification & event capture). |
| `POST` | `/api/webhooks/corporate-web` | Receiver kontak form & CLI beacon dari Next.js Corporate Web. |

---

## 10. Keamanan, Audit Log & Non-Functional Requirements

### 10.1 Protokol Keamanan & Enkripsi
1. **Webhook Signature Verification**: Setiap payload dari Meta dan Corporate Web divalidasi dengan enkripsi HMAC SHA-256 menggunakan secret key khusus.
2. **Data Encryption at Rest & in Transit**: Seluruh komunikasi wajib HTTPS/TLS 1.3. Kredensial sensitif dan token integrasi disimpan menggunakan enkripsi `AES-256-CBC` via Laravel `Crypt`.
3. **Granular Audit Logs**: Setiap aktivitas krusial (perubahan nilai invoice, akses repositori proyek, pembaruan data klien) dicatat dalam tabel `audit_logs` dengan informasi IP, Timestamp, dan State Diff.

### 10.2 Standar Kinerja & SLA Sistem
- **API Response Time**: < 150ms untuk endpoint data transaksional.
- **Chat Delivery Latency**: < 100ms via Firebase Realtime infrastructure.
- **High Availability**: Target uptime sistem 99.95% dengan backup otomatis database harian ke S3 Object Storage.

---

## 11. Roadmap Implementasi & Checklist Pengembangan

```mermaid
gantt
    title Roadmap Pengembangan SuperApp Intelecta
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Foundation
    Laravel API Setup & MySQL Migration    :done, p1_1, 2026-09-01, 7d
    Auth Sanctum & Firebase Admin SDK Token :done, p1_2, after p1_1, 5d
    React + Tailwind UI Shell & Tokens     :done, p1_3, after p1_1, 7d
    
    section Phase 2: Omnichannel & Integrasi
    Instagram Graph API Webhook & DM Sender:done, p2_1, after p1_2, 8d
    Next.js Webhook & Team Sync Connector  :done, p2_2, after p2_1, 5d
    Firebase Realtime Chat Module          :done, p2_3, after p1_3, 8d
    
    section Phase 3: Client & Project Operations
    Client Management Directory            :done, p3_1, after p2_3, 5d
    Kanban Board & Sprints Management      :done, p3_2, after p3_1, 6d
    Invoicing & Payment Gateway Midtrans   :done, p3_3, after p3_2, 5d
    SLA Helpdesk & Ticket Management       :done, p3_4, after p3_2, 5d
    
    section Phase 4: AI & Hardening
    Intelecta AI Auto-Reply & Copilot Suite:done, p4_1, after p3_4, 7d
    Security Audit, E2E Testing & UAT      :done, p4_2, after p4_1, 7d
    Production Deployment & Monitoring     :done, p4_3, after p4_2, 4d
```

### 11.1 Checklist Langkah Pengerjaan

#### Tahap 1: Setup Fondasi & Otentikasi
- [x] Inisialisasi project Laravel 11 dengan MySQL / SQLite database driver.
- [x] Buat skema migrasi basis data (`users`, `team_profiles`, `clients`, `projects`, `leads`, `invoices`, `tickets`, dll.).
- [x] Setup otentikasi internal pengguna (Laravel Sanctum Bearer Token).
- [x] Setup Firebase Service dan implementasikan Custom Token Generator.
- [x] Inisialisasi React frontend dengan Tailwind CSS dan rancang theme token Monochromatic Dark.

#### Tahap 2: Komunikasi Realtime & Integrasi Eksternal
- [x] Buat listener webhook `/api/webhooks/instagram` dan handler verifikasi token Meta.
- [x] Bangun modul pengirim DM Instagram dari backend ke Meta Graph API.
- [x] Implementasikan endpoint penerima webhook dari Next.js Corporate Web.
- [x] Bangun komponen UI chat di React terhubung ke Firebase Firestore untuk streaming pesan instan.
- [x] Pasang arsitektur notifikasi web & real-time toast drawer untuk pesan masuk dan insiden darurat.

#### Tahap 3: Modul Operasional & Manajemen Klien
- [x] Bangun modul Client Directory untuk pencatatan dan pengelolaan profil klien B2B serta PIC.
- [x] Bangun Kanban board interaktif untuk manajemen sprint proyek engineer (Web, Mobile, WebApp).
- [x] Integrasikan simulator payment gateway (Midtrans Sandbox QRIS/VA) untuk tagihan invoice digital klien.
- [x] Buat modul Talent Manager yang dapat memicu webhook revalidasi profil ke `/tim/[slug]` di Corporate Web.
- [x] Bangun sistem tiket SLA helpdesk untuk pencatatan, investigasi, dan monitoring countdown SLA 60 menit.

#### Tahap 4: Pengujian, Optimasi & Peluncuran
- [x] Pengujian performa realtime chat di bawah beban multi-channel concurrent.
- [x] Uji coba simulasi webhook Instagram DM dan form submission landing page di Settings Sandbox.
- [x] Setup service layer, queue & event logging di server untuk background tasks.
- [x] Verifikasi build produksi Vite frontend dan validasi route API backend.

---

> **Dokumen Terkait**:
> - [Arsitektur Sistem (architecture.md)](file:///c:/laragon/www/SuperAppIntelecta/docs/architecture.md)
> - [Skema Basis Data (database-schema.md)](file:///c:/laragon/www/SuperAppIntelecta/docs/database-schema.md)
> - [Spesifikasi API & Webhook (api-endpoints.md)](file:///c:/laragon/www/SuperAppIntelecta/docs/api-endpoints.md)
> - [README Dokumen (README.md)](file:///c:/laragon/www/SuperAppIntelecta/docs/README.md)
