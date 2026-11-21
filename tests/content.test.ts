import test from "node:test";
import assert from "node:assert/strict";
import {
  siteSchema,
  workSchema,
  stackSchema,
  researchSchema,
  timelineSchema,
} from "../lib/content/schemas.ts";
import fs from "node:fs";
import path from "node:path";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("site.json matches schema and non-negotiables", () => {
  const data = loadJson("site.json");
  const parsed = siteSchema.parse(data);
  assert.equal(parsed.name, "Muzammil Yasir");
  assert.equal(typeof parsed.featureFlags.enable3D, "boolean");
});

test("work.json contains four mandatory disciplines", () => {
  const data = loadJson("work.json");
  const parsed = workSchema.parse(data);
  const disciplineIds = parsed.disciplines.map((d) => d.id);
  assert.ok(disciplineIds.includes("intelligent-systems"));
  assert.ok(disciplineIds.includes("visual-intelligence"));
  assert.ok(disciplineIds.includes("predictive-intelligence"));
  assert.ok(disciplineIds.includes("edge-intelligence"));
  assert.ok(parsed.projects.some((p) => p.slug === "greenlink"));
});

test("stack.json nodes have genuine technical relationships and no fake percentages", () => {
  const data = loadJson("stack.json");
  const parsed = stackSchema.parse(data);
  assert.ok(parsed.nodes.length >= 20);
  assert.ok(parsed.edges.length >= 15);
  // Verify no percentages or proficiency numbers are present in node objects
  parsed.nodes.forEach((node) => {
    assert.equal("percentage" in node, false);
    assert.equal("score" in node, false);
    assert.ok(["verified", "placeholder", "planned"].includes(node.status));
  });
});

test("research.json permits only designated statuses and has no fabricated published items", () => {
  const data = loadJson("research.json");
  const parsed = researchSchema.parse(data);
  parsed.entries.forEach((entry) => {
    assert.ok(["Published", "Presented", "Ongoing", "Exploratory"].includes(entry.status));
    // As per rule 2 & section 5: Seed ONLY Exploratory or Ongoing
    assert.notEqual(entry.status, "Published", "No items may be seeded as Published");
  });
});

test("timeline.json planned items have status 'planned'", () => {
  const data = loadJson("timeline.json");
  const parsed = timelineSchema.parse(data);
  const plannedItem = parsed.milestones.find((m) => m.status === "planned");
  assert.ok(plannedItem, "At least one future milestone is flagged as planned");
});
