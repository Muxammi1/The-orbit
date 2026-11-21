import { cn } from "@/lib/cn";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  language?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div className="relative my-6 rounded-sm border border-[#252C35] bg-[#0E1117] overflow-x-auto">
      <pre
        className={cn(
          "p-4 font-mono text-xs sm:text-sm text-[#D9DEE5] leading-relaxed",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
