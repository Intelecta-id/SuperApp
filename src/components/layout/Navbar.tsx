"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlyphMenu,
  GlyphClose,
  GlyphArrowUpRight,
} from "@/components/ui/TechnicalGlyphs";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Beranda", href: "/#beranda" },
    { label: "3D Lab", href: "/#3d-showcase", is3D: true },
    { label: "Layanan", href: "/#layanan" },
    { label: "Transformasi", href: "/#transformasi" },
    { label: "Studi Kasus", href: "/#studi-kasus" },
    { label: "Pondasi", href: "/#keunggulan" },
    { label: "Pakar", href: "/tim" },
    { label: "Kontak", href: "/#kontak" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6"
      >
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-md px-4 py-2.5 transition-all duration-300 sm:px-6 sm:py-3",
            isScrolled
              ? "glass-pill shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
              : "bg-black/60 border border-white/8 backdrop-blur-md"
          )}
        >
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-6 w-6 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/logo-icon.svg"
                alt="Intelecta"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-sm font-extrabold tracking-widest text-white transition-colors duration-200 group-hover:text-zinc-200 uppercase">
              INTELECTA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isCurrent = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5",
                    isCurrent
                      ? "bg-white/10 text-white font-bold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.is3D && (
                    <span className="h-1.5 w-1.5 rounded-sm bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  window.location.href = "/#kontak";
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-200 hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <span>Konsultasi</span>
              <GlyphArrowUpRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
              className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
            >
              {mobileMenuOpen ? <GlyphClose className="h-4 w-4" /> : <GlyphMenu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-lg border border-white/15 bg-[#09090D]/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <span>{link.label}</span>
                  {link.is3D && (
                    <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">
                      3D
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenConsultation) {
                      onOpenConsultation();
                    } else {
                      window.location.href = "/#kontak";
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200"
                >
                  <span>Jadwalkan Konsultasi</span>
                  <GlyphArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
