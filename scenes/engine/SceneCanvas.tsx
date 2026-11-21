"use client";

import { useSyncExternalStore, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { View } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSceneStore } from "./useSceneStore";
import { useSceneProgress } from "./useSceneProgress";

export interface SceneCanvasProps {
  enable3D?: boolean;
  enableSmoothScroll?: boolean;
  posterUrl?: string;
}

function subscribe() {
  return () => {};
}

function getBody() {
  return typeof document !== "undefined" ? document.body : undefined;
}

function getSSR() {
  return undefined;
}

export function SceneCanvas({
  enable3D = true,
  enableSmoothScroll = false,
}: SceneCanvasProps) {
  useSceneProgress(enableSmoothScroll);
  const { deviceTier } = useSceneStore();
  const eventSource = useSyncExternalStore(subscribe, getBody, getSSR);

  if (!enable3D || deviceTier === "low") {
    return null;
  }

  const isHighTier = deviceTier === "high";

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        eventSource={eventSource}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          alpha: true,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <View.Port />
          {isHighTier && (
            <EffectComposer autoClear={false} renderPriority={2} multisampling={0}>
              <Bloom
                luminanceThreshold={1.0}
                luminanceSmoothing={0.2}
                intensity={0.6}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
