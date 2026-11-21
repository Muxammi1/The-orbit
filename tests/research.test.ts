import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  researchSchema,
  researchEntryFrontmatterSchema,
} from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("research.json complies with schema and has no fabricated published entries", () => {
  const data = loadJson("research.json");
  const parsed = researchSchema.parse(data);

  assert.ok(parsed.statement.length > 0);
  assert.ok(parsed.areas.length >= 4);
  assert.ok(parsed.entries.length >= 2);

  parsed.entries.forEach((entry) => {
    assert.ok(entry.slug.length > 0);
    assert.ok(entry.title.length > 0);
    // Non-negotiable: No fabricated "Published" items
    assert.notEqual(
      entry.status,
      "Published",
      `Research entry ${entry.slug} must not be labeled Published without verification`
    );
  });
});

test("all research entries have matching mdx files with valid frontmatter", () => {
  const data = loadJson("research.json");
  const parsed = researchSchema.parse(data);

  parsed.entries.forEach((entry) => {
    const filePath = path.join(contentDir, "research", `${entry.slug}.mdx`);
    assert.ok(
      fs.existsSync(filePath),
      `Research MDX file for ${entry.slug} must exist at ${filePath}`
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsedMdx = matter(raw);
    const frontmatter = researchEntryFrontmatterSchema.parse(parsedMdx.data);

    assert.equal(frontmatter.slug, entry.slug);
    assert.equal(frontmatter.status, entry.status);
    assert.ok(frontmatter.title.length > 0);
  });
});
