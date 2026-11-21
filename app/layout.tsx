import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavigationShell } from "@/components/navigation/NavigationShell";
import { SkipLink } from "@/components/ui/SkipLink";
import {
  getNavigationContent,
  getAllCaseStudies,
  getAllResearchEntries,
} from "@/lib/content/loaders";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ORBIT — Muzammil Yasir | AI Engineer & Systems Thinker",
    template: "%s | ORBIT",
  },
  description:
    "An Exploration of Intelligence. Personal portfolio, research systems, and architectural work of Muzammil Yasir.",
  metadataBase: new URL("https://orbit.local"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ORBIT — Muzammil Yasir",
    description: "An Exploration of Intelligence.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = getNavigationContent();
  const caseStudies = getAllCaseStudies().map((cs) => ({
    slug: cs.frontmatter.slug,
    title: cs.frontmatter.title,
    discipline: cs.frontmatter.discipline,
  }));
  const researchEntries = getAllResearchEntries().map((re) => ({
    slug: re.frontmatter.slug,
    title: re.frontmatter.title,
    area: re.frontmatter.area,
  }));

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable} dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-screen bg-[#08090C] text-[#D9DEE5] font-sans antialiased selection:bg-[#B6E36A] selection:text-[#08090C]">
        <SkipLink />
        <NavigationShell
          items={navigation.items}
          caseStudies={caseStudies}
          researchEntries={researchEntries}
        />
        {children}
      </body>
    </html>
  );
}
