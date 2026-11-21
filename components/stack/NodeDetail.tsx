"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { StackNode } from "@/lib/content/schemas";

interface NodeDetailProps {
  node: StackNode | null;
  onClose: () => void;
  clusterLabel?: string;
}

export function NodeDetail({ node, onClose, clusterLabel }: NodeDetailProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-labelledby="node-detail-title"
      className="border border-[#252C35] rounded-sm p-6 bg-[#0E1117]/95 backdrop-blur-md relative space-y-4 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <MonoLabel className="text-[#8C96A3] text-[10px]">
            {clusterLabel ?? node.cluster.toUpperCase()}
          </MonoLabel>
          <h3
            id="node-detail-title"
            className="text-xl font-medium text-[#D9DEE5] mt-1"
          >
            {node.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
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
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C96A3] hover:text-[#D9DEE5] text-lg px-2 py-1 rounded-sm border border-transparent hover:border-[#252C35]"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
      </div>

      <p className="text-sm text-[#8C96A3] leading-relaxed">
        {node.description}
      </p>

      {node.usedIn.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#252C35]/50">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C96A3]">
            SYSTEM USAGE &amp; CASE STUDIES
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {node.usedIn.map((slug: string) => (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className="text-xs font-mono px-2.5 py-1 rounded-sm border border-[#252C35] text-[#D9DEE5] hover:border-[#B6E36A]/50 hover:text-[#B6E36A] transition-colors"
              >
                /work/{slug} ↗
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
