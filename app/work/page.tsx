import Link from "next/link";
import { getWorkContent } from "@/lib/content/loaders";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DisciplineList } from "@/components/work/DisciplineList";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Engineering Work & Architectures",
  description:
    "Production-grade intelligent systems, edge telemetry, and computer vision architectures by Muzammil Yasir.",
};

export default function WorkIndexPage() {
  const work = getWorkContent();

  return (
    <main className="shell pt-32 pb-40 space-y-16">
      <div>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Orbit Overview</span>
        </Link>
        <SectionHeader
          ringNumber="RING 03 / WORK ARCHIVE"
          title="Engineered Systems & Case Studies"
          serifWord="Engineered"
          subtitle="Complete archive of applied intelligence architectures, distributed edge systems, and computer vision pipelines."
        />
      </div>

      <DisciplineList
        disciplines={work.disciplines}
        projects={work.projects}
      />
    </main>
  );
}
