import { cn } from "@/lib/cn";

export interface CalloutProps {
  type?: "note" | "warning" | "info" | "disclosure";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = "note",
  title,
  children,
  className,
}: CalloutProps) {
  const borderColors = {
    note: "border-[#252C35] bg-[#171B22]/70",
    warning: "border-amber-500/40 bg-amber-500/5",
    info: "border-[#B6E36A]/40 bg-[#B6E36A]/5",
    disclosure: "border-[#8C96A3]/40 bg-[#0E1117]",
  };

  const titleColors = {
    note: "text-[#D9DEE5]",
    warning: "text-amber-400",
    info: "text-[#B6E36A]",
    disclosure: "text-[#D9DEE5]",
  };

  return (
    <div
      role="region"
      aria-label={title || `${type} callout`}
      className={cn(
        "my-6 border rounded-sm p-4 sm:p-5 text-sm leading-relaxed",
        borderColors[type],
        className
      )}
    >
      {title && (
        <div className={cn("font-mono text-xs uppercase tracking-wider font-semibold mb-2", titleColors[type])}>
          {title}
        </div>
      )}
      <div className="text-[#8C96A3] space-y-2 [&>p]:leading-relaxed">{children}</div>
    </div>
  );
}
