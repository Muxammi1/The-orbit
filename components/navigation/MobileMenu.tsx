"use client";

import { useEffect, useRef } from "react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { cn } from "@/lib/cn";
import { X, ArrowRight, FileText, Mail } from "lucide-react";
import type { NavItem } from "./FloatingNav";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  activeSection?: string;
  onOpenCommandCenter: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  items,
  activeSection = "entry",
  onOpenCommandCenter,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape listener
  useEffect(() => {
    if (!isOpen) return;

    const prevActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      prevActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      ref={panelRef}
      className="fixed inset-0 z-50 bg-[#08090C]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#252C35] pb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B6E36A]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#D9DEE5]">
            ORBIT / NAVIGATION
          </span>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-[#171B22] border border-[#252C35] text-[#8C96A3] hover:text-[#D9DEE5] transition-colors cursor-pointer"
          aria-label="Close Navigation Menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Ring links */}
      <nav className="flex flex-col gap-3 my-auto py-8">
        {items.map((item, index) => {
          const isActive = item.id === activeSection;
          const ringIndex = String(index + 1).padStart(2, "0");

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between py-3 px-4 rounded-sm border transition-all duration-200",
                isActive
                  ? "bg-[#171B22] border-[#B6E36A]/50 text-[#B6E36A]"
                  : "bg-transparent border-transparent hover:bg-[#171B22]/50 text-[#8C96A3] hover:text-[#D9DEE5]"
              )}
            >
              <div className="flex items-center gap-4">
                <MonoLabel
                  accent={isActive}
                  className="text-xs"
                >
                  RING {ringIndex}
                </MonoLabel>
                <span className="font-sans text-2xl font-light tracking-tight">
                  {item.label}
                </span>
              </div>
              <ArrowRight
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:translate-x-1",
                  isActive ? "text-[#B6E36A]" : "text-[#8C96A3]/40"
                )}
              />
            </a>
          );
        })}
      </nav>

      {/* Mobile action bar */}
      <div className="pt-6 border-t border-[#252C35] flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenCommandCenter();
          }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-sm bg-[#171B22] border border-[#252C35] text-[#D9DEE5] font-mono text-xs uppercase tracking-wider"
        >
          <span>Open Command Center</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#08090C] text-[#8C96A3] text-[10px]">
            ⌘K
          </kbd>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="/cv"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#171B22] border border-[#252C35] text-[#8C96A3] hover:text-[#D9DEE5] font-mono text-xs uppercase"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>CV View</span>
          </a>
          <a
            href="#connect"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#B6E36A] text-[#08090C] font-mono text-xs uppercase font-semibold"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Connect</span>
          </a>
        </div>
      </div>
    </div>
  );
}
