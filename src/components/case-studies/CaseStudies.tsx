"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlyphBuilding,
  GlyphTrending,
  GlyphShieldCheck,
  GlyphArrowLeft,
  GlyphArrowRight,
} from "@/components/ui/TechnicalGlyphs";
import { caseStudiesData, CaseStudyItem } from "@/data/caseStudies";
import { cn } from "@/lib/utils";

export const CaseStudies: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCase = caseStudiesData[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % caseStudiesData.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + caseStudiesData.length) % caseStudiesData.length);
  };

  return (
    <section id="studi-kasus" className="relative py-28 bg-[#030305] border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
              <span>PORTOFOLIO STRATEGIS TERVERIFIKASI</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              Studi Kasus & Dampak Industri
            </h2>
          </div>

          {/* Navigation Arrows for Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Proyek sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded border border-white/15 bg-white/5 text-white transition-all hover:bg-white hover:text-black"
            >
              <GlyphArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-zinc-400">
              0{activeIdx + 1} / 0{caseStudiesData.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Proyek selanjutnya"
              className="flex h-10 w-10 items-center justify-center rounded border border-white/15 bg-white/5 text-white transition-all hover:bg-white hover:text-black"
            >
              <GlyphArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Pills for Fast Jump */}
        <div className="mt-8 flex flex-wrap gap-2">
          {caseStudiesData.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "flex items-center gap-2 rounded px-4 py-2 text-xs font-mono transition-all",
                  isActive
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "border border-white/8 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
                )}
              >
                <GlyphBuilding className="h-3 w-3" />
                <span>{item.clientIndustry}</span>
              </button>
            );
          })}
        </div>

        {/* Active Project Showcase Card with 3D Tilt & Stagger Reveal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000 mt-8"
          >
            <div className="overflow-hidden rounded-xl border border-white/15 bg-gradient-to-b from-[#0E0E14] via-[#09090D] to-[#040406] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
                {/* Left Column: Narrative & Problem/Solution */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded bg-white/10 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      TAHUN {activeCase.year}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      SEKTOR: {activeCase.clientIndustry.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold uppercase text-white sm:text-3xl">
                    {activeCase.title}
                  </h3>

                  <p className="mt-4 font-sans text-base leading-relaxed text-zinc-300">
                    {activeCase.summary}
                  </p>

                  <div className="mt-8 space-y-4 rounded-lg border border-white/8 bg-black/60 p-6">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-red-400">
                        // TANTANGAN ARSITEKTUR
                      </span>
                      <p className="mt-1 font-sans text-sm text-zinc-400 leading-relaxed">
                        {activeCase.challenge}
                      </p>
                    </div>

                    <div className="border-t border-white/8 pt-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                        // SOLUSI REKAYASA INTELECTA
                      </span>
                      <p className="mt-1 font-sans text-sm text-zinc-300 leading-relaxed">
                        {activeCase.solution}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">Stack Terkait:</span>
                    {activeCase.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Key Quantitative Metrics */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-white/10 bg-black/80 p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-2 text-white">
                      <GlyphTrending className="h-4 w-4 text-emerald-400" />
                      <h4 className="font-display text-base font-bold uppercase tracking-wider">
                        Hasil & Metrik Terukur
                      </h4>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      Diverifikasi pasca-implementasi lingkungan produksi
                    </p>

                    <div className="mt-8 space-y-5">
                      {activeCase.results.map((res, i) => (
                        <div key={res.label} className="border-b border-white/8 pb-4 last:border-0">
                          <span className="font-display text-3xl font-extrabold text-white">
                            {res.value}
                          </span>
                          <p className="mt-1 font-mono text-xs text-zinc-400">
                            + {res.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/8 pt-6">
                    <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                      <span>Status Sistem</span>
                      <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <GlyphShieldCheck className="h-3.5 w-3.5" /> PRODUKSI AKTIF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
