# Panduan Deployment: Vercel & Supabase (Next.js 15)

Dokumen ini menjelaskan langkah-langkah deployment **Intelecta SuperApp** ke **Vercel** dan konfigurasi proyek di **Supabase**.

---

## 1. Setup Supabase Project

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor** pada project Anda.
3. Jalankan file migrasi skema:
   - Salin isi `supabase/migrations/20260907000001_create_superapp_schema.sql` lalu klik **Run**.
4. (Opsional) Jalankan seed data:
   - Salin isi `supabase/seed.sql` lalu klik **Run** untuk mengisi data operasional awal.
5. Dapatkan kredensial project di **Project Settings -> API**:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` -> `SUPABASE_SERVICE_ROLE_KEY` (untuk Next.js Route Handlers & Edge Functions)

---

## 2. Deploy ke Vercel

### Metode A: Via Vercel Web Dashboard (Rekomendasi)
1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Import repository GitHub: `Intelecta-id/SuperApp`.
3. Konfigurasi Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./` (atau pilih `frontend`)
   - **Build Command**: `npm --prefix frontend run build` (atau default jika root `frontend`)
4. Tambahkan **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://flpiqpmpqwteqkzqkbue.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<your-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-service-role-key>` (Opsional)
   - `CORPORATE_WEB_SECRET`: `intelecta_corp_web_secret`
5. Klik **Deploy**.

### Metode B: Via Vercel CLI
```bash
npm i -g vercel
cd SuperApp/frontend
vercel --prod
```
