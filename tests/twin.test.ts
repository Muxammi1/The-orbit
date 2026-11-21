import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  suggestedQuestionsSchema,
  fallbackAnswersSchema,
} from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("suggested-questions.json contains 6 valid prompt entries", () => {
  const data = loadJson("twin/suggested-questions.json");
  const parsed = suggestedQuestionsSchema.parse(data);

  assert.equal(parsed.questions.length, 6);
  for (const q of parsed.questions) {
    assert.ok(q.id.length > 0);
    assert.ok(q.label.length > 0);
    assert.ok(q.prompt.length > 0);
  }
});

test("fallback-answers.json contains cited sources for every answer", () => {
  const data = loadJson("twin/fallback-answers.json");
  const parsed = fallbackAnswersSchema.parse(data);

  const entries = Object.values(parsed.answers);
  assert.ok(entries.length >= 6);

  for (const item of entries) {
    assert.ok(item.answer.length > 0);
    assert.ok(item.sources.length > 0, `Answer ${item.id} must have at least one source`);
  }

  assert.ok(parsed.defaultFallback.answer.length > 0);
  assert.ok(parsed.defaultFallback.sources.length > 0);
});

test("twin persona enforces third-person and strict veracity", () => {
  const personaPath = path.join(contentDir, "twin", "persona.md");
  assert.ok(fs.existsSync(personaPath), "persona.md must exist");

  const raw = fs.readFileSync(personaPath, "utf-8").toLowerCase();
  assert.ok(raw.includes("third person") || raw.includes("third-person"), "Must enforce third-person voice");
  assert.ok(raw.includes("fabricat") || raw.includes("invent") || raw.includes("speculat"), "Must forbid fabrication");
});
