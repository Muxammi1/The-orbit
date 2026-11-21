"use client";

import React, { useRef, useState, useEffect } from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import { useSceneStore } from "@/scenes/engine/useSceneStore";
import { cn } from "@/lib/cn";

export interface StageCameraProps {
  position?: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
}

export interface StageProps {
  children: React.ReactNode;
  camera?: StageCameraProps;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  enable3D?: boolean;
}

export function Stage({
  children,
  camera,
  fallback,
  className,
  style,
  id,
  enable3D = true,
}: StageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const { deviceTier } = useSceneStore();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.01, rootMargin: "150px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const is3DAllowed = enable3D && deviceTier !== "low";

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn("w-full h-full relative overflow-hidden", className)}
      style={style}
    >
      {!is3DAllowed ? (
        fallback ?? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0E1117]/40 text-xs font-mono text-[#8C96A3]">
            [ 3D ACCELERATION DISABLED ]
          </div>
        )
      ) : (
        <View
          as="div"
          visible={inView}
          className="w-full h-full pointer-events-auto"
        >
          {camera && (
            <PerspectiveCamera
              makeDefault
              position={camera.position ?? [0, 0.4, 8]}
              fov={camera.fov ?? 32}
              near={camera.near ?? 0.1}
              far={camera.far ?? 1000}
            />
          )}
          {children}
        </View>
      )}
    </div>
  );
}
