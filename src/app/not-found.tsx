import React from "react";
import Link from "next/link";
import { GlyphArrowLeft, GlyphTerminal } from "@/components/ui/TechnicalGlyphs";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] px-4 text-center grid-pattern">
      <div className="rounded border border-white/10 bg-white/5 p-4 text-zinc-400">
        <GlyphTerminal className="h-8 w-8 text-white" />
      </div>

      <span className="mt-6 font-mono text-xs font-semibold tracking-widest text-zinc-500 uppercase">
        ERROR 404 // RESOURCE_NOT_FOUND
      </span>

      <h1 className="mt-4 font-display text-4xl font-black uppercase text-white sm:text-5xl">
        Halaman Tidak Ditemukan
      </h1>

      <p className="mt-4 max-w-md font-sans text-sm text-zinc-400">
        Topologi URL yang Anda tuju tidak terdaftar pada arsitektur sistem Intelecta atau telah dialihkan.
      </p>

      <div className="mt-8">
        <Link href="/">
          <MagneticButton variant="primary">
            <GlyphArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda Utama</span>
          </MagneticButton>
        </Link>
      </div>
    </div>
  );
}
