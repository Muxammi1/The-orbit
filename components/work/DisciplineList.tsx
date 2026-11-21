"use client";

import { useState } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Chip } from "@/components/ui/Chip";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/cn";
import { ChevronDown, ChevronUp, FolderCode } from "lucide-react";
import type { Discipline, ProjectSummary } from "@/lib/content/schemas";

export interface DisciplineListProps {
  disciplines: Discipline[];
  projects: ProjectSummary[];
}

export function DisciplineList({ disciplines, projects }: DisciplineListProps) {
  // Allow expanding/collapsing individual discipline rows
  const [expandedId, setExpandedId] = useState<string | null>(
    disciplines[0]?.id ?? null
  );

  const toggleDiscipline = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-4">
      {disciplines.map((discipline) => {
        const isExpanded = expandedId === discipline.id;
        const disciplineProjects = projects.filter(
          (p) => discipline.projects.includes(p.slug) || p.discipline === discipline.id
        );

        return (
          <div
            key={discipline.id}
            className={cn(
              "border rounded-sm transition-all duration-300 overflow-hidden bg-[#171B22]",
              isExpanded
                ? "border-[#8C96A3]/60 bg-[#171B22]"
                : "border-[#252C35] hover:border-[#8C96A3]/40"
            )}
          >
            {/* Header row: Not a card grid, but an expansive editorial list row */}
            <button
              type="button"
              onClick={() => toggleDiscipline(discipline.id)}
              className="w-full p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B6E36A]"
              aria-expanded={isExpanded}
            >
              {/* Left: Index + Title */}
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-mono text-3xl sm:text-4xl font-light text-[#B6E36A]">
                  {discipline.index}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-sans text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-[#D9DEE5]">
                      {discipline.title}
                    </h3>
                    <Chip variant="default" size="sm">
                      {disciplineProjects.length} {disciplineProjects.length === 1 ? "Project" : "Projects"}
                    </Chip>
                  </div>
                  <p className="text-sm text-[#8C96A3] max-w-xl">
                    {discipline.summary}
                  </p>
                </div>
              </div>

              {/* Right: Topics pills + toggle indicator */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="hidden lg:flex flex-wrap gap-1.5 max-w-xs justify-end">
                  {discipline.topics.slice(0, 3).map((topic: string, i: number) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] text-[#8C96A3] px-2 py-0.5 rounded bg-[#0E1117] border border-[#252C35]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="p-2 rounded-full bg-[#0E1117] border border-[#252C35] text-[#8C96A3]">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#B6E36A]" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </button>

            {/* Expandable Project Drawer */}
            {isExpanded && (
              <div className="p-6 sm:p-8 pt-0 border-t border-[#252C35]/60 bg-[#0E1117]/50 animate-in fade-in duration-200">
                <div className="pt-6 pb-2 flex items-center justify-between">
                  <MonoLabel accent className="text-xs">
                    ARCHIVED CASE STUDIES & IMPLEMENTATIONS
                  </MonoLabel>
                </div>

                {disciplineProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {disciplineProjects.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border border-dashed border-[#252C35] rounded-sm p-6 text-sm text-[#8C96A3]">
                    <FolderCode className="h-6 w-6 text-[#8C96A3] mx-auto mb-2" />
                    <p>Projects under verification for this discipline will be published shortly.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
