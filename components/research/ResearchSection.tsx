import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRight } from "lucide-react";
import type { ResearchContent } from "@/lib/content/schemas";

interface ResearchSectionProps {
  research: ResearchContent;
}

export function ResearchSection({ research }: ResearchSectionProps) {
  // Group entries by group field
  const groupedEntries: Record<string, typeof research.entries> = {};
  research.entries.forEach((entry) => {
    if (!groupedEntries[entry.group]) {
      groupedEntries[entry.group] = [];
    }
    groupedEntries[entry.group]?.push(entry);
  });

  return (
    <section
      id="research"
      data-ring="06"
      className="scroll-mt-24 min-h-screen py-24 space-y-16"
      aria-labelledby="research-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#252C35]/50 pb-8">
        <SectionHeader
          ringNumber="THE LABORATORY"
          title="Inquiries at the Physical Boundary"
          subtitle="Theoretical investigations, active experiments, and research statements. Strict veracity: no fabricated publications or premature claims."
          id="research-heading"
        />

        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] transition-colors"
        >
          <span>All Inquiries</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Research Statement Panel */}
      <div className="border border-[#252C35] rounded-sm p-6 sm:p-8 bg-[#0E1117]/60 space-y-4">
        <div className="flex items-center gap-2">
          <MonoLabel accent>RESEARCH STATEMENT</MonoLabel>
          <span className="text-xs text-[#8C96A3]/60">•</span>
          <span className="text-xs font-mono text-[#8C96A3]">PERSPECTIVE &amp; MOTIVATION</span>
        </div>
        <p className="text-sm sm:text-base text-[#D9DEE5] leading-relaxed max-w-3xl font-light">
          {research.statement}
        </p>

        {/* Research Areas */}
        <div className="pt-4 border-t border-[#252C35]/40 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-mono text-[#8C96A3] uppercase mr-2">
            CORE INQUIRY DOMAINS:
          </span>
          {research.areas.map((area) => (
            <span
              key={area}
              className="text-xs font-mono px-2.5 py-1 rounded bg-[#171B22] border border-[#252C35] text-[#D9DEE5]"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Grouped Entries */}
      <div className="space-y-10">
        {Object.entries(groupedEntries).map(([groupTitle, entries]) => (
          <div key={groupTitle} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#252C35] pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6E36A]" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D9DEE5]">
                {groupTitle}
              </h3>
              <span className="text-[11px] font-mono text-[#8C96A3]/60">
                ({entries.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/research/${entry.slug}`}
                  className={[
                    "group block p-6 rounded-sm border border-[#252C35] bg-[#0E1117]/60",
                    "hover:border-[#B6E36A]/50 hover:bg-[#171B22]/60 transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6E36A]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-mono text-[#8C96A3] uppercase">
                      {entry.area}
                    </span>
                    <Chip
                      size="sm"
                      dot
                      variant={
                        entry.status === "Published"
                          ? "verified"
                          : entry.status === "Presented"
                          ? "accent"
                          : entry.status === "Ongoing"
                          ? "planned"
                          : "placeholder"
                      }
                    >
                      {entry.status}
                    </Chip>
                  </div>

                  <h4 className="text-lg font-medium text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors leading-snug">
                    {entry.title}
                  </h4>

                  <p className="text-xs text-[#8C96A3] mt-2 line-clamp-2 leading-relaxed">
                    {entry.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#252C35]/40 flex items-center justify-between text-xs font-mono text-[#8C96A3]">
                    <span>Read Investigation Document</span>
                    <span className="text-[#B6E36A] group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
