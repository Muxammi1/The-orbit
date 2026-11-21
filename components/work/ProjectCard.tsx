import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ArrowUpRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/content/schemas";

export interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isPlanned = project.status === "planned";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block p-5 rounded-sm bg-[#0E1117] border border-[#252C35] hover:border-[#8C96A3] transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <MonoLabel className="text-[10px]">
          {project.discipline.replace("-", " ")}
        </MonoLabel>
        <Chip
          variant={isPlanned ? "planned" : project.status === "placeholder" ? "placeholder" : "verified"}
          size="sm"
          dot
        >
          {isPlanned ? "Planned" : project.status === "placeholder" ? "Draft" : "Verified"}
        </Chip>
      </div>

      <h4 className="text-lg font-sans font-medium text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors flex items-center justify-between">
        <span>{project.title}</span>
        <ArrowUpRight className="h-4 w-4 text-[#8C96A3] group-hover:text-[#B6E36A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </h4>

      <p className="text-sm text-[#8C96A3] mt-2 line-clamp-2 leading-relaxed">
        {project.tagline}
      </p>

      <div className="mt-4 pt-3 border-t border-[#252C35]/60 flex items-center justify-between text-[11px] font-mono text-[#8C96A3]">
        <span>Read Case Study</span>
        <span className="text-[#B6E36A] group-hover:underline">Explore →</span>
      </div>
    </Link>
  );
}
