import test from "node:test";
import assert from "node:assert/strict";
import { cn } from "../lib/cn.ts";
import { DURATION, EASING } from "../lib/motion.ts";

test("cn merges tailwind classes without collisions", () => {
  const result = cn("px-2 py-1", "px-4", { "text-red-500": false, "text-[#B6E36A]": true });
  assert.equal(result.includes("px-4"), true);
  assert.equal(result.includes("px-2"), false);
  assert.equal(result.includes("text-[#B6E36A]"), true);
});

test("motion tokens respect design brief requirements", () => {
  assert.ok(DURATION.section >= 0.5 && DURATION.section <= 0.9, "Section transition duration between 500-900ms");
  assert.ok(DURATION.micro >= 0.15 && DURATION.micro <= 0.3, "Micro transition duration between 150-300ms");
  assert.deepEqual(EASING.orbit, [0.22, 1, 0.36, 1], "Orbit easing curve matches design tokens");
});

test("color tokens comply with contrast guidelines", () => {
  // Relative luminance calculation for WCAG contrast
  function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return (a[0] ?? 0) * 0.2126 + (a[1] ?? 0) * 0.7152 + (a[2] ?? 0) * 0.0722;
  }

  function getContrast(hex1: string, hex2: string): number {
    const parse = (hex: string) => {
      const cleaned = hex.replace("#", "");
      return [
        parseInt(cleaned.substring(0, 2), 16),
        parseInt(cleaned.substring(2, 4), 16),
        parseInt(cleaned.substring(4, 6), 16),
      ] as const;
    };
    const [r1, g1, b1] = parse(hex1);
    const [r2, g2, b2] = parse(hex2);
    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  const obsidian = "#08090C";
  const titanium = "#D9DEE5";
  const silver = "#8C96A3";
  const ion = "#B6E36A";

  const titaniumContrast = getContrast(titanium, obsidian);
  const silverContrast = getContrast(silver, obsidian);
  const ionContrast = getContrast(ion, obsidian);

  // WCAG AA requirement for body text is >= 4.5:1
  assert.ok(titaniumContrast >= 4.5, `Titanium contrast should be >= 4.5:1 (got ${titaniumContrast.toFixed(2)})`);
  assert.ok(silverContrast >= 4.5, `Silver contrast should be >= 4.5:1 (got ${silverContrast.toFixed(2)})`);
  assert.ok(ionContrast >= 4.5, `Ion Green contrast should be >= 4.5:1 (got ${ionContrast.toFixed(2)})`);
});
