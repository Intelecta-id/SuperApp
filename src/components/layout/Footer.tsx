"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GlyphArrowUp,
  GlyphGithub,
  GlyphLinkedin,
  GlyphTwitter,
  GlyphMail,
  GlyphShieldCheck,
} from "@/components/ui/TechnicalGlyphs";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020203] pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-7 w-7">
                <Image
                  src="/images/logo-icon.svg"
                  alt="Intelecta"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-lg font-extrabold tracking-widest text-white uppercase">
                INTELECTA
              </span>
            </Link>

            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-zinc-400">
              Mitra arsitektur teknologi terpercaya untuk solusi Artificial Intelligence,
              Modern Cloud Infrastructure, Cybersecurity Zero Trust, dan Software Enterprise mission-critical di Indonesia.
            </p>

            {/* System Status Badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>SEMUA SISTEM OPERASIONAL (UPTIME 99.99%)</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Solusi */}
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                Solusi & Layanan
              </h3>
              <ul className="mt-4 space-y-2.5 font-sans text-sm text-zinc-400">
                <li>
                  <Link href="/#layanan" className="hover:text-white transition-colors">
                    AI & Machine Learning
                  </Link>
                </li>
                <li>
                  <Link href="/#layanan" className="hover:text-white transition-colors">
                    Cloud Infrastructure
                  </Link>
                </li>
                <li>
                  <Link href="/#layanan" className="hover:text-white transition-colors">
                    Cybersecurity Zero Trust
                  </Link>
                </li>
                <li>
                  <Link href="/#layanan" className="hover:text-white transition-colors">
                    Distributed Core
                  </Link>
                </li>
              </ul>
            </div>

            {/* Perusahaan & Legal */}
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                Perusahaan & Legal
              </h3>
              <ul className="mt-4 space-y-2.5 font-sans text-sm text-zinc-400">
                <li>
                  <Link href="/tim" className="hover:text-white transition-colors">
                    Dewan Pakar
                  </Link>
                </li>
                <li>
                  <Link href="/#transformasi" className="hover:text-white transition-colors">
                    Benchmark Transformasi
                  </Link>
                </li>
                <li>
                  <Link href="/#studi-kasus" className="hover:text-white transition-colors">
                    Studi Kasus
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontak & Alamat */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                Hubungi Kami
              </h3>
              <ul className="mt-4 space-y-2.5 font-sans text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <GlyphMail className="h-4 w-4 text-zinc-500" />
                  <span className="font-mono text-xs">contact@intelecta.id</span>
                </li>
                <li className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Sudirman Central Business District (SCBD), Tower One Lt. 28, Jakarta Selatan 12190
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Large Decorative Faded Logo Backdrop */}
        <div className="relative mt-16 flex justify-center overflow-hidden py-6 opacity-10 select-none pointer-events-none">
          <span className="font-display text-[14vw] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-500 to-transparent">
            INTELECTA
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} PT Intelecta Teknologi Nusantara. Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-4">
            <Link href="https://github.com" target="_blank" aria-label="GitHub Intelecta" className="text-zinc-500 hover:text-white transition-colors">
              <GlyphGithub className="h-4 w-4" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn Intelecta" className="text-zinc-500 hover:text-white transition-colors">
              <GlyphLinkedin className="h-4 w-4" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter Intelecta" className="text-zinc-500 hover:text-white transition-colors">
              <GlyphTwitter className="h-4 w-4" />
            </Link>

            <button
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
              className="ml-4 flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <GlyphArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
