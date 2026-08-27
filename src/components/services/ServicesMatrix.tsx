"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlyphCpu,
  GlyphCloud,
  GlyphShieldCheck,
  GlyphServer,
  GlyphArrowUpRight,
  GlyphLayers,
} from "@/components/ui/TechnicalGlyphs";
import { servicesData, ServiceItem } from "@/data/services";
import { cn } from "@/lib/utils";

const glyphMap: Record<string, React.FC<{ className?: string }>> = {
  Cpu: GlyphCpu,
  Cloud: GlyphCloud,
  ShieldCheck: GlyphShieldCheck,
  Layers: GlyphServer,
};

export const ServicesMatrix: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState<string>(servicesData[0].id);

  const activeService =
    servicesData.find((s) => s.id === activeServiceId) || servicesData[0];
  const ActiveGlyph = glyphMap[activeService.iconName] || GlyphServer;

  return (
    <section id="layanan" className="relative py-28 bg-[#040406] border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
              <span>MATRIKS KAPABILITAS REKAYASA TEKNOLOGI</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              Solusi Arsitektur Skala Enterprise
            </h2>
          </div>

          <p className="max-w-md font-sans text-sm leading-relaxed text-zinc-400">
            Setiap pilar rekayasa dibangun dengan standar industri global, memberikan keunggulan kompetitif, keandalan 99.99%, dan skalabilitas tanpa batas.
          </p>
        </div>

        {/* Structured Capabilities Row Selector (United Carriers Inspiration) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {servicesData.map((service, index) => {
            const isActive = service.id === activeServiceId;
            const GlyphComp = glyphMap[service.iconName] || GlyphServer;

            return (
              <button
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={cn(
                  "relative flex flex-col justify-between text-left p-5 rounded-lg border transition-all duration-200",
                  isActive
                    ? "bg-white/10 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                    : "bg-[#0A0A0E]/80 border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    [0{index + 1}]
                  </span>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded border transition-colors",
                      isActive
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/5 text-zinc-400"
                    )}
                  >
                    <GlyphComp className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    {service.category}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold leading-snug text-white">
                    {service.title}
                  </h3>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="serviceActiveLine"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-white shadow-[0_0_8px_#ffffff]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Inspection Panel of Active Service */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-xl border border-white/15 bg-gradient-to-b from-[#0E0E14] via-[#0A0A0E] to-[#040406] p-8 sm:p-12 shadow-2xl backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left Overview */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-white/5 text-white">
                      <ActiveGlyph className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                        KAPABILITAS UTAMA // {activeService.category}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 font-sans text-base leading-relaxed text-zinc-300">
                    {activeService.description}
                  </p>

                  {/* Technical Feature Points with Technical Index (No Checkmarks) */}
                  <div className="mt-8 space-y-3 border-t border-white/8 pt-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                      SPESIFIKASI OPERASIONAL PRODUKSI
                    </span>
                    {activeService.features.map((feature, idx) => (
                      <div key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                          + [0{idx + 1}]
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/8 pt-6">
                  <span className="font-mono text-xs text-zinc-500">Teknologi Terkelola:</span>
                  {activeService.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Panel: Performance SLA & Direct Initiation */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-white/10 bg-black/60 p-6 sm:p-8">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                    BENCHMARK OUTPUT
                  </span>
                  <div className="mt-4 rounded border border-emerald-500/20 bg-emerald-500/10 p-5">
                    <span className="font-mono text-xs text-emerald-400 font-semibold uppercase">
                      Target Kinerja Terverifikasi
                    </span>
                    <p className="mt-2 font-display text-2xl font-black text-white">
                      {activeService.metrics}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 font-mono text-xs text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>Standar Keandalan</span>
                      <span className="text-white">99.99% SLA Uptime</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>Protokol Keamanan</span>
                      <span className="text-white">Zero Trust / AES-256</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>Audit Kepatuhan</span>
                      <span className="text-white">ISO 27001 & UU PDP</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/8">
                  <button
                    onClick={() => {
                      const el = document.getElementById("kontak");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200"
                  >
                    <span>Inisiasi Solusi Ini</span>
                    <GlyphArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
