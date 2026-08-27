"use client";

import React from "react";
import {
  GlyphLayers,
  GlyphActivity,
  GlyphZap,
  GlyphEye,
  GlyphRotate,
} from "@/components/ui/TechnicalGlyphs";
import { LogoInteractionMode } from "./LayeredHeroLogo";

interface LogoLayerControlsProps {
  currentMode: LogoInteractionMode;
  onSelectMode: (mode: LogoInteractionMode) => void;
  onTriggerSurge: () => void;
  onTriggerMaterialize?: () => void;
  className?: string;
}

export const LogoLayerControls: React.FC<LogoLayerControlsProps> = ({
  currentMode,
  onSelectMode,
  onTriggerSurge,
  onTriggerMaterialize,
  className = "",
}) => {
  const modes: { id: LogoInteractionMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "float",
      label: "Float 2.5D",
      icon: <GlyphActivity className="h-3.5 w-3.5" />,
      desc: "Animasi organik mengambang & paralaks mouse",
    },
    {
      id: "explode",
      label: "3D Exploded",
      icon: <GlyphLayers className="h-3.5 w-3.5" />,
      desc: "Pecah layer logo di ruang 3D perspektif",
    },
    {
      id: "pulse",
      label: "Energy Pulse",
      icon: <GlyphZap className="h-3.5 w-3.5" />,
      desc: "Denyut gelombang resonansi berkas cahaya",
    },
    {
      id: "hologram",
      label: "Hologram",
      icon: <GlyphEye className="h-3.5 w-3.5" />,
      desc: "Sudut kemiringan matriks holografis",
    },
  ];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>Eksplorasi Dimensi Logo Intelecta</span>
        </div>
        <div className="flex items-center gap-2">
          {onTriggerMaterialize && (
            <button
              onClick={onTriggerMaterialize}
              title="Materialisasi Ulang Logo dari Partikel Cahaya"
              className="group flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-300 transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <GlyphRotate className="h-3 w-3 text-zinc-300 transition-transform duration-300 group-hover:rotate-180" />
              <span>Materialize</span>
            </button>
          )}
          <button
            onClick={onTriggerSurge}
            title="Kirim denyut energi resonansi ke seluruh kristal"
            className="group flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-300 transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <GlyphZap className="h-3 w-3 text-white transition-transform duration-200 group-hover:scale-125" />
            <span>Energy Surge</span>
          </button>
        </div>
      </div>

      {/* Mode Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`relative flex items-center gap-2 rounded border px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? "border-white bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                  : "border-white/8 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                  isActive ? "bg-white text-black" : "bg-white/5 text-zinc-400"
                }`}
              >
                {mode.icon}
              </div>
              <div className="min-w-0">
                <div className="font-mono text-xs font-semibold tracking-wide">
                  {mode.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
