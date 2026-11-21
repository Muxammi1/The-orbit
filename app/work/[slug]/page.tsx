import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getCaseStudy,
  getAllCaseStudies,
  getWorkContent,
} from "@/lib/content/loaders";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { TableOfContents } from "@/components/work/TableOfContents";
import { CaseStudyNavigation } from "@/components/work/CaseStudyNavigation";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ArrowLeft, GitFork, ExternalLink, Calendar, Cpu } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((cs) => ({
    slug: cs.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${caseStudy.frontmatter.title} — Technical Case Study`,
    description: caseStudy.frontmatter.tagline,
    openGraph: {
      title: `${caseStudy.frontmatter.title} — ORBIT Case Study`,
      description: caseStudy.frontmatter.tagline,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const work = getWorkContent();
  const currentIndex = work.projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? (work.projects[currentIndex - 1] ?? null) : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < work.projects.length - 1
      ? (work.projects[currentIndex + 1] ?? null)
      : null;

  const { frontmatter, content } = caseStudy;

  // Canonical case study sections for the table of contents
  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "objectives", label: "Objectives" },
    { id: "architecture", label: "Architecture" },
    { id: "tech-stack", label: "Tech Stack" },
    { id: "engineering-decisions", label: "Engineering Decisions" },
    { id: "implementation", label: "Implementation" },
    { id: "results", label: "Results" },
    { id: "limitations", label: "Limitations" },
    { id: "future-improvements", label: "Future Improvements" },
    { id: "links", label: "Links" },
  ];

  // JSON-LD structured data for Technical Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.tagline,
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: "Muzammil Yasir",
      jobTitle: "AI Engineer & Systems Thinker",
    },
    keywords: frontmatter.techStack.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="shell pt-28 sm:pt-36 pb-32">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Work Section</span>
        </Link>

        {/* Case Study Header Banner */}
        <header className="space-y-6 pb-12 border-b border-[#252C35]">
          <div className="flex flex-wrap items-center gap-3">
            <MonoLabel accent className="text-xs">
              RING 03 / CASE STUDY
            </MonoLabel>
            <span className="text-[#252C35]">•</span>
            <span className="font-mono text-xs text-[#8C96A3] uppercase">
              {frontmatter.discipline.replace("-", " ")}
            </span>
            <span className="text-[#252C35]">•</span>
            <Chip
              variant={frontmatter.status === "placeholder" ? "placeholder" : "verified"}
              size="sm"
              dot
            >
              {frontmatter.status === "placeholder" ? "Draft Case Study" : "Verified System"}
            </Chip>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.1]">
            {frontmatter.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#8C96A3] max-w-3xl leading-relaxed">
            {frontmatter.tagline}
          </p>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-[#8C96A3]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#B6E36A]" />
              <span>Timeline: {frontmatter.date}</span>
            </div>
            {frontmatter.repoUrl && (
              <a
                href={frontmatter.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#B6E36A] hover:underline"
              >
                <GitFork className="h-4 w-4" />
                <span>Source Repository</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Tech Stack Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <Cpu className="h-4 w-4 text-[#8C96A3] mr-1" />
            {frontmatter.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#171B22] border border-[#252C35] text-[#D9DEE5]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Content Layout with sticky mini-TOC */}
        <div className="flex items-start gap-12 pt-12">
          {/* Main MDX Content */}
          <article className="min-w-0 flex-1 max-w-3xl prose prose-invert prose-pre:bg-transparent prose-pre:p-0">
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          {/* Sticky Table of Contents on large viewports */}
          <TableOfContents items={tocItems} />
        </div>

        {/* Prev / Next Navigation */}
        <div className="max-w-3xl mt-16">
          <CaseStudyNavigation prevProject={prevProject} nextProject={nextProject} />
        </div>
      </main>
    </>
  );
}
