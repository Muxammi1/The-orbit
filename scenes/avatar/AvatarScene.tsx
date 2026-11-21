"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { dampE } from "maath/easing";
import { useSceneStore } from "../engine/useSceneStore";

export type TwinVisualState = "idle" | "listening" | "thinking" | "speaking";

export interface AvatarSceneProps {
  twinState?: TwinVisualState;
}

export function AvatarScene({ twinState = "idle" }: AvatarSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const eyeLightRef = useRef<THREE.PointLight>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);

  const { reducedMotion } = useSceneStore();

  const materials = useMemo(() => {
    return {
      titanium: new THREE.MeshPhysicalMaterial({
        color: "#D9DEE5",
        metalness: 0.95,
        roughness: 0.25,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
      darkGraphite: new THREE.MeshPhysicalMaterial({
        color: "#171B22",
        metalness: 0.85,
        roughness: 0.35,
        clearcoat: 0.4,
      }),
      obsidian: new THREE.MeshStandardMaterial({
        color: "#0E1117",
        metalness: 0.9,
        roughness: 0.2,
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: "#B58A68",
        metalness: 0.9,
        roughness: 0.3,
      }),
      ionGlow: new THREE.MeshStandardMaterial({
        color: "#B6E36A",
        emissive: "#B6E36A",
        emissiveIntensity: 2.2,
        roughness: 0.1,
      }),
      conduit: new THREE.MeshStandardMaterial({
        color: "#B6E36A",
        emissive: "#B6E36A",
        emissiveIntensity: 1.5,
        wireframe: true,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Interactive Pointer Head Tracking
    const targetParallaxX = -state.pointer.y * 0.18;
    const targetParallaxY = state.pointer.x * 0.22;

    if (headRef.current && !reducedMotion) {
      // Base sway + pointer parallax
      const sway = Math.sin(t * 1.2) * 0.04;
      const pitchSway = Math.cos(t * 0.9) * 0.03;
      dampE(
        headRef.current.rotation,
        [targetParallaxX + pitchSway, targetParallaxY + sway, 0],
        0.2,
        delta
      );
    }

    // 2. Breathing Torso Motion
    if (!reducedMotion) {
      const breath = Math.sin(t * 1.5) * 0.015;
      groupRef.current.position.y = breath;
    }

    // 3. State-driven dynamic behaviors
    if (coreLightRef.current && eyeLightRef.current && !reducedMotion) {
      if (twinState === "listening") {
        // Alert state: brighten ocular visor
        eyeLightRef.current.intensity = 2.4 + Math.sin(t * 4) * 0.4;
        coreLightRef.current.intensity = 2.0;
      } else if (twinState === "thinking") {
        // Processing state: high frequency pulse on core and eyes
        const pulse = Math.sin(t * 12) * 0.8 + 2.2;
        coreLightRef.current.intensity = pulse * 1.5;
        eyeLightRef.current.intensity = pulse;
        if (coreRef.current) {
          coreRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.08);
        }
      } else if (twinState === "speaking") {
        // Speaking state: vocal frequency modulation
        const speechWave = Math.sin(t * 14) * Math.cos(t * 6);
        coreLightRef.current.intensity = 2.5 + speechWave * 1.2;
        eyeLightRef.current.intensity = 2.0;
        if (jawRef.current) {
          jawRef.current.position.y = -0.58 + Math.abs(speechWave) * 0.06;
        }
      } else {
        // Idle
        coreLightRef.current.intensity = 1.6 + Math.sin(t * 2) * 0.3;
        eyeLightRef.current.intensity = 1.8;
        if (jawRef.current) {
          jawRef.current.position.y = -0.58;
        }
      }
    }

    if (!reducedMotion) {
      state.invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#D9DEE5" />
      <pointLight position={[3, 4, 3]} intensity={1.8} color="#D9DEE5" />
      <pointLight position={[-3, 1, 2]} intensity={1.2} color="#B58A68" />
      <pointLight position={[0, -2, 2]} intensity={0.8} color="#171B22" />

      {/* Dynamic state lights */}
      <pointLight
        ref={eyeLightRef}
        position={[0, 1.4, 0.9]}
        color="#B6E36A"
        intensity={1.8}
        distance={4}
      />
      <pointLight
        ref={coreLightRef}
        position={[0, 0.1, 0.6]}
        color="#B6E36A"
        intensity={1.6}
        distance={5}
      />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#D9DEE5"
          scale={[10, 4]}
          position={[4, 6, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#B58A68"
          scale={[8, 2]}
          position={[-4, 2, -3]}
          target={[0, 0, 0]}
        />
      </Environment>

      <group ref={groupRef} position={[0, -0.6, 0]}>
        {/* ================= HEAD & SENSOR RIG ================= */}
        <group ref={headRef} position={[0, 1.3, 0]}>
          {/* Main Cranium / Faceplate */}
          <mesh material={materials.titanium} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.36, 0.85, 8]} />
          </mesh>

          {/* Temporal Armor Shell */}
          <mesh material={materials.darkGraphite} position={[0, 0.08, -0.06]}>
            <boxGeometry args={[0.9, 0.75, 0.72]} />
          </mesh>

          {/* Horizontal Ocular Visor / Eye Slit */}
          <mesh
            material={materials.ionGlow}
            position={[0, 0.08, 0.42]}
            rotation={[0, 0, 0]}
          >
            <boxGeometry args={[0.55, 0.06, 0.06]} />
          </mesh>

          {/* Secondary Sensor Strip */}
          <mesh
            material={materials.ionGlow}
            position={[0, 0.22, 0.4]}
            rotation={[0, 0, 0]}
          >
            <boxGeometry args={[0.3, 0.02, 0.04]} />
          </mesh>

          {/* Jaw / Articulated Vocal Modulator */}
          <mesh
            ref={jawRef}
            material={materials.darkGraphite}
            position={[0, -0.58, 0.15]}
          >
            <boxGeometry args={[0.48, 0.22, 0.45]} />
          </mesh>

          {/* Temporal Ear Audio Sensors */}
          <mesh
            material={materials.bronze}
            position={[0.48, 0.05, -0.05]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          </mesh>
          <mesh
            material={materials.bronze}
            position={[-0.48, 0.05, -0.05]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          </mesh>
        </group>

        {/* ================= CERVICAL GIMBAL & HYDRAULICS ================= */}
        <group position={[0, 0.75, 0]}>
          <mesh material={materials.bronze}>
            <cylinderGeometry args={[0.16, 0.18, 0.35, 16]} />
          </mesh>
          {/* Hydraulic Struts */}
          <mesh material={materials.titanium} position={[0.22, 0, -0.05]}>
            <cylinderGeometry args={[0.035, 0.035, 0.35, 8]} />
          </mesh>
          <mesh material={materials.titanium} position={[-0.22, 0, -0.05]}>
            <cylinderGeometry args={[0.035, 0.035, 0.35, 8]} />
          </mesh>
        </group>

        {/* ================= TORSO & REACTOR CORE ================= */}
        <group position={[0, -0.1, 0]}>
          {/* Clavicle / Upper Chest Armor */}
          <mesh material={materials.darkGraphite} position={[0, 0.35, 0]}>
            <boxGeometry args={[1.5, 0.35, 0.7]} />
          </mesh>

          {/* Pectoral Structural Plates */}
          <mesh material={materials.titanium} position={[0.45, 0.05, 0.15]}>
            <boxGeometry args={[0.62, 0.55, 0.45]} />
          </mesh>
          <mesh material={materials.titanium} position={[-0.45, 0.05, 0.15]}>
            <boxGeometry args={[0.62, 0.55, 0.45]} />
          </mesh>

          {/* Central Reactor Core Well */}
          <mesh material={materials.obsidian} position={[0, 0.08, 0.22]}>
            <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
          </mesh>

          {/* Glowing Reactor Energy Core */}
          <mesh
            ref={coreRef}
            material={materials.ionGlow}
            position={[0, 0.08, 0.28]}
          >
            <sphereGeometry args={[0.14, 32, 32]} />
          </mesh>

          {/* Core Conduit Accent Ring */}
          <mesh material={materials.bronze} position={[0, 0.08, 0.29]}>
            <torusGeometry args={[0.2, 0.02, 16, 32]} />
          </mesh>

          {/* Shoulder Armor Nodes */}
          <mesh material={materials.darkGraphite} position={[0.95, 0.3, -0.05]}>
            <sphereGeometry args={[0.24, 16, 16]} />
          </mesh>
          <mesh
            material={materials.darkGraphite}
            position={[-0.95, 0.3, -0.05]}
          >
            <sphereGeometry args={[0.24, 16, 16]} />
          </mesh>

          {/* Sub-surface Conduits */}
          <mesh material={materials.conduit} position={[0, -0.35, 0.1]}>
            <cylinderGeometry args={[0.3, 0.25, 0.45, 12]} />
          </mesh>
        </group>
      </group>
    </>
  );
}
