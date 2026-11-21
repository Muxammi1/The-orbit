import Link from "next/link";
import type { Metadata } from "next";
import { getResearchContent } from "@/lib/content/loaders";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Chip } from "@/components/ui/Chip";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Research & Inquiries — Muzammil Yasir",
  description:
    "Theoretical investigations, ongoing experiments, and inquiries at the physical and architectural boundary of machine intelligence.",
};

export default function ResearchPage() {
  const research = getResearchContent();

  return (
    <main className="shell pt-28 sm:pt-36 pb-32 space-y-16">
      {/* Back Link */}
      <Link
        href="/#research"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Research Section</span>
      </Link>

      {/* Header */}
      <header className="space-y-4 max-w-3xl pb-8 border-b border-[#252C35]">
        <MonoLabel accent>RING 06 / RESEARCH ARCHIVE</MonoLabel>
        <h1 className="text-4xl sm:text-5xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.1]">
          Research &amp; Inquiries
        </h1>
        <p className="text-lg text-[#8C96A3] leading-relaxed">
          All active and exploratory research tracks. Every inquiry reflects genuine technical questions in low-power perception, agentic verification, and autonomous sensor networks.
        </p>
      </header>

      {/* Research Statement */}
      <section className="border border-[#252C35] rounded-sm p-6 sm:p-8 bg-[#0E1117]/60 space-y-4">
        <MonoLabel accent>FORMAL RESEARCH STATEMENT</MonoLabel>
        <p className="text-base text-[#D9DEE5] leading-relaxed font-light">
          {research.statement}
        </p>
      </section>

      {/* Entries List */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#8C96A3]">
          ACTIVE INQUIRIES ({research.entries.length})
        </h2>

        <div className="space-y-4">
          {research.entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/research/${entry.slug}`}
              className="group block p-6 rounded-sm border border-[#252C35] bg-[#0E1117]/40 hover:border-[#B6E36A]/50 hover:bg-[#171B22]/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8C96A3] uppercase">
                      {entry.area}
                    </span>
                    <span className="text-[#252C35]">•</span>
                    <span className="text-xs font-mono text-[#8C96A3]/60 uppercase">
                      {entry.group}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-[#D9DEE5] group-hover:text-[#B6E36A] transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-[#8C96A3] line-clamp-2 max-w-2xl">
                    {entry.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
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
                  <ArrowUpRight className="h-4 w-4 text-[#8C96A3] group-hover:text-[#B6E36A] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
