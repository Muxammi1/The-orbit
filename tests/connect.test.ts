import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { connectSchema } from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("connect.json complies with schema and contains direct links and reasons", () => {
  const data = loadJson("connect.json");
  const parsed = connectSchema.parse(data);

  assert.ok(parsed.headline.length > 0);
  assert.ok(parsed.reasons.length >= 3);
  assert.ok(parsed.directLinks.length >= 4);

  // Check required links
  const labels = parsed.directLinks.map((l) => l.label.toLowerCase());
  assert.ok(labels.some((l) => l.includes("email")));
  assert.ok(labels.some((l) => l.includes("linkedin")));
  assert.ok(labels.some((l) => l.includes("github")));
  assert.ok(labels.some((l) => l.includes("cv")));
});

test("all direct links have non-empty hrefs and types", () => {
  const data = loadJson("connect.json");
  const parsed = connectSchema.parse(data);

  parsed.directLinks.forEach((link) => {
    assert.ok(link.href.length > 0);
    assert.ok(link.type.length > 0);
  });
});
