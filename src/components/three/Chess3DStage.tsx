"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cn } from "@/lib/utils";
import { GlyphRotate, GlyphShield } from "@/components/ui/TechnicalGlyphs";

interface Chess3DStageProps {
  className?: string;
}

export const Chess3DStage: React.FC<Chess3DStageProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const autoRotateRef = useRef(true);
  autoRotateRef.current = autoRotate;

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
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // --- Studio Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4d4d8, 2.5);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const floorLight = new THREE.PointLight(0xffffff, 1.2, 15);
    floorLight.position.set(0, -2, 3);
    scene.add(floorLight);

    // Shadow Floor
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    let modelGroup: THREE.Group | null = null;

    // GLTF Loading
    const loader = new GLTFLoader();
    loader.load(
      "/models/chess.gltf",
      (gltf) => {
        modelGroup = gltf.scene;

        // Enhance materials to Obsidian Gloss & Chrome
        modelGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.25,
                roughness: 0.18,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2,
                reflectivity: 0.6,
              });
            }
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / (maxDim || 1);

        modelGroup.scale.setScalar(scale);
        modelGroup.position.x = -center.x * scale;
        modelGroup.position.y = -center.y * scale - 0.2;
        modelGroup.position.z = -center.z * scale;

        scene.add(modelGroup);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading chess model:", error);
        setLoading(false);
      }
    );

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.5;
      mouse.targetY = y * 0.3;
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

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 1.5;
      camera.position.y = 1.5 + mouse.y * 0.8;
      camera.lookAt(0, 0, 0);

      if (modelGroup && autoRotateRef.current) {
        modelGroup.rotation.y += 0.008;
        modelGroup.position.y = -0.2 + Math.sin(t * 0.8) * 0.08;
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
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* HUD Header */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
          <GlyphShield className="h-3.5 w-3.5 text-white" />
          <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wider">
            CHESS STRATEGIST MONOLITH
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-white/15 px-4 py-2 text-xs font-mono backdrop-blur-xl transition-all shadow-xl",
            autoRotate
              ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              : "bg-black/70 text-zinc-400 hover:text-white"
          )}
        >
          <GlyphRotate className={cn("h-3.5 w-3.5", autoRotate && "animate-spin")} />
          <span>{autoRotate ? "Rotasi Aktif" : "Rotasi Diam"}</span>
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Memuat Model Catur 3D...
        </div>
      )}
    </div>
  );
};
