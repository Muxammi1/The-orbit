import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  ringNumber?: string; // e.g. "RING 02 / PERSON" or category
  title: string;
  serifWord?: string; // Deprecated, retained for interface compatibility
  subtitle?: string;
  className?: string;
  id?: string;
}

export function SectionHeader({
  ringNumber,
  title,
  subtitle,
  className,
  id,
}: SectionHeaderProps) {
  // Strip "RING 0N / " or "SEC 0N / " prefix if present to keep public UI clean
  const cleanLabel = ringNumber?.replace(/^(RING|SEC)\s+\d+\s*\/\s*/i, "").trim();

  return (
    <div className={cn("space-y-4 max-w-3xl", className)}>
      {cleanLabel && (
        <span className="text-xs font-mono tracking-widest uppercase text-[#B6E36A] font-medium block">
          {cleanLabel}
        </span>
      )}
      <h2 id={id} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-[#D9DEE5] leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#8C96A3] font-normal leading-relaxed max-w-2xl font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
