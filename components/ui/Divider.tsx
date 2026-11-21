import { cn } from "@/lib/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  ringNumber?: string;
}

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn("w-full border-t border-[#252C35]/40 my-16 sm:my-24", className)}
      {...props}
    />
  );
}
