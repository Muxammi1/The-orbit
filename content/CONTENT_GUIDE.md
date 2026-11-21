# ORBIT Content Management Guide

Welcome to the ORBIT content system. All text, projects, timeline milestones, skills, research, and twin answers are completely decoupled from UI components and reside directly inside the `/content` folder.

You can modify any aspect of your portfolio by editing JSON or Markdown files without ever writing React or CSS code.

---

## 1. Directory Structure

```
content/
├── site.json               # Global metadata, links, email, feature flags, SEO
├── navigation.json         # Navigation links, ring mappings, command shortcuts
├── hero.json               # Hero headline, serif-emphasis word, bio, CTAs
├── person.json             # Four narrative chapters (Curiosity, Engineering, Research, Individuality)
├── timeline.json           # Academic, professional, and research milestones
├── work.json               # 4 engineering disciplines and list of project cards
├── stack.json              # 5 technical clusters, skill nodes, and relationship edges
├── research.json           # Research statement, research areas, and entry index
├── connect.json            # Contact section headline, communication reasons, direct links
├── media.json              # Mappings for background videos, fallback posters, and alt tags
├── CONTENT_GUIDE.md        # This guide
├── twin/
│   ├── persona.md          # Twin behavioral guidelines and third-person rules
│   ├── suggested-questions.json # 6 pre-configured questions in third person
│   ├── fallback-answers.json    # Offline answers for the suggested questions
│   └── knowledge/          # Markdown documents used by Twin retrieval (Phase 12)
│       ├── architecture.md
│       ├── projects.md
│       └── research.md
├── work/                   # Deep-dive MDX case studies
│   ├── greenlink.mdx
│   └── example-vision-system.mdx
└── research/               # Deep-dive MDX research write-ups
    └── edge-ai-sensing.mdx
```

---

## 2. Validation & Quality Gates

Every JSON and MDX file is validated against strict Zod schemas in `lib/content/schemas.ts`.

Run content check:
```bash
npm run content:check
```
This prints human-readable errors and an inventory of all remaining placeholders.

Before official launch, run strict verification:
```bash
npm run content:strict
```
This **fails** with exit code 1 if any `"[Placeholder: ...]"` strings or items with `"status": "placeholder"` remain in the content files.

---

## 3. How to Perform Common Updates

### A. How to Update Site Metadata & Feature Flags
Edit `content/site.json`:
- Change your name, role line, location, or email.
- Toggle feature flags:
  ```json
  "featureFlags": {
    "enable3D": true,                // Set to false to disable WebGL canvas across site
    "enableAmbientVideo": true,       // Toggle ambient background loops
    "enableTwin": true,               // Toggle interactive robot twin
    "enableSmoothScroll": false,      // Lenis smooth scroll toggle
    "enableCommandCenter": true,      // ⌘K command center modal
    "showAvailabilityStatus": false   // Shows availability status pill when true
  }
  ```

### B. How to Add a New Project
1. Open `content/work.json`.
2. Add the project to the `"projects"` array:
   ```json
   {
     "slug": "new-autonomous-robot",
     "title": "Autonomous Inspection Rover",
     "discipline": "edge-intelligence",
     "tagline": "Obstacle avoidance and SLAM on embedded edge hardware.",
     "status": "verified",
     "featured": true,
     "repoUrl": "https://github.com/...",
     "demoUrl": "https://...",
     "cover": "/media/rover.jpg"
   }
   ```
3. Add the project slug to the corresponding discipline's `"projects"` list in `work.json`.
4. Create the case study file at `content/work/new-autonomous-robot.mdx`. Follow the required 11-section structure:
   - Overview
   - Problem
   - Objectives
   - Architecture
   - Tech stack
   - Engineering decisions (include rejected alternatives)
   - Implementation
   - Results (only verified metrics; otherwise "Results pending verification")
   - Limitations
   - Future improvements
   - Links

> **Institutional Disclosure Rule:**
> If publishing an institutional, defense, or university surveillance project, publish ONLY university-approved, redacted material. Never include live camera locations, network topology, IP addresses, actual footage, or identifiable student/staff data.

### C. How to Add a Research Entry
1. Open `content/research.json`.
2. Add an entry to `"entries"`:
   ```json
   {
     "slug": "novel-retrieval-mechanics",
     "title": "Multi-Hop Citation Verification in RAG",
     "status": "Ongoing",
     "area": "Retrieval-Augmented Generation",
     "group": "Ongoing investigations",
     "summary": "Exploring graph-based context retrieval with verifiable citations."
   }
   ```
   *Allowed status values:* `Published`, `Presented`, `Ongoing`, `Exploratory`. (Never mark unverified work as Published).
3. Create `content/research/novel-retrieval-mechanics.mdx` with the corresponding frontmatter.

### D. How to Add a Milestone to the Timeline
1. Open `content/timeline.json`.
2. Append a milestone:
   ```json
   {
     "id": "m5",
     "category": "professional", // "academic" | "professional" | "research"
     "title": "Senior AI Infrastructure Engineer",
     "date": "2025 - Present",
     "organization": "Acme Systems",
     "role": "Systems Lead",
     "responsibilities": ["Designed high-throughput vector ingestion"],
     "contributions": ["Reduced p99 retrieval latency by 42ms"],
     "status": "verified"
   }
   ```
   *Note:* Items with `"status": "planned"` automatically render with dashed orbital styling.

### E. How to Add a Node to the 3D Stack Constellation
1. Open `content/stack.json`.
2. Add the node to `"nodes"`:
   ```json
   {
     "id": "triton",
     "label": "Triton",
     "cluster": "ai-ml",
     "description": "High-performance GPU programming and custom inference kernels.",
     "usedIn": ["example-vision-system"],
     "evidence": [],
     "repoUrls": [],
     "status": "verified"
   }
   ```
3. Add edges in `"edges"` to genuine technical connections:
   ```json
   { "from": "pytorch", "to": "triton", "relation": "kernel-acceleration" }
   ```

### F. How to Add or Edit Twin Answers
1. Open `content/twin/suggested-questions.json` if editing the 6 pre-configured questions.
2. Update corresponding answers in `content/twin/fallback-answers.json`.
3. Ensure all twin dialogue speaks in the **third person** ("Muzammil has designed...", "His experience with...") and includes proper citation source chips.

### G. How to Replace Media (Portrait, Posters, Videos, CV)
- **Portrait:** Replace `/public/media/portrait.jpg`. (Never use AI-generated portraits).
- **CV:** Replace `/public/cv/Muzammil_Yasir_CV.pdf` and ensure the path matches `site.json` `"cvFilePath"`.
- **Videos & Posters:** Update the filenames in `content/media.json` and place matching files in `/public/media/`.

### H. How to Adjust Theme Colors
Edit `styles/tokens.css`. The design system uses Tailwind v4 `@theme` properties:
- `--color-obsidian`: Base background (`#08090C`)
- `--color-carbon`: Secondary background (`#0E1117`)
- `--color-graphite`: Cards & panels (`#171B22`)
- `--color-slate`: Borders (`#252C35`)
- `--color-ion`: Primary accent (`#B6E36A`)
- `--color-titanium`: Primary text (`#D9DEE5`)
- `--color-silver`: Secondary text (`#8C96A3`)
- `--color-bronze`: 3D lighting/reflections only (`#B58A68`)
