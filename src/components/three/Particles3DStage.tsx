"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cn } from "@/lib/utils";
import { GlyphActivity, GlyphZap } from "@/components/ui/TechnicalGlyphs";

interface Particles3DStageProps {
  className?: string;
}

export const Particles3DStage: React.FC<Particles3DStageProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [particleSpeed, setParticleSpeed] = useState<"normal" | "hyper">("normal");

  const speedRef = useRef<"normal" | "hyper">("normal");
  speedRef.current = particleSpeed;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // --- Dynamic Particle Cloud Generation ---
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.4 + 0.6;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      scales[i] = Math.random() * 0.04 + 0.015;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle Shader Material
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // GLTF Loading (Auxiliary neural network mesh from particles.gltf)
    let gltfGroup: THREE.Group | null = null;
    const loader = new GLTFLoader();
    loader.load(
      "/models/particles.gltf",
      (gltf) => {
        gltfGroup = gltf.scene;
        gltfGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true,
              transparent: true,
              opacity: 0.25,
            });
          }
        });

        const box = new THREE.Box3().setFromObject(gltfGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / (maxDim || 1);

        gltfGroup.scale.setScalar(scale);
        gltfGroup.position.x = -center.x * scale;
        gltfGroup.position.y = -center.y * scale;
        gltfGroup.position.z = -center.z * scale;

        scene.add(gltfGroup);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading particles.gltf:", err);
        setLoading(false);
      }
    );

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.8;
      mouse.targetY = y * 0.5;
    };
    container.addEventListener("pointermove", handlePointerMove);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const speedMultiplier = speedRef.current === "hyper" ? 2.5 : 1.0;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 1.5;
      camera.position.y = mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      // Rotate Particles Cloud
      particles.rotation.y = t * 0.1 * speedMultiplier;
      particles.rotation.x = t * 0.05 * speedMultiplier;

      // Organic wave deformation
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        const wave = Math.sin(t * 1.8 * speedMultiplier + ox * 2 + oy * 2) * 0.12;
        posArr[i3] = ox + wave * (ox / 2);
        posArr[i3 + 1] = oy + wave * (oy / 2);
        posArr[i3 + 2] = oz + wave * (oz / 2);
      }
      posAttr.needsUpdate = true;

      if (gltfGroup) {
        gltfGroup.rotation.y = -t * 0.08 * speedMultiplier;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full min-h-[480px] bg-black overflow-hidden select-none", className)}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* HUD Header */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
          <GlyphActivity className="h-3.5 w-3.5 text-white animate-pulse" />
          <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wider">
            NEURAL PARTICLES GALAXY
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
          1,800 Quantum Nodes · Additive Blending
        </span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={() => setParticleSpeed(particleSpeed === "normal" ? "hyper" : "normal")}
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2 text-xs font-mono backdrop-blur-xl transition-all shadow-xl",
            particleSpeed === "hyper"
              ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              : "bg-black/70 text-zinc-400 hover:text-white"
          )}
        >
          <GlyphZap className="h-3.5 w-3.5" />
          <span>{particleSpeed === "hyper" ? "Hyper Wave Aktif" : "Mode Standar"}</span>
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Menginisialisasi Matriks Partikel...
        </div>
      )}
    </div>
  );
};
