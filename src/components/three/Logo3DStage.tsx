"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { GlyphEye, GlyphLayers, GlyphRotate } from "@/components/ui/TechnicalGlyphs";

interface Logo3DStageProps {
  className?: string;
  showControls?: boolean;
}

export const Logo3DStage: React.FC<Logo3DStageProps> = ({
  className,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [explodeOffset, setExplodeOffset] = useState(0); // 0 to 1
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<"studio" | "cyber" | "beam">("studio");
  const [isLoaded, setIsLoaded] = useState(false);

  const explodeRef = useRef(0);
  const wireframeRef = useRef(false);
  const autoRotateRef = useRef(true);

  explodeRef.current = explodeOffset;
  wireframeRef.current = wireframe;
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // --- Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 8, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(-8, -2, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.9, 30, 2);
    fillLight.position.set(-3, -3, 8);
    scene.add(fillLight);

    // Top Beam Cone Light for Center Logo
    const beamLight = new THREE.SpotLight(0xffffff, 4, 25, Math.PI / 6, 0.5, 1);
    beamLight.position.set(0, 8, 0);
    beamLight.target.position.set(0, 0, 0);
    scene.add(beamLight);
    scene.add(beamLight.target);

    // --- Studio Floor Shadow Plane ---
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.4;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- Geometry Generation for Diamond Rings ---
    function diamondOutline(r: number) {
      const shape = new THREE.Shape();
      shape.moveTo(0, r);
      shape.lineTo(r, 0);
      shape.lineTo(0, -r);
      shape.lineTo(-r, 0);
      shape.closePath();
      return shape;
    }

    function frameGeometry(outerR: number, innerR: number, depth: number) {
      const shape = diamondOutline(outerR);
      shape.holes.push(diamondOutline(innerR));
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 1,
      });
      geo.center();
      return geo;
    }

    function solidGeometry(r: number, depth: number) {
      const shape = diamondOutline(r);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 1,
      });
      geo.center();
      return geo;
    }

    const RING_DEPTH = 0.16;

    // Physical Material matching Intelecta's Monochromatic Glossy Identity
    const glossMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.28,
      clearcoat: 0.7,
      clearcoatRoughness: 0.25,
      reflectivity: 0.4,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    interface DiamondLogoGroup {
      group: THREE.Group;
      outer: THREE.Mesh;
      middle: THREE.Mesh;
      core: THREE.Mesh;
      baseY: number;
      spin: number;
      bobOffset: number;
    }

    function buildDiamondLogo(scale: number): DiamondLogoGroup {
      const group = new THREE.Group();

      const outer = new THREE.Mesh(
        frameGeometry(1.0, 0.72, RING_DEPTH),
        glossMaterial
      );
      outer.position.z = -0.16;
      outer.castShadow = outer.receiveShadow = true;

      const middle = new THREE.Mesh(
        frameGeometry(0.6, 0.36, RING_DEPTH),
        glossMaterial
      );
      middle.position.z = 0;
      middle.castShadow = middle.receiveShadow = true;

      const core = new THREE.Mesh(solidGeometry(0.22, RING_DEPTH), glossMaterial);
      core.position.z = 0.16;
      core.castShadow = core.receiveShadow = true;

      group.add(outer, middle, core);
      group.scale.setScalar(scale);

      const spin = (Math.random() - 0.5) * 0.15 + 0.1;
      const bobOffset = Math.random() * Math.PI * 2;

      return { group, outer, middle, core, baseY: 0, spin, bobOffset };
    }

    // 3 Fixed Spots (Left, Right, Top/Center Constellation)
    const spots = [
      { position: new THREE.Vector3(-4.4, -0.4, 0.6), rotationY: 0.35, scale: 0.85 }, // Left
      { position: new THREE.Vector3(4.4, -0.4, 0.6), rotationY: -0.35, scale: 0.85 },  // Right
      { position: new THREE.Vector3(0, 1.8, -0.5), rotationY: 0, scale: 1.15 },        // Center / Top
    ];

    const logoInstances: DiamondLogoGroup[] = spots.map((spot) => {
      const instance = buildDiamondLogo(spot.scale);
      instance.group.position.copy(spot.position);
      instance.group.rotation.y = spot.rotationY;
      instance.baseY = spot.position.y;
      scene.add(instance.group);
      return instance;
    });

    // --- Mouse Parallax Tracking ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.6;
      mouse.targetY = y * 0.4;
    };
    container.addEventListener("pointermove", handlePointerMove);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    setIsLoaded(true);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 1.2;
      camera.position.y = 0.2 + mouse.y * 0.8;
      camera.lookAt(0, 0.4, 0);

      // Update Logos
      const currentExplode = explodeRef.current;
      const currentWireframe = wireframeRef.current;
      const isAutoRotating = autoRotateRef.current;

      logoInstances.forEach((item, index) => {
        // Material switch
        const mat = currentWireframe ? wireframeMaterial : glossMaterial;
        item.outer.material = mat;
        item.middle.material = mat;
        item.core.material = mat;

        // Explode layer z-spacing
        item.outer.position.z = -0.16 - currentExplode * 1.2;
        item.core.position.z = 0.16 + currentExplode * 1.2;

        // Rotation and gentle floating
        if (isAutoRotating) {
          item.group.rotation.y += item.spin * 0.012;
        }
        item.group.position.y =
          item.baseY + Math.sin(t * 0.7 + item.bobOffset) * 0.14;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full min-h-[500px] overflow-hidden bg-black select-none", className)}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Soft Vignette Overlay for Depth */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Floating HUD Meta Overlay */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
          <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wider">
            INTELECTA 3D MONOLITH
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
          3-Spot Constellation · MeshPhysicalMaterial
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 w-full max-w-xl px-4">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-xl shadow-2xl">
            {/* Auto Rotate Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-all",
                autoRotate
                  ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              )}
            >
              <GlyphRotate className={cn("h-3.5 w-3.5", autoRotate && "animate-spin")} />
              <span>{autoRotate ? "Rotasi Aktif" : "Rotasi Diam"}</span>
            </button>

            {/* Wireframe Mode */}
            <button
              onClick={() => setWireframe(!wireframe)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-all",
                wireframe
                  ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              )}
            >
              <GlyphEye className="h-3.5 w-3.5" />
              <span>Wireframe</span>
            </button>

            {/* Explode Layers Toggle */}
            <button
              onClick={() => setExplodeOffset(explodeOffset > 0 ? 0 : 0.85)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-all",
                explodeOffset > 0
                  ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              )}
            >
              <GlyphLayers className="h-3.5 w-3.5" />
              <span>Explode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
