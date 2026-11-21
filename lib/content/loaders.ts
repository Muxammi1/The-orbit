import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  siteSchema,
  navigationSchema,
  heroSchema,
  personSchema,
  timelineSchema,
  workSchema,
  caseStudyFrontmatterSchema,
  stackSchema,
  researchSchema,
  researchEntryFrontmatterSchema,
  connectSchema,
  mediaSchema,
  suggestedQuestionsSchema,
  fallbackAnswersSchema,
  type SiteContent,
  type NavigationContent,
  type HeroContent,
  type PersonContent,
  type TimelineContent,
  type WorkContent,
  type CaseStudyFrontmatter,
  type StackContent,
  type ResearchContent,
  type ResearchEntryFrontmatter,
  type ConnectContent,
  type MediaContent,
  type SuggestedQuestionsContent,
  type FallbackAnswersContent,
} from "./schemas";

const contentDir = path.resolve(process.cwd(), "content");

function readJsonFile<T>(relativePath: string): T {
  const fullPath = path.join(contentDir, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getSiteContent(): SiteContent {
  const data = readJsonFile("site.json");
  return siteSchema.parse(data);
}

export function getNavigationContent(): NavigationContent {
  const data = readJsonFile("navigation.json");
  return navigationSchema.parse(data);
}

export function getHeroContent(): HeroContent {
  const data = readJsonFile("hero.json");
  return heroSchema.parse(data);
}

export function getPersonContent(): PersonContent {
  const data = readJsonFile("person.json");
  return personSchema.parse(data);
}

export function getTimelineContent(): TimelineContent {
  const data = readJsonFile("timeline.json");
  return timelineSchema.parse(data);
}

export function getWorkContent(): WorkContent {
  const data = readJsonFile("work.json");
  return workSchema.parse(data);
}

export interface CaseStudyData {
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

export function getCaseStudy(slug: string): CaseStudyData | null {
  const filePath = path.join(contentDir, "work", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const frontmatter = caseStudyFrontmatterSchema.parse(parsed.data);
  return {
    frontmatter,
    content: parsed.content,
  };
}

export function getAllCaseStudies(): CaseStudyData[] {
  const dirPath = path.join(contentDir, "work");
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => getCaseStudy(file.replace(".mdx", "")))
    .filter((cs): cs is CaseStudyData => cs !== null);
}

export function getStackContent(): StackContent {
  const data = readJsonFile("stack.json");
  return stackSchema.parse(data);
}

export function getResearchContent(): ResearchContent {
  const data = readJsonFile("research.json");
  return researchSchema.parse(data);
}

export interface ResearchEntryData {
  frontmatter: ResearchEntryFrontmatter;
  content: string;
}

export function getResearchEntry(slug: string): ResearchEntryData | null {
  const filePath = path.join(contentDir, "research", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(fileContent);
  const frontmatter = researchEntryFrontmatterSchema.parse(parsed.data);
  return {
    frontmatter,
    content: parsed.content,
  };
}

export function getAllResearchEntries(): ResearchEntryData[] {
  const dirPath = path.join(contentDir, "research");
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => getResearchEntry(file.replace(".mdx", "")))
    .filter((entry): entry is ResearchEntryData => entry !== null);
}

export function getConnectContent(): ConnectContent {
  const data = readJsonFile("connect.json");
  return connectSchema.parse(data);
}

export function getMediaContent(): MediaContent {
  const data = readJsonFile("media.json");
  return mediaSchema.parse(data);
}

export function getTwinQuestions(): SuggestedQuestionsContent {
  const data = readJsonFile("twin/suggested-questions.json");
  return suggestedQuestionsSchema.parse(data);
}

export function getTwinFallbackAnswers(): FallbackAnswersContent {
  const data = readJsonFile("twin/fallback-answers.json");
  return fallbackAnswersSchema.parse(data);
}
