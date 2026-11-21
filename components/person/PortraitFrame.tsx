"use client";

import { useState } from "react";
import Image from "next/image";
import { MonoLabel } from "@/components/ui/MonoLabel";

export interface PortraitFrameProps {
  alt?: string;
  className?: string;
}

export function PortraitFrame({
  alt = "Muzammil Yasir - Editorial Portrait",
  className,
}: PortraitFrameProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative w-full aspect-[4/5] sm:aspect-[3/4] max-w-md mx-auto rounded-sm overflow-hidden border border-[#252C35] bg-[#0E1117] p-2 shadow-2xl ${
        className || ""
      }`}
    >
      {/* Inner frame */}
      <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#171B22]/50 flex items-center justify-center">
        {!imgError ? (
          <Image
            src="/media/portrait.jpg"
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            onError={() => setImgError(true)}
            priority={false}
          />
        ) : (
          /* Editorial architectural silhouette placeholder */
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <svg
              className="w-24 h-24 text-[#252C35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div className="space-y-1">
              <MonoLabel accent className="text-[10px]">
                PORTRAIT SLOT
              </MonoLabel>
              <p className="font-mono text-[11px] text-[#8C96A3]">
                Place photo at <code className="text-[#D9DEE5]">/public/media/portrait.jpg</code>
              </p>
            </div>
          </div>
        )}

        {/* Cinematic subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Corner alignment construction marks */}
        <div className="absolute top-3 left-3 font-mono text-[9px] text-[#8C96A3]/60 tracking-widest select-none">
          SEC 02 / PERSON
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-[#B6E36A]/70 tracking-widest select-none">
          SYSTEMS THINKER
        </div>
      </div>
    </div>
  );
}
