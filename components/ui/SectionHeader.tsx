import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  ringNumber?: string; // e.g. "RING 02 / PERSON" or category
  title: string;
  serifWord?: string; // Optional emphasized word rendered in Instrument Serif italic
  subtitle?: string;
  className?: string;
  id?: string;
}

export function SectionHeader({
  ringNumber,
  title,
  serifWord,
  subtitle,
  className,
  id,
}: SectionHeaderProps) {
  // Strip "RING 0N / " prefix if present to keep public UI clean
  const cleanLabel = ringNumber?.replace(/^RING\s+\d+\s*\/\s*/i, "").trim();

  return (
    <div className={cn("space-y-4 max-w-3xl", className)}>
      {cleanLabel && (
        <span className="text-xs font-mono tracking-widest uppercase text-[#B6E36A] font-medium block">
          {cleanLabel}
        </span>
      )}
      <h2 id={id} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.1]">
        {serifWord && title.includes(serifWord) ? (
          <>
            {title.split(serifWord)[0]}
            <span className="font-serif italic font-normal text-[#D9DEE5]">
              {serifWord}
            </span>
            {title.split(serifWord)[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#8C96A3] font-normal leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
