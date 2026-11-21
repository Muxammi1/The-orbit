import type { DeviceTier } from "./sceneStore";

export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  if (cores < 4) return "low";

  // Check device memory if exposed (Chromium)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mem = (navigator as any).deviceMemory;
  if (typeof mem === "number" && mem < 4) return "low";

  // Check viewport width and coarse pointer
  const isMobile = window.innerWidth < 768;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (isMobile && isCoarsePointer) {
    return cores >= 8 ? "medium" : "low";
  }

  if (cores >= 8) return "high";
  return "medium";
}
