"use client";

import React from "react";
import { GlyphWhatsApp } from "@/components/ui/TechnicalGlyphs";

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = "6281289001926";
  const message = encodeURIComponent(
    "Halo Intelecta, saya tertarik untuk mendiskusikan kebutuhan solusi teknologi IT & AI untuk perusahaan kami."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-105 hover:bg-emerald-500"
    >
      <GlyphWhatsApp className="h-5 w-5 fill-current" />

      {/* Tooltip on Hover */}
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded border border-white/10 bg-[#09090D] px-3 py-1 font-mono text-xs text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100 sm:block">
        Chat WhatsApp Konsultan
      </span>
    </a>
  );
};
