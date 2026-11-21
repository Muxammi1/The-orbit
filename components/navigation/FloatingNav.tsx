"use client";

import { useEffect, useState, useRef } from "react";
import { RingIndicator } from "./RingIndicator";
import { cn } from "@/lib/cn";
import { Search, Menu, ArrowUpRight } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  ring: string;
  href: string;
}

export interface FloatingNavProps {
  items: NavItem[];
  onOpenCommandCenter: () => void;
  onOpenMobileMenu: () => void;
  activeSection?: string;
}

export function FloatingNav({
  items,
  onOpenCommandCenter,
  onOpenMobileMenu,
  activeSection = "entry",
}: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCondensed, setIsCondensed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (currentScrollY > 120) {
        setIsCondensed(true);
        if (isScrollingDown && currentScrollY - lastScrollY.current > 15) {
          setIsVisible(false);
        } else if (!isScrollingDown && lastScrollY.current - currentScrollY > 10) {
          setIsVisible(true);
        }
      } else {
        setIsCondensed(false);
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = items.findIndex((item) => item.id === activeSection);
  const activeRing = activeIndex !== -1 ? String(activeIndex + 1).padStart(2, "0") : "01";

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className={cn(
        "fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-full",
          "bg-[#08090C]/85 backdrop-blur-md border border-[#252C35]",
          "shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300",
          isCondensed ? "scale-95" : "scale-100"
        )}
      >
        {/* Wordmark */}
        <a
          href="#entry"
          className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#D9DEE5] hover:text-[#B6E36A] transition-colors px-2 py-1 select-none"
          aria-label="ORBIT Home"
        >
          ORBIT
        </a>

        {/* Ring Status Indicator */}
        <div className="hidden sm:flex">
          <RingIndicator activeRing={activeRing} />
        </div>

        {/* Desktop Section Links */}
        <div className="hidden lg:flex items-center gap-1 border-l border-r border-[#252C35] px-3">
          {items.map((item) => {
            const isActive = item.id === activeSection;
            return (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-200",
                  isActive
                    ? "text-[#B6E36A] bg-[#171B22] border border-[#B6E36A]/40 font-semibold"
                    : "text-[#8C96A3] hover:text-[#D9DEE5] hover:bg-[#171B22]/50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Command Center Trigger Button */}
        <button
          type="button"
          onClick={onOpenCommandCenter}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#171B22] text-[#8C96A3] hover:text-[#D9DEE5] hover:border-[#8C96A3]/60 border border-[#252C35] transition-all cursor-pointer font-mono text-[11px] select-none"
          aria-label="Open Command Center (Command + K)"
        >
          <Search className="h-3 w-3 text-[#B6E36A]" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-[#08090C] text-[#8C96A3] border border-[#252C35]">
            ⌘K
          </kbd>
        </button>

        {/* Connect Shortcut */}
        <a
          href="#connect"
          className="hidden md:inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#08090C] bg-[#B6E36A] hover:bg-[#cbf489] font-semibold px-3 py-1 rounded-full transition-colors select-none"
        >
          <span>Connect</span>
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>

        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-full text-[#8C96A3] hover:text-[#D9DEE5] hover:bg-[#171B22] transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
