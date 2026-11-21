import { cn } from "@/lib/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  ringNumber?: string;
}

export function Divider({ className, ringNumber, ...props }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn("relative w-full flex items-center justify-center my-16 sm:my-24", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-[#252C35]" />
      </div>
      {ringNumber ? (
        <div className="relative bg-[#08090C] px-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full border border-[#B6E36A]/60 bg-[#08090C]" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8C96A3]">
            {ringNumber}
          </span>
          <div className="h-2 w-2 rounded-full border border-[#B6E36A]/60 bg-[#08090C]" />
        </div>
      ) : (
        <div className="relative bg-[#08090C] px-3">
          <div className="h-1.5 w-1.5 rounded-full bg-[#B6E36A]/40" />
        </div>
      )}
    </div>
  );
}
