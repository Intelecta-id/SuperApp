# Moodboard Animasi & Layout — Intelecta Corporate Web

> Dokumen pendamping PRD v2.0. Fokus dokumen ini **hanya** pada arah animasi & layouting, diselaraskan dengan 6 video referensi yang diberikan. Palet warna, tipografi, dan konten tetap mengikuti PRD (§1.3, §7) — tidak diubah di sini.

---

## 0. Cara Baca Dokumen Ini

Setiap section berisi:
- **Video Referensi** — video mana yang jadi acuan gerak/layout
- **Apa yang Diambil** — elemen spesifik yang direplikasi
- **Apa yang TIDAK Diambil** — elemen dari video yang sengaja diabaikan karena bentrok dengan brand Intelecta (dark monochrome, korporat, B2B)
- **Penyesuaian ke Palet Intelecta** — cara elemen itu di-reskin ke `#030303 / #0D0D11 / #FFFFFF`

Keputusan berikut sudah dikonfirmasi bersama Anda:
| Section | Keputusan |
|---|---|
| Case Studies (§5.4) | **Hybrid** — horizontal slider di desktop, stacked di mobile |
| Why Intelecta (§5.5) | **Hybrid** — 4 pilar tetap bergantian (scrollytelling pin), tapi tiap pilar menggunakan layout 3-kolom |
| Drag-to-compare (before/after) | **Dipakai**, tapi lokasi penempatan **belum ditentukan** — lihat §7 "Open Item" di bawah, mohon konfirmasi section mana |

---

## 1. Hero — 3D Diamond Monolith (§4.3, §5.1)

**Video Referensi**: Alche Studio (Video 1, frame 1–4)

**Apa yang Diambil**:
- Objek geometris bercahaya (triangle/diamond outline) diletakkan di atas *grid pattern* halus sebagai background — memberi kesan "digital canvas"
- Transisi antar-state: bentuk diamond bisa "redraw" ulang stroke-nya (mirip logo Alche yang muncul sebagai outline putih tipis lalu solid) — cocok dipakai juga untuk preloader (§2)
- Rotasi lambat + parallax ringan mengikuti mouse (tilt), bukan rotasi penuh 360° yang membosankan

**Apa yang TIDAK Diambil**:
- Warna neon ungu/pink Alche (`#7B2FF7` dsb.) — tetap pakai grayscale/white glow sesuai token `--accent-gradient`
- Tipografi tebal besar menimpa logo (gaya "ALCHE" raksasa) — Intelecta pakai headline terpisah di samping, bukan menimpa objek 3D

**Penyesuaian ke Palet Intelecta**:
- Grid background: garis `rgba(255,255,255,0.05)` di atas `#030303`
- Glow diamond: gradient putih (`--accent-gradient`) bukan ungu
- Beam cahaya vertikal tetap sesuai PRD §4.3 (light ray dari puncak diamond)

---

## 2. Preloader (§4.1)

**Video Referensi**: Alche Studio (transisi antar state), Shopify Editions (kehalusan reveal)

**Apa yang Diambil**:
- Efek "draw-in" outline sebelum objek jadi solid (dipakai untuk stroke-animation logo diamond Intelecta, sesuai PRD)
- Reveal halaman utama: bukan potong instan, tapi diamond preloader "menyusut" ke posisi hero 3D — memberi kontinuitas visual antara preloader → hero (opsional, level polish tinggi; fallback: fade-out biasa jika waktu development terbatas)

**Catatan**: Ini murni penambahan gaya transisi, tidak mengubah durasi 2–3 detik yang sudah ditentukan PRD.

---

## 3. Custom Cursor & Micro-interactions (§4.2)

**Video Referensi**: Active Theory (Video 6, frame 1 & 3)

**Apa yang Diambil**:
- Konsep *glassmorphic panel* yang bereaksi terhadap posisi cursor (bukan cuma dot+ring, tapi elemen kartu ikut sedikit distorsi/blur saat didekati cursor) — bisa diterapkan ringan di kartu Bento Services (§5.3) sebagai variasi dari "spotlight follower" yang sudah ada di PRD
- `mix-blend-mode: difference` saat hover di atas teks besar (sudah sesuai PRD §4.2, dikonfirmasi relevan dari referensi ini)

**Apa yang TIDAK Diambil**:
- Chaos WebGL penuh (particle field, distorsi ekstrem, neon warna-warni) — ini gaya *creative-lab/experimental agency*, terlalu jauh dari brand "profesional, terpercaya" milik Intelecta (PRD §1.2). Diambil **konsepnya saja** (reaktif terhadap cursor), bukan intensitasnya.

---

## 4. Company Metrics & Client Marquee (§5.2)

**Video Referensi**: Tidak ada referensi langsung yang cocok dari 6 video (semua video fokus ke hero/case-study). 

**Rekomendasi**: Tetap ikuti PRD as-is (counting animation + marquee grayscale→color on hover). Tidak ada perubahan dari referensi video.

---

## 5. Services — Interactive Bento Grid (§5.3)

**Video Referensi**: United Carriers (Video 4, frame 3)

**Apa yang Diambil**:
- Baris ikon servis dengan label singkat di bawahnya, disusun rapi dalam grid horizontal — validasi bahwa pendekatan bento PRD (icon + judul + deskripsi singkat) sudah sejalan dengan referensi kelas B2B/logistik-tech ini
- Tipografi uppercase tebal untuk judul tiap servis (opsional — bisa dipakai untuk memperkuat kesan "teknis/tegas" sesuai brand persona Intelecta)

**Apa yang TIDAK Diambil**:
- Warna latar putih/terang ala United Carriers (brand mereka terang) — Intelecta tetap dark (`--bg-surface: #0D0D11`)

---

## 6. Case Studies (§5.4) — HYBRID (sudah dikonfirmasi)

**Video Referensi**: Alche Studio (Video 1, frame 1–3)

**Desktop — Horizontal Slider**:
- Full-bleed card besar, project screenshot ditampilkan dengan sedikit **3D tilt/perspective** (bukan flat), meniru efek "layar melayang miring" di video Alche
- Saat drag/scroll horizontal, card berikutnya masuk dengan sedikit delay pada elemen teks (title muncul lebih lambat dari gambar)
- Navigasi: scroll horizontal via wheel/trackpad + swipe, bukan tombol next/prev saja

**Mobile — Stacked Deck**:
- Card dtumpuk vertikal, swipeable, tilt effect dihilangkan (sesuai prinsip graceful degradation PRD §10.2)

**Apa yang TIDAK Diambil**:
- Skema warna cerah/anime-style dari portfolio Alche (itu konten client mereka, bukan gaya UI) — hanya bentuk interaksi slider & tilt-nya yang diambil

---

## 7. Why Intelecta (§5.5) — HYBRID (sudah dikonfirmasi)

**Video Referensi**: United Carriers (Video 4, frame 4)

**Struktur per Pilar** (tetap 4 pilar bergantian via scroll-pin sesuai PRD, tapi tiap pilar pakai layout 3-kolom):

| Kolom Kiri | Kolom Tengah | Kolom Kanan |
|---|---|---|
| Judul pilar + angka pendukung (mis. "99.99%") | Visual animasi vertikal (garis bergerak / node pulsing, sesuai tipe pilar — lihat tabel PRD §5.5) | Deskripsi singkat pilar |

**Apa yang Diambil dari United Carriers**:
- Format "label kiri — visual bergerak di tengah — label kanan" yang terasa data-driven dan tidak flat
- Tipografi besar uppercase untuk judul pilar (mis. "KEANDALAN")

**Transisi antar pilar**: tetap scroll-pin sesuai PRD (pilar berganti saat scroll), bukan klik/tab manual.

**Apa yang TIDAK Diambil**: Tidak ada elemen dari United Carriers yang perlu dibuang di sini — kombinasi sudah sesuai arahan Anda.

---

## 8. Contact Section — Form + Terminal (§4.7, §5.6)

**Video Referensi**: Tidak ada video yang menampilkan terminal console secara langsung.

**Rekomendasi**: Tetap ikuti PRD as-is. Tidak ada perubahan dari referensi video.

---

## 9. Scrollytelling — Prinsip Transisi Antar Section (§4.4)

**Video Referensi**: Santoni Spirits (Video 2, frame 1, 2, 4)

**Apa yang Diambil (konsep saja)**:
- Section terasa seperti "babak" cerita — tiap section punya identitas visual yang jelas berbeda dari section sebelumnya, dengan transisi tegas (bukan sekadar fade), memberi ritme scrollytelling yang kuat

**Apa yang TIDAK Diambil (penting)**:
- Santoni Spirits mengganti **warna dasar** tiap section (putih → merah pekat → putih lagi). Ini **bertentangan** dengan PRD Intelecta yang menetapkan satu dasar warna gelap konsisten (`#030303`/`#0D0D11`) di seluruh halaman (§1.3). 
- **Penyesuaian**: "ritme babak" tetap dipertahankan, tapi diwujudkan lewat variasi *shade* gelap (`#030303` → `#0D0D11` → kembali) dan intensitas glow/grid, bukan lewat warna terang/merah.

⚠️ **Perlu konfirmasi Anda**: apakah pendekatan "variasi shade gelap per section" ini yang dimaksud, atau ada preferensi lain untuk membedakan section tanpa keluar dari dark monochrome?

---

## 10. Referensi yang Sengaja Tidak Dipakai Sama Sekali

| Video | Alasan |
|---|---|
| Shopify Editions (Video 3) | Estetika "renaissance mewah + serif elegan" tidak cocok dengan brand Intelecta yang futuristik-teknis (bukan mewah-klasik). Tidak ada elemen yang diadopsi. |
| Active Theory (chaos WebGL penuh) | Terlalu eksperimental untuk situs korporat B2B. Hanya konsep reaktif-cursor yang diambil (§3), bukan visualnya. |

---

## 11. Open Item — Perlu Keputusan Anda

**Drag-to-Compare Before/After Slider** (dari video Stonecrest, Video 5)

Anda sudah konfirmasi ingin memakainya, tapi lokasinya belum ditentukan. Beberapa opsi yang mungkin cocok secara konten (bukan kesimpulan — mohon pilih atau usulkan lokasi lain):

- **A. Di dalam Case Study card** — mis. drag untuk bandingkan "dashboard sebelum vs sesudah optimasi" pada salah satu project dummy
- **B. Section baru khusus** di antara Case Studies dan Why Intelecta — mis. "Transformasi Sebelum & Sesudah" dengan 1 contoh visual (before: sistem legacy, after: sistem ter-modernisasi)
- **C. Di halaman `/tim/[slug]`** — kurang relevan secara konten, kemungkinan besar bukan pilihan yang tepat

Mohon konfirmasi lokasi mana yang dimaksud, atau jelaskan konteks penggunaannya agar saya bisa detailkan animasi & layout-nya di section terpisah.

---

## 12. Ringkasan Prinsip Animasi (Cross-check ke PRD §4)

| Prinsip | Sumber |
|---|---|
| Semua animasi tetap dalam skema monokrom gelap — tidak ada warna terang mengambil alih background section manapun | PRD §1.3, dikonfirmasi ulang dari analisis video Santoni |
| 3D tilt/perspective dipakai secukupnya (card, hero), bukan distorsi ekstrem | PRD §4.5, disaring dari video Active Theory |
| Transisi antar section tegas secara *ritme*, tapi halus secara *warna* | Video Santoni (disesuaikan) |
| Layout data (Why Intelecta, Services) memakai pola "label–visual–label" untuk kesan teknis/presisi | Video United Carriers |
| Slider/stack case study memakai tilt 3D ringan untuk kedalaman visual | Video Alche |

---

*Dokumen ini adalah pelengkap PRD, bukan pengganti. Jika ada bagian yang perlu direvisi setelah diskusi lebih lanjut, silakan sebutkan section mana yang ingin diubah.*