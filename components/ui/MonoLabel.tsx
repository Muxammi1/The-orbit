import { cn } from "@/lib/cn";

export interface MonoLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  accent?: boolean;
  dimmed?: boolean;
}

export function MonoLabel({
  children,
  className,
  accent = false,
  dimmed = false,
  ...props
}: MonoLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium select-none",
        accent ? "text-[#B6E36A]" : dimmed ? "text-[#8C96A3]/70" : "text-[#8C96A3]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
