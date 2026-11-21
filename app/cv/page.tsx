import Link from "next/link";
import type { Metadata } from "next";
import {
  getSiteContent,
  getPersonContent,
  getTimelineContent,
  getWorkContent,
  getStackContent,
  getResearchContent,
} from "@/lib/content/loaders";
import { PrintActions } from "@/components/cv/PrintActions";
import { ArrowLeft, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Curriculum Vitae — Muzammil Yasir",
  description:
    "Structured, fast-loading, print-friendly CV of Muzammil Yasir (AI Engineer / Researcher / Systems Thinker).",
  robots: {
    index: true,
    follow: true,
  },
};

export default function CvPage() {
  const site = getSiteContent();
  const person = getPersonContent();
  const timeline = getTimelineContent();
  const work = getWorkContent();
  const stack = getStackContent();
  const research = getResearchContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: site.name,
      jobTitle: site.roleLine,
      description: site.tagline,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#08090C] text-[#D9DEE5] print:bg-white print:text-black">
        <main className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-16 print:py-8 print:px-4 print:space-y-8">
          {/* Top navigation — hidden in print */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#252C35] print:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Interactive Portfolio</span>
            </Link>

            <PrintActions cvFilePath={site.cvFilePath} />
          </div>

          {/* Header */}
          <header className="space-y-4 border-b border-[#252C35] pb-8 print:border-black/20">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-3xl sm:text-4xl font-sans font-normal tracking-tight text-[#D9DEE5] print:text-black">
                {site.name}
              </h1>
              <span className="font-mono text-xs text-[#B6E36A] print:text-black font-medium">
                {site.roleLine}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#8C96A3] print:text-neutral-700 max-w-2xl leading-relaxed">
              {site.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8C96A3] print:text-neutral-600 pt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#B6E36A] print:text-black" />
                <span>{site.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#B6E36A] print:text-black" />
                <span>{site.email}</span>
              </div>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B6E36A] transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B6E36A] transition-colors"
              >
                GitHub ↗
              </a>
            </div>
          </header>

          {/* Executive Summary */}
          <section className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#B6E36A] print:text-black">
              EXECUTIVE PROFILE
            </h2>
            <p className="text-sm text-[#D9DEE5] print:text-neutral-800 leading-relaxed font-light">
              {person.statement}
            </p>
          </section>

          {/* Experience & Timeline */}
          <section className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#B6E36A] print:text-black border-b border-[#252C35] print:border-black/20 pb-2">
              EXPERIENCE &amp; MILESTONES
            </h2>

            <div className="space-y-8">
              {timeline.milestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base font-medium text-[#D9DEE5] print:text-black">
                      {milestone.title}
                    </h3>
                    <span className="text-xs font-mono text-[#8C96A3] print:text-neutral-600">
                      {milestone.date}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#8C96A3] print:text-neutral-600">
                    {milestone.organization} — {milestone.role}
                  </div>

                  {milestone.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-[#8C96A3] print:text-neutral-700 space-y-1 pt-1">
                      {milestone.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Selected Systems & Case Studies */}
          <section className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#B6E36A] print:text-black border-b border-[#252C35] print:border-black/20 pb-2">
              SELECTED SYSTEMS ARCHITECTURES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {work.projects.map((project) => (
                <div
                  key={project.slug}
                  className="p-4 rounded-sm border border-[#252C35] bg-[#0E1117] print:bg-white print:border-black/20 space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium text-[#D9DEE5] print:text-black">
                      {project.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#8C96A3] uppercase">
                      {project.discipline.replace("-", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-[#8C96A3] print:text-neutral-700 leading-relaxed">
                    {project.tagline}
                  </p>

                  <div className="pt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171B22] print:bg-neutral-100 border border-[#252C35] print:border-neutral-300 text-[#8C96A3] print:text-neutral-700">
                      Case Study: /work/{project.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Stack */}
          <section className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#B6E36A] print:text-black border-b border-[#252C35] print:border-black/20 pb-2">
              CORE SYSTEM CLUSTERS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stack.clusters.map((cluster) => {
                const nodes = stack.nodes.filter((n) => n.cluster === cluster.id);
                return (
                  <div key={cluster.id} className="space-y-1.5">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#D9DEE5] print:text-black">
                      {cluster.label}
                    </h3>
                    <p className="text-xs text-[#8C96A3] print:text-neutral-700 leading-relaxed">
                      {nodes.map((n) => n.label).join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Research Inquiries */}
          <section className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#B6E36A] print:text-black border-b border-[#252C35] print:border-black/20 pb-2">
              RESEARCH INQUIRIES &amp; FOCUS
            </h2>

            <div className="space-y-4">
              {research.entries.map((entry) => (
                <div key={entry.slug} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium text-[#D9DEE5] print:text-black">
                      {entry.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#B6E36A] print:text-black uppercase">
                      [{entry.status}]
                    </span>
                  </div>
                  <p className="text-xs text-[#8C96A3] print:text-neutral-700 leading-relaxed">
                    {entry.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
