# Skema Basis Data Intelecta SuperApp

## 1. Entitas Relasional MySQL
- `users`: Identitas akun dan peran (`super_admin`, `project_manager`, `engineer`, `marketing`, `finance`, `client`).
- `team_profiles`: Profil teknis talent engineer untuk kebutuhan sinkronisasi publik `/tim/[slug]`.
- `clients`: Data perusahaan klien B2B dan PIC kontak.
- `projects`: Portofolio proyek digital, timeline, value kontrak, dan status pengerjaan.
- `leads`: Menampung seluruh pesan masuk omnichannel (Instagram DM, Web Contact Form, Terminal CLI).
- `invoices`: Tagihan termin pembayaran dan integrasi payment gateway.
- `tickets`: Manajemen helpdesk dan SLA insiden kritis.

## 2. Struktur NoSQL Firestore (Realtime Chat)
- `/channels/{channelId}`: Metadata channel (tipe: `project`, `direct`, `lead_omnichannel`).
- `/channels/{channelId}/messages/{messageId}`: Pesan teks, attachment dokumen/gambar, dan penanda internal note.
- `/presence/{userId}`: Status online, away, dan typing indicator.
