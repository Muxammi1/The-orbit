import Image from "next/image";
import { cn } from "@/lib/cn";

export interface FigureProps {
  src?: string;
  alt: string;
  caption?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Figure({ src, alt, caption, children, className }: FigureProps) {
  return (
    <figure className={cn("my-8 space-y-3", className)}>
      <div className="overflow-hidden rounded-sm border border-[#252C35] bg-[#171B22]">
        {children ? (
          <div className="p-4 flex items-center justify-center">{children}</div>
        ) : src ? (
          <div className="relative w-full aspect-video">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center font-mono text-xs text-[#8C96A3]">
            [Figure Placeholder: {alt}]
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="font-mono text-[11px] text-[#8C96A3] text-center tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
