"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASING } from "@/lib/motion";
import { Stage } from "@/components/stage/Stage";
import { HeroSculpture } from "@/scenes/hero/HeroSculpture";
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
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
      className="relative min-h-[95vh] flex flex-col justify-between pt-20 sm:pt-28 pb-12 overflow-hidden"
    >
      {/* Two-column layout: Mobile = Stage on top (55vh) then text; Desktop = 42% text left, 58% 3D stage right */}
      <div className="flex flex-col-reverse lg:flex-row items-center w-full min-h-[calc(100vh-10rem)]">
        {/* Left: Text column (~42% desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[42%] flex flex-col justify-center space-y-6 z-10 py-6 lg:py-0"
        >
          {/* Name: small, spaced */}
          <motion.div variants={itemVariants}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B6E36A] font-medium">
              {hero.name}
            </p>
          </motion.div>

          {/* Headline (max 3 lines) */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-normal tracking-tight text-[#D9DEE5] leading-[1.08] max-w-xl">
              {renderHeadline()}
            </h1>
          </motion.div>

          {/* 2-line intro */}
          <motion.p
            variants={itemVariants}
            className="text-base text-[#8C96A3] font-normal leading-relaxed max-w-lg"
          >
            {hero.intro}
          </motion.p>

          {/* Two Buttons */}
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

        {/* Right: 3D Stage (~58% desktop, full viewport height, bleeding to right edge) */}
        <div className="w-full lg:w-[58%] h-[55vh] lg:h-[88vh] relative flex items-center justify-center">
          <Stage
            camera={{ position: [0, 0.4, 8], fov: 32 }}
            className="w-full h-full"
            enable3D={site.featureFlags.enable3D}
          >
            <HeroSculpture />
          </Stage>
        </div>
      </div>

      {/* Bottom Status & Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: DURATION.micro, ease: EASING.orbit }}
        className="mt-8 pt-6 border-t border-[#252C35]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
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

        {/* Right: Featured systems without cluttered chips */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] text-[#8C96A3] uppercase tracking-wider">
            Featured Systems:
          </span>
          {featuredProjects.map((project) => (
            <a
              key={project.slug}
              href={`/work/${project.slug}`}
              className="text-xs font-mono text-[#D9DEE5] hover:text-[#B6E36A] transition-colors"
            >
              {project.title} ↗
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
