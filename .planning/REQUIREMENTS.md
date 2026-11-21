# REQUIREMENTS: ORBIT Portfolio Redesign & Creative Reset

## Milestone Goals
Transform ORBIT from an early prototype into a world-class, cinematic, immersive digital portfolio that represents Muzammil Yasir as an AI Engineer, Researcher, and Systems Thinker.

---

## Section Requirements

### 1. Visual Foundation & Design Tokens
- [ ] **TYP-01**: Configure `Space Grotesk` (headings/display), `Inter` (body), and `JetBrains Mono` (technical metadata) via `next/font/google`.
- [ ] **COL-01**: Enforce 8 strict color tokens (Obsidian, Carbon, Graphite, Slate, Ion Green, Titanium, Muted Silver, Warm Bronze).
- [ ] **UI-01**: Remove all "RING 0N", "SEC 0N", and "DRAFT" chips from public view. Keep dev overlays behind `NEXT_PUBLIC_SHOW_PLACEHOLDERS`.

### 2. Hero Section (Section 01)
- [ ] **HERO-01**: Immersive full-screen 3D spatial installation featuring concentric precision-engineered metallic gimbals (titanium, obsidian, bronze) and an emissive Ion Green energy core.
- [ ] **HERO-02**: Exact editorial typography:
  - Label: `MUZAMMIL YASIR`
  - Sub: `AI ENGINEER / RESEARCHER / SYSTEMS THINKER`
  - Headline: `Engineering intelligence. Building what's next.` (Space Grotesk, max 3 lines)
  - Statement: `"I design and engineer intelligent systems that bridge artificial intelligence with real-world applications."`
  - CTAs: `EXPLORE MY WORK` & `DOWNLOAD CV`
- [ ] **HERO-03**: No overlap between text column and 3D rings on desktop (42% text left, 58% 3D stage right). Stage top (55vh) on mobile.
- [ ] **HERO-04**: Floating navigation bar: `ORBIT | PERSON | WORK | TWIN | STACK | RESEARCH | CONNECT` with active indicator and status dot.

### 3. Person Section (Section 02)
- [ ] **PERS-01**: Cinematic editorial split-screen layout.
- [ ] **PERS-02**: Left: Architectural portrait frame with dark environment and subtle metallic edge.
- [ ] **PERS-03**: Right: 4-chapter narrative slider with large chapter indices (`01 CURIOSITY`, `02 ENGINEERING`, `03 RESEARCH`, `04 INDIVIDUALITY`) and smooth animated transitions.

### 4. Digital Twin Section (Section 04)
- [ ] **TWIN-01**: Dedicated prominent 3D viewport featuring a humanoid robotic character in brushed titanium & dark graphite with Ion Green illuminated energy pathways.
- [ ] **TWIN-02**: Visual states: `IDLE` (calm breathing & scanning), `LISTENING`, `THINKING` (energy core pulse), `SPEAKING` (articulation).
- [ ] **TWIN-03**: Advanced scientific research console interface with terminal input, latency/token readouts, and 5 suggested query chips.

### 5. Neural Ecosystem / Stack (Section 05)
- [ ] **STACK-01**: Interactive 3D relational network of technologies, disciplines, and projects.
- [ ] **STACK-02**: Categories: LLMs & Agents, Computer Vision, RAG & Search, Systems Architecture, Hardware & Edge AI.
- [ ] **STACK-03**: Node selection focuses camera and reveals connected project links and competencies.

### 6. Work & Archives (Section 03)
- [ ] **WORK-01**: Engineering case studies categorized into: Intelligent Systems, Visual Intelligence, Predictive Intelligence, Edge Intelligence.
- [ ] **WORK-02**: Architecture diagrams, problem/solution narratives, and technical metrics.

### 7. Orbit Timeline (Section 02 / Sub-view)
- [ ] **TIME-01**: Multi-track timeline separating Academic, Professional, Research, and Future Ambitions.

### 8. Research Laboratory (Section 06)
- [ ] **RES-01**: Dedicated research showcase with verified status tags (`PUBLISHED`, `PRESENTED`, `ONGOING`, `EXPLORATORY`).

### 9. Convergence / Connect (Section 07)
- [ ] **CONN-01**: Memorable convergence scene with headline: *"Every meaningful system begins with a question. Let's explore the next one."*
- [ ] **CONN-02**: Terminal-style message sender, direct channels, and verified contact points.

### 10. Quality & Performance Gates
- [ ] **PERF-01**: 60fps rendering on standard hardware, zero WebGL crashing or black voids.
- [ ] **TEST-01**: Lint, TypeScript, contract tests, and Next.js production build pass cleanly.
