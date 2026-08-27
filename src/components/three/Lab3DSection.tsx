"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Logo3DStage } from "./Logo3DStage";
import { Chess3DStage } from "./Chess3DStage";
import { Particles3DStage } from "./Particles3DStage";
import {
  GlyphLayers,
  GlyphShield,
  GlyphCpu,
  GlyphBox,
} from "@/components/ui/TechnicalGlyphs";
import { cn } from "@/lib/utils";

type LabSceneMode = "logo" | "chess" | "particles";

export const Lab3DSection: React.FC = () => {
  const [activeScene, setActiveScene] = useState<LabSceneMode>("logo");

  const sceneTabs = [
    {
      id: "logo" as LabSceneMode,
      label: "01 / Logo 3D Trio",
      subtitle: "Extruded Clearcoat Diamond",
      glyph: GlyphLayers,
      desc: "Simulasi 3D Logo Intelecta 3-spot dengan material physical clearcoat glossy dan floor shadow persis sesuai rancangan referensi.",
    },
    {
      id: "chess" as LabSceneMode,
      label: "02 / Chess Monolith",
      subtitle: "Strategic Enterprise AI",
      glyph: GlyphShield,
      desc: "Representasi 3D strategi arsitektur IT dan kecerdasan enterprise dalam balutan material obsidian chrome reflektif.",
    },
    {
      id: "particles" as LabSceneMode,
      label: "03 / Neural Galaxy",
      subtitle: "1,800 Quantum Data Nodes",
      glyph: GlyphCpu,
      desc: "Matriks data partikel kuantum yang berosilasi dan merespons gelombang kursor pengguna secara real-time.",
    },
  ];

  const currentInfo = sceneTabs.find((t) => t.id === activeScene) || sceneTabs[0];

  return (
    <div id="3d-showcase" className="relative w-full min-h-screen bg-[#000000] py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
              <span>VISUALISASI SPASIAL WEBGL & THREE.JS</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white">
              Eksplorasi Dimensi Spasial
            </h2>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-xl font-sans">
              Visualisasi real-time WebGL berkecepatan 60 FPS mengintegrasikan
              identitas logo berlapis, strategi arsitektur enterprise, dan partikel neural.
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-lg border border-white/15 bg-zinc-950/80 backdrop-blur-xl">
            {sceneTabs.map((tab) => {
              const GlyphIcon = tab.glyph;
              const isActive = activeScene === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScene(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded px-4 py-2.5 text-xs font-mono transition-all duration-200",
                    isActive
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <GlyphIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 3D Canvas Stage Container */}
        <div className="mt-8 relative rounded-xl border border-white/20 bg-black overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] h-[620px] sm:h-[680px]">
          {/* Active 3D Scene Switcher */}
          <div className="absolute inset-0 w-full h-full">
            {activeScene === "logo" && <Logo3DStage key="logo-stage" />}
            {activeScene === "chess" && <Chess3DStage key="chess-stage" />}
            {activeScene === "particles" && <Particles3DStage key="particles-stage" />}
          </div>

          {/* Bottom Left Floating Descriptive Card */}
          <motion.div
            key={currentInfo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-6 left-6 z-20 max-w-sm rounded-lg border border-white/15 bg-black/85 p-4 backdrop-blur-xl shadow-2xl hidden md:block"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                {currentInfo.subtitle}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300 font-sans">
              {currentInfo.desc}
            </p>
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2 text-[10px] font-mono text-zinc-400">
              <span>DRAG MOUSE UNTUK ROTASI 3D</span>
              <span className="text-zinc-600">·</span>
              <span>SMOOTH 60 FPS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
