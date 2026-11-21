"use client";

import { useState } from "react";
import Image from "next/image";

export interface PortraitFrameProps {
  alt?: string;
  className?: string;
}

export function PortraitFrame({
  alt = "Muzammil Yasir — Editorial Portrait",
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
      <div className="relative w-full h-full rounded-sm overflow-hidden bg-[#171B22]/60 flex items-center justify-center">
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
          /* Editorial architectural silhouette */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#171B22]/40 via-[#0E1117] to-[#08090C]">
            <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
              {/* Outer delicate reticle */}
              <div className="absolute inset-0 rounded-full border border-[#252C35] animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#B6E36A]/20" />
              <svg
                className="w-16 h-16 text-[#8C96A3]/40"
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
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#D9DEE5]">
              MUZAMMIL YASIR
            </p>
            <p className="font-mono text-[10px] text-[#B6E36A] tracking-wider mt-1">
              ARCHITECTURAL ARCHIVE
            </p>
          </div>
        )}

        {/* Cinematic subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Corner alignment construction marks */}
        <div className="absolute top-3 left-3 font-mono text-[9px] text-[#8C96A3]/60 tracking-widest select-none">
          PORTRAIT ARCHIVE
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-[#B6E36A]/80 tracking-widest select-none flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#B6E36A]" />
          <span>SYSTEMS THINKER</span>
        </div>
      </div>
    </div>
  );
}
