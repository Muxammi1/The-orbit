"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StackListView } from "./StackListView";
import { NodeDetail } from "./NodeDetail";
import { Stage } from "@/components/stage/Stage";
import { ConstellationScene } from "@/scenes/constellation/ConstellationScene";
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

  const handleSelectById = (nodeId: string) => {
    const node = stack.nodes.find((n) => n.id === nodeId);
    if (node) setSelectedNode(node);
  };

  return (
    <section
      id="stack"
      data-ring="05"
      className="scroll-mt-24 min-h-screen py-20 space-y-10"
      aria-labelledby="stack-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#252C35]/50 pb-8">
        <SectionHeader
          ringNumber="THE STACK"
          title="Neural Ecosystem"
          subtitle="An interactive 3D relational topology of computational frameworks, machine intelligence models, and embedded protocols."
          id="stack-heading"
        />

        <div className="flex items-center gap-3 font-mono text-[11px] text-[#8C96A3] bg-[#171B22] px-3 py-1.5 rounded-full border border-[#252C35]">
          <span className="w-2 h-2 rounded-full bg-[#B6E36A] animate-pulse" />
          <span>3D RELATIONAL NETWORK ACTIVE</span>
        </div>
      </div>

      {/* Main Experience: 3D Constellation Stage + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: 3D Interactive Topology Viewport */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-[#252C35] rounded-sm bg-[#0E1117]/80 overflow-hidden shadow-2xl relative min-h-[460px] lg:min-h-[580px]">
          {/* Top Status Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#252C35] bg-[#08090C]/60 z-10 font-mono text-[10px] text-[#8C96A3]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6E36A]" />
              <span className="text-[#D9DEE5] font-medium">
                INTERACTIVE CONSTELLATION GRAPH
              </span>
            </div>
            <span>CLICK NODE TO INSPECT • ROTATE VIA DRAG</span>
          </div>

          {/* 3D Scene */}
          <div className="relative flex-1 w-full h-full min-h-[380px]">
            <Stage
              camera={{ position: [0, 0, 7.5], fov: 38 }}
              className="w-full h-full"
            >
              <ConstellationScene
                selectedNodeId={selectedNode?.id}
                onSelectNode={handleSelectById}
              />
            </Stage>
          </div>

          {/* Bottom Telemetry */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#252C35] bg-[#08090C]/80 font-mono text-[10px] text-[#8C96A3] z-10">
            <span>NODES: {stack.nodes.length}</span>
            <span>CLUSTERS: {stack.clusters.length}</span>
            <span>PROJECTION: SPHERICAL TOPOLOGY</span>
          </div>
        </div>

        {/* Right: Selected Node Detail Inspector */}
        <div className="lg:col-span-5 flex flex-col">
          {selectedNode ? (
            <NodeDetail
              node={selectedNode}
              clusterLabel={clusterLabel}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-[#252C35] rounded-sm bg-[#0E1117]/60 p-8 text-center text-[#8C96A3] font-mono text-xs">
              <span className="text-[#B6E36A] mb-2">[ SELECT A NODE ]</span>
              <p>Click any node in the 3D topology or choose from the list below to inspect its architecture, connections, and evidence.</p>
            </div>
          )}
        </div>
      </div>

      {/* Accessible List View Grouped by Clusters */}
      <StackListView
        stack={stack}
        selectedNodeId={selectedNode?.id ?? null}
        onSelectNode={setSelectedNode}
      />
    </section>
  );
}
