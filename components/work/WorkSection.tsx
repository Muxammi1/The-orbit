import { SectionHeader } from "@/components/ui/SectionHeader";
import { DisciplineList } from "./DisciplineList";
import type { WorkContent } from "@/lib/content/schemas";

export interface WorkSectionProps {
  work: WorkContent;
}

export function WorkSection({ work }: WorkSectionProps) {
  return (
    <section
      id="work"
      data-ring="03"
      aria-label="Section 03: Work"
      className="space-y-12 scroll-mt-24"
    >
      <SectionHeader
        ringNumber="THE ARCHIVES"
        title="Architectures of Applied Intelligence"
        subtitle="Four technical disciplines spanning agentic retrieval, computer vision, predictive classification, and distributed edge telemetry. Click any row to expand archived case studies."
      />

      <DisciplineList
        disciplines={work.disciplines}
        projects={work.projects}
      />
    </section>
  );
}
