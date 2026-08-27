"use client";

import React, { useState, useEffect, useRef } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { Lab3DSection } from "@/components/three/Lab3DSection";
import { ServicesMatrix } from "@/components/services/ServicesMatrix";
import { BeforeAfterCompare } from "@/components/compare/BeforeAfterCompare";
import { MetricsMarquee } from "@/components/metrics/MetricsMarquee";
import { CaseStudies } from "@/components/case-studies/CaseStudies";
import { WhyIntelecta } from "@/components/why-intelecta/WhyIntelecta";
import { ContactSection } from "@/components/contact/ContactSection";
import { CalendlyModal } from "@/components/ui/CalendlyModal";
import { CurtainSection } from "@/components/transitions/CurtainSection";
import { gsap } from "@/lib/gsap-config";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // GSAP ScrollTrigger Master Exit Transition for Hero
    const ctx = gsap.context(() => {
      const heroEl = document.getElementById("beranda");
      if (heroEl) {
        gsap.to(heroEl, {
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          scale: 0.94,
          opacity: 0.3,
          filter: "blur(6px)",
          ease: "none",
        });
      }

      // Continuous Axis Line Tracker animation across main page
      const axisLine = document.querySelector(".global-axis-line");
      if (axisLine) {
        gsap.fromTo(
          axisLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mainRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="relative min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black">
      {/* Global Vertical Axis Tracker Line */}
      <div className="pointer-events-none fixed left-8 sm:left-12 top-0 bottom-0 z-10 w-[1px] bg-white/10 hidden xl:block">
        <div className="global-axis-line w-full h-full bg-gradient-to-b from-white via-zinc-400 to-transparent shadow-[0_0_8px_#ffffff]" />
      </div>

      {/* 01 / HERO & SIGNAL (Monumental Layered Animated 3D Logo) */}
      <CurtainSection id="beranda-curtain" zIndex={10} wipeDirection="fade">
        <HeroSection onOpenConsultation={() => setIsConsultationOpen(true)} />
      </CurtainSection>

      {/* 02 / 3D SPATIAL LAB & SHOWCASE (Logo 3D Trio, Chess & Neural Particles) */}
      <CurtainSection id="showcase-3d-curtain" zIndex={20} wipeDirection="up">
        <Lab3DSection />
      </CurtainSection>

      {/* 03 / KAPABILITAS SISTEM (Services Matrix - United Carriers Format) */}
      <CurtainSection id="layanan-curtain" zIndex={30} wipeDirection="up">
        <ServicesMatrix />
      </CurtainSection>

      {/* 04 / BENCHMARK TRANSFORMASI (Before / After Drag-to-Compare Slider) */}
      <CurtainSection id="transformasi-curtain" zIndex={32} wipeDirection="up">
        <BeforeAfterCompare />
      </CurtainSection>

      {/* 05 / METRIK & KINERJA PRODUKSI (Stats & Client Infinite Marquee) */}
      <CurtainSection id="metrik-curtain" zIndex={35} wipeDirection="fade">
        <MetricsMarquee />
      </CurtainSection>

      {/* 06 / STUDI KASUS & DAMPAK (Alche Studio Hybrid 3D Slider) */}
      <CurtainSection id="studi-kasus-curtain" zIndex={40} wipeDirection="up">
        <CaseStudies />
      </CurtainSection>

      {/* 07 / PONDASI ARSITEKTUR (3-Column Pillar Scrollytelling + Grand Right Logo) */}
      <CurtainSection id="keunggulan-curtain" zIndex={45} wipeDirection="up">
        <WhyIntelecta />
      </CurtainSection>

      {/* 08 / INISIASI & KONTAK (Contact Form & Interactive Architecture Console) */}
      <CurtainSection id="kontak-curtain" zIndex={50} wipeDirection="up">
        <ContactSection />
      </CurtainSection>

      {/* Calendly Consultation Modal */}
      <CalendlyModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
