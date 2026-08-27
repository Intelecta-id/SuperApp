"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { GlyphSliders, GlyphCheck, GlyphActivity, GlyphZap, GlyphShieldCheck } from "@/components/ui/TechnicalGlyphs";

export const BeforeAfterCompare: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="transformasi" className="relative py-28 bg-[#050508] border-t border-white/8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400">
            <GlyphSliders className="h-3.5 w-3.5 text-white" />
            <span>BENCHMARK TRANSFORMASI ARSITEKTUR</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Perbandingan Kinerja Nyata: Legacy vs Intelecta
          </h2>

          <p className="mt-4 text-base text-zinc-400">
            Geser slider interaktif untuk membandingkan karakteristik beban sistem konvensional
            dengan arsitektur modern berdaya tahan tinggi yang dirancang oleh Intelecta.
          </p>
        </div>

        {/* Interactive Comparison Stage */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative mt-14 h-[560px] sm:h-[500px] w-full select-none overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl cursor-ew-resize"
        >
          {/* ================================================================= */}
          {/* LAYER KANAN (AFTER - ARSITEKTUR INTELECTA)                        */}
          {/* ================================================================= */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#09090D] via-[#0D0D14] to-[#040406] p-6 sm:p-10 flex flex-col justify-between">
            {/* Header Right */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
                  <GlyphShieldCheck className="h-3.5 w-3.5" />
                  SESUDAH: ARSITEKTUR INTELECTA
                </span>
                <p className="mt-1 font-mono text-[11px] text-zinc-400">
                  Multi-Region Active-Active · SLA 99.99%
                </p>
              </div>
            </div>

            {/* Spec Cards Right */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl ml-auto">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Latency Respon P99</span>
                <p className="font-display text-2xl font-black text-emerald-400 mt-1">&lt; 8.4 ms</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Optimasi Kernel & Edge</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Failover Otomatis</span>
                <p className="font-display text-2xl font-black text-white mt-1">&lt; 850 ms</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Zero Data Loss (RPO 0)</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Kapasitas Skala</span>
                <p className="font-display text-2xl font-black text-white mt-1">1,000+ Pods</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Autoscaling Berbasis Metrik</p>
              </div>
            </div>

            {/* Bottom Telemetry Status */}
            <div className="flex items-center justify-end gap-3 text-xs font-mono text-zinc-400 border-t border-white/8 pt-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                HEALTH: OPTIMAL
              </span>
              <span className="text-zinc-600">|</span>
              <span>THROUGHPUT: 120,000 REQ/SEC</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* LAYER KIRI (BEFORE - SISTEM LEGACY) CLIP PATH                     */}
          {/* ================================================================= */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#181111] via-[#100B0B] to-[#080505] p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            {/* Header Left */}
            <div className="flex items-start justify-start">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded">
                  <GlyphActivity className="h-3.5 w-3.5" />
                  SEBELUM: SISTEM LEGACY KONVENSIONAL
                </span>
                <p className="mt-1 font-mono text-[11px] text-zinc-400">
                  Single Point of Failure · Bottleneck Transaksi
                </p>
              </div>
            </div>

            {/* Spec Cards Left */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Latency Respon P99</span>
                <p className="font-display text-2xl font-black text-red-400 mt-1">450 - 1,200 ms</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Antrean IO & Lock DB</p>
              </div>
              <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Pemulihan Bencana</span>
                <p className="font-display text-2xl font-black text-zinc-300 mt-1">4 - 8 Jam</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Failover Manual & Downtime</p>
              </div>
              <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">Batas Beban</span>
                <p className="font-display text-2xl font-black text-zinc-300 mt-1">Statis (Monolit)</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">Rentan Crash saat Flash Sale</p>
              </div>
            </div>

            {/* Bottom Telemetry Status */}
            <div className="flex items-center justify-start gap-3 text-xs font-mono text-zinc-400 border-t border-white/8 pt-4">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                STATUS: BOTTLENECK TERDETEKSI
              </span>
              <span className="text-zinc-600">|</span>
              <span>ERROR RATE: 4.8%</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SLIDER DIVIDER LINE & DRAG HANDLE                                 */}
          {/* ================================================================= */}
          <div
            className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_15px_#ffffff]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Thumb Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black text-white shadow-[0_0_20px_rgba(255,255,255,0.6)]">
              <div className="flex items-center gap-0.5">
                <span className="block h-3 w-[1.5px] bg-white" />
                <span className="block h-3 w-[1.5px] bg-white" />
              </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white">
              GESER
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
