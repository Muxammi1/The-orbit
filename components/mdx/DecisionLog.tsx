import { cn } from "@/lib/cn";

export interface DecisionLogProps {
  decision: string;
  rationale: string;
  rejectedAlternative: string;
  rejectionReason: string;
  className?: string;
}

export function DecisionLog({
  decision,
  rationale,
  rejectedAlternative,
  rejectionReason,
  className,
}: DecisionLogProps) {
  return (
    <div
      className={cn(
        "my-6 border border-[#252C35] bg-[#171B22] rounded-sm p-5 space-y-4",
        className
      )}
    >
      <div className="border-b border-[#252C35] pb-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#B6E36A] font-medium">
          Architectural Decision
        </span>
        <h4 className="text-base font-sans font-medium text-[#D9DEE5] mt-1">{decision}</h4>
        <p className="text-sm text-[#8C96A3] mt-1 leading-relaxed">{rationale}</p>
      </div>
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#8C96A3] font-medium">
          Rejected Alternative
        </span>
        <h5 className="text-sm font-sans font-medium text-[#8C96A3] mt-1">{rejectedAlternative}</h5>
        <p className="text-xs text-[#8C96A3]/80 mt-1 leading-relaxed">{rejectionReason}</p>
      </div>
    </div>
  );
}
