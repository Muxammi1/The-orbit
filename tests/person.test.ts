import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { personSchema, timelineSchema } from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("person.json has exactly four required storytelling chapters", () => {
  const data = loadJson("person.json");
  const parsed = personSchema.parse(data);

  assert.equal(parsed.chapters.length, 4, "Must have exactly 4 chapters");
  const titles = parsed.chapters.map((c) => c.title);
  assert.deepEqual(titles, ["Curiosity", "Engineering", "Research", "Individuality"]);

  parsed.chapters.forEach((c, idx) => {
    assert.equal(c.number, String(idx + 1).padStart(2, "0"));
    assert.ok(c.headline.length > 5);
    assert.ok(c.content.length > 5);
    assert.ok(c.revealLabel.length > 3);
    assert.ok(c.revealContent.length > 5);
  });
});

test("timeline.json milestones cover academic, professional, and research categories", () => {
  const data = loadJson("timeline.json");
  const parsed = timelineSchema.parse(data);

  const categories = new Set(parsed.milestones.map((m) => m.category));
  assert.ok(categories.has("academic"), "Timeline must include academic milestones");
  assert.ok(categories.has("professional"), "Timeline must include professional milestones");
  assert.ok(categories.has("research"), "Timeline must include research milestones");
});

test("planned milestones have distinct status and required fields", () => {
  const data = loadJson("timeline.json");
  const parsed = timelineSchema.parse(data);

  const planned = parsed.milestones.filter((m) => m.status === "planned");
  assert.ok(planned.length >= 1, "At least one planned future milestone exists");
  planned.forEach((p) => {
    assert.ok(p.title.length > 0);
    assert.ok(p.organization.length > 0);
    assert.ok(p.date.length > 0);
  });
});
