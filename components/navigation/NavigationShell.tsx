"use client";

import { useState, useEffect } from "react";
import { FloatingNav, type NavItem } from "./FloatingNav";
import { MobileMenu } from "./MobileMenu";
import {
  CommandCenter,
  type CaseStudySearchItem,
  type ResearchSearchItem,
} from "./CommandCenter";
import { useCommandCenter } from "@/hooks/useCommandCenter";

export interface NavigationShellProps {
  items: NavItem[];
  caseStudies?: CaseStudySearchItem[];
  researchEntries?: ResearchSearchItem[];
}

export function NavigationShell({
  items,
  caseStudies,
  researchEntries,
}: NavigationShellProps) {
  const { isOpen: isCommandOpen, open: openCommand, close: closeCommand } = useCommandCenter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("entry");

  // Track active section via IntersectionObserver on scroll
  useEffect(() => {
    const sectionIds = items.map((i) => i.id);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the most visible section in the viewport
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) {
        setActiveSection(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -50% 0px",
      threshold: [0.1, 0.3, 0.5, 0.7],
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <FloatingNav
        items={items}
        activeSection={activeSection}
        onOpenCommandCenter={openCommand}
        onOpenMobileMenu={() => setIsMobileOpen(true)}
      />
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        items={items}
        activeSection={activeSection}
        onOpenCommandCenter={openCommand}
      />
      <CommandCenter
        isOpen={isCommandOpen}
        onClose={closeCommand}
        sections={items}
        caseStudies={caseStudies}
        researchEntries={researchEntries}
      />
    </>
  );
}
