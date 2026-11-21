"use client";

import { Chip } from "@/components/ui/Chip";
import type { StackContent, StackNode } from "@/lib/content/schemas";

interface StackListViewProps {
  stack: StackContent;
  selectedNodeId: string | null;
  onSelectNode: (node: StackNode) => void;
}

export function StackListView({
  stack,
  selectedNodeId,
  onSelectNode,
}: StackListViewProps) {
  return (
    <div className="space-y-10">
      {stack.clusters.map((cluster) => {
        const nodesInCluster = stack.nodes.filter(
          (node) => node.cluster === cluster.id
        );

        return (
          <div key={cluster.id} className="space-y-3">
            <div className="flex items-center gap-3 border-b border-[#252C35] pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6E36A]" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D9DEE5]">
                {cluster.label}
              </h3>
              <span className="text-[11px] font-mono text-[#8C96A3]/60">
                ({nodesInCluster.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {nodesInCluster.map((node) => {
                const isSelected = selectedNodeId === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => onSelectNode(node)}
                    className={[
                      "text-left p-4 rounded-sm border transition-all duration-200",
                      "flex flex-col justify-between gap-3",
                      isSelected
                        ? "border-[#B6E36A] bg-[#171B22]"
                        : "border-[#252C35] bg-[#0E1117]/60 hover:border-[#8C96A3]/40 hover:bg-[#171B22]/40",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <span className="font-mono text-sm text-[#D9DEE5] font-medium">
                        {node.label}
                      </span>
                      <Chip
                        size="sm"
                        dot
                        variant={
                          node.status === "verified"
                            ? "verified"
                            : node.status === "planned"
                            ? "planned"
                            : "placeholder"
                        }
                      >
                        {node.status}
                      </Chip>
                    </div>
                    <p className="text-xs text-[#8C96A3] line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
