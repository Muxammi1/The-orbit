"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "../engine/useSceneStore";

// Placeholder avatar mesh — an animated distorted sphere representing
// the Digital Twin's presence. Replace with GLTF model in a later phase.
export function AvatarScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { reducedMotion } = useSceneStore();

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#B6E36A" />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#B6E36A" />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color="#B58A68" />
      <Sphere ref={meshRef} args={[1.6, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#1a2a0a"
          emissive="#B6E36A"
          emissiveIntensity={0.18}
          metalness={0.7}
          roughness={0.3}
          distort={0.35}
          speed={reducedMotion ? 0 : 1.2}
        />
      </Sphere>
    </>
  );
}
