import { z } from "zod";

export const claimStatusSchema = z.enum(["verified", "placeholder", "planned"]);
export type ClaimStatus = z.infer<typeof claimStatusSchema>;

export const siteSchema = z.object({
  name: z.string(),
  roleLine: z.string(),
  tagline: z.string(),
  location: z.string(),
  email: z.string().email(),
  domain: z.string(),
  cvFilePath: z.string(),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
  }),
  featureFlags: z.object({
    enable3D: z.boolean().default(true),
    enableAmbientVideo: z.boolean().default(true),
    enableTwin: z.boolean().default(true),
    enableSmoothScroll: z.boolean().default(false),
    enableCommandCenter: z.boolean().default(true),
    showAvailabilityStatus: z.boolean().default(false),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  analytics: z.object({
    enablePlausible: z.boolean().default(false),
    domain: z.string().default(""),
  }),
});
export type SiteContent = z.infer<typeof siteSchema>;

export const navigationItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  ring: z.string(),
  href: z.string(),
});

export const navigationSchema = z.object({
  items: z.array(navigationItemSchema),
  actions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      shortcut: z.string().optional(),
      href: z.string().optional(),
    })
  ),
});
export type NavigationContent = z.infer<typeof navigationSchema>;

export const heroSchema = z.object({
  name: z.string(),
  roleLine: z.string(),
  headline: z.string(),
  serifWord: z.string(),
  intro: z.string(),
  status: claimStatusSchema,
  availabilityText: z.string().default("[Placeholder: availability status]"),
  ctas: z.object({
    primary: z.object({ label: z.string(), href: z.string() }),
    secondary: z.object({ label: z.string(), href: z.string() }),
  }),
});
export type HeroContent = z.infer<typeof heroSchema>;

export const personChapterSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  headline: z.string(),
  content: z.string(),
  revealLabel: z.string(),
  revealContent: z.string(),
  status: claimStatusSchema,
});

export const personSchema = z.object({
  statement: z.string(),
  chapters: z.array(personChapterSchema),
});
export type PersonContent = z.infer<typeof personSchema>;

export const milestoneSchema = z.object({
  id: z.string(),
  category: z.enum(["academic", "professional", "research"]),
  title: z.string(),
  date: z.string(),
  organization: z.string(),
  role: z.string(),
  responsibilities: z.array(z.string()),
  contributions: z.array(z.string()),
  evidenceUrl: z.string().optional(),
  status: claimStatusSchema,
});

export const timelineSchema = z.object({
  milestones: z.array(milestoneSchema),
});
export type TimelineContent = z.infer<typeof timelineSchema>;

export const projectSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  discipline: z.string(),
  tagline: z.string(),
  status: claimStatusSchema,
  featured: z.boolean().default(false),
  repoUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  cover: z.string().optional(),
  evidenceUrl: z.string().optional(),
});

export const disciplineSchema = z.object({
  id: z.string(),
  index: z.string(),
  title: z.string(),
  summary: z.string(),
  topics: z.array(z.string()),
  projects: z.array(z.string()),
});

export const workSchema = z.object({
  disciplines: z.array(disciplineSchema),
  projects: z.array(projectSummarySchema),
});
export type WorkContent = z.infer<typeof workSchema>;

export const caseStudyFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  discipline: z.string(),
  tagline: z.string(),
  date: z.string(),
  status: claimStatusSchema,
  featured: z.boolean().default(false),
  repoUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  cover: z.string().optional(),
  evidenceUrl: z.string().optional(),
  techStack: z.array(z.string()),
});
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;

export const stackNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  cluster: z.string(),
  description: z.string(),
  usedIn: z.array(z.string()),
  evidence: z.array(z.string()),
  repoUrls: z.array(z.string()),
  status: claimStatusSchema,
});

export const stackClusterSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const stackEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  relation: z.string(),
});

export const stackSchema = z.object({
  clusters: z.array(stackClusterSchema),
  nodes: z.array(stackNodeSchema),
  edges: z.array(stackEdgeSchema),
});
export type StackContent = z.infer<typeof stackSchema>;

export const researchStatusSchema = z.enum(["Published", "Presented", "Ongoing", "Exploratory"]);
export type ResearchStatus = z.infer<typeof researchStatusSchema>;

export const researchEntrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  status: researchStatusSchema,
  area: z.string(),
  group: z.enum([
    "Publications and preprints",
    "Technical experiments",
    "Research projects",
    "Academic presentations",
    "Ongoing investigations",
    "Future directions",
  ]),
  summary: z.string(),
  evidenceUrl: z.string().optional(),
});

export const researchSchema = z.object({
  statement: z.string(),
  areas: z.array(z.string()),
  entries: z.array(researchEntrySchema),
});
export type ResearchContent = z.infer<typeof researchSchema>;

export const researchEntryFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  status: researchStatusSchema,
  area: z.string(),
  group: z.string(),
  date: z.string(),
  summary: z.string(),
  evidenceUrl: z.string().optional(),
});
export type ResearchEntryFrontmatter = z.infer<typeof researchEntryFrontmatterSchema>;

export const connectSchema = z.object({
  headline: z.string(),
  serifWord: z.string(),
  subheadline: z.string(),
  reasons: z.array(z.string()),
  directLinks: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      type: z.string(),
    })
  ),
});
export type ConnectContent = z.infer<typeof connectSchema>;

export const mediaSectionSchema = z.object({
  video: z.string().optional(),
  poster: z.string(),
  mobilePoster: z.string().optional(),
  alt: z.string(),
});

export const mediaSchema = z.record(z.string(), mediaSectionSchema);
export type MediaContent = z.infer<typeof mediaSchema>;

export const suggestedQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      prompt: z.string(),
    })
  ),
});
export type SuggestedQuestionsContent = z.infer<typeof suggestedQuestionsSchema>;

export const fallbackAnswersSchema = z.object({
  answers: z.record(
    z.string(),
    z.object({
      id: z.string(),
      answer: z.string(),
      sources: z.array(z.string()),
    })
  ),
  defaultFallback: z.object({
    answer: z.string(),
    sources: z.array(z.string()),
  }),
});
export type FallbackAnswersContent = z.infer<typeof fallbackAnswersSchema>;
