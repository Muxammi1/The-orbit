"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { StackListView } from "./StackListView";
import { NodeDetail } from "./NodeDetail";
import type { StackContent, StackNode } from "@/lib/content/schemas";

interface StackSectionProps {
  stack: StackContent;
}

export function StackSection({ stack }: StackSectionProps) {
  const [selectedNode, setSelectedNode] = useState<StackNode | null>(
    stack.nodes[0] ?? null
  );

  const clusterLabel = stack.clusters.find(
    (c) => c.id === selectedNode?.cluster
  )?.label;

  return (
    <section
      id="stack"
      data-ring="05"
      className="scroll-mt-24 min-h-screen py-24 space-y-12"
      aria-labelledby="stack-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#252C35]/50 pb-8">
        <SectionHeader
          ringNumber="RING 05 / STACK"
          title="Constellation of Systems"
          serifWord="Systems"
          subtitle="A functional topology of computational frameworks, machine intelligence models, and embedded protocols. No fabricated proficiency metrics."
          id="stack-heading"
        />

        <div className="flex items-center gap-3">
          <MonoLabel className="text-[#8C96A3]">PERSISTENT 3D ACTIVE</MonoLabel>
          <span className="w-2 h-2 rounded-full bg-[#B6E36A] animate-pulse" />
        </div>
      </div>

      {/* Selected Node Inspector */}
      {selectedNode && (
        <NodeDetail
          node={selectedNode}
          clusterLabel={clusterLabel}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Accessible List View Grouped by Clusters */}
      <StackListView
        stack={stack}
        selectedNodeId={selectedNode?.id ?? null}
        onSelectNode={setSelectedNode}
      />
    </section>
  );
}
