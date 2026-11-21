import type { DeviceTier } from "./sceneStore";

export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";

  // Check WebGL availability
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "low";
  } catch {
    return "low";
  }

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory if exposed (Chromium)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mem = (navigator as any).deviceMemory;
  if (typeof mem === "number" && mem < 2) return "low";

  // Check viewport width and coarse pointer
  const isMobile = window.innerWidth < 768;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (isMobile && isCoarsePointer) {
    return cores >= 6 ? "medium" : "low";
  }

  // Standard laptops and desktops get high (if >=6 cores) or medium (if >=4 cores)
  // Never aggressively fall back to low on capable machines
  if (cores >= 6) return "high";
  return "medium";
}
