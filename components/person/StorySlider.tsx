"use client";

import { useState, useRef, useCallback } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { cn } from "@/lib/cn";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import type { PersonChapter } from "@/lib/content/schemas";

export interface StorySliderProps {
  chapters: PersonChapter[];
}

export function StorySlider({ chapters }: StorySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const total = chapters.length;
  const currentChapter = chapters[currentIndex] || chapters[0];
  const isExpanded = expandedIndex === currentIndex;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      goNext();
    } else if (diff < -50) {
      goPrev();
    }
    touchStartX.current = null;
  };

  if (!currentChapter) return null;

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Personal narrative chapters slider"
      className="relative flex flex-col justify-between h-full bg-[#171B22]/70 border border-[#252C35] rounded-sm p-6 sm:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B6E36A] shadow-xl"
    >
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        Chapter {currentChapter.number} of {total}: {currentChapter.title}. {currentChapter.headline}
      </div>

      {/* Header bar: Chapter index & Stepper buttons */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-[#252C35]">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl sm:text-4xl font-light text-[#B6E36A]">
              {currentChapter.number}
            </span>
            <div className="h-6 w-px bg-[#252C35]" />
            <MonoLabel accent className="text-xs uppercase tracking-widest">
              CHAPTER / {currentChapter.title}
            </MonoLabel>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="p-2 rounded-full border border-[#252C35] bg-[#0E1117] text-[#8C96A3] hover:text-[#D9DEE5] hover:border-[#8C96A3] transition-colors cursor-pointer"
              aria-label="Previous chapter"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-[#8C96A3] px-2 select-none">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              className="p-2 rounded-full border border-[#252C35] bg-[#0E1117] text-[#8C96A3] hover:text-[#D9DEE5] hover:border-[#8C96A3] transition-colors cursor-pointer"
              aria-label="Next chapter"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress segment indicator */}
        <div className="grid grid-cols-4 gap-1.5 py-4">
          {chapters.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx === currentIndex ? "bg-[#B6E36A]" : "bg-[#252C35]"
              )}
            />
          ))}
        </div>

        {/* Chapter content */}
        <div className="mt-4 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#D9DEE5]">
            {currentChapter.headline}
          </h3>
          <p className="text-base text-[#8C96A3] font-sans leading-relaxed">
            {currentChapter.content}
          </p>
        </div>
      </div>

      {/* Controlled expandable reveal */}
      <div className="mt-8 pt-6 border-t border-[#252C35]/60">
        <button
          type="button"
          onClick={() => setExpandedIndex((prev) => (prev === currentIndex ? null : currentIndex))}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#B6E36A] hover:text-[#cbf489] transition-colors cursor-pointer"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Hide notes" : currentChapter.revealLabel}</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {isExpanded && (
          <div
            role="region"
            aria-label={`${currentChapter.title} expanded notes`}
            className="mt-4 p-4 rounded-sm bg-[#0E1117] border border-[#252C35] text-sm text-[#8C96A3] font-sans leading-relaxed animate-in fade-in duration-200"
          >
            {currentChapter.revealContent}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-2">
          <span className="font-mono text-[10px] text-[#8C96A3]/60">
            Use ← → arrow keys or swipe to change chapters
          </span>
        </div>
      </div>
    </div>
  );
}
