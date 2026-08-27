"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GlyphArrowUpRight,
  GlyphAward,
  GlyphBriefcase,
  GlyphArrowLeft,
} from "@/components/ui/TechnicalGlyphs";
import { teamData } from "@/data/team";
import { cn } from "@/lib/utils";

export default function TeamListPage() {
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const departments = [
    "All",
    "AI & Distributed Systems",
    "Cloud & Reliability Engineering",
    "Cybersecurity & Governance",
    "Experience Engineering",
  ];

  const filteredTeam =
    selectedDept === "All"
      ? teamData
      : teamData.filter((member) => member.department === selectedDept);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-24 grid-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-zinc-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <GlyphArrowLeft className="h-3.5 w-3.5" />
          <span>KEMBALI KE BERANDA</span>
        </Link>

        {/* Header */}
        <div className="mt-8 text-center max-w-3xl mx-auto border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
            <span>DEWAN PAKAR ARSITEKTUR REKAYASA</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Para Spesialis di Balik Intelecta
          </h1>

          <p className="mt-4 font-sans text-base leading-relaxed text-zinc-400 sm:text-lg">
            Insinyur sistem terdistribusi, peneliti AI, dan praktisi pertahanan siber berdedikasi untuk menciptakan keunggulan teknologi organisasi Anda.
          </p>
        </div>

        {/* Department Filter Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "rounded px-4 py-2 text-xs font-mono tracking-wide transition-all duration-200",
                selectedDept === dept
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-white"
              )}
            >
              {dept === "All" ? "Semua Divisi" : dept}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTeam.map((member, index) => (
            <motion.div
              key={member.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={`/tim/${member.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#09090D] p-8 transition-all duration-200 hover:border-white/35 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                <div>
                  {/* Top Bar: Avatar & Department */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded border border-white/20 bg-zinc-900 font-display text-lg font-black text-white shadow-inner">
                      {member.avatarPlaceholder}
                    </div>

                    <span className="rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
                      {member.yearsOfExp}+ TAHUN PENGALAMAN
                    </span>
                  </div>

                  {/* Name & Role */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold uppercase text-white transition-colors group-hover:text-zinc-200">
                        {member.name}
                      </h2>
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 group-hover:bg-white group-hover:text-black">
                        <GlyphArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <p className="mt-1 font-mono text-xs text-zinc-400">
                      {member.role}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="mt-4 font-sans text-sm leading-relaxed text-zinc-300">
                    &ldquo;{member.tagline}&rdquo;
                  </p>

                  {/* Skills Snapshot */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {member.skills[0]?.items.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5 font-mono text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <GlyphBriefcase className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{member.featuredProjectsCount} Proyek Selesai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GlyphAward className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{member.certifications.length} Sertifikasi</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
