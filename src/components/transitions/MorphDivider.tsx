"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

interface MorphDividerProps {
  className?: string;
  variant?: "diamond-to-wide" | "wave-to-flat" | "beam-morph";
}

export const MorphDivider: React.FC<MorphDividerProps> = ({
  className,
  variant = "diamond-to-wide",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    if (!container || !path) return;

    const ctx = gsap.context(() => {
      // Dynamic Path Morphing based on scroll scrub
      if (variant === "diamond-to-wide") {
        gsap.fromTo(
          path,
          {
            attr: {
              d: "M 0,0 L 500,45 L 1000,0 L 1000,60 L 500,85 L 0,60 Z",
            },
          },
          {
            attr: {
              d: "M 0,0 L 500,10 L 1000,0 L 1000,40 L 500,40 L 0,40 Z",
            },
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          {
            attr: { cx: "20%" },
            opacity: 0.3,
          },
          {
            attr: { cx: "80%" },
            opacity: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 90%",
              end: "bottom 10%",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden pointer-events-none select-none my-[-1px]", className)}
      style={{ height: "60px" }}
    >
      <svg
        viewBox="0 0 1000 85"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="morph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
          </linearGradient>

          <radialGradient id="morph-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          ref={pathRef}
          d="M 0,0 L 500,45 L 1000,0 L 1000,60 L 500,85 L 0,60 Z"
          fill="url(#morph-gradient)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        <circle
          ref={glowRef}
          cx="50%"
          cy="30"
          r="40"
          fill="url(#morph-glow)"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
