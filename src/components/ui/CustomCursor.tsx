"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useSpring(0, { stiffness: 600, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 600, damping: 30 });
  const ringX = useSpring(0, { stiffness: 200, damping: 20 });
  const ringY = useSpring(0, { stiffness: 200, damping: 20 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("a, button, input, textarea, [data-interactive]");
        setIsPointer(!!interactive);
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, ringX, ringY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Outer Diamond / Ring */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 border border-white/80 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          rotate: 45,
          borderRadius: isPointer ? "12px" : "4px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
    </div>
  );
};
