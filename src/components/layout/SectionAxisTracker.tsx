"use client";

import React, { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

interface SectionAxisTrackerProps {
  sections: { id: string; num: string; label: string }[];
}

export const SectionAxisTracker: React.FC<SectionAxisTrackerProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "beranda");

  useEffect(() => {
    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveSection(sec.id),
        onEnterBack: () => setActiveSection(sec.id),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [sections]);

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const currentNum = sections[activeIndex]?.num || "01";
  const currentLabel = sections[activeIndex]?.label || "Signal";

  return (
    <aside
      aria-label="Section tracking axis"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 select-none pointer-events-none"
    >
      {/* Current Active Section Badge */}
      <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/60 px-3.5 py-1.5 backdrop-blur-md font-mono text-[11px] text-zinc-300 pointer-events-auto">
        <span className="text-white font-bold">{currentNum}</span>
        <span className="text-zinc-500">/</span>
        <span className="text-zinc-400">{sections.length < 10 ? `0${sections.length}` : sections.length}</span>
        <span className="text-zinc-600">·</span>
        <span className="text-white uppercase tracking-wider">{currentLabel}</span>
      </div>

      {/* Vertical Axis Node Track */}
      <div className="relative flex flex-col items-center gap-4 py-2 pr-2">
        <div className="absolute right-[5px] top-0 bottom-0 w-[1px] bg-white/10" />

        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                const el = document.getElementById(sec.id);
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              title={`${sec.num} / ${sec.label}`}
              className="relative z-10 group flex items-center gap-2 pointer-events-auto transition-transform duration-200"
            >
              <span
                className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isActive ? "text-white opacity-100 font-bold" : "text-zinc-400"
                }`}
              >
                {sec.num}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-white border-white scale-125 shadow-[0_0_10px_#fff]"
                    : "bg-black/80 border-white/20 group-hover:border-white/60"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
