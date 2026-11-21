"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MonoLabel } from "@/components/ui/MonoLabel";

export interface TocItem {
  id: string;
  label: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const headings = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const topOffset = window.scrollY + 160;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= topOffset) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  return (
    <aside
      aria-label="Table of contents"
      className="sticky top-28 hidden xl:block w-64 space-y-4 p-5 rounded-sm bg-[#171B22]/70 border border-[#252C35] backdrop-blur-sm self-start"
    >
      <MonoLabel accent className="text-[10px]">
        ON THIS PAGE
      </MonoLabel>

      <nav className="space-y-1 text-xs font-mono">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block py-1 px-2 rounded-sm transition-all duration-150 line-clamp-1",
                isActive
                  ? "text-[#B6E36A] bg-[#0E1117] border-l-2 border-[#B6E36A] font-medium"
                  : "text-[#8C96A3] hover:text-[#D9DEE5] hover:bg-[#0E1117]/50"
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
