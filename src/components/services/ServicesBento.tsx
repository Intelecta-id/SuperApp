"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GlyphCpu,
  GlyphCloud,
  GlyphShieldCheck,
  GlyphServer,
} from "@/components/ui/TechnicalGlyphs";
import { servicesData, ServiceItem } from "@/data/services";
import { cn } from "@/lib/utils";

const glyphMap: Record<string, React.FC<{ className?: string }>> = {
  Cpu: GlyphCpu,
  Cloud: GlyphCloud,
  ShieldCheck: GlyphShieldCheck,
  Layers: GlyphServer,
};

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const GlyphComp = glyphMap[service.iconName] || GlyphServer;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0E] p-8 transition-all duration-300 backdrop-blur-xl hover:border-white/30",
        index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"
      )}
    >
      {/* Specular Spotlight Follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.08), transparent 40%)`,
        }}
      />

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-white/15 bg-white/5 text-white transition-transform duration-200 group-hover:scale-105 group-hover:bg-white group-hover:text-black">
            <GlyphComp className="h-5 w-5" />
          </div>

          <span className="font-mono text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            [ {service.category} ]
          </span>
        </div>

        <h3 className="mt-6 font-display text-xl font-bold uppercase text-white transition-colors duration-200">
          {service.title}
        </h3>

        <p className="mt-3 font-sans text-sm leading-relaxed text-zinc-400">
          {service.description}
        </p>

        {/* Feature List */}
        <div className="mt-6 space-y-2 font-sans text-xs text-zinc-300">
          {service.features.map((feature, i) => (
            <div key={feature} className="flex items-start gap-2.5">
              <span className="font-mono text-xs font-bold text-white mt-0.5">+ [0{i + 1}]</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Tech Stack & Metric */}
      <div className="mt-8 pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {service.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-white/8 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
          <span>{service.metrics}</span>
        </div>
      </div>
    </motion.div>
  );
}

export const ServicesBento: React.FC = () => {
  return (
    <section id="layanan-bento" className="relative py-20 bg-[#040406]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
