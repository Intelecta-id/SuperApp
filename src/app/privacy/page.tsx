import React from "react";
import Link from "next/link";
import { GlyphArrowLeft, GlyphShieldCheck } from "@/components/ui/TechnicalGlyphs";

export default function PrivacyPage() {
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
            <span>KEPATUHAN UU PDP & ISO 27001 // VERSI 2.4</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-5xl">
            Kebijakan Privasi & Tata Kelola Data
          </h1>
          <p className="mt-2 font-mono text-xs text-zinc-400">
            Kepatuhan penuh terhadap Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan Standar ISO/IEC 27001:2022.
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-300 font-sans">
          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              1. Prinsip Pengumpulan Data
            </h2>
            <p className="mt-3 text-zinc-400">
              Intelecta hanya mengumpulkan data teknis dan informasi kontak bisnis yang relevan untuk pelaksanaan konsultasi dan penyediaan solusi arsitektur IT. Kami tidak pernah memperjualbelikan, menyewakan, atau mendistribusikan data Klien kepada pihak ketiga untuk tujuan komersial di luar lingkup perjanjian.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              2. Kepatuhan Zero Trust & Enkripsi Data
            </h2>
            <p className="mt-3 text-zinc-400">
              Setiap transmisi data melalui platform Intelecta diamankan menggunakan protokol Mutual TLS (mTLS) dan enkripsi AES-256 pada tingkat penyimpanan (at-rest) dan transit (in-transit). Kunci enkripsi dikelola melalui Dynamic Key Vault dengan rotasi berkala otomatis.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              3. Hak Subjek Data sesuai UU PDP
            </h2>
            <p className="mt-3 text-zinc-400">
              Sesuai amanat UU PDP, Klien dan pengguna berhak untuk mengakses, memperbaiki, menghapus, atau membatasi pemrosesan data pribadi mereka yang tersimpan dalam sistem kami. Permintaan pemenuhan hak subjek data dapat diajukan melalui Data Protection Officer (DPO) kami di <span className="text-white font-mono">dpo@intelecta.id</span>.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#0D0D11]/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white">
              4. Audit Jejak & Pencatatan Log
            </h2>
            <p className="mt-3 text-zinc-400">
              Semua aktivitas akses sistem, perubahan konfigurasi, dan permintaan API dicatat dalam buku besar log terenkripsi (*Immutable Audit Trail*) untuk keperluan forensik siber dan pemenuhan audit kepatuhan regulasi tahunan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
