import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("sitemap.ts and robots.ts exist and disallow internal dev routes", () => {
  const sitemapPath = path.resolve(process.cwd(), "app/sitemap.ts");
  const robotsPath = path.resolve(process.cwd(), "app/robots.ts");
  const notFoundPath = path.resolve(process.cwd(), "app/not-found.tsx");

  assert.ok(fs.existsSync(sitemapPath), "app/sitemap.ts must exist");
  assert.ok(fs.existsSync(robotsPath), "app/robots.ts must exist");
  assert.ok(fs.existsSync(notFoundPath), "app/not-found.tsx must exist");

  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  assert.ok(robotsContent.includes("/dev-styleguide"), "robots.ts must disallow /dev-styleguide");
  assert.ok(robotsContent.includes("/api/"), "robots.ts must disallow /api/");
});
