import { cn } from "@/lib/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "verified" | "planned" | "placeholder" | "accent";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Chip({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  ...props
}: ChipProps) {
  // If in production/public view and NEXT_PUBLIC_SHOW_PLACEHOLDERS is not true, hide draft/placeholder chips
  const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";
  if (variant === "placeholder" && !showPlaceholders) {
    return null;
  }

  const baseStyles =
    "inline-flex items-center font-mono font-medium uppercase tracking-wider rounded-full select-none";

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-2",
  };

  const variantStyles = {
    default: "bg-[#171B22] text-[#8C96A3] border border-[#252C35]",
    verified: "bg-[#171B22] text-[#D9DEE5] border border-[#252C35]",
    planned: "bg-[#0E1117] text-[#8C96A3] border border-dashed border-[#252C35]",
    placeholder: "bg-[#171B22]/60 text-[#8C96A3] border border-dashed border-[#8C96A3]/40",
    accent: "bg-[#171B22] text-[#B6E36A] border border-[#B6E36A]/30",
  };

  const dotColors = {
    default: "bg-[#8C96A3]",
    verified: "bg-[#B6E36A]",
    planned: "bg-[#8C96A3]/60",
    placeholder: "bg-amber-400/60",
    accent: "bg-[#B6E36A]",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
