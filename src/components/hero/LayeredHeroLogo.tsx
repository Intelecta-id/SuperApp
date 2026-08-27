"use client";

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { gsap } from "@/lib/gsap-config";

export type LogoInteractionMode = "float" | "explode" | "pulse" | "hologram";

export interface LayeredHeroLogoRef {
  setMode: (mode: LogoInteractionMode) => void;
  pulseSurge: () => void;
  materialize: () => void;
}

interface LayeredHeroLogoProps {
  initialMode?: LogoInteractionMode;
  onModeChange?: (mode: LogoInteractionMode) => void;
  className?: string;
}

export const LayeredHeroLogo = forwardRef<LayeredHeroLogoRef, LayeredHeroLogoProps>(
  ({ initialMode = "float", onModeChange, className = "" }, ref) => {
    const [activeMode, setActiveMode] = useState<LogoInteractionMode>(initialMode);

    // DOM Refs for layers
    const containerRef = useRef<HTMLDivElement>(null);
    const scene3dRef = useRef<HTMLDivElement>(null);
    const outerDiamondRef = useRef<HTMLDivElement>(null);
    const midDiamondRef = useRef<HTMLDivElement>(null);
    const coreDiamondRef = useRef<HTMLDivElement>(null);
    const coreGlowRef = useRef<HTMLDivElement>(null);
    const typographyRef = useRef<HTMLDivElement>(null);
    const annotationsRef = useRef<HTMLDivElement>(null);
    const ambientGlowRef = useRef<HTMLDivElement>(null);
    const laserScannerRef = useRef<HTMLDivElement>(null);

    // GSAP Timelines & QuickSetters
    const idleTlRef = useRef<gsap.core.Timeline | null>(null);
    const modeTlRef = useRef<gsap.core.Timeline | null>(null);
    const quickXRef = useRef<((val: number) => void) | null>(null);
    const quickYRef = useRef<((val: number) => void) | null>(null);
    const quickRotXRef = useRef<((val: number) => void) | null>(null);
    const quickRotYRef = useRef<((val: number) => void) | null>(null);

    // Expose control methods via ref
    useImperativeHandle(ref, () => ({
      setMode: (mode: LogoInteractionMode) => {
        switchMode(mode);
      },
      pulseSurge: () => {
        triggerPulseSurge();
      },
      materialize: () => {
        triggerMaterialize();
      },
    }));

    // Trigger materialization morphing sequence
    const triggerMaterialize = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set([outerDiamondRef.current, midDiamondRef.current, coreDiamondRef.current], {
        opacity: 0,
      })
      .set(laserScannerRef.current, {
        opacity: 1,
        y: -140,
      })
      // Laser scanner sweep
      .to(laserScannerRef.current, {
        y: 140,
        duration: 0.9,
        ease: "power2.inOut",
      })
      // Outer monumental frame materializes
      .fromTo(outerDiamondRef.current, {
        opacity: 0,
        scale: 0.75,
        rotation: -20,
        filter: "blur(10px) brightness(2)",
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: "blur(0px) brightness(1)",
        duration: 0.9,
        ease: "back.out(1.8)",
      }, "-=0.4")
      // Middle resonance diamond snaps in
      .fromTo(midDiamondRef.current, {
        opacity: 0,
        scale: 0.55,
        rotation: 30,
        filter: "blur(8px) brightness(2)",
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: "blur(0px) brightness(1)",
        duration: 0.8,
        ease: "back.out(2)",
      }, "-=0.6")
      // Quantum Core explodes in from center
      .fromTo(coreDiamondRef.current, {
        opacity: 0,
        scale: 0,
        filter: "drop-shadow(0 0 50px rgba(255,255,255,1)) brightness(3)",
      }, {
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 0 20px rgba(255,255,255,0.7)) brightness(1)",
        duration: 0.7,
        ease: "elastic.out(1.2, 0.4)",
      }, "-=0.5")
      // Ambient glow pulse
      .to(coreGlowRef.current, {
        scale: 1.5,
        opacity: 0.9,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      }, "<")
      // Hide laser scanner
      .to(laserScannerRef.current, {
        opacity: 0,
        duration: 0.3,
      }, "-=0.2");
    };

    // Trigger one-off energy pulse surge
    const triggerPulseSurge = () => {
      const tl = gsap.timeline();

      // Flash the core
      tl.to(coreDiamondRef.current, {
        scale: 1.25,
        filter: "drop-shadow(0 0 45px rgba(255,255,255,1)) brightness(1.8)",
        duration: 0.16,
        ease: "power2.out",
      })
      .to(coreGlowRef.current, {
        scale: 2.4,
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
      }, "<")
      // Ripple to middle ring
      .to(midDiamondRef.current, {
        scale: 1.18,
        rotate: "+=45",
        duration: 0.32,
        ease: "back.out(2)",
      }, "-=0.08")
      // Ripple to outer frame
      .to(outerDiamondRef.current, {
        scale: 1.12,
        rotate: "-=30",
        duration: 0.42,
        ease: "back.out(1.5)",
      }, "-=0.15")
      // Return smoothly to base state
      .to([coreDiamondRef.current, midDiamondRef.current, outerDiamondRef.current], {
        scale: 1,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
        stagger: 0.04,
      })
      .to(coreGlowRef.current, {
        scale: 1,
        opacity: 0.45,
        duration: 0.6,
      }, "<");
    };

    // Mode Switcher Animation Logic
    const switchMode = (mode: LogoInteractionMode) => {
      setActiveMode(mode);
      if (onModeChange) onModeChange(mode);

      if (modeTlRef.current) {
        modeTlRef.current.kill();
      }

      const tl = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.inOut" } });
      modeTlRef.current = tl;

      if (mode === "explode") {
        // 3D Exploded Layer Decomposition
        tl.to(scene3dRef.current, {
          rotateY: -34,
          rotateX: 18,
          scale: 0.94,
          transformPerspective: 1200,
        })
        .to(outerDiamondRef.current, {
          z: 20,
          rotateZ: -10,
          filter: "drop-shadow(0 20px 35px rgba(255,255,255,0.3))",
        }, 0)
        .to(midDiamondRef.current, {
          z: 110,
          rotateZ: 14,
          filter: "drop-shadow(0 25px 45px rgba(255,255,255,0.45))",
        }, 0)
        .to(coreDiamondRef.current, {
          z: 210,
          scale: 1.15,
          filter: "drop-shadow(0 30px 60px rgba(255,255,255,1))",
        }, 0)
        .to(annotationsRef.current, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.5,
          stagger: 0.08,
        }, 0.25)
        .to(typographyRef.current, {
          z: 70,
          letterSpacing: "0.45em",
        }, 0);

      } else if (mode === "pulse") {
        // High-energy pulsating resonance
        tl.to(scene3dRef.current, {
          rotateY: 0,
          rotateX: 0,
          scale: 1.04,
        })
        .to([outerDiamondRef.current, midDiamondRef.current, coreDiamondRef.current], {
          z: 0,
          rotateZ: 0,
        }, 0)
        .to(annotationsRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.3,
        }, 0);

        triggerPulseSurge();

      } else if (mode === "hologram") {
        // Holographic tilt
        tl.to(scene3dRef.current, {
          rotateY: 18,
          rotateX: -14,
          scale: 1.02,
        })
        .to(outerDiamondRef.current, {
          z: 40,
          rotateZ: 45,
        }, 0)
        .to(midDiamondRef.current, {
          z: 85,
          rotateZ: -45,
        }, 0)
        .to(coreDiamondRef.current, {
          z: 140,
          scale: 1.08,
        }, 0)
        .to(annotationsRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.3,
        }, 0);

      } else {
        // Default Float Mode
        tl.to(scene3dRef.current, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
        })
        .to([outerDiamondRef.current, midDiamondRef.current, coreDiamondRef.current, typographyRef.current], {
          z: 0,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          filter: "none",
        }, 0)
        .to(annotationsRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.3,
        }, 0);
      }
    };

    // Setup GSAP Master Timelines & Mouse Tracker
    useEffect(() => {
      const container = containerRef.current;
      const scene3d = scene3dRef.current;
      if (!container || !scene3d) return;

      // 1. Setup GSAP QuickSetters for smooth mouse parallax
      quickXRef.current = gsap.quickTo(scene3d, "x", { duration: 0.8, ease: "power2.out" });
      quickYRef.current = gsap.quickTo(scene3d, "y", { duration: 0.8, ease: "power2.out" });
      quickRotXRef.current = gsap.quickTo(scene3d, "rotationX", { duration: 0.8, ease: "power2.out" });
      quickRotYRef.current = gsap.quickTo(scene3d, "rotationY", { duration: 0.8, ease: "power2.out" });

      // 2. Setup Independent Continuous Idle Floating Animations for EVERY element
      const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
      idleTlRef.current = idleTl;

      // Outer monumental diamond slow oscillation
      idleTl.to(outerDiamondRef.current, {
        y: -14,
        rotation: 1.8,
        duration: 3.8,
        ease: "sine.inOut",
      }, 0);

      // Mid diamond counter oscillation
      idleTl.to(midDiamondRef.current, {
        y: -20,
        rotation: -2.2,
        duration: 3.2,
        ease: "sine.inOut",
      }, 0.2);

      // Core diamond breathing pulse
      idleTl.to(coreDiamondRef.current, {
        y: -9,
        scale: 1.07,
        duration: 2.4,
        ease: "sine.inOut",
      }, 0.1);

      // Ambient background glow breathing
      idleTl.to(ambientGlowRef.current, {
        scale: 1.18,
        opacity: 0.75,
        duration: 3.6,
        ease: "sine.inOut",
      }, 0);

      // 3. Opening Materialization Sequence Timeline
      triggerMaterialize();

      // 4. Mouse Move Event Handler for Parallax
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Limit range
        const clampedX = Math.max(-1, Math.min(1, mouseX));
        const clampedY = Math.max(-1, Math.min(1, mouseY));

        if (activeMode === "float") {
          quickXRef.current?.(clampedX * 22);
          quickYRef.current?.(clampedY * 22);
          quickRotXRef.current?.(-clampedY * 14);
          quickRotYRef.current?.(clampedX * 18);

          // Deepen parallax per sub-layer
          gsap.to(coreDiamondRef.current, {
            x: clampedX * 28,
            y: clampedY * 28,
            duration: 0.6,
            ease: "power1.out",
          });
          gsap.to(midDiamondRef.current, {
            x: clampedX * 16,
            y: clampedY * 16,
            duration: 0.7,
            ease: "power1.out",
          });
          gsap.to(outerDiamondRef.current, {
            x: clampedX * 8,
            y: clampedY * 8,
            duration: 0.8,
            ease: "power1.out",
          });
        }
      };

      const handleMouseLeave = () => {
        if (activeMode === "float") {
          quickXRef.current?.(0);
          quickYRef.current?.(0);
          quickRotXRef.current?.(0);
          quickRotYRef.current?.(0);

          gsap.to([coreDiamondRef.current, midDiamondRef.current, outerDiamondRef.current], {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        idleTl.kill();
      };
    }, [activeMode]);

    return (
      <div
        ref={containerRef}
        className={`relative flex flex-col items-center justify-center select-none ${className}`}
        style={{ perspective: "1400px" }}
      >
        {/* Ambient Radial Background Glow */}
        <div
          ref={ambientGlowRef}
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-[560px] w-[560px] sm:h-[720px] sm:w-[720px] rounded-full bg-radial from-white/14 via-white/3 to-transparent blur-[90px]"
        />

        {/* 3D Scene Root Stage */}
        <div
          ref={scene3dRef}
          className="relative flex flex-col items-center justify-center preserve-3d cursor-pointer w-full"
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => triggerPulseSurge()}
          title="Klik untuk memicu Energy Pulse Surge!"
        >
          {/* Laser Sweep Scanner Effect for Materialization */}
          <div
            ref={laserScannerRef}
            className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 shadow-[0_0_15px_#fff]"
            style={{ zIndex: 50 }}
          />

          {/* ============================================================ */}
          {/* MAIN MONUMENTAL DIAMOND SYSTEM STAGE (Clean & Crisp Scale)   */}
          {/* ============================================================ */}
          <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] flex items-center justify-center preserve-3d">

            {/* LAYER 1: OUTER MONUMENTAL DIAMOND FRAME (Grand Rhombus Contour) */}
            <div
              ref={outerDiamondRef}
              className="absolute inset-0 flex items-center justify-center preserve-3d drop-shadow-glow"
              style={{ transform: "translateZ(0px)" }}
            >
              <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="monumentalOuterStroke" x1="100" y1="40" x2="400" y2="460" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#E4E4E7" />
                    <stop offset="100%" stopColor="#A1A1AA" />
                  </linearGradient>
                </defs>

                {/* Massive Outer Rhombus Frame */}
                <polygon
                  points="250,40 460,250 250,460 40,250"
                  stroke="url(#monumentalOuterStroke)"
                  strokeWidth="18"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  className="transition-all duration-300"
                />
                {/* Outer Highlight Line Contour */}
                <polygon
                  points="250,22 478,250 250,478 22,250"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2.5"
                />
                {/* Tech Corner Markers */}
                <rect x="246" y="32" width="8" height="8" fill="#FFFFFF" />
                <rect x="246" y="460" width="8" height="8" fill="#FFFFFF" />
                <rect x="32" y="246" width="8" height="8" fill="#FFFFFF" />
                <rect x="460" y="246" width="8" height="8" fill="#FFFFFF" />
              </svg>
            </div>

            {/* LAYER 2: MIDDLE CONCENTRIC RESONANCE DIAMOND RING */}
            <div
              ref={midDiamondRef}
              className="absolute inset-0 flex items-center justify-center preserve-3d"
              style={{ transform: "translateZ(50px)" }}
            >
              <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                {/* Mid Diamond Rhombus */}
                <polygon
                  points="250,110 390,250 250,390 110,250"
                  stroke="#FFFFFF"
                  strokeWidth="13"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  className="transition-all duration-300"
                />
                {/* Inner Accent Dashed Perimeter */}
                <polygon
                  points="250,145 355,250 250,355 145,250"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                />
              </svg>
            </div>

            {/* LAYER 3: CORE LUMINOUS QUANTUM NUCLEUS & SOLID DIAMOND */}
            <div
              ref={coreDiamondRef}
              className="absolute inset-0 flex items-center justify-center preserve-3d drop-shadow-core"
              style={{ transform: "translateZ(100px)" }}
            >
              {/* Radial Core Glow Aura */}
              <div
                ref={coreGlowRef}
                className="pointer-events-none absolute h-48 w-48 rounded-full bg-white/35 blur-3xl transition-all duration-300"
              />

              <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="monumentalCoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#F4F4F5" />
                    <stop offset="100%" stopColor="#D4D4D8" />
                  </linearGradient>
                </defs>

                {/* Solid Rhombus Core */}
                <polygon
                  points="250,175 325,250 250,325 175,250"
                  fill="url(#monumentalCoreGradient)"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  className="transition-all duration-300"
                />

                {/* Inner Micro Core Crystal */}
                <circle cx="250" cy="250" r="5" fill="#09090B" />
                <circle cx="250" cy="250" r="2" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* ============================================================ */}
          {/* LAYER 4: 3D EXPLO-DECONSTRUCT ANNOTATION LABELS (When Exploded) */}
          {/* ============================================================ */}
          <div
            ref={annotationsRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 preserve-3d"
          >
            {/* Annotation 1: Outer Frame */}
            <div
              className="absolute top-1/4 -right-16 sm:-right-32 flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-300 border border-white/15 bg-black/85 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xl"
              style={{ transform: "translateZ(20px)" }}
            >
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
              <span>LAYER 01: MONUMENTAL RHOMBUS ARCH</span>
            </div>

            {/* Annotation 2: Middle Ring */}
            <div
              className="absolute top-1/2 -left-20 sm:-left-36 flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-300 border border-white/15 bg-black/85 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xl"
              style={{ transform: "translateZ(110px)" }}
            >
              <span className="h-2 w-2 rounded-full bg-zinc-300 shadow-[0_0_8px_#fff]" />
              <span>LAYER 02: HARMONIC RESONANCE RING</span>
            </div>

            {/* Annotation 3: Core Nucleus */}
            <div
              className="absolute bottom-16 -right-16 sm:-right-32 flex items-center gap-2 font-mono text-[10px] tracking-wider text-emerald-300 border border-emerald-500/40 bg-black/85 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xl"
              style={{ transform: "translateZ(210px)" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              <span>LAYER 03: CORE QUANTUM NUCLEUS</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* LAYER 5: WORDMARK "INTELECTA" KINETIC TYPOGRAPHY (z: 25px)  */}
          {/* ============================================================ */}
          <div
            ref={typographyRef}
            className="mt-4 sm:mt-6 text-center preserve-3d"
            style={{ transform: "translateZ(25px)" }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.4em] text-white flex justify-center items-center drop-shadow-md">
              {"INTELECTA".split("").map((letter, idx) => (
                <span key={idx} className="letter inline-block transition-transform duration-200 hover:scale-125 hover:text-white">
                  {letter}
                </span>
              ))}
            </h2>

            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-white/40" />
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
                ENTERPRISE ARCHITECTURE
              </p>
              <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-white/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LayeredHeroLogo.displayName = "LayeredHeroLogo";
