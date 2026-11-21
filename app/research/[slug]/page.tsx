import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getResearchEntry,
  getAllResearchEntries,
} from "@/lib/content/loaders";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllResearchEntries();
  return entries.map((entry) => ({
    slug: entry.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getResearchEntry(slug);

  if (!entry) {
    return { title: "Research Entry Not Found" };
  }

  return {
    title: `${entry.frontmatter.title} — Research Inquiry`,
    description: entry.frontmatter.summary,
    openGraph: {
      title: `${entry.frontmatter.title} — ORBIT Research`,
      description: entry.frontmatter.summary,
      type: "article",
    },
  };
}

export default async function ResearchEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getResearchEntry(slug);

  if (!entry) {
    notFound();
  }

  const { frontmatter, content } = entry;

  // JSON-LD structured data for Scholarly Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: frontmatter.title,
    description: frontmatter.summary,
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: "Muzammil Yasir",
      jobTitle: "AI Engineer & Researcher",
    },
    about: frontmatter.area,
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
          href="/#research"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8C96A3] hover:text-[#B6E36A] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Research Section</span>
        </Link>

        {/* Header Banner */}
        <header className="space-y-6 pb-12 border-b border-[#252C35]">
          <div className="flex flex-wrap items-center gap-3">
            <MonoLabel accent className="text-xs">
              RING 06 / RESEARCH INQUIRY
            </MonoLabel>
            <span className="text-[#252C35]">•</span>
            <span className="font-mono text-xs text-[#8C96A3] uppercase">
              {frontmatter.group}
            </span>
            <span className="text-[#252C35]">•</span>
            <Chip
              variant={
                frontmatter.status === "Published"
                  ? "verified"
                  : frontmatter.status === "Presented"
                  ? "accent"
                  : frontmatter.status === "Ongoing"
                  ? "planned"
                  : "placeholder"
              }
              size="sm"
              dot
            >
              {frontmatter.status}
            </Chip>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.1]">
            {frontmatter.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#8C96A3] max-w-3xl leading-relaxed">
            {frontmatter.summary}
          </p>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-[#8C96A3]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#B6E36A]" />
              <span>Initiated: {frontmatter.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#B6E36A]" />
              <span>Domain: {frontmatter.area}</span>
            </div>
            {frontmatter.evidenceUrl && (
              <a
                href={frontmatter.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#B6E36A] hover:underline"
              >
                <span>Evidence / Pre-print</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </header>

        {/* Main MDX Content */}
        <div className="pt-12">
          <article className="min-w-0 max-w-3xl prose prose-invert prose-pre:bg-transparent prose-pre:p-0">
            <MDXRemote source={content} components={mdxComponents} />
          </article>
        </div>
      </main>
    </>
  );
}
