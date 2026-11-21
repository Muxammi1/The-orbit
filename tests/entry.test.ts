import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { heroSchema, siteSchema, workSchema } from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("hero.json conforms to schema and non-negotiables", () => {
  const data = loadJson("hero.json");
  const parsed = heroSchema.parse(data);

  assert.equal(parsed.name, "MUZAMMIL YASIR");
  assert.equal(parsed.roleLine, "AI ENGINEER / RESEARCHER / SYSTEMS THINKER");
  assert.ok(parsed.headline.length > 10);
  assert.ok(parsed.headline.includes(parsed.serifWord), "Headline must contain the serif-italic emphasis word");
  assert.equal(parsed.ctas.primary.href, "#work");
  assert.ok(parsed.ctas.secondary.href.includes(".pdf") || parsed.ctas.secondary.href.startsWith("/"));
});

test("hero proof chips draw from featured projects in work.json", () => {
  const workData = loadJson("work.json");
  const work = workSchema.parse(workData);

  const featured = work.projects.filter((p) => p.featured);
  assert.ok(featured.length >= 2, "Hero proof chips must feature at least two initial projects");
  assert.ok(featured.some((p) => p.slug === "greenlink"));
});

test("hero availability status honors site feature flag", () => {
  const siteData = loadJson("site.json");
  const site = siteSchema.parse(siteData);

  // Default in brief: showAvailabilityStatus: false
  assert.equal(site.featureFlags.showAvailabilityStatus, false);
});
