"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Command } from "cmdk";
import { Search, Compass, FileText, Sparkles, Terminal, Mail, X } from "lucide-react";
import type { NavItem } from "./FloatingNav";

export interface CaseStudySearchItem {
  slug: string;
  title: string;
  discipline: string;
}

export interface ResearchSearchItem {
  slug: string;
  title: string;
  area: string;
}

export interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  sections: NavItem[];
  caseStudies?: CaseStudySearchItem[];
  researchEntries?: ResearchSearchItem[];
}

export function CommandCenter({
  isOpen,
  onClose,
  sections,
  caseStudies = [
    { slug: "greenlink", title: "GreenLink+", discipline: "Edge Intelligence" },
    { slug: "example-vision-system", title: "Institutional Examination Monitoring System", discipline: "Visual Intelligence" },
  ],
  researchEntries = [
    { slug: "edge-ai-sensing", title: "Low-Power Edge Inference in Ambient Sensing Topologies", area: "Edge AI" },
  ],
}: CommandCenterProps) {
  const router = useRouter();
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
      triggerElementRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (href: string) => {
    onClose();
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    } else {
      router.push(href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command Center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-[#08090C]/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#0E1117] border border-[#252C35] rounded-lg shadow-2xl overflow-hidden"
          >
            <Command label="Command Center Search" className="flex flex-col">
              {/* Header search bar */}
              <div className="flex items-center border-b border-[#252C35] px-4 py-3">
                <Search className="h-4 w-4 text-[#B6E36A] shrink-0 mr-3" aria-hidden="true" />
                <Command.Input
                  autoFocus
                  placeholder="Search sections, case studies, technical nodes, actions..."
                  className="w-full bg-transparent text-sm text-[#D9DEE5] placeholder-[#8C96A3] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={onClose}
              className="text-[#8C96A3] hover:text-[#D9DEE5] p-1 rounded-sm"
              aria-label="Close Command Dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results list */}
          <Command.List className="max-h-[380px] overflow-y-auto p-2 space-y-2">
            <Command.Empty className="py-8 text-center text-xs font-mono text-[#8C96A3]">
              No results found. Try searching for a section, skill, or project.
            </Command.Empty>

            {/* Group: Sections */}
            <Command.Group
              heading="SECTIONS"
              className="text-[11px] font-mono text-[#8C96A3] px-2 py-1 uppercase tracking-wider"
            >
              {sections.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`section ${item.label} ${item.ring}`}
                  onSelect={() => navigateTo(item.href)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="h-4 w-4 text-[#8C96A3]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8C96A3]">{item.ring}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group: Case Studies */}
            {caseStudies.length > 0 && (
              <Command.Group
                heading="CASE STUDIES"
                className="text-[11px] font-mono text-[#8C96A3] px-2 py-1 uppercase tracking-wider"
              >
                {caseStudies.map((cs) => (
                  <Command.Item
                    key={cs.slug}
                    value={`project ${cs.title} ${cs.discipline}`}
                    onSelect={() => navigateTo(`/work/${cs.slug}`)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Terminal className="h-4 w-4 text-[#8C96A3]" />
                      <span>{cs.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8C96A3]">{cs.discipline}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Group: Research Inquiries */}
            {researchEntries.length > 0 && (
              <Command.Group
                heading="RESEARCH INQUIRIES"
                className="text-[11px] font-mono text-[#8C96A3] px-2 py-1 uppercase tracking-wider"
              >
                {researchEntries.map((re) => (
                  <Command.Item
                    key={re.slug}
                    value={`research ${re.title} ${re.area}`}
                    onSelect={() => navigateTo(`/research/${re.slug}`)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-[#8C96A3]" />
                      <span>{re.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8C96A3]">{re.area}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Group: Quick Actions */}
            <Command.Group
              heading="QUICK ACTIONS"
              className="text-[11px] font-mono text-[#8C96A3] px-2 py-1 uppercase tracking-wider"
            >
              <Command.Item
                value="action download cv pdf"
                onSelect={() => navigateTo("/cv/Muzammil_Yasir_CV.pdf")}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#8C96A3]" />
                  <span>Download Curriculum Vitae (PDF)</span>
                </div>
                <span className="font-mono text-[10px] text-[#8C96A3]">PDF</span>
              </Command.Item>
              <Command.Item
                value="action quick cv view page"
                onSelect={() => navigateTo("/cv")}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#8C96A3]" />
                  <span>Fast CV Reader (No-3D / Printable)</span>
                </div>
                <span className="font-mono text-[10px] text-[#8C96A3]">PAGE</span>
              </Command.Item>
              <Command.Item
                value="action ask the twin ai counterpart"
                onSelect={() => navigateTo("#twin")}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#B6E36A]" />
                  <span>Ask the Twin (AI Digital Counterpart)</span>
                </div>
                <span className="font-mono text-[10px] text-[#B6E36A]">TWIN</span>
              </Command.Item>
              <Command.Item
                value="action email contact connect form"
                onSelect={() => navigateTo("#connect")}
                className="flex items-center justify-between px-3 py-2.5 rounded-sm text-sm text-[#D9DEE5] hover:bg-[#171B22] hover:text-[#B6E36A] cursor-pointer aria-selected:bg-[#171B22] aria-selected:text-[#B6E36A] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#8C96A3]" />
                  <span>Send Direct Message / Connect</span>
                </div>
                <span className="font-mono text-[10px] text-[#8C96A3]">CONNECT</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer keyboard hint */}
          <div className="flex items-center justify-between border-t border-[#252C35] px-4 py-2 bg-[#08090C] text-[11px] font-mono text-[#8C96A3]">
            <span>Navigation: ↑ ↓ to navigate, ↵ to select</span>
            <span>ESC to close</span>
          </div>
        </Command>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}


