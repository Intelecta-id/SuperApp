"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function DiamondMonolith({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth lerp rotation toward mouse position + subtle continuous rotation
    const targetRotX = (mouse.current.y * 0.4) + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    const targetRotY = (mouse.current.x * 0.6) + state.clock.elapsedTime * 0.15;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);

    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Diamond / Octahedron Ring */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Outer Wireframe Diamond */}
        <mesh>
          <octahedronGeometry args={[2.2, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            wireframe
            roughness={0.1}
            metalness={0.9}
            emissive="#FFFFFF"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Refractive Glass Crystal Diamond */}
        <mesh>
          <octahedronGeometry args={[2.0, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={1.2}
            roughness={0.05}
            chromaticAberration={0.4}
            anisotropy={0.2}
            distortion={0.3}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#FFFFFF"
            attenuationDistance={1}
            attenuationColor="#E4E4E7"
          />
        </mesh>

        {/* Inner Floating Core Diamond */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.1}
            metalness={1}
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export const DiamondScene: React.FC = () => {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouse.current.x = (clientX / innerWidth) * 2 - 1;
    mouse.current.y = -(clientY / innerHeight) * 2 + 1;
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] lg:h-[540px] lg:w-[540px]"
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#FFFFFF" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#A1A1AA" />
        <pointLight position={[0, 4, 2]} intensity={3} color="#FFFFFF" />

        <DiamondMonolith mouse={mouse} />
      </Canvas>
    </div>
  );
};
