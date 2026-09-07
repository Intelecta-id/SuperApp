# Skema Basis Data Intelecta SuperApp (Supabase PostgreSQL)

## 1. Entitas Relasional PostgreSQL

- `profiles`: Identitas akun internal & hak akses terhubung dengan `auth.users` (`super_admin`, `project_manager`, `engineer`, `marketing`, `finance`, `client`).
- `team_profiles`: Profil publik talent engineer untuk kebutuhan sinkronisasi publik `/tim/[slug]` Corporate Web.
- `clients`: Data entitas perusahaan klien B2B, status kerjasama, tier kontrak, dan nilai kontrak.
- `projects`: Portofolio proyek digital, service type (`web_dev`, `mobile_dev`, `web_app`), timeline, progress, repositori URL, dan live URL.
- `project_members`: Relasi banyak-ke-banyak antara proyek dan tim talent yang dialokasikan.
- `sprints`: Manajemen sprint siklus Scrum 2 mingguan.
- `tasks`: Backlog item dan kanban task (`backlog`, `todo`, `in_progress`, `review`, `done`), assignee, priority, dan point estimation.
- `task_attachments`: Dokumen atau aset yang diunggah ke Supabase Storage dan direferensikan ke task.
- `leads`: Menampung prospek omnichannel (Instagram DM, Form Web, Web CLI Terminal, WhatsApp).
- `lead_activities`: Riwayat tindak lanjut (panggilan, meeting, email, catatan, perubahan status).
- `invoices`: Tagihan termin pembayaran, breakdown item, dan token integrasi Midtrans.
- `tickets`: Manajemen helpdesk SLA insiden kritis, waktu tenggat, prioritas, dan status penyelesaian.
- `ticket_replies`: Utas tanggapan tiket antar tim internal dan klien.
- `chat_channels`: Kanal obrolan (`general`, `project`, `lead_omnichannel`, `incident`).
- `chat_messages`: Riwayat pesan teks dan status internal note, dipublikasikan secara sub-100ms via `supabase_realtime`.
- `audit_logs`: Pelacakan aktivitas sistem per pengguna.
- `webhook_logs`: Pencatatan log pesan masuk dari Instagram dan Corporate Web.

## 2. Row Level Security (RLS) & Realtime

- Seluruh tabel relasional dilindungi oleh RLS policy.
- Tabel `chat_messages`, `chat_channels`, `tasks`, `leads`, dan `tickets` terdaftar pada publikasi `supabase_realtime` untuk streaming event langsung ke antarmuka operator.
