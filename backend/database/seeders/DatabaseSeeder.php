<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TeamProfile;
use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\Invoice;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Users & Team Profiles
        $rian = User::create([
            'uuid' => (string) Str::uuid(),
            'name' => 'Rian Pratama',
            'email' => 'rian@intelecta.id',
            'password' => Hash::make('password123'),
            'phone' => '+6281122334455',
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            'status' => 'active',
            'firebase_uid' => 'fb_uid_rian_001',
            'last_active_at' => now(),
        ]);

        TeamProfile::create([
            'user_id' => $rian->id,
            'slug' => 'rian-pratama',
            'job_title' => 'Senior Fullstack & WebApp Lead',
            'tagline' => 'Architecting resilient SaaS & high-load distributed systems.',
            'bio_id' => 'Berpengalaman lebih dari 8 tahun dalam merancang arsitektur cloud modular, REST/GraphQL API berskala tinggi dengan Laravel & Node.js, serta frontend modern React & Next.js.',
            'skills_json' => ['Laravel 11', 'React 19', 'Next.js 15', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
            'certifications_json' => [
                ['name' => 'AWS Certified Solutions Architect', 'year' => '2025'],
                ['name' => 'Meta Certified Fullstack Engineer', 'year' => '2024']
            ],
            'social_links_json' => [
                'github' => 'https://github.com/rianintelecta',
                'linkedin' => 'https://linkedin.com/in/rianpratama',
            ],
            'is_public_showcase' => true,
            'display_order' => 1,
        ]);

        $sarah = User::create([
            'uuid' => (string) Str::uuid(),
            'name' => 'Sarah Dian',
            'email' => 'sarah@intelecta.id',
            'password' => Hash::make('password123'),
            'phone' => '+6281298765432',
            'avatar_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
            'status' => 'active',
            'firebase_uid' => 'fb_uid_sarah_002',
            'last_active_at' => now()->subMinutes(12),
        ]);

        TeamProfile::create([
            'user_id' => $sarah->id,
            'slug' => 'sarah-dian',
            'job_title' => 'Lead Mobile App Engineer (iOS & Flutter)',
            'tagline' => 'Crafting buttery smooth native-feel mobile experiences.',
            'bio_id' => 'Spesialis mobile multi-platform Flutter, Kotlin, dan Swift dengan fokus pada optimasi 120Hz frame rate, offline-first sync architecture, serta integrasi hardware BLE dan payment SDK.',
            'skills_json' => ['Flutter', 'Dart', 'Swift', 'Kotlin', 'Firebase SDK', 'Fastlane', 'CI/CD Mobile'],
            'certifications_json' => [
                ['name' => 'Google Associate Android Developer', 'year' => '2024'],
            ],
            'social_links_json' => [
                'github' => 'https://github.com/sarahmobile',
                'linkedin' => 'https://linkedin.com/in/sarahdian',
            ],
            'is_public_showcase' => true,
            'display_order' => 2,
        ]);

        $dimas = User::create([
            'uuid' => (string) Str::uuid(),
            'name' => 'Dimas Arya',
            'email' => 'dimas@intelecta.id',
            'password' => Hash::make('password123'),
            'phone' => '+6281355667788',
            'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            'status' => 'active',
            'firebase_uid' => 'fb_uid_dimas_003',
            'last_active_at' => now()->subMinutes(5),
        ]);

        TeamProfile::create([
            'user_id' => $dimas->id,
            'slug' => 'dimas-arya',
            'job_title' => 'Senior Frontend & Design Engineer',
            'tagline' => 'Bridging the gap between high aesthetics and snappy web performance.',
            'bio_id' => 'Fokus pada desain sistem modern bernuansa dark aesthetic, micro-animations Framer Motion, accessibility WCAG 2.1, dan web core vitals score 99+.',
            'skills_json' => ['React 19', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Figma Tokens', 'Vite'],
            'certifications_json' => [
                ['name' => 'Interaction Design Specialist', 'year' => '2025'],
            ],
            'social_links_json' => [
                'github' => 'https://github.com/dimasui',
                'linkedin' => 'https://linkedin.com/in/dimasarya',
            ],
            'is_public_showcase' => true,
            'display_order' => 3,
        ]);

        // Default Admin Operator
        $admin = User::create([
            'uuid' => (string) Str::uuid(),
            'name' => 'Operator Intelecta',
            'email' => 'admin@intelecta.id',
            'password' => Hash::make('password123'),
            'phone' => '+6281100000000',
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            'status' => 'active',
            'firebase_uid' => 'fb_uid_admin_000',
            'last_active_at' => now(),
        ]);

        // 2. Clients (B2B Accounts)
        $client1 = Client::create([
            'uuid' => (string) Str::uuid(),
            'company_name' => 'PT FinTech Nusantara Mandiri',
            'pic_name' => 'Hendrawan Kusuma',
            'pic_email' => 'hendrawan@fintechnusantara.co.id',
            'pic_phone' => '+628119008877',
            'pic_position' => 'Chief Technology Officer (CTO)',
            'industry' => 'Financial Technology & Banking',
            'website' => 'https://fintechnusantara.co.id',
            'tax_id' => '01.234.567.8-012.000',
            'address' => 'Menara Mandiri Lt. 24, Jl. Jend. Sudirman Kav. 54-55, Jakarta Selatan',
            'notes' => 'Klien enterprise tier-1 dengan SLA 99.99% dan audit keamanan reguler.',
        ]);

        $client2 = Client::create([
            'uuid' => (string) Str::uuid(),
            'company_name' => 'PT Logistik Global Express',
            'pic_name' => 'Budi Santoso',
            'pic_email' => 'budi.s@globalexpress.id',
            'pic_phone' => '+6281233445566',
            'pic_position' => 'Head of Digital Innovation',
            'industry' => 'Supply Chain & Logistics',
            'website' => 'https://globalexpress.id',
            'tax_id' => '02.987.654.3-034.000',
            'address' => 'Kawasan Pergudangan Soewarna Blok D, Bandara Soekarno Hatta, Tangerang',
            'notes' => 'Proyek tracking kurir armada realtime GPS BLE.',
        ]);

        $client3 = Client::create([
            'uuid' => (string) Str::uuid(),
            'company_name' => 'PT Medika Sehat Digital',
            'pic_name' => 'dr. Anita Wijaya, Sp.A',
            'pic_email' => 'anita.wijaya@medikasehat.co.id',
            'pic_phone' => '+6281577889900',
            'pic_position' => 'Managing Director',
            'industry' => 'Healthcare & Telemedicine',
            'website' => 'https://medikasehat.co.id',
            'tax_id' => '03.456.789.1-056.000',
            'address' => 'Kuningan Cyber Building Lt. 10, Jl. HR Rasuna Said, Jakarta Selatan',
            'notes' => 'Platform konsultasi dokter video call WebRTC terenkripsi HIPAA compliant.',
        ]);

        // 3. Projects (Covering 3 Core Services)
        $project1 = Project::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client1->id,
            'project_code' => 'INTL-2026-001',
            'title' => 'Core Banking API & SaaS Partner Portal',
            'description' => 'Pengembangan portal multi-tenant B2B untuk integrasi open banking API, disbursement otomatis, dan rekonsiliasi mutasi bank.',
            'category' => 'webapp_development',
            'status' => 'active_sprint',
            'contract_value' => 350000000,
            'start_date' => '2026-08-01',
            'target_completion_date' => '2026-11-30',
            'git_repository_url' => 'https://github.com/intelecta-org/fintech-core-portal',
            'staging_url' => 'https://staging-portal.fintechnusantara.intelecta.dev',
            'production_url' => 'https://portal.fintechnusantara.co.id',
        ]);

        $project2 = Project::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client2->id,
            'project_code' => 'INTL-2026-002',
            'title' => 'Global Express Driver & Fleet App',
            'description' => 'Aplikasi seluler Flutter untuk 1.500+ kurir lapangan dengan routing navigasi offline, barcode scan camera OCR, dan e-signature bukti kirim.',
            'category' => 'mobile_app_development',
            'status' => 'active_sprint',
            'contract_value' => 185000000,
            'start_date' => '2026-08-10',
            'target_completion_date' => '2026-10-25',
            'git_repository_url' => 'https://github.com/intelecta-org/globalexpress-mobile',
            'staging_url' => 'https://app-dist.intelecta.dev/globalexpress-beta',
        ]);

        $project3 = Project::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client3->id,
            'project_code' => 'INTL-2026-003',
            'title' => 'Medika Sehat Telehealth Platform',
            'description' => 'Web portal modern Next.js 15 dengan integrasi antrean dokter real-time Firestore dan pembayaran otomatis Snap Midtrans.',
            'category' => 'web_development',
            'status' => 'uat',
            'contract_value' => 120000000,
            'start_date' => '2026-07-25',
            'target_completion_date' => '2026-09-15',
            'git_repository_url' => 'https://github.com/intelecta-org/medika-telehealth-web',
            'staging_url' => 'https://staging.medikasehat.intelecta.dev',
        ]);

        // 4. Sprints & Tasks
        $sprint1 = Sprint::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $project1->id,
            'name' => 'Sprint 2: Integrasi HMAC Webhook & High-Load Redis',
            'goal' => 'Integrasi HMAC Webhook & High-Load Redis Transaction Idempotency',
            'status' => 'active',
            'start_date' => '2026-08-25',
            'end_date' => '2026-09-08',
            'order' => 2,
        ]);

        Task::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $project1->id,
            'sprint_id' => $sprint1->id,
            'title' => 'Setup HMAC SHA-256 Webhook Ingestion Validator',
            'description' => 'Implementasi middleware validasi signature request webhook dari bank partner dengan timing attack resistant string comparison.',
            'status' => 'done',
            'priority' => 'high',
            'story_points' => 5,
            'assigned_to_user_id' => $rian->id,
            'due_date' => '2026-08-28',
        ]);

        Task::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $project1->id,
            'sprint_id' => $sprint1->id,
            'title' => 'Idempotency Key Cache Handler di Redis Cluster',
            'description' => 'Memastikan request transfer dana duplikat dicegah secara otomatis menggunakan atomic lock Redis 60 detik.',
            'status' => 'in_progress',
            'priority' => 'urgent',
            'story_points' => 8,
            'assigned_to_user_id' => $rian->id,
            'due_date' => '2026-09-02',
        ]);

        Task::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $project2->id,
            'title' => 'Optimasi Battery-Drain Background GPS Tracking di Flutter',
            'description' => 'Konfigurasi geofencing dan fused location provider agar konsumsi baterai kurir tetap di bawah 4% per jam saat tracking aktif.',
            'status' => 'in_progress',
            'priority' => 'high',
            'story_points' => 8,
            'assigned_to_user_id' => $sarah->id,
            'due_date' => '2026-09-05',
        ]);

        Task::create([
            'uuid' => (string) Str::uuid(),
            'project_id' => $project3->id,
            'title' => 'Pemeriksaan UAT Video Call WebRTC di Browser Safari iOS',
            'description' => 'Verifikasi audio echo cancellation dan fallback ICE server TURN relay untuk koneksi jaringan telco 4G.',
            'status' => 'review_uat',
            'priority' => 'medium',
            'story_points' => 3,
            'assigned_to_user_id' => $dimas->id,
            'due_date' => '2026-09-01',
        ]);

        // 5. Invoices
        Invoice::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client1->id,
            'project_id' => $project1->id,
            'invoice_number' => 'INV/2026/08/001',
            'title' => 'Termin 1 (DP 40%): Architecture Setup & Sprint 1 Deliverables',
            'amount' => 140000000,
            'tax_amount' => 15400000,
            'total_payable' => 155400000,
            'payment_status' => 'paid',
            'due_date' => '2026-08-15',
            'paid_at' => '2026-08-14 11:30:00',
            'payment_gateway_ref' => 'MID-TRANS-20260814-0988',
        ]);

        Invoice::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client2->id,
            'project_id' => $project2->id,
            'invoice_number' => 'INV/2026/08/002',
            'title' => 'Termin 1 (DP 50%): Mobile App UI/UX & Flutter Scaffold',
            'amount' => 92500000,
            'tax_amount' => 10175000,
            'total_payable' => 102675000,
            'payment_status' => 'paid',
            'due_date' => '2026-08-20',
            'paid_at' => '2026-08-19 15:45:00',
            'payment_gateway_ref' => 'MID-TRANS-20260819-1124',
        ]);

        Invoice::create([
            'uuid' => (string) Str::uuid(),
            'client_id' => $client3->id,
            'project_id' => $project3->id,
            'invoice_number' => 'INV/2026/08/003',
            'title' => 'Termin 2 (Pelunasan 50%): UAT Completion & Handover Medika Sehat',
            'amount' => 60000000,
            'tax_amount' => 6600000,
            'total_payable' => 66600000,
            'payment_status' => 'pending_gateway',
            'due_date' => '2026-09-05',
            'payment_gateway_ref' => 'MID-TRANS-20260831-7782',
        ]);

        // 6. Omnichannel Leads
        Lead::create([
            'uuid' => (string) Str::uuid(),
            'source' => 'instagram_dm',
            'sender_name' => 'Bintang Radiance (@bintang_tech)',
            'sender_contact' => '@bintang_tech (IG Direct)',
            'company_name' => 'Radiance Digital Media',
            'subject_or_intent' => 'Tanya Paket WebApp SaaS & Mobile App MVP',
            'initial_message' => 'Halo tim Intelecta! Kami tertarik untuk buat platform marketplace custom untuk kreator konten di Indonesia. Butuh web portal admin dan aplikasi mobile iOS/Android. Apakah bisa konsultasi sprint dan perkiraan estimasi biayanya?',
            'ai_sentiment_score' => 0.94,
            'ai_suggested_reply' => 'Halo Kak Bintang! Terima kasih atas ketertarikan Anda pada Intelecta. Kami siap membantu mewujudkan marketplace kreator Anda dengan solusi WebApp modern dan Mobile App Flutter berkinerja tinggi. Bisakah kami menjadwalkan sesi discovery call singkat selama 20 menit besok pukul 14.00 WIB untuk membahas spesifikasi teknis dan estimasi sprint MVP Anda?',
            'status' => 'new',
        ]);

        Lead::create([
            'uuid' => (string) Str::uuid(),
            'source' => 'web_terminal_cli',
            'sender_name' => 'Arif Wibowo (CTO Startup)',
            'sender_contact' => 'arif.w@aerologix.id',
            'company_name' => 'AeroLogix Indonesia',
            'subject_or_intent' => 'Terminal Ingestion: command `services --mobile --quote`',
            'initial_message' => 'Pengunjung mengeksekusi terminal CLI interaktif pada landing page Intelecta: `services --mobile-app --scale --quote`. Kebutuhan: Telemetri IoT & Dashboard Mobile armada drone.',
            'ai_sentiment_score' => 0.88,
            'ai_suggested_reply' => 'Halo Pak Arif, kami mendeteksi interaksi Anda melalui terminal CLI Intelecta mengenai solusi Mobile App IoT Telemetri. Tim engineering mobile kami memiliki rekam jejak kuat dalam arsitektur real-time telemetri. Kami dapat mengirimkan executive whitepaper dan proposal teknis arsitektur hari ini.',
            'status' => 'qualified',
        ]);

        // 7. SLA Tickets
        $ticket1 = Ticket::create([
            'uuid' => (string) Str::uuid(),
            'ticket_code' => 'TCK-2026-089',
            'client_id' => $client1->id,
            'project_id' => $project1->id,
            'title' => 'High Latency pada Endpoint /api/v1/disbursement/bulk',
            'description' => 'Pihak treasury klien melaporkan waktu respons transaksi batch di atas 4.5 detik saat memproses 500 records secara bersamaan.',
            'priority' => 'critical_sla_1hr',
            'status' => 'investigating',
            'sla_due_at' => now()->addMinutes(45),
            'assigned_engineer_id' => $rian->id,
        ]);

        TicketReply::create([
            'ticket_id' => $ticket1->id,
            'user_id' => $rian->id,
            'message' => 'Sedang memeriksa query database N+1 pada relasi akun rekening bank penerima dan menambahkan batch insert chunk size 100.',
            'is_internal_note' => true,
        ]);
    }
}
