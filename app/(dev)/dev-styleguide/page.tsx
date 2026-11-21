import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Divider } from "@/components/ui/Divider";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkipLink } from "@/components/ui/SkipLink";

export const metadata = {
  title: "Styleguide (Dev)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const colorTokens = [
    { name: "Obsidian", hex: "#08090C", role: "Main background (~75%)", contrast: "1.0:1 (Base)" },
    { name: "Carbon", hex: "#0E1117", role: "Secondary background", contrast: "1.1:1" },
    { name: "Graphite", hex: "#171B22", role: "Cards & Panels", contrast: "1.3:1" },
    { name: "Slate", hex: "#252C35", role: "1px Borders & Dividers", contrast: "1.7:1" },
    { name: "Ion Green", hex: "#B6E36A", role: "Primary accent / interaction (7%)", contrast: "13.9:1 (AAA)" },
    { name: "Titanium", hex: "#D9DEE5", role: "Primary text", contrast: "14.8:1 (AAA)" },
    { name: "Silver", hex: "#8C96A3", role: "Secondary text & metadata", contrast: "7.2:1 (AAA)" },
    { name: "Bronze", hex: "#B58A68", role: "3D lighting & reflections only (3%)", contrast: "6.1:1" },
  ];

  return (
    <div className="min-h-screen bg-[#08090C] text-[#D9DEE5] pb-32">
      <SkipLink />
      <header className="border-b border-[#252C35] bg-[#0E1117]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="shell py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#B6E36A]" />
            <h1 className="font-mono text-sm uppercase tracking-widest text-[#D9DEE5]">
              ORBIT / DESIGN SYSTEM & STYLEGUIDE
            </h1>
          </div>
          <Chip variant="accent" size="sm">
            DEV ONLY • 404 IN PROD
          </Chip>
        </div>
      </header>

      <main id="main-content" className="shell pt-12 space-y-24">
        {/* Section 0: Accessibility & Contrast Audit */}
        <section aria-labelledby="audit-heading">
          <SectionHeader
            ringNumber="SYSTEM / AUDIT"
            title="Design System & Contrast Rules"
            serifWord="Rules"
            subtitle="Strict validation against non-negotiable rules: dark-only, minimum 11px mono labels, WCAG AA body contrast >=4.5:1, and no glassmorphism on ordinary cards."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Panel>
              <MonoLabel accent>RULE 04 / DARK ONLY</MonoLabel>
              <p className="mt-2 text-sm text-[#8C96A3]">
                `color-scheme: dark`. No light mode or toggles. Obsidian base (#08090C) ensures deep cinematic contrast.
              </p>
            </Panel>
            <Panel>
              <MonoLabel accent>RULE 06 / ACCESSIBILITY</MonoLabel>
              <p className="mt-2 text-sm text-[#8C96A3]">
                All body and metadata text pass WCAG AAA (Titanium 14.8:1, Silver 7.2:1, Ion 13.9:1). Focus rings visible.
              </p>
            </Panel>
            <Panel>
              <MonoLabel accent>RULE 08 / NO TEMPLATE LOOK</MonoLabel>
              <p className="mt-2 text-sm text-[#8C96A3]">
                Flat graphite cards with 1px slate borders. Glass/blur reserved strictly for floating nav & command center.
              </p>
            </Panel>
          </div>
        </section>

        <Divider ringNumber="RING 01 / TOKENS" />

        {/* Section 1: Color Tokens */}
        <section aria-labelledby="tokens-heading">
          <SectionHeader
            ringNumber="TOKENS / PALETTE"
            title="Color Tokens & Distribution"
            serifWord="Tokens"
            subtitle="75% Obsidian dark surfaces, 15% neutral metallic, 7% Ion Green, 3% Bronze (3D lighting only)."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="bg-[#171B22] border border-[#252C35] rounded-sm p-4 space-y-3"
              >
                <div
                  className="h-16 w-full rounded-sm border border-white/5 flex items-end p-2"
                  style={{ backgroundColor: token.hex }}
                >
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white font-medium"
                  >
                    {token.hex}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans text-sm font-medium text-[#D9DEE5]">{token.name}</h3>
                  <p className="text-xs text-[#8C96A3] mt-0.5">{token.role}</p>
                </div>
                <div className="pt-2 border-t border-[#252C35] flex justify-between items-center text-[11px] font-mono text-[#8C96A3]">
                  <span>Contrast vs Bg:</span>
                  <span className="text-[#B6E36A] font-medium">{token.contrast}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider ringNumber="RING 02 / TYPOGRAPHY" />

        {/* Section 2: Typography Scale */}
        <section aria-labelledby="type-heading">
          <SectionHeader
            ringNumber="TOKENS / TYPE"
            title="Typography Hierarchy & Scaled Scale"
            serifWord="Hierarchy"
            subtitle="Inter Tight for body and UI, Instrument Serif for 1-2 emphasized words per headline, JetBrains Mono for labels (min 11px)."
          />
          <div className="mt-8 space-y-6">
            <Panel className="space-y-4">
              <MonoLabel>HERO DISPLAY (FLUID 64-96PX)</MonoLabel>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-none">
                An Exploration of <span className="font-serif italic font-normal text-[#D9DEE5]">Intelligence</span>.
              </h1>
            </Panel>
            <Panel className="space-y-4">
              <MonoLabel>SECTION HEADLINE (FLUID 42-64PX)</MonoLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-normal tracking-tight text-[#D9DEE5]">
                Intelligent <span className="font-serif italic font-normal text-[#D9DEE5]">Systems</span> & Robotics
              </h2>
            </Panel>
            <Panel className="space-y-4">
              <MonoLabel>SUBHEADLINE (24-32PX) & BODY TEXT (15-18PX)</MonoLabel>
              <h3 className="text-xl sm:text-2xl font-sans font-medium text-[#D9DEE5]">
                Engineering robust architectures across physical and digital intelligence.
              </h3>
              <p className="text-base text-[#8C96A3] leading-relaxed max-w-2xl">
                This body copy is set in Inter Tight at 16px with a line-height of 1.6. It maintains a 14.8:1 contrast
                ratio against Obsidian, exceeding WCAG AAA standards for reading comfort.
              </p>
            </Panel>
            <Panel className="space-y-2">
              <MonoLabel>MONO LABELS & CODE (MINIMUM 11PX ENFORCED)</MonoLabel>
              <div className="flex flex-wrap gap-4 pt-2">
                <MonoLabel>RING 01 / ENTRY</MonoLabel>
                <MonoLabel accent>STATUS: VERIFIED</MonoLabel>
                <MonoLabel dimmed>LATENCY: &lt;100MS</MonoLabel>
              </div>
            </Panel>
          </div>
        </section>

        <Divider ringNumber="RING 03 / PRIMITIVES" />

        {/* Section 3: UI Primitives */}
        <section aria-labelledby="primitives-heading" className="space-y-12">
          <SectionHeader
            ringNumber="PRIMITIVES / CONTROLS"
            title="Interactive Components & Chips"
            serifWord="Interactive"
            subtitle="Accessible buttons, status-aware chips, flat graphite panels, and reveal wrappers."
          />

          {/* Buttons */}
          <div className="space-y-4">
            <MonoLabel>BUTTON VARIANTS & SIZES</MonoLabel>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">Explore My Work</Button>
              <Button variant="primary" size="md">Download CV</Button>
              <Button variant="primary" size="sm">Action</Button>
              <Button variant="secondary" size="md">Secondary Action</Button>
              <Button variant="ghost" size="md">Ghost Link</Button>
              <Button variant="primary" size="md" disabled>Disabled State</Button>
            </div>
          </div>

          {/* Chips */}
          <div className="space-y-4">
            <MonoLabel>STATUS CHIPS (MIN 11PX)</MonoLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Chip variant="verified" dot>Verified System</Chip>
              <Chip variant="planned" dot>Planned Milestone</Chip>
              <Chip variant="placeholder" dot>[Placeholder Data]</Chip>
              <Chip variant="accent">Active Ring</Chip>
              <Chip variant="default">RAG Architecture</Chip>
              <Chip variant="verified" size="sm" dot>Small Verified</Chip>
            </div>
          </div>

          {/* Panels and Reveal */}
          <div className="space-y-4">
            <MonoLabel>GRAPHITE PANELS & REVEAL ANIMATIONS</MonoLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal direction="up" delay={0.1}>
                <Panel hoverEffect className="space-y-2">
                  <div className="flex items-center justify-between">
                    <MonoLabel accent>PANEL A</MonoLabel>
                    <Chip variant="verified" size="sm" dot>Active</Chip>
                  </div>
                  <h4 className="text-lg font-sans font-medium text-[#D9DEE5]">
                    Flat Graphite Surface with 1px Slate Border
                  </h4>
                  <p className="text-sm text-[#8C96A3]">
                    Includes subtle border brightening on hover, respecting strict dark mode without glassmorphism.
                  </p>
                </Panel>
              </Reveal>
              <Reveal direction="up" delay={0.2}>
                <Panel hoverEffect className="space-y-2">
                  <div className="flex items-center justify-between">
                    <MonoLabel>PANEL B</MonoLabel>
                    <Chip variant="planned" size="sm" dot>Future</Chip>
                  </div>
                  <h4 className="text-lg font-sans font-medium text-[#D9DEE5]">
                    Reduced Motion Conscious Reveal
                  </h4>
                  <p className="text-sm text-[#8C96A3]">
                    Under `prefers-reduced-motion: reduce`, animations collapse immediately to avoid disorienting motion.
                  </p>
                </Panel>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
