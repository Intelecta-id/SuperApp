"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlyphServer,
  GlyphZap,
  GlyphShieldCheck,
  GlyphMaximize,
  GlyphCode,
} from "@/components/ui/TechnicalGlyphs";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap-config";

interface PillarItem {
  id: string;
  num: string;
  title: string;
  metric: string;
  metricLabel: string;
  glyph: React.FC<{ className?: string }>;
  description: string;
  points: string[];
  visualCode: string;
}

const pillars: PillarItem[] = [
  {
    id: "keandalan",
    num: "01",
    title: "Keandalan Ekstrem",
    metric: "99.99%",
    metricLabel: "Uptime SLA Bergaransi",
    glyph: GlyphServer,
    description:
      "Arsitektur zero single-point-of-failure dengan auto-failover aktif antar zona dan region. Sistem dirancang untuk terus beroperasi tanpa henti saat lonjakan trafik atau pemadaman jaringan lokal.",
    points: [
      "Topologi Multi-Region Active-Active Quorum",
      "Automated Health Probes & Chaos Engineering",
      "Disaster Recovery RPO < 1 menit & RTO < 5 menit",
    ],
    visualCode: `// Multi-Region Failover Controller
const cluster = new DistributedCluster({
  regions: ["ap-southeast-1", "ap-southeast-3"],
  replication: "synchronous-quorum",
  failoverLatency: "< 850ms",
  healthState: "OPTIMAL_ACTIVE"
});`,
  },
  {
    id: "kecepatan",
    num: "02",
    title: "Performa Sub-Milidetik",
    metric: "< 8.4ms",
    metricLabel: "P99 Latency Response",
    glyph: GlyphZap,
    description:
      "Pengoptimalan algoritma pada tingkat kernel dan edge network. Setiap baris kode ditulis dengan efisiensi alokasi memori tinggi untuk melayani jutaan transaksi konkurensi.",
    points: [
      "Microservices Komputasi Tinggi berbasis Go & Rust",
      "Global Edge Caching & Kernel-Bypass Networking",
      "Optimasi Query & Non-Blocking Asynchronous IO",
    ],
    visualCode: `// High-Throughput Event Ingestion
func HandleEventStream(ctx context.Context, stream <-chan Event) {
  workerPool := runtime.NumCPU() * 4
  parallelDispatch(stream, workerPool, func(e Event) {
    p99Latency := recordMetric(e) // 4.2ms avg
  })
}`,
  },
  {
    id: "keamanan",
    num: "03",
    title: "Keamanan Zero Trust",
    metric: "AES-256",
    metricLabel: "Enkripsi Lapis Ganda + mTLS",
    glyph: GlyphShieldCheck,
    description:
      "Pendekatan 'Never Trust, Always Verify' di setiap titik transmisi data. Enkripsi terstandarisasi dan manajemen identitas terpusat memastikan integritas data dari ancaman siber modern.",
    points: [
      "Mutual TLS (mTLS) pada Seluruh Komunikasi Internal",
      "Identity-Aware Access Proxy & Dynamic Secrets Vault",
      "Kepatuhan Penuh Standar ISO 27001 & Regulasi UU PDP",
    ],
    visualCode: `// Zero Trust Policy Enforcement
policy := SecurityPolicy{
  mTLSRequired: true,
  cipherSuite: "TLS_AES_256_GCM_SHA384",
  accessEvaluation: ContinuousIdentityVerification,
  auditLogging: "Immutable-Signed-Ledger"
}`,
  },
  {
    id: "skalabilitas",
    num: "04",
    title: "Skalabilitas Elastis",
    metric: "1,000+",
    metricLabel: "Horizontal Autoscaling Pods",
    glyph: GlyphMaximize,
    description:
      "Infrastruktur modern yang secara otonom beradaptasi dengan fluktuasi beban pengguna. Tidak ada hambatan kapasitas ketika volume transaksi bisnis melonjak 10x hingga 100x lipat.",
    points: [
      "Horizontal Pod Autoscaling berbasis Metrik Khusus",
      "Distributed Database Partitioning & Sharding",
      "Serverless Burst Capacity & Dynamic Traffic Routing",
    ],
    visualCode: `// Elastic Auto-Scaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: intelecta-core-engine
spec:
  minReplicas: 10
  maxReplicas: 1000
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          averageUtilization: 60`,
  },
];

export const WhyIntelecta: React.FC = () => {
  const [activePillar, setActivePillar] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const outerPathRef = useRef<SVGPolygonElement>(null);
  const midPathRef = useRef<SVGPolygonElement>(null);
  const corePathRef = useRef<SVGPolygonElement>(null);

  // GSAP Materialization Animation for Monumental Right Edge Logo
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !logoSvgRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 30%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(
        outerPathRef.current,
        {
          strokeDasharray: 2000,
          strokeDashoffset: 2000,
          opacity: 0,
          scale: 0.85,
          transformOrigin: "center right",
        },
        {
          strokeDashoffset: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        }
      )
        .fromTo(
          midPathRef.current,
          {
            strokeDasharray: 1500,
            strokeDashoffset: 1500,
            opacity: 0,
            scale: 0.7,
            transformOrigin: "center right",
          },
          {
            strokeDashoffset: 0,
            opacity: 0.9,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1.0"
        )
        .fromTo(
          corePathRef.current,
          {
            scale: 0,
            opacity: 0,
            transformOrigin: "center center",
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "elastic.out(1.2, 0.4)",
          },
          "-=0.7"
        );

      // Continuous subtle breathing
      gsap.to(logoSvgRef.current, {
        y: -12,
        rotation: 1,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentPillar = pillars[activePillar];
  const PillarGlyph = currentPillar.glyph;

  return (
    <section
      ref={sectionRef}
      id="keunggulan"
      className="relative min-h-screen py-28 bg-[#030303] overflow-hidden border-t border-white/8 flex items-center"
    >
      {/* Monumental Half-Visible Logo on the Right Edge */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 sm:translate-x-1/4 lg:translate-x-1/5 w-[500px] sm:w-[700px] md:w-[850px] lg:w-[1050px] h-[700px] sm:h-[900px] lg:h-[1100px] z-0 opacity-80 select-none">
        <svg
          ref={logoSvgRef}
          viewBox="0 0 1000 1000"
          className="w-full h-full drop-shadow-glow"
          fill="none"
        >
          <defs>
            <linearGradient id="whyOuterGrad" x1="200" y1="100" x2="800" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#A1A1AA" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#27272A" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="whyMidGrad" x1="300" y1="200" x2="700" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#71717A" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="whyCoreGrad" x1="400" y1="400" x2="600" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D4D4D8" />
            </linearGradient>
          </defs>

          <polygon
            ref={outerPathRef}
            points="500,50 950,500 500,950 50,500"
            stroke="url(#whyOuterGrad)"
            strokeWidth="32"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />

          <polygon
            points="500,18 982,500 500,982 18,500"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeDasharray="16 12"
          />

          <polygon
            ref={midPathRef}
            points="500,200 800,500 500,800 200,500"
            stroke="url(#whyMidGrad)"
            strokeWidth="20"
            strokeLinejoin="miter"
            strokeMiterlimit="10"
          />

          <polygon
            ref={corePathRef}
            points="500,350 650,500 500,650 350,500"
            fill="url(#whyCoreGrad)"
            stroke="#FFFFFF"
            strokeWidth="6"
            className="drop-shadow-core"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
            <span>PONDASI ARSITEKTUR KORPORAT</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            4 Pilar Fundamental Intelecta
          </h2>
          <p className="mt-3 font-sans text-base text-zinc-400 max-w-2xl">
            Prinsip rekayasa tanpa kompromi untuk memastikan setiap sistem siap menghadapi beban jutaan transaksi dan ancaman siber tingkat tinggi.
          </p>
        </div>

        {/* Pillar Switcher Buttons */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pillars.map((pillar, idx) => {
            const isActive = activePillar === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(idx)}
                className={cn(
                  "p-4 rounded text-left border transition-all duration-200",
                  isActive
                    ? "bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-[#0A0A0E]/80 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span>[{pillar.num}]</span>
                  <span className={isActive ? "text-black" : "text-zinc-500"}>PILAR</span>
                </div>
                <p className="mt-2 font-display text-sm font-bold uppercase truncate">
                  {pillar.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* HYBRID 3-COLUMN LAYOUT (United Carriers inspiration from PRD2.MD §7)      */}
        {/* Kolom Kiri: Label & Metrik | Kolom Tengah: Visual Animasi | Kolom Kanan: Deskripsi */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* KOLOM KIRI (3 Cols): Judul Besar + Metrik KPI Data-Driven */}
            <div className="lg:col-span-4 rounded-xl border border-white/15 bg-[#09090D] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-500 uppercase">
                  PILAR REKAYASA // {currentPillar.num}
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                  {currentPillar.title}
                </h3>
              </div>

              <div className="my-8 rounded border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  METRIK UTAMA TERUKUR
                </span>
                <p className="mt-1 font-display text-4xl font-black text-white">
                  {currentPillar.metric}
                </p>
                <p className="mt-1 font-mono text-xs text-emerald-400">
                  {currentPillar.metricLabel}
                </p>
              </div>

              <div className="font-mono text-[11px] text-zinc-500">
                PRODUKSI TERVERIFIKASI // STANDAR INTELECTA
              </div>
            </div>

            {/* KOLOM TENGAH (3 Cols): Visual Animasi Vertikal / Node Pulse */}
            <div className="lg:col-span-3 rounded-xl border border-white/15 bg-black/90 p-6 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Dynamic Topology Node Visual */}
              <div className="relative w-full h-full min-h-[220px] flex flex-col items-center justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-lg border border-white/30 bg-white/5 text-white shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  <PillarGlyph className="h-10 w-10" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400" />
                </div>

                {/* Data Stream Signal Nodes */}
                <div className="mt-6 flex items-center gap-3 font-mono text-xs text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>SYNC: ACTIVE</span>
                  <span className="text-zinc-600">|</span>
                  <span>NODE: OPTIMAL</span>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (5 Cols): Deskripsi Arsitektur & Spesifikasi Kode */}
            <div className="lg:col-span-5 rounded-xl border border-white/15 bg-[#09090D] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-zinc-300">
                  {currentPillar.description}
                </p>

                <div className="mt-6 space-y-2.5">
                  {currentPillar.points.map((pt, i) => (
                    <div key={pt} className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-zinc-300">
                      <span className="font-mono text-xs font-bold text-white shrink-0 mt-0.5">
                        + [0{i + 1}]
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet */}
              <div className="mt-6 overflow-hidden rounded border border-white/10 bg-black/90 font-mono text-[11px] text-zinc-300">
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <GlyphCode className="h-3 w-3 text-zinc-400" />
                    architecture-spec.ts
                  </span>
                  <span className="text-emerald-400 font-bold">LIVE SPEC</span>
                </div>
                <pre className="p-3 overflow-x-auto text-[10.5px] leading-relaxed text-zinc-300">
                  <code>{currentPillar.visualCode}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
