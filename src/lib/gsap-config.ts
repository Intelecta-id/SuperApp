"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Ensure plugins are registered only once on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set global default eases
  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });
}

export { gsap, ScrollTrigger };
