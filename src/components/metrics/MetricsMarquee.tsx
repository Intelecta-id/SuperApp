"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { metricsData, clientLogos } from "@/data/metrics";

function AnimatedCounter({
  target,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (target - start) * easeProgress;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-white sm:text-5xl">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export const MetricsMarquee: React.FC = () => {
  return (
    <section id="metrik" className="relative overflow-hidden border-y border-white/8 bg-[#060608] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Tag */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            METRIK KINERJA & TINGKAT KEBERHASILAN PRODUKSI
          </span>
          <span className="font-mono text-xs text-zinc-500">Q3 2026 AUDIT VERIFIED</span>
        </div>

        {/* Tabular Architectural Metrics Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
          {metricsData.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#09090D] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] text-zinc-500">[0{idx + 1}] METRIC KPI</span>
                <div className="mt-3">
                  <AnimatedCounter
                    target={item.number}
                    decimals={item.decimals}
                    suffix={item.suffix}
                    prefix={item.prefix}
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-4">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-zinc-200">
                  {item.label}
                </span>
                <p className="mt-1 font-sans text-xs text-zinc-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee Header */}
        <div className="mt-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            DIPERCAYA OLEH PERUSAHAAN TERKEMUKA DI BERBAGAI SEKTOR STRATEGIS
          </span>
        </div>
      </div>

      {/* Infinite Horizontal Logo Marquee */}
      <div className="relative mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center gap-6 py-4">
          {[...clientLogos, ...clientLogos].map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="group flex items-center gap-3 rounded border border-white/8 bg-white/[0.02] px-6 py-3 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 group-hover:bg-white transition-colors" />
              <div>
                <p className="font-display text-xs font-bold tracking-wide text-zinc-300 group-hover:text-white transition-colors uppercase">
                  {client.name}
                </p>
                <p className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {client.sector}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
