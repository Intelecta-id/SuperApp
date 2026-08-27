"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session storage to only show preloader once per session
    const hasLoaded = sessionStorage.getItem("intelecta_preloaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("intelecta_preloaded", "true");
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -30,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030303] text-white"
        >
          {/* Logo Animation */}
          <div className="relative mb-8 h-32 w-32">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/logo-icon.svg"
                alt="Intelecta Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
              />
            </motion.div>
          </div>

          {/* Typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="font-display text-lg tracking-[0.3em] font-bold text-white">
              INTELECTA
            </h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-500">
              NEXT-GEN ENTERPRISE ARCHITECTURE
            </p>
          </motion.div>

          {/* Progress Bar & Counter */}
          <div className="w-56">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-zinc-900">
              <motion.div
                className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] text-zinc-400">
              <span>SYSTEM INITIALIZING</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
