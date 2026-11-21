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
  title,
  subtitle,
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-3.5 max-w-3xl", className)}>
      <h2 id={id} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[#D9DEE5] leading-[1.08]">
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
