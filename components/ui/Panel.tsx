import { cn } from "@/lib/cn";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Panel({
  children,
  className,
  hoverEffect = false,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "bg-[#171B22] border border-[#252C35] rounded-sm p-6 sm:p-8 transition-colors duration-200",
        hoverEffect && "hover:border-[#8C96A3]/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
