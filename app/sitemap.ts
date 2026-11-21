import { MetadataRoute } from "next";
import { getAllCaseStudies, getAllResearchEntries, getSiteContent } from "@/lib/content/loaders";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteContent();
  const baseUrl = site.domain.startsWith("http")
    ? site.domain
    : `https://${site.domain}`;

  const staticRoutes = [
    "",
    "/work",
    "/research",
    "/cv",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const caseStudies = getAllCaseStudies().map((cs) => ({
    url: `${baseUrl}/work/${cs.frontmatter.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const researchEntries = getAllResearchEntries().map((entry) => ({
    url: `${baseUrl}/research/${entry.frontmatter.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudies, ...researchEntries];
}
