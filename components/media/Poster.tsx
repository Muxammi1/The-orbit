import { cn } from "@/lib/cn";

export interface PosterProps {
  className?: string;
  posterUrl?: string;
  alt?: string;
}

export function Poster({
  className,
  posterUrl,
  alt = "Atmospheric visual background",
}: PosterProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#08090C]",
        className
      )}
    >
      {posterUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen filter saturate-50"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      ) : (
        /* Atmospheric CSS radial gradient fallback */
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(182, 227, 106, 0.08) 0%, rgba(181, 138, 104, 0.04) 40%, rgba(8, 9, 12, 1) 100%)",
          }}
        />
      )}
      {/* Cinematic subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,9,12,0.95)_100%)]" />
    </div>
  );
}
