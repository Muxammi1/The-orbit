"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { dampE } from "maath/easing";
import { useSceneStore } from "../engine/useSceneStore";

interface RingConfig {
  radius: number;
  tube: number;
  rotationSpeed: [number, number, number];
  tiltOffset: [number, number, number];
}

export function RingsMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const { progress, activeSection, mouse, reducedMotion, state } = useSceneStore();

  const isDimmed = state === "dim";
  const isConnect = activeSection === "connect";

  // 5 concentric rings with varying radii and thicknesses
  const rings: RingConfig[] = useMemo(
    () => [
      { radius: 2.2, tube: 0.024, rotationSpeed: [0.15, 0.25, 0.05], tiltOffset: [0.2, 0.1, 0.0] },
      { radius: 3.0, tube: 0.032, rotationSpeed: [-0.12, 0.18, 0.10], tiltOffset: [-0.15, 0.2, 0.1] },
      { radius: 3.8, tube: 0.028, rotationSpeed: [0.20, -0.15, -0.08], tiltOffset: [0.1, -0.25, 0.15] },
      { radius: 4.6, tube: 0.038, rotationSpeed: [-0.18, -0.22, 0.12], tiltOffset: [-0.25, 0.1, -0.2] },
      { radius: 5.4, tube: 0.022, rotationSpeed: [0.10, 0.30, -0.15], tiltOffset: [0.3, -0.15, 0.25] },
    ],
    []
  );

  // Brushed titanium material parameters
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#D9DEE5"),
        metalness: 0.92,
        roughness: 0.24,
        transparent: true,
        opacity: isDimmed ? 0.15 : 0.85,
      }),
    [isDimmed]
  );

  // Ion Green emissive core material
  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#B6E36A"),
        emissive: new THREE.Color("#B6E36A"),
        emissiveIntensity: isDimmed ? 0.4 : 2.2,
        roughness: 0.2,
        metalness: 0.8,
      }),
    [isDimmed]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Respect reduced motion: static pose
    if (reducedMotion) {
      groupRef.current.rotation.set(0.2, 0.2, 0);
      return;
    }

    // Subtle cursor parallax
    const targetRotX = mouse.y * 0.15 + (isConnect ? 0.1 : progress * 0.4);
    const targetRotY = mouse.x * 0.2 + (isConnect ? 0.1 : progress * 0.6);

    dampE(groupRef.current.rotation, [targetRotX, targetRotY, 0], 0.25, delta);

    // Scrub individual ring drift based on section progression
    ringRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const config = rings[idx];
      if (!config) return;

      if (isConnect) {
        // Converge back into harmonic ring alignment
        dampE(mesh.rotation, [0, 0, 0], 0.2, delta);
      } else {
        // Controlled drift out of alignment proportional to scroll progress
        const drift = progress * 2.5;
        const rx = config.tiltOffset[0] + drift * config.rotationSpeed[0];
        const ry = config.tiltOffset[1] + drift * config.rotationSpeed[1];
        const rz = config.tiltOffset[2] + drift * config.rotationSpeed[2];
        dampE(mesh.rotation, [rx, ry, rz], 0.2, delta);
      }
    });

    // Subtle breathing pulse on core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {/* Ion Green Core Point Light */}
      <pointLight
        position={[0, 0, 0]}
        color="#B6E36A"
        intensity={isDimmed ? 0.8 : 3.5}
        distance={18}
        decay={2}
      />

      {/* Warm Bronze Rim Light (never UI controls, reflections only) */}
      <directionalLight
        position={[8, 6, 4]}
        color="#B58A68"
        intensity={isDimmed ? 0.3 : 1.2}
      />
      <directionalLight
        position={[-8, -6, -4]}
        color="#D9DEE5"
        intensity={isDimmed ? 0.2 : 0.8}
      />

      {/* Emissive Core Sphere */}
      <mesh ref={coreRef} position={[0, 0, 0]} material={coreMaterial}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>

      {/* 5 Concentric Rings */}
      {rings.map((ring, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) ringRefs.current[idx] = el;
          }}
          material={ringMaterial}
        >
          <torusGeometry args={[ring.radius, ring.tube, 24, 96]} />
        </mesh>
      ))}
    </group>
  );
}
