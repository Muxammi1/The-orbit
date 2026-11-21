"use client";

import { MonoLabel } from "@/components/ui/MonoLabel";

export interface RingIndicatorProps {
  activeRing: string; // e.g. "01", "02"
  totalRings?: number;
}

export function RingIndicator({ activeRing, totalRings = 7 }: RingIndicatorProps) {
  const ringNum = parseInt(activeRing, 10) || 1;

  return (
    <div
      role="status"
      aria-label={`Current position: Ring ${ringNum} of ${totalRings}`}
      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171B22]/80 border border-[#252C35] select-none"
    >
      <div className="relative flex items-center justify-center h-2.5 w-2.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-[#B6E36A] shadow-[0_0_8px_#B6E36A]" />
      </div>
      <MonoLabel accent className="text-[10px] tracking-widest">
        RING {String(ringNum).padStart(2, "0")}
      </MonoLabel>
    </div>
  );
}
