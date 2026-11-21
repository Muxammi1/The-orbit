"use client";

import { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useSceneStore } from "./useSceneStore";
import { useSceneProgress } from "./useSceneProgress";
import { RingsScene } from "../rings/RingsScene";
import { Poster } from "@/components/media/Poster";

export interface SceneCanvasProps {
  enable3D?: boolean;
  enableSmoothScroll?: boolean;
  posterUrl?: string;
}

export function SceneCanvas({
  enable3D = true,
  enableSmoothScroll = false,
  posterUrl,
}: SceneCanvasProps) {
  useSceneProgress(enableSmoothScroll);
  const { deviceTier, state, pointerInteractive } = useSceneStore();

  const isWebGLDisabled = !enable3D || deviceTier === "low";

  useEffect(() => {
    const handleVisibility = () => {
      // Automatic browser RAF pausing handles hidden tabs
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  if (isWebGLDisabled) {
    return <Poster posterUrl={posterUrl} alt="Static background poster (optimized mode)" />;
  }

  const isHighTier = deviceTier === "high";

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      style={{
        pointerEvents: pointerInteractive ? "auto" : "none",
      }}
      aria-hidden="true"
    >
      <Poster posterUrl={posterUrl} className="opacity-30" />
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {(state === "rings" || state === "dim") && <RingsScene />}

          {isHighTier && (
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.7}
                luminanceSmoothing={0.3}
                intensity={0.6}
              />
              <Vignette offset={0.1} darkness={0.6} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
