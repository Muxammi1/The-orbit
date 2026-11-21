"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASING } from "@/lib/motion";
import type { HeroContent, SiteContent, WorkContent } from "@/lib/content/schemas";
import { ArrowDown, ArrowUpRight, Compass } from "lucide-react";

export interface EntryHeroProps {
  hero: HeroContent;
  site: SiteContent;
  work: WorkContent;
}

export function EntryHero({ hero, site, work }: EntryHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Featured project proof chips (up to 3)
  const featuredProjects = work.projects.filter((p) => p.featured).slice(0, 3);

  // Stagger animation timing under 900ms total
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.55,
        ease: EASING.orbit,
      },
    },
  };

  // Splitting headline for Instrument Serif word emphasis
  const renderHeadline = () => {
    const { headline, serifWord } = hero;
    if (!serifWord || !headline.includes(serifWord)) {
      return headline;
    }
    const parts = headline.split(serifWord);
    return (
      <>
        {parts[0]}
        <span className="font-serif italic font-normal text-[#D9DEE5]">
          {serifWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section
      id="entry"
      data-ring="01"
      aria-label="Section 01: Entry Hero"
      className="relative min-h-[95vh] flex flex-col justify-between pt-28 sm:pt-36 pb-12 overflow-hidden"
    >
      {/* Upper content grid: Left 7 columns text, right area transparent over 3D rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 space-y-6 max-w-3xl"
        >
          {/* Eyebrow / Role Line */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171B22]/80 border border-[#252C35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B6E36A] shadow-[0_0_8px_#B6E36A]" />
              <MonoLabel accent className="text-[11px]">
                RING 01 / ENTRY
              </MonoLabel>
            </div>
            <MonoLabel dimmed className="hidden sm:inline">
              •
            </MonoLabel>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C96A3]">
              {hero.roleLine}
            </span>
          </motion.div>

          {/* Name & Tagline */}
          <motion.div variants={itemVariants}>
            <h1 className="sr-only">{hero.name} — {hero.roleLine}</h1>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B6E36A] font-medium mb-1">
              {hero.name}
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.05]">
              {renderHeadline()}
            </h2>
          </motion.div>

          {/* Short Intro Bio */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#8C96A3] font-normal leading-relaxed max-w-xl"
          >
            {hero.intro}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              href={hero.ctas.primary.href}
              className="gap-2"
            >
              <span>{hero.ctas.primary.label}</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={hero.ctas.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <span>{hero.ctas.secondary.label}</span>
              <ArrowUpRight className="h-4 w-4 text-[#8C96A3]" aria-hidden="true" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right column remains transparent for the persistent 3D rings canvas */}
        <div className="hidden lg:block lg:col-span-4 h-full pointer-events-none" aria-hidden="true" />
      </div>

      {/* Bottom Status & Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: DURATION.micro, ease: EASING.orbit }}
        className="mt-16 pt-6 border-t border-[#252C35]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
      >
        {/* Left: Scroll indicator & Location */}
        <div className="flex flex-wrap items-center gap-4 text-[#8C96A3]">
          <a
            href="#person"
            className="flex items-center gap-2 hover:text-[#B6E36A] transition-colors group select-none"
            aria-label="Scroll to Section 02 Person"
          >
            <Compass className="h-3.5 w-3.5 text-[#B6E36A] animate-pulse" aria-hidden="true" />
            <span className="tracking-widest uppercase text-[11px]">[ SCROLL TO DISCOVER ]</span>
          </a>
          <span className="text-[#252C35]">•</span>
          <span className="text-[#8C96A3] tracking-wider uppercase text-[11px]">
            LOC: {site.location}
          </span>
        </div>

        {/* Right: Featured proof chips & Optional availability status */}
        <div className="flex flex-wrap items-center gap-2">
          {site.featureFlags.showAvailabilityStatus && (
            <Chip variant="accent" size="sm" dot>
              {hero.availabilityText}
            </Chip>
          )}
          <span className="hidden sm:inline font-mono text-[10px] text-[#8C96A3] uppercase tracking-wider mr-1">
            Featured Systems:
          </span>
          {featuredProjects.map((project) => (
            <a key={project.slug} href={`#work`}>
              <Chip variant="verified" size="sm" dot className="hover:border-[#8C96A3]/60 transition-colors">
                {project.title}
              </Chip>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
