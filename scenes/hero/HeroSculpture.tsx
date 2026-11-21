"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { dampE } from "maath/easing";
import { useSceneStore } from "../engine/useSceneStore";

// Procedurally generate brushed metal roughness texture
function createBrushedMetalTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#666666";
  ctx.fillRect(0, 0, 512, 512);

  // Micro horizontal streaks for anisotropic reflection
  for (let i = 0; i < 3500; i++) {
    const y = Math.random() * 512;
    const x = Math.random() * 512;
    const len = 40 + Math.random() * 140;
    const alpha = 0.03 + Math.random() * 0.12;
    const val = Math.random() > 0.5 ? 240 : 20;
    ctx.strokeStyle = `rgba(${val}, ${val}, ${val}, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();

    if (x + len > 512) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(x + len - 512, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

export function HeroSculpture() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);
  const ring5Ref = useRef<THREE.Group>(null);

  const { reducedMotion, progress } = useSceneStore();

  const brushedTexture = useMemo(() => createBrushedMetalTexture(), []);

  // Material configs matching specification:
  // metalness 1, roughness 0.28, clearcoat 0.5, clearcoatRoughness 0.25, envMapIntensity 1.4
  const materials = useMemo(() => {
    const baseConfig = {
      metalness: 1,
      roughness: 0.28,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.4,
      roughnessMap: brushedTexture,
    };

    return {
      titanium: new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: "#D9DEE5",
      }),
      obsidian: new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: "#15181E",
        roughness: 0.32,
      }),
      bronze: new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        color: "#B58A68",
        roughness: 0.26,
      }),
    };
  }, [brushedTexture]);

  // Rotational speeds (full turn every 40-90 seconds)
  // 40s -> ~0.157 rad/s, 90s -> ~0.07 rad/s
  const speeds = useMemo(
    () => ({
      r1: (2 * Math.PI) / 80, // ~80s
      r2: -(2 * Math.PI) / 55, // ~55s
      r3: (2 * Math.PI) / 65, // ~65s
      r4: -(2 * Math.PI) / 45, // ~45s
      r5: (2 * Math.PI) / 75, // ~75s
    }),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Idle rotational motion on each ring around its own axis
    if (!reducedMotion) {
      if (ring1Ref.current) ring1Ref.current.rotation.z += delta * speeds.r1;
      if (ring2Ref.current) ring2Ref.current.rotation.y += delta * speeds.r2;
      if (ring3Ref.current) ring3Ref.current.rotation.x += delta * speeds.r3;
      if (ring4Ref.current) ring4Ref.current.rotation.z += delta * speeds.r4;
      if (ring5Ref.current) ring5Ref.current.rotation.y += delta * speeds.r5;
    }

    // 2. Pointer parallax (max ~0.25 rad, damped with maath)
    const targetParallaxX = -state.pointer.y * 0.25;
    const targetParallaxY = state.pointer.x * 0.25;

    // 3. Scroll scrub: sculpture slowly rotates and scales down as hero leaves viewport
    const heroScroll = Math.min(progress * 4, 1); // 0 to 1 as hero scrolls out
    const scrollScale = Math.max(1 - heroScroll * 0.35, 0.65);
    const scrollRot = heroScroll * 0.8;

    groupRef.current.scale.setScalar(scrollScale);

    dampE(
      groupRef.current.rotation,
      [targetParallaxX + scrollRot * 0.3, targetParallaxY + scrollRot * 0.5, 0],
      0.25,
      delta
    );

    // Keep demand frameloop rendering smoothly when animating
    if (!reducedMotion) {
      state.invalidate();
    }
  });

  return (
    <>
      {/* Weak ambient light */}
      <ambientLight intensity={0.15} color="#D9DEE5" />

      {/* Environment with custom Lightformer strips for metallic reflections */}
      <Environment resolution={256}>
        {/* Large cool-white strip top-right */}
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#EBF4FF"
          scale={[12, 6]}
          position={[6, 8, 4]}
          target={[0, 0, 0]}
        />
        {/* Narrow bronze strip back-left */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#B58A68"
          scale={[14, 2]}
          position={[-6, 2, -5]}
          target={[0, 0, 0]}
        />
        {/* Soft fill from below */}
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#8C96A3"
          scale={[10, 8]}
          position={[0, -8, 2]}
          target={[0, 0, 0]}
        />
      </Environment>

      {/* Gyroscope Sculpture Group */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Emissive Core: small sphere (radius 0.22) with emissive Ion Green */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color="#B6E36A"
            emissive="#B6E36A"
            emissiveIntensity={2.5}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
        <pointLight color="#B6E36A" intensity={2.0} distance={7} decay={2} />

        {/* Ring 1: radius 2.6, tube 0.07, tilt X 0.35, Titanium */}
        <group rotation={[0.35, 0, 0]}>
          <group ref={ring1Ref}>
            <mesh material={materials.titanium}>
              <torusGeometry args={[2.6, 0.07, 64, 256]} />
            </mesh>
            {/* Satellite 1 on Ring 1 */}
            <mesh position={[2.6, 0, 0]} material={materials.titanium}>
              <capsuleGeometry args={[0.06, 0.12, 8, 16]} />
              <meshBasicMaterial color="#B6E36A" />
            </mesh>
          </group>
        </group>

        {/* Ring 2: radius 2.15, tube 0.09, tilt Y 1.1, Darker Obsidian */}
        <group rotation={[0, 1.1, 0]}>
          <group ref={ring2Ref}>
            <mesh material={materials.obsidian}>
              <torusGeometry args={[2.15, 0.09, 64, 256]} />
            </mesh>
          </group>
        </group>

        {/* Ring 3: radius 1.7, tube 0.06, tilt Z 0.8, Subtle Bronze Tint */}
        <group rotation={[0, 0, 0.8]}>
          <group ref={ring3Ref}>
            <mesh material={materials.bronze}>
              <torusGeometry args={[1.7, 0.06, 64, 256]} />
            </mesh>
            {/* Satellite 2 on Ring 3 */}
            <mesh position={[0, 1.7, 0]} material={materials.bronze}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#B58A68"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Ring 4: radius 1.3, tube 0.1, tilt X -0.9, Y 0.4, Titanium */}
        <group rotation={[-0.9, 0.4, 0]}>
          <group ref={ring4Ref}>
            <mesh material={materials.titanium}>
              <torusGeometry args={[1.3, 0.1, 64, 256]} />
            </mesh>
            {/* Satellite 3 on Ring 4 */}
            <mesh position={[-1.3, 0, 0]} material={materials.titanium}>
              <sphereGeometry args={[0.06, 16, 16]} />
            </mesh>
          </group>
        </group>

        {/* Ring 5: radius 0.9, tube 0.05, tilt Z -1.2, Titanium */}
        <group rotation={[0, 0, -1.2]}>
          <group ref={ring5Ref}>
            <mesh material={materials.titanium}>
              <torusGeometry args={[0.9, 0.05, 64, 256]} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
