# Product Requirement Document (PRD) — Intelecta Corporate Web

> **Versi**: 2.0  
> **Terakhir Diperbarui**: 17 Agustus 2026  
> **Status**: Draft — Menunggu Approval

---

## Daftar Isi

1. [Project Overview & Brand Identity](#1-project-overview--brand-identity)
2. [Tech Stack & Library Specifications](#2-tech-stack--library-specifications)
3. [Arsitektur Halaman & Routing](#3-arsitektur-halaman--routing)
4. [Desain & Fitur Interaktif](#4-desain--fitur-interaktif)
5. [Section Breakdown — Landing Page (Home)](#5-section-breakdown--landing-page-home)
6. [Section Breakdown — Halaman Detail](#6-section-breakdown--halaman-detail)
7. [Konten & Copywriting](#7-konten--copywriting)
8. [Integrasi & Fitur Komunikasi](#8-integrasi--fitur-komunikasi)
9. [Aset Visual & Logo](#9-aset-visual--logo)
10. [Non-Functional & Performance Requirements](#10-non-functional--performance-requirements)
11. [Referensi Visual & Benchmark](#11-referensi-visual--benchmark)
12. [Deployment & Infrastruktur](#12-deployment--infrastruktur)
13. [Implementation Checklist](#13-implementation-checklist)

---

## 1. Project Overview & Brand Identity

### 1.1 Ringkasan Proyek

**Intelecta** adalah perusahaan konsultan dan penyedia solusi teknologi informasi (IT Solutions, Cloud Infrastructure, AI Engineering, & Cybersecurity). Website ini dirancang sebagai platform pameran (*showcase/portfolio*) korporat dengan standar visual kelas dunia (*Awwwards-level creative web*).

**Tipe Website**: **Hybrid** — Landing page utama sebagai showcase + halaman detail terpisah untuk portofolio tim/anggota.

**Bahasa Konten**: **Bahasa Indonesia** — target market lokal. Semua copywriting, label navigasi, button text, dan microcopy dalam Bahasa Indonesia.

### 1.2 Brand Persona

| Aspek | Detail |
| :--- | :--- |
| **Kepribadian Brand** | Profesional, futuristik, terpercaya, cutting-edge |
| **Tone of Voice** | Percaya diri tapi tidak arogan, teknis tapi bisa dipahami, elegan |
| **Target Audience** | Enterprise/mid-sized companies di Indonesia yang membutuhkan solusi IT end-to-end |

### 1.3 Design System

#### Color Palette (Monochromatic Dark)

| Token | Nama | Hex / Value | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | Rich Pitch Black | `#030303` / `#080808` | Background utama halaman |
| `--bg-surface` | Deep Obsidian | `#0D0D11` / `#121217` | Background kartu, modal, section alternatif |
| `--border-subtle` | Ghost Border | `rgba(255, 255, 255, 0.08)` | Border kartu, divider halus |
| `--border-hover` | Glow Border | `rgba(255, 255, 255, 0.15)` | Border saat hover |
| `--fg-primary` | Pure White | `#FFFFFF` | Heading, teks utama |
| `--fg-secondary` | Zinc Light | `#A1A1AA` | Body text, paragraf |
| `--fg-muted` | Slate Charcoal | `#52525B` | Caption, metadata, disabled text |
| `--accent-gradient` | Silver Glow | `#E4E4E7 → #71717A → transparent` | Glow effect, beam, highlight gradient |
| `--accent-glow` | Soft White Glow | `rgba(255, 255, 255, 0.05)` | Ambient glow, spotlight radial |

#### Typography

| Peran | Font Family | Fallback | Ukuran Referensi |
| :--- | :--- | :--- | :--- |
| **Heading Display** | `Space Grotesk` atau `Clash Display` | `Syne`, `system-ui` | Hero: 72–96px, H2: 48–56px, H3: 32–36px |
| **Body / UI** | `Inter` | `Geist Sans`, `system-ui` | Body: 16–18px, Small: 14px |
| **Monospace / Tags** | `JetBrains Mono` | `Geist Mono`, `monospace` | Code/tags: 13–14px |

> **Catatan Font Loading**: Semua font dimuat via `next/font/google` dengan `display: swap` dan `subset: latin`. Tidak menggunakan CDN Google Fonts langsung.

---

## 2. Tech Stack & Library Specifications

| Layer | Teknologi | Versi | Alasan Pemilihan |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js 15** (App Router) | 15.x | Hybrid rendering (SSG + SSR), routing file-based, React Server Components |
| **Bahasa** | **TypeScript** | 5.x | Type safety, DX yang lebih baik |
| **Styling** | **Tailwind CSS v3** | 3.4.x | Utility-first, stabil, dokumentasi luas |
| **CSS Tambahan** | CSS Custom Properties (variables) | — | Glow effects, grid lines, beam animations yang tidak bisa Tailwind handle |
| **Animasi** | **Framer Motion** | 11.x | Micro-interactions, layout animations, gesture |
| **Scroll Animation** | **GSAP + ScrollTrigger** | 3.12.x | Scrollytelling, section pinning, text reveal per kata |
| **Smooth Scroll** | **Lenis** | 1.x | Momentum scrolling halus |
| **3D Engine** | **Three.js + React Three Fiber (R3F)** + **@react-three/drei** | — | Hero 3D diamond monolith, refraksi cahaya, mouse-responsive tilt |
| **Icons** | **Lucide React** + Custom SVG | — | Konsisten, ringan |
| **Deployment** | Belum ditentukan (Vercel / Cloudflare Pages / Self-hosted) | — | Akan diputuskan nanti |

### 2.1 Struktur Folder Project

```
intelecta/
├── public/
│   ├── fonts/                  # Font files (jika self-hosted)
│   ├── images/                 # Gambar statis (logo, og-image, dll)
│   ├── models/                 # File 3D (.glb/.gltf) untuk hero diamond
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (font, metadata, providers)
│   │   ├── page.tsx            # Landing page (Home)
│   │   ├── loading.tsx         # Preloader animasi
│   │   ├── tim/
│   │   │   ├── page.tsx        # Halaman list semua anggota tim
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Halaman portofolio detail anggota
│   │   └── not-found.tsx       # Custom 404 page
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Preloader
│   │   ├── hero/               # Hero section + 3D diamond
│   │   ├── services/           # Bento grid services
│   │   ├── metrics/            # Counter + client marquee
│   │   ├── case-studies/       # Showcase/portfolio cards
│   │   ├── why-intelecta/      # Differentiator section
│   │   ├── contact/            # Form + Terminal interaktif
│   │   ├── team/               # Team card components
│   │   └── ui/                 # Reusable: Button, Card, Badge, Cursor, dll
│   ├── lib/                    # Utilities, constants, helpers
│   ├── hooks/                  # Custom React hooks
│   ├── data/                   # Data dummy (services, team, case studies)
│   └── styles/
│       └── globals.css         # Tailwind directives + CSS custom properties
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 3. Arsitektur Halaman & Routing

### 3.1 Sitemap

```
/                         → Landing Page (Home) — semua section utama
/tim                      → Halaman daftar anggota tim/perusahaan
/tim/[slug]               → Halaman portofolio detail per anggota
```

### 3.2 Detail Setiap Route

| Route | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `/` | **SSG (Static)** | Landing page utama dengan semua section: Hero, Metrics, Services, Case Studies, Why Intelecta, Contact, Footer |
| `/tim` | **SSG (Static)** | Grid kartu semua anggota tim dengan foto, nama, jabatan. Klik kartu → masuk ke `/tim/[slug]` |
| `/tim/[slug]` | **SSG (generateStaticParams)** | Halaman portofolio detail anggota: foto besar, bio lengkap, keahlian, pengalaman proyek, sertifikasi, sosial media |

### 3.3 Navigasi

**Navbar** (sticky floating pill, semi-transparan):
- **Logo Intelecta** (klik → scroll ke atas / kembali ke `/`)
- **Menu Links**: `Beranda` | `Layanan` | `Portofolio` | `Tim` | `Tentang`
  - `Beranda`, `Layanan`, `Portofolio`, `Tentang` → scroll ke section di landing page
  - `Tim` → navigate ke halaman `/tim`
- **CTA Button**: `Hubungi Kami` (scroll ke section kontak / buka modal)

> **Perilaku Navbar**:
> - Di halaman `/` → menu links scroll ke section yang sesuai (smooth scroll via Lenis)
> - Di halaman `/tim` atau `/tim/[slug]` → menu links navigate ke `/#section-id` (kembali ke landing + scroll ke section)
> - Navbar muncul dengan animasi slide-down saat halaman dimuat
> - Navbar auto-hide saat scroll ke bawah, muncul lagi saat scroll ke atas

---

## 4. Desain & Fitur Interaktif

### 4.1 Preloader (Loading Screen)

**Muncul saat**: Halaman pertama kali dibuka (session-based, hanya sekali per kunjungan).

**Deskripsi Animasi**:
1. Layar hitam penuh (`#030303`)
2. Logo diamond Intelecta muncul di tengah dengan animasi *draw-in* (stroke SVG path animation)
3. Teks "INTELECTA" fade-in di bawah logo
4. Progress bar minimalis di bagian bawah (garis tipis putih mengisi dari kiri ke kanan)
5. Setelah loading selesai: logo dan preloader *scale-up + fade-out*, reveal halaman utama di belakangnya

**Durasi**: 2–3 detik (minimum, meskipun konten sudah dimuat)

### 4.2 Custom Interactive Cursor

- Kursor browser default disembunyikan (`cursor: none` pada `body`)
- Diganti dengan **dua elemen kursor kustom**:
  - **Dot kecil** (4–6px): mengikuti posisi mouse secara instan
  - **Ring/Diamond outline** (30–40px): mengikuti dengan sedikit *delay/lerp* (efek trailing)
- **Saat hover elemen interaktif** (link, button, card): ring membesar + efek `mix-blend-mode: difference` (membalik warna)
- **Saat hover teks**: ring berubah menjadi garis vertikal (text cursor)
- **Pada mobile/touch device**: cursor kustom di-disable, pakai default

### 4.3 Hero — 3D Diamond Monolith

**Implementasi**: Three.js + React Three Fiber (R3F) + @react-three/drei

**Deskripsi Visual**:
- Objek **diamond/kristal geometris** berputar perlahan (sesuai bentuk logo Intelecta: dua layer diamond bertumpuk dengan inner diamond)
- Material: **glass/crystal refraction** — transparan dengan pantulan cahaya, edge glow putih
- **Light beam / volumetric ray**: Pancaran cahaya vertikal ke atas dari titik puncak diamond (seperti di logo)
- **Mouse interaction**: Diamond *tilt* mengikuti posisi mouse (rotasi 3D ringan). Cahaya juga bergeser sesuai sudut pandang

**Fallback Mobile**: Gambar statis diamond dengan CSS animation rotation sederhana atau Lottie animation

### 4.4 Scrollytelling & Section Transitions

**Engine**: GSAP + ScrollTrigger

- Setiap section memiliki *reveal animation* saat masuk viewport:
  - Heading: *fade-up + stagger per kata* (setiap kata muncul satu per satu dari bawah)
  - Paragraf: *fade-in* setelah heading selesai
  - Kartu/elemen: *stagger fade-up* dari kiri ke kanan atau bawah ke atas
- **Section pinning**: Section "Why Intelecta" di-*pin* saat scroll, konten berubah di dalamnya (4 pilar muncul bergantian)
- Transisi antar section: garis tipis horizontal atau gradient fade sebagai divider

### 4.5 Interactive Bento Grid (Services)

- Layout: **Grid asimetris** (bento-style), bukan grid biasa rata
- Setiap kartu service memiliki:
  - **Spotlight Mouse Follower**: Cahaya radial halus (`radial-gradient`) mengikuti posisi pointer *di dalam batas kartu*
  - **3D Tilt micro-movement**: Kartu sedikit *tilt* mengikuti posisi mouse (perspective transform)
  - **Border glow**: Border kartu bersinar halus saat hover
  - **Icon**: Lucide icon atau custom SVG monoline
  - **Tag**: Label tech stack dalam monospace font (`JetBrains Mono`)

### 4.6 Magnetic Buttons

- Semua tombol CTA utama memiliki efek **magnetis**:
  - Saat kursor mendekati tombol (dalam radius ~100px), tombol sedikit bergeser *ke arah* kursor
  - Saat kursor meninggalkan area, tombol kembali ke posisi asal dengan *ease-out spring*
- Implementasi: Custom hook `useMagneticEffect()` menggunakan Framer Motion

### 4.7 Interactive Terminal Console

**Lokasi**: Section Contact, di samping form kontak

**Deskripsi**:
- Tampilan visual menyerupai terminal/console (background `#0D0D11`, border radius, title bar dengan 3 dot merah-kuning-hijau)
- User bisa mengetik command, sistem merespons dengan output teks:

| Command | Output |
| :--- | :--- |
| `help` | Menampilkan daftar command yang tersedia |
| `layanan` atau `services` | Menampilkan daftar 4 layanan utama Intelecta |
| `kontak` atau `contact` | Menampilkan info kontak (email, telepon, alamat) |
| `tim` atau `team` | Menampilkan daftar anggota tim |
| `tentang` atau `about` | Menampilkan deskripsi singkat Intelecta |
| `clear` | Membersihkan layar terminal |
| Command tidak dikenal | `Command not found. Ketik 'help' untuk melihat daftar perintah.` |

- **Animasi**: Output muncul dengan efek *typewriter* (karakter demi karakter)
- **Prompt**: `visitor@intelecta:~$` (gaya Linux terminal)
- **Auto-greeting**: Saat section muncul di viewport, terminal otomatis menampilkan greeting:  
  `Selamat datang di Intelecta Terminal. Ketik 'help' untuk memulai.`

---

## 5. Section Breakdown — Landing Page (Home)

### 5.1 Hero Section

**Komponen**:

| Elemen | Detail |
| :--- | :--- |
| **Navbar** | Floating pill navigation, semi-transparan (`backdrop-blur-md`), logo Intelecta monokrom kiri, menu links tengah, CTA "Hubungi Kami" kanan (magnetic button) |
| **Headline** | Teks display besar: *"Arsitektur Kecerdasan & Infrastruktur Masa Depan"* (atau headline serupa dalam Bahasa Indonesia) |
| **Sub-headline** | 1–2 kalimat deskripsi singkat perusahaan |
| **3D Centerpiece** | Diamond monolith interaktif dengan beam cahaya (lihat 4.3) |
| **CTA Buttons** | 2 tombol magnetic: `Jelajahi Solusi` (primary, filled) dan `Jadwalkan Konsultasi` (secondary, outline) |
| **Scroll Indicator** | Animated chevron/arrow di bagian bawah hero menandakan "scroll ke bawah" |

**Layout**: Full viewport height (`100vh`). Headline di kiri/tengah, 3D diamond di kanan/tengah (tergantung layout terpilih).

### 5.2 Company Metrics & Client Marquee

**Komponen**:

| Elemen | Detail |
| :--- | :--- |
| **Metrics Counter** | 3–4 angka statistik dengan *counting animation* (angka naik dari 0 ke target saat section ter-scroll). Contoh: `99.99%` Uptime, `150+` Enterprise Deployments, `50+` Klien Aktif, `24/7` Dukungan |
| **Client Marquee** | Infinite horizontal scroll logo klien/partner dalam format *grayscale* monokrom. Logo memudar di ujung kiri dan kanan (gradient mask). Saat hover: logo berubah ke versi berwarna/terang |

**Animasi Trigger**: Counting number mulai saat section masuk viewport (Intersection Observer / ScrollTrigger).

### 5.3 Core Capabilities / Services (Interactive Bento Grid)

**4 Layanan Utama** (masing-masing satu kartu bento):

| # | Layanan | Deskripsi Singkat | Icon Ref |
| :--- | :--- | :--- | :--- |
| 1 | **AI & Machine Learning Engineering** | Solusi model AI enterprise, integrasi LLM, sistem prediktif | `Brain` / `Cpu` |
| 2 | **Cloud Infrastructure & DevOps** | Kubernetes cluster high-availability, serverless, multicloud orchestration | `Cloud` / `Server` |
| 3 | **Cybersecurity & Compliance** | Zero Trust architecture, penetration testing, deteksi ancaman otomatis | `Shield` / `Lock` |
| 4 | **Enterprise Custom Software** | Platform web & mobile terdistribusi untuk misi kritikal | `Code` / `Layers` |

**Layout**: Bento grid 2x2 atau asimetris (1 kartu besar + 3 kartu kecil). Setiap kartu memiliki spotlight effect + 3D tilt (lihat 4.5).

**Setiap Kartu Berisi**:
- Icon (Lucide atau custom SVG)
- Judul layanan
- Deskripsi 2–3 kalimat
- Tags teknologi (contoh: `Next.js`, `PyTorch`, `AWS`, `Kubernetes`)
- Hover: spotlight + tilt + border glow

### 5.4 Interactive Case Studies / Showcase

**Layout**: Horizontal scroll slider ATAU sticky deck kartu bertumpuk.

**Setiap Kartu Project**:
- Screenshot/mockup proyek (gambar dummy)
- Judul proyek
- Deskripsi singkat (1–2 kalimat)
- Stack tags (monospace, contoh: `Next.js` `PyTorch` `AWS`)
- Metrik hasil (contoh: "Performa +40%", "Downtime -99%")
- Hover: Screenshot zoom-in sedikit + overlay gradient

**Jumlah**: 4–6 case study dummy.

### 5.5 Why Intelecta (Interactive Differentiator)

**4 Pilar Intelecta**:

| # | Pilar | Deskripsi Singkat | Visual |
| :--- | :--- | :--- | :--- |
| 1 | **Keandalan** (Reliability) | Infrastruktur enterprise-grade dengan uptime 99.99% | Animasi node network yang stabil |
| 2 | **Kecepatan** (Speed) | Delivery cepat tanpa kompromi kualitas | Animasi data stream / particle flow |
| 3 | **Keamanan** (Security) | Proteksi berlapis dengan standar internasional | Animasi shield / encryption visual |
| 4 | **Skalabilitas** (Scalability) | Arsitektur yang tumbuh sesuai kebutuhan bisnis | Animasi grid/nodes yang ekspansi |

**Interaksi**: Section di-*pin* saat scroll. User scroll → pilar berganti satu per satu (scrollytelling). Setiap pilar memiliki visual animasi ringan di sisi kiri/kanan dan teks deskripsi di sisi sebaliknya.

### 5.6 Lead Generation / Contact Section

**Dua Kolom**:

| Kolom Kiri | Kolom Kanan |
| :--- | :--- |
| **Form Kontak Modern** | **Interactive Terminal Console** |
| Input: Nama, Email, Perusahaan, Pesan | Terminal CLI (lihat section 4.7) |
| Animasi: garis input bersinar putih saat fokus | — |
| Tombol submit magnetic: "Kirim Pesan" | — |

**Validasi Form**: Client-side validation dengan pesan error yang jelas di bawah setiap input.

**Aksi Submit**: Untuk saat ini, tampilkan toast/notifikasi sukses (dummy). Backend integration diputuskan nanti.

### 5.7 Footer

| Elemen | Detail |
| :--- | :--- |
| **Logo Besar** | Logo Intelecta ukuran besar dengan efek gradient fade ke bawah |
| **Navigasi Cepat** | Links: Beranda, Layanan, Portofolio, Tim, Kontak |
| **Info Kontak** | Email, telepon, alamat kantor |
| **Sosial Media** | Icons link ke sosial media (placeholder) |
| **System Status** | Badge: "Semua Sistem Operasional" dengan dot hijau berkedip |
| **Copyright** | `© 2026 Intelecta. Hak Cipta Dilindungi.` |

---

## 6. Section Breakdown — Halaman Detail

### 6.1 Halaman Tim (`/tim`)

**Layout**: Grid kartu anggota tim (3 kolom di desktop, 2 di tablet, 1 di mobile).

**Setiap Kartu Anggota**:
- Foto profil (aspect ratio 3:4 atau 1:1, efek grayscale → warna saat hover)
- Nama lengkap
- Jabatan / Role
- Hover: foto berubah warna + overlay gradient + nama/role slide-up
- Klik: navigate ke `/tim/[slug]`

**Header Halaman**: Heading "Tim Kami" + sub-heading deskripsi singkat tentang tim.

### 6.2 Halaman Portofolio Anggota (`/tim/[slug]`)

**Layout**: Full-page profile dengan scroll.

| Section | Detail |
| :--- | :--- |
| **Hero Profile** | Foto besar (setengah layar atau hero-style), nama, jabatan, tagline personal |
| **Bio** | Paragraf tentang anggota: latar belakang, passion, filosofi kerja |
| **Keahlian / Skills** | Grid tags atau progress bar visual: bahasa pemrograman, framework, tools |
| **Pengalaman Proyek** | Daftar proyek yang pernah dikerjakan (kartu mini, bisa overlap dengan case studies) |
| **Sertifikasi** | Badge/kartu sertifikasi (AWS Certified, Google Cloud, dll) |
| **Sosial Media / Links** | Icon links ke LinkedIn, GitHub, personal website, dll |
| **CTA** | Tombol "Kembali ke Tim" atau "Hubungi [Nama]" |

**Animasi**: Setiap section fade-in saat scroll. Foto profil memiliki parallax ringan.

**Data Source**: File data statis di `/src/data/team.ts` — array object berisi info setiap anggota.

---

## 7. Konten & Copywriting

### 7.1 Pendekatan Konten

- **Bahasa**: Bahasa Indonesia penuh
- **Konten**: Menggunakan **dummy realistis** — teks yang terdengar profesional dan masuk akal, bukan "Lorem ipsum"
- **Angka/Metrik**: Dummy realistis (contoh: 99.99% uptime, 150+ deployment, 50+ klien)
- **Nama Klien/Partner**: Logo placeholder grayscale generik (tidak menyebut nama perusahaan nyata)
- **Case Studies**: Project dummy dengan nama fiktif tapi deskripsi yang masuk akal
- **Tim**: Data anggota dummy (nama, foto placeholder, bio, skills)

### 7.2 Microcopy & Label

| Konteks | Bahasa Indonesia |
| :--- | :--- |
| Navbar CTA | "Hubungi Kami" |
| Hero CTA Primary | "Jelajahi Solusi" |
| Hero CTA Secondary | "Jadwalkan Konsultasi" |
| Form Submit | "Kirim Pesan" |
| Scroll Indicator | "Gulir ke bawah" (atau tanpa teks, hanya icon) |
| Footer Status | "Semua Sistem Operasional" |
| 404 Page | "Halaman Tidak Ditemukan" |
| Preloader | Tanpa teks (hanya logo + progress bar) |

---

## 8. Integrasi & Fitur Komunikasi

### 8.1 WhatsApp Floating Button

- **Posisi**: Fixed di pojok kanan bawah layar
- **Visual**: Icon WhatsApp dalam lingkaran, warna hijau WhatsApp (`#25D366`) atau monochrome sesuai tema
- **Animasi**: Subtle pulse/glow saat idle, scale-up saat hover
- **Klik**: Buka `https://wa.me/62XXXXXXXXXXX?text=Halo%20Intelecta` (nomor diisi nanti)
- **Mobile**: Tetap ada, ukuran sedikit lebih besar untuk touch target

### 8.2 Email Integration (Form Submit)

- Form kontak di section Contact mengirim data ke email
- **Implementasi awal**: Dummy (toast success), backend diputuskan nanti
- **Opsi backend nanti**: Next.js API Route + Nodemailer / Resend / EmailJS

### 8.3 Calendly Embed

- **Posisi**: Muncul saat klik CTA "Jadwalkan Konsultasi"
- **Tipe**: Modal popup berisi Calendly inline widget
- **URL Calendly**: Placeholder (diisi nanti)
- **Fallback**: Jika Calendly belum disetup, tombol mengarah ke form kontak

---

## 9. Aset Visual & Logo

### 9.1 Logo Files

| File | Status | Keterangan |
| :--- | :--- | :--- |
| `Logo/1.png` | ✅ Ada | Logo full (diamond + teks "INTELECTA") di atas background hitam |
| `Logo/2.png` | ✅ Ada | Logo icon only (diamond tanpa teks) di atas background hitam |
| `logo.svg` | ❌ Belum ada | **PERLU DIBUAT** — konversi dari PNG ke SVG untuk: navbar, preloader, favicon, footer |

### 9.2 Kebutuhan Aset yang Harus Dibuat

| Aset | Format | Keterangan |
| :--- | :--- | :--- |
| Logo SVG (full) | `.svg` | Diamond + teks, untuk navbar & footer |
| Logo SVG (icon only) | `.svg` | Diamond saja, untuk favicon & preloader |
| Favicon | `.ico` + `.png` (32x32, 192x192, 512x512) | Dari logo icon |
| OG Image | `.png` (1200x630) | Preview saat share di sosial media |
| 3D Diamond Model | `.glb` / `.gltf` | Model 3D untuk hero section (dibuat saat development) |
| Foto Tim Placeholder | `.webp` / `.jpg` | Foto dummy anggota tim |
| Screenshot Case Study | `.webp` / `.jpg` | Mockup proyek dummy |
| Client Logos Placeholder | `.svg` / `.png` | Logo generik grayscale untuk marquee |

---

## 10. Non-Functional & Performance Requirements

### 10.1 Performance

| Metrik | Target Desktop | Target Mobile |
| :--- | :--- | :--- |
| Lighthouse Performance | > 90 | > 85 |
| Lighthouse Accessibility | > 95 | > 95 |
| Lighthouse SEO | > 95 | > 95 |
| LCP (Largest Contentful Paint) | < 2.5s | < 3.0s |
| FID (First Input Delay) | < 100ms | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.1 |

**Optimasi Wajib**:
- Gambar: format WebP/AVIF, `next/image` dengan lazy loading
- 3D Model: low-poly GLB/GLTF, lazy load setelah halaman interaktif
- Font: `next/font` dengan `display: swap`, subset `latin`
- Code splitting: per-page, komponen 3D di-dynamic import
- Bundle analyzer: cek size sebelum deploy

### 10.2 Responsive Design

| Breakpoint | Lebar | Penyesuaian |
| :--- | :--- | :--- |
| **Desktop** | ≥ 1280px | Full experience: 3D, custom cursor, semua animasi |
| **Tablet** | 768px – 1279px | 3D tetap ada (simplified), cursor default, animasi dikurangi |
| **Mobile** | < 768px | **No 3D** (fallback gambar statis), cursor default, animasi minimal, bento grid menjadi stack vertikal |

**Graceful Degradation**:
- Custom cursor → disabled pada touch devices
- 3D Diamond → gambar statis + CSS rotation pada mobile
- Section pinning → scroll biasa pada mobile
- Horizontal slider → swipeable carousel pada mobile
- Spotlight mouse follower → disabled pada touch devices

### 10.3 SEO & Accessibility

- **Semantic HTML5**: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`
- **Heading hierarchy**: Satu `<h1>` per halaman, hierarki H2–H6 yang benar
- **WCAG AA compliance**: Contrast ratio teks putih/abu terhadap latar hitam ≥ 4.5:1
- **Alt text**: Semua gambar memiliki `alt` deskriptif
- **Keyboard navigation**: Semua elemen interaktif bisa diakses via Tab + Enter
- **Skip to content**: Link tersembunyi di awal halaman
- **Meta tags**: Title, description, OpenGraph, Twitter Card per halaman
- **JSON-LD**: Schema.org `Organization` + `WebSite` + `LocalBusiness` (IT Consulting)
- **Sitemap.xml**: Auto-generated
- **robots.txt**: Standard allow

---

## 11. Referensi Visual & Benchmark

Website yang menjadi **referensi desain dan interaksi** (bukan untuk ditiru identik, tapi sebagai benchmark level kualitas):

### Website IT/Tech Kelas Dunia
| Website | Aspek yang Direferensi |
| :--- | :--- |
| [Vercel.com](https://vercel.com) | Dark theme, clean typography, gradient glows, grid patterns |
| [Linear.app](https://linear.app) | Minimalist dark UI, smooth animations, beam effects |
| [Stripe.com](https://stripe.com) | Gradient mesh, polished micro-interactions, premium feel |
| [Raycast.com](https://raycast.com) | Dark monochrome, spotlight effects, keyboard-first UX |
| [Resend.com](https://resend.com) | Dark theme, terminal aesthetic, clean sections |

### Website dengan Interaksi/Animasi Kelas Dunia
| Website | Aspek yang Direferensi |
| :--- | :--- |
| [Ramotion.com](https://ramotion.com) | Creative agency showcase, scrollytelling, 3D elements |
| [Basement.studio](https://basement.studio) | Experimental 3D, dark theme, cutting-edge WebGL |
| [Lusion.co](https://lusion.co) | Immersive 3D experiences, particle effects |
| [Aristide Benoist](https://aristidebenoist.com) | Custom cursor, smooth transitions, portfolio layout |

> **Prinsip**: Ambil inspirasi dari *feel* dan *kualitas* website di atas, tapi desain tetap orisinal dan sesuai brand identity Intelecta.

---

## 12. Deployment & Infrastruktur

**Status**: Belum ditentukan. Opsi yang tersedia:

| Platform | Kelebihan | Kekurangan |
| :--- | :--- | :--- |
| **Vercel** | Optimized untuk Next.js, free tier murah hati, edge functions, analytics | Vendor lock-in, limit bandwidth di free tier |
| **Cloudflare Pages** | CDN global gratis, unlimited bandwidth, Workers | Kurang optimized untuk Next.js RSC dibanding Vercel |
| **Self-hosted (VPS/Laragon)** | Kontrol penuh, tidak ada vendor lock-in | Perlu setup sendiri, maintenance manual |

> **Keputusan**: Akan ditentukan setelah website selesai dibangun.

---

## 13. Implementation Checklist

Urutan pengerjaan yang direkomendasikan:

### Phase 1: Foundation
- [ ] Setup Next.js 15 project dengan TypeScript
- [ ] Konfigurasi Tailwind CSS v3 + CSS custom properties (design tokens)
- [ ] Setup font loading (`Space Grotesk`, `Inter`, `JetBrains Mono`)
- [ ] Buat komponen Navbar (floating pill, responsive)
- [ ] Buat komponen Footer
- [ ] Buat SVG logo dari PNG
- [ ] Setup Lenis smooth scrolling

### Phase 2: Core Sections (Landing Page)
- [ ] Preloader animasi (logo reveal + progress bar)
- [ ] Custom interactive cursor
- [ ] Hero section + headline + CTA buttons (magnetic)
- [ ] Hero 3D diamond monolith (Three.js/R3F)
- [ ] Company metrics counter + client marquee
- [ ] Services bento grid (spotlight + 3D tilt)

### Phase 3: Advanced Sections
- [ ] Case Studies slider/deck
- [ ] Why Intelecta (scrollytelling pinned section)
- [ ] Contact section: form + terminal interaktif
- [ ] WhatsApp floating button
- [ ] Calendly modal integration (placeholder)

### Phase 4: Detail Pages
- [ ] Halaman `/tim` — grid kartu anggota
- [ ] Halaman `/tim/[slug]` — portofolio detail anggota
- [ ] Data dummy tim yang realistis
- [ ] Custom 404 page

### Phase 5: Polish & Optimization
- [ ] Responsive testing semua breakpoint
- [ ] Mobile fallback untuk 3D, cursor, animations
- [ ] SEO: meta tags, JSON-LD, sitemap, robots.txt
- [ ] Accessibility audit (WCAG AA)
- [ ] Lighthouse performance optimization
- [ ] Favicon & OG image
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

> **Catatan Akhir**: PRD ini adalah dokumen hidup. Akan diperbarui sesuai kebutuhan selama proses development. Semua konten menggunakan **dummy realistis** dan akan diganti dengan konten asli oleh tim Intelecta.
