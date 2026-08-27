"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

interface CurtainSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  zIndex?: number;
  enablePin?: boolean;
  wipeDirection?: "up" | "down" | "fade";
}

export const CurtainSection: React.FC<CurtainSectionProps> = ({
  id,
  className,
  children,
  zIndex = 10,
  enablePin = false,
  wipeDirection = "up",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const ctx = gsap.context(() => {
      // Vertical Curtain Reveal Animation
      if (wipeDirection === "up") {
        gsap.fromTo(
          content,
          {
            y: 60,
            scale: 0.96,
            opacity: 0.7,
            clipPath: "inset(10% 0% 0% 0% round 24px)",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 25%",
              scrub: 1.2,
            },
          }
        );
      } else if (wipeDirection === "fade") {
        gsap.fromTo(
          content,
          {
            y: 40,
            opacity: 0.4,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 35%",
              scrub: 1,
            },
          }
        );
      }

      // Exit curtain effect when scrolling past
      gsap.to(content, {
        opacity: 0.4,
        scale: 0.94,
        filter: "blur(4px)",
        scrollTrigger: {
          trigger: el,
          start: "bottom 40%",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [wipeDirection]);

  return (
    <section
      id={id}
      ref={sectionRef}
      style={{ zIndex }}
      className={cn("relative w-full overflow-hidden", className)}
    >
      <div ref={contentRef} className="relative w-full transition-transform will-change-transform">
        {children}
      </div>
    </section>
  );
};
