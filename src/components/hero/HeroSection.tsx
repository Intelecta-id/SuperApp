"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlyphArrowRight, GlyphCalendar } from "@/components/ui/TechnicalGlyphs";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LayeredHeroLogo, LayeredHeroLogoRef, LogoInteractionMode } from "./LayeredHeroLogo";
import { LogoLayerControls } from "./LogoLayerControls";

interface HeroSectionProps {
  onOpenConsultation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const logoRef = useRef<LayeredHeroLogoRef>(null);
  const [logoMode, setLogoMode] = useState<LogoInteractionMode>("float");

  const handleSelectMode = (mode: LogoInteractionMode) => {
    setLogoMode(mode);
    logoRef.current?.setMode(mode);
  };

  const handleTriggerSurge = () => {
    logoRef.current?.pulseSurge();
  };

  const handleTriggerMaterialize = () => {
    logoRef.current?.materialize();
  };

  return (
    <section
      id="beranda"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-20 grid-pattern"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Asymmetrical 2-Column Wireframe Layout */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 min-h-[75vh]">
          {/* SISI KIRI: MONUMENTAL LAYERED 3D ANIMATED LOGO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center lg:col-span-6 lg:items-center order-2 lg:order-1"
          >
            <div className="relative w-full flex flex-col items-center justify-center py-4">
              <LayeredHeroLogo
                ref={logoRef}
                initialMode={logoMode}
                onModeChange={(mode) => setLogoMode(mode)}
                className="w-full max-w-[460px] sm:max-w-[540px] lg:max-w-none"
              />
            </div>
          </motion.div>

          {/* SISI KANAN: HEADLINE, VALUE PROP, CTAS, CONTROLS */}
          <div className="text-center lg:col-span-6 lg:text-left order-1 lg:order-2 flex flex-col justify-center">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-[3.2rem] lg:leading-[1.12]"
            >
              <span className="headline-mask">
                <span className="headline-line">Membangun Solusi</span>
              </span>
              <span className="headline-mask">
                <span className="headline-line text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  Kecerdasan & Infrastruktur
                </span>
              </span>
              <span className="headline-mask">
                <span className="headline-line">Masa Depan.</span>
              </span>
            </motion.h1>

            {/* Sub-headline Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 font-sans text-base leading-relaxed text-zinc-400 sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              <strong className="text-white font-semibold">Intelecta</strong> mengakselerasi
              transformasi digital perusahaan enterprise melalui rekayasa Artificial Intelligence
              mutakhir, modernisasi Cloud berkeandalan 99.99%, dan arsitektur pertahanan
              siber Zero Trust berstandar global.
            </motion.p>

            {/* Primary & Secondary Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <MagneticButton
                variant="primary"
                onClick={() => {
                  const el = document.getElementById("layanan");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Jelajahi Kapabilitas</span>
                <GlyphArrowRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton
                variant="secondary"
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else {
                    const el = document.getElementById("kontak");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <GlyphCalendar className="h-4 w-4 text-zinc-400" />
                <span>Jadwalkan Konsultasi</span>
              </MagneticButton>
            </motion.div>

            {/* Interactive Logo Layer & 3D Explode Explorer Box */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 rounded-lg border border-white/12 bg-white/[0.03] p-4 backdrop-blur-md"
            >
              <LogoLayerControls
                currentMode={logoMode}
                onSelectMode={handleSelectMode}
                onTriggerSurge={handleTriggerSurge}
                onTriggerMaterialize={handleTriggerMaterialize}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
