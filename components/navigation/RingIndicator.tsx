"use client";

import { MonoLabel } from "@/components/ui/MonoLabel";

export interface RingIndicatorProps {
  activeRing?: string;
  totalRings?: number;
}

export function RingIndicator({ activeRing = "01" }: RingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={`System status: Online — Node ${activeRing}`}
      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171B22]/80 border border-[#252C35] select-none"
    >
      <div className="relative flex items-center justify-center h-2 w-2" aria-hidden="true">
        <span className="absolute h-2 w-2 rounded-full bg-[#B6E36A]/40 animate-ping" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#B6E36A] shadow-[0_0_8px_#B6E36A]" />
      </div>
      <MonoLabel accent className="text-[10px] tracking-widest text-[#B6E36A]">
        SYS.ONLINE
      </MonoLabel>
    </div>
  );
}
