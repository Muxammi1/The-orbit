import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/content/schemas";

export interface CaseStudyNavigationProps {
  prevProject: ProjectSummary | null;
  nextProject: ProjectSummary | null;
}

export function CaseStudyNavigation({
  prevProject,
  nextProject,
}: CaseStudyNavigationProps) {
  return (
    <nav
      aria-label="Previous and next case studies"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 border-t border-[#252C35]"
    >
      {prevProject ? (
        <Link
          href={`/work/${prevProject.slug}`}
          className="group p-5 rounded-sm bg-[#171B22] border border-[#252C35] hover:border-[#8C96A3] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C96A3] mb-1">
            <ArrowLeft className="h-3.5 w-3.5 text-[#B6E36A] group-hover:-translate-x-1 transition-transform" />
            <span>PREVIOUS PROJECT</span>
          </div>
          <h5 className="font-sans text-base font-medium text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors">
            {prevProject.title}
          </h5>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextProject && (
        <Link
          href={`/work/${nextProject.slug}`}
          className="group p-5 rounded-sm bg-[#171B22] border border-[#252C35] hover:border-[#8C96A3] transition-colors text-right ml-auto w-full"
        >
          <div className="flex items-center justify-end gap-2 text-xs font-mono text-[#8C96A3] mb-1">
            <span>NEXT PROJECT</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#B6E36A] group-hover:translate-x-1 transition-transform" />
          </div>
          <h5 className="font-sans text-base font-medium text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors">
            {nextProject.title}
          </h5>
        </Link>
      )}
    </nav>
  );
}
