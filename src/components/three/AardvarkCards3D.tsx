"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GlyphCpu,
  GlyphCloud,
  GlyphShieldCheck,
  GlyphDatabase,
  GlyphCheck,
} from "@/components/ui/TechnicalGlyphs";

interface CapabilityCardData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  glyph: React.FC<{ className?: string }>;
  initialRotate: number;
  badge: string;
  specs: string[];
}

const capabilities: CapabilityCardData[] = [
  {
    id: "ai",
    number: "01",
    title: "AI & Neural Engineering",
    tagline: "Arsitektur Kecerdasan Buatan Enterprise",
    description:
      "Pengembangan model machine learning terdistribusi, fine-tuning LLM privat, dan pipeline Retrieval-Augmented Generation (RAG) dengan latensi sub-detik.",
    glyph: GlyphCpu,
    initialRotate: -2.0,
    badge: "LLM & RAG Engine",
    specs: ["Sub-100ms Inference", "On-Premise GPU Cluster", "Zero Data Leaks"],
  },
  {
    id: "cloud",
    number: "02",
    title: "Cloud & High-Availability",
    tagline: "Infrastruktur Skala Petabyte SLA 99.99%",
    description:
      "Modernisasi arsitektur cloud-native multi-region, orkestrasi Kubernetes terkelola, dan Disaster Recovery otomatis dengan RPO/RTO mendekati nol.",
    glyph: GlyphCloud,
    initialRotate: 1.8,
    badge: "Multi-Region K8s",
    specs: ["99.99% SLA Uptime", "Zero Downtime Deploy", "Auto-Scaling Core"],
  },
  {
    id: "security",
    number: "03",
    title: "Cybersecurity Zero Trust",
    tagline: "Pertahanan Siber & Standar ISO 27001",
    description:
      "Implementasi arsitektur pertahanan Zero Trust, audit penetrasi berkala, enkripsi end-to-end kuantum-aman, dan pusat operasi keamanan (SOC) 24/7.",
    glyph: GlyphShieldCheck,
    initialRotate: -1.5,
    badge: "Zero Trust Protocol",
    specs: ["ISO 27001 Certified", "24/7 Threat Hunting", "Quantum-Safe Crypt"],
  },
  {
    id: "distributed",
    number: "04",
    title: "Distributed Core Systems",
    tagline: "Komputasi Terdistribusi & Microservices",
    description:
      "Rekayasa sistem backend dengan throughput jutaan event per detik, arsitektur event-driven, dan konsistensi data terdistribusi ACID/BASE.",
    glyph: GlyphDatabase,
    initialRotate: 1.9,
    badge: "High-Throughput Core",
    specs: ["1M+ Events/Sec", "Event-Driven Broker", "ACID Compliance"],
  },
];

function Card3DItem({ card }: { card: CapabilityCardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const GlyphIcon = card.glyph;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 group relative w-full transition-transform duration-300"
      style={{
        transform: `rotate(${card.initialRotate}deg)`,
      }}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
          scale: glare.opacity > 0 ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative overflow-hidden rounded-xl border border-white/15 bg-gradient-to-b from-[#14141A] via-[#0E0E14] to-[#08080A] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 group-hover:border-white/40"
      >
        {/* Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)`,
          }}
        />

        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded bg-white/10 border border-white/10">
              {card.number}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              {card.badge}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded border border-white/10 bg-white/5 text-white transition-transform group-hover:scale-105 group-hover:bg-white group-hover:text-black">
            <GlyphIcon className="h-4 w-4" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="mt-6 font-display text-xl font-bold uppercase text-white">
          {card.title}
        </h3>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          {card.tagline}
        </p>

        {/* Description */}
        <p className="mt-4 font-sans text-sm leading-relaxed text-zinc-300">
          {card.description}
        </p>

        {/* Technical Specs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {card.specs.map((spec, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
            >
              <span className="text-white font-bold">+</span>
              <span>{spec}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export const AardvarkCards3D: React.FC = () => {
  return (
    <div className="w-full py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded bg-white/5 px-3 py-1 border border-white/10">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            KARTU PERSPEKTIF SPASIAL INTERAKTIF
          </span>
        </div>
        <h3 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
          Pilar Arsitektur & Rekayasa Sistem
        </h3>
        <p className="mt-2 font-sans text-zinc-400 text-sm sm:text-base">
          Arahkan kursor pada kartu untuk merasakan responsifitas sudut 3D dan pantulan cahaya dinamis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto px-4">
        {capabilities.map((card) => (
          <Card3DItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};
