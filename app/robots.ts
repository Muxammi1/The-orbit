import { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/loaders";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteContent();
  const baseUrl = site.domain.startsWith("http")
    ? site.domain
    : `https://${site.domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dev-styleguide", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
