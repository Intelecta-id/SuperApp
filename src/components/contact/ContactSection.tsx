"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GlyphSend,
  GlyphCheck,
  GlyphMail,
  GlyphLocation,
  GlyphPhone,
} from "@/components/ui/TechnicalGlyphs";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TerminalConsole } from "./TerminalConsole";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "AI & Machine Learning",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section id="kontak" className="relative py-28 bg-[#030303] border-t border-white/8">
      <div id="terminal" className="absolute -top-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 border border-white/5">
            <span>INISIASI KONSULTASI & PERENCANAAN</span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            Mari Rancang Masa Depan Bersama
          </h2>
          <p className="mt-3 font-sans text-base text-zinc-400">
            Diskusikan kebutuhan arsitektur digital, inisiatif AI enterprise, atau audit keamanan siber Anda bersama dewan pakar Intelecta.
          </p>
        </div>

        {/* 2-Column Layout: Form & Terminal */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Left Column: Contact Form */}
          <div className="rounded-xl border border-white/15 bg-[#09090D] p-8 sm:p-10 backdrop-blur-xl lg:col-span-6">
            <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Kirim Permintaan Konsultasi
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Tim engineering kami akan merespons dalam kurun waktu 1x24 jam kerja.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/20 text-emerald-400">
                  <GlyphCheck className="h-6 w-6" />
                </div>
                <h4 className="mt-4 font-display text-xl font-bold uppercase text-white">
                  Permintaan Berhasil Terkirim
                </h4>
                <p className="mt-2 font-sans text-sm text-zinc-300">
                  Terima kasih, {formData.name}. Solutions Architect Intelecta akan segera menghubungi Anda melalui email <span className="text-white font-mono">{formData.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      company: "",
                      service: "AI & Machine Learning",
                      message: "",
                    });
                  }}
                  className="mt-6 font-mono text-xs text-zinc-400 underline hover:text-white"
                >
                  Kirim pesan baru
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase">
                      NAMA LENGKAP *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Budi Santoso"
                      className="mt-2 w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-white focus:bg-white/5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase">
                      EMAIL BISNIS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@perusahaan.co.id"
                      className="mt-2 w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-white focus:bg-white/5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase">
                      PERUSAHAAN / ORGANISASI
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="PT Bank Nusantara"
                      className="mt-2 w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-white focus:bg-white/5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase">
                      FOKUS REKAYASA
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="mt-2 w-full rounded border border-white/10 bg-[#121217] px-4 py-3 text-sm text-white transition-colors focus:border-white focus:outline-none"
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Cloud & DevOps">Cloud & High-Availability</option>
                      <option value="Cybersecurity">Cybersecurity Zero Trust</option>
                      <option value="Enterprise Custom Software">Enterprise Custom Software</option>
                      <option value="Konsultasi Komprehensif">Konsultasi Komprehensif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-zinc-400 uppercase">
                    DESKRIPSI SPESIFIKASI / PERMASALAHAN *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Jelaskan kebutuhan arsitektur, kapasitas trafik, atau target implementasi sistem Anda..."
                    className="mt-2 w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-white focus:bg-white/5 focus:outline-none font-sans"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="w-full"
                >
                  <GlyphSend className="h-4 w-4" />
                  <span>{isSubmitting ? "Mengirimkan Data..." : "Kirim Permintaan Konsultasi"}</span>
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Right Column: Terminal Diagnostics */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <TerminalConsole />

            {/* Quick Contact Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded border border-white/8 bg-white/[0.02] p-4 text-center">
                <GlyphMail className="mx-auto h-4 w-4 text-zinc-400" />
                <p className="mt-2 font-mono text-[11px] text-zinc-300">contact@intelecta.id</p>
              </div>
              <div className="rounded border border-white/8 bg-white/[0.02] p-4 text-center">
                <GlyphPhone className="mx-auto h-4 w-4 text-zinc-400" />
                <p className="mt-2 font-mono text-[11px] text-zinc-300">+62 812-8900-1926</p>
              </div>
              <div className="rounded border border-white/8 bg-white/[0.02] p-4 text-center">
                <GlyphLocation className="mx-auto h-4 w-4 text-zinc-400" />
                <p className="mt-2 font-mono text-[11px] text-zinc-300">SCBD, Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
