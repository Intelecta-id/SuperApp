import React from "react";
import Link from "next/link";
import { GlyphArrowLeft, GlyphShieldCheck } from "@/components/ui/TechnicalGlyphs";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-24 grid-pattern">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-zinc-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <GlyphArrowLeft className="h-3.5 w-3.5" />
          <span>KEMBALI KE BERANDA</span>
        </Link>

        {/* Header */}
        <div className="mt-8 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400 border border-white/5">
            <GlyphShieldCheck className="h-3.5 w-3.5 text-white" />
            <span>DOKUMEN LEGAL RESMI // VERSI 2.4</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-5xl">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="mt-2 font-mono text-xs text-zinc-400">
            Terakhir diperbarui: 17 Agustus 2026 · Berlaku untuk seluruh entitas PT Intelecta Teknologi Nusantara
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-300 font-sans">
          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              1. Ruang Lingkup Layanan & Perjanjian
            </h2>
            <p className="mt-3 text-zinc-400">
              Syarat dan Ketentuan ini mengatur penyediaan jasa konsultasi teknologi informasi, rekayasa kecerdasan buatan (AI Engineering), modernisasi infrastruktur cloud terdistribusi, serta audit arsitektur keamanan siber oleh PT Intelecta Teknologi Nusantara (&quot;Intelecta&quot;) kepada klien korporat (&quot;Klien&quot;).
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              2. Standar Service Level Agreement (SLA) & Keandalan
            </h2>
            <p className="mt-3 text-zinc-400">
              Intelecta berkomitmen memberikan Service Level Agreement (SLA) ketersediaan infrastruktur sebesar 99.99% untuk arsitektur cloud multi-region yang dikelola secara penuh. Parameter latensi, Disaster Recovery (RPO &lt; 1 menit, RTO &lt; 5 menit), dan jadwal pemeliharaan terencana diatur secara spesifik dalam Dokumen Perjanjian Kerja Sama (PKS) terpisah.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              3. Hak Kekayaan Intelektual (IP Rights)
            </h2>
            <p className="mt-3 text-zinc-400">
              Seluruh kode sumber khusus, arsitektur data pipeline, dan model inferensi yang dikembangkan khusus untuk Klien menjadi hak milik penuh Klien setelah penyelesaian kewajiban komersial. Kerangka kerja dasar (*proprietary framework*) dan algoritma internal Intelecta tetap menjadi hak kekayaan intelektual Intelecta dengan lisensi penggunaan abadi non-eksklusif bagi Klien.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              4. Kerahasiaan Data & Non-Disclosure (NDA)
            </h2>
            <p className="mt-3 text-zinc-400">
              Kedua belah pihak terikat pada perjanjian kerahasiaan ketat terhadap seluruh data operasional, bobot model privat, skema database, dan log audit keamanan. Intelecta menerapkan protokol enkripsi end-to-end (AES-256) serta isolasi lingkungan pengujian untuk mencegah kebocoran informasi strategis.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              5. Hukum yang Berlaku & Penyelesaian Sengketa
            </h2>
            <p className="mt-3 text-zinc-400">
              Perjanjian ini tunduk dan ditafsirkan berdasarkan hukum Negara Republik Indonesia. Segala perselisihan yang timbul akan diselesaikan terlebih dahulu melalui musyawarah mufakat, atau melalui Badan Arbitrase Nasional Indonesia (BANI) di Jakarta.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
