"use client";

import { useState, useEffect } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { Milestone } from "@/lib/content/schemas";

export interface OrbitalTimelineProps {
  milestones: Milestone[];
}

export function OrbitalTimeline({ milestones }: OrbitalTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedMilestone) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMilestone(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMilestone]);

  const getCategoryIcon = (cat: Milestone["category"]) => {
    switch (cat) {
      case "academic":
        return <GraduationCap className="h-4 w-4 text-[#8C96A3]" />;
      case "professional":
        return <Briefcase className="h-4 w-4 text-[#B6E36A]" />;
      case "research":
        return <Sparkles className="h-4 w-4 text-[#B58A68]" />;
      default:
        return <Briefcase className="h-4 w-4 text-[#8C96A3]" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <MonoLabel accent>ORBITAL TRAJECTORY</MonoLabel>
          <h4 className="text-xl sm:text-2xl font-sans font-medium text-[#D9DEE5] mt-1">
            Academic, Professional & Research Milestones
          </h4>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#8C96A3]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#B6E36A]" />
            <span>Completed / Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-dashed border-[#8C96A3]" />
            <span>Planned</span>
          </div>
        </div>
      </div>

      {/* Horizontal milestone scroll strip */}
      <div className="relative py-8 overflow-x-auto">
        {/* Continuous orbital connecting track */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-[#252C35] z-0" />

        <div className="relative z-10 flex items-center gap-6 min-w-max px-2">
          {milestones.map((milestone) => {
            const isPlanned = milestone.status === "planned";
            const isSelected = selectedMilestone?.id === milestone.id;

            return (
              <button
                key={milestone.id}
                type="button"
                onClick={() => setSelectedMilestone(milestone)}
                className={cn(
                  "group flex flex-col items-start p-4 rounded-sm transition-all duration-200 cursor-pointer text-left w-64 sm:w-72 bg-[#171B22] border",
                  isPlanned ? "border-dashed border-[#252C35]" : "border-[#252C35]",
                  isSelected
                    ? "border-[#B6E36A] ring-1 ring-[#B6E36A]"
                    : "hover:border-[#8C96A3]"
                )}
                aria-haspopup="dialog"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#0E1117] border border-[#252C35]">
                      {getCategoryIcon(milestone.category)}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C96A3]">
                      {milestone.category}
                    </span>
                  </div>

                  {isPlanned ? (
                    <Chip variant="planned" size="sm">
                      Planned
                    </Chip>
                  ) : (
                    <Chip variant={milestone.status === "placeholder" ? "placeholder" : "verified"} size="sm" dot>
                      {milestone.status === "placeholder" ? "Draft" : "Active"}
                    </Chip>
                  )}
                </div>

                <h5 className="font-sans text-sm font-medium text-[#D9DEE5] line-clamp-1 group-hover:text-[#B6E36A] transition-colors">
                  {milestone.title}
                </h5>

                <p className="font-mono text-[11px] text-[#8C96A3] mt-1 line-clamp-1">
                  {milestone.organization}
                </p>

                <div className="mt-3 pt-2 border-t border-[#252C35] w-full flex items-center justify-between text-[11px] font-mono text-[#8C96A3]">
                  <span>{milestone.date}</span>
                  <span className="text-[#B6E36A] text-[10px] font-medium group-hover:underline">
                    Inspect →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-milestone-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090C]/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMilestone(null);
          }}
        >
          <div className="w-full max-w-lg bg-[#0E1117] border border-[#252C35] rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-5 right-5 p-1 rounded text-[#8C96A3] hover:text-[#D9DEE5] transition-colors"
              aria-label="Close milestone detail panel"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#B6E36A]">
                  {selectedMilestone.category} Milestone
                </span>
                {selectedMilestone.status === "planned" && (
                  <Chip variant="planned" size="sm">
                    Planned
                  </Chip>
                )}
              </div>
              <h4 id="modal-milestone-title" className="text-xl font-sans font-medium text-[#D9DEE5]">
                {selectedMilestone.title}
              </h4>
              <p className="text-sm font-mono text-[#8C96A3]">
                {selectedMilestone.role} • {selectedMilestone.organization}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#8C96A3] pt-1">
                <Calendar className="h-3.5 w-3.5 text-[#B6E36A]" />
                <span>{selectedMilestone.date}</span>
              </div>
            </div>

            {/* Responsibilities */}
            {selectedMilestone.responsibilities.length > 0 && (
              <div className="space-y-2 border-t border-[#252C35] pt-4">
                <MonoLabel>CORE RESPONSIBILITIES</MonoLabel>
                <ul className="space-y-1.5 text-xs text-[#8C96A3] list-disc list-inside">
                  {selectedMilestone.responsibilities.map((r: string, i: number) => (
                    <li key={i} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contributions */}
            {selectedMilestone.contributions.length > 0 && (
              <div className="space-y-2 border-t border-[#252C35] pt-4">
                <MonoLabel>KEY DELIVERABLES & CONTRIBUTIONS</MonoLabel>
                <ul className="space-y-1.5 text-xs text-[#D9DEE5] list-disc list-inside">
                  {selectedMilestone.contributions.map((c: string, i: number) => (
                    <li key={i} className="leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evidence Link */}
            {selectedMilestone.evidenceUrl && (
              <div className="border-t border-[#252C35] pt-4 flex items-center justify-between">
                <a
                  href={selectedMilestone.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B6E36A] hover:underline"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>View Verified Evidence</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
