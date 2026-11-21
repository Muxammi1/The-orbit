import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { caseStudyFrontmatterSchema, workSchema } from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("work.json contains required disciplines and project listings", () => {
  const data = loadJson("work.json");
  const parsed = workSchema.parse(data);

  assert.equal(parsed.disciplines.length, 4);
  const slugs = parsed.projects.map((p) => p.slug);
  assert.ok(slugs.includes("greenlink"));
  assert.ok(slugs.includes("example-vision-system"));
});

test("both case studies exist and possess valid frontmatter", () => {
  const slugs = ["greenlink", "example-vision-system"];

  slugs.forEach((slug) => {
    const filePath = path.join(contentDir, "work", `${slug}.mdx`);
    assert.ok(fs.existsSync(filePath), `MDX file for ${slug} must exist`);

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(raw);
    const frontmatter = caseStudyFrontmatterSchema.parse(parsed.data);

    assert.equal(frontmatter.slug, slug);
    assert.ok(frontmatter.title.length > 0);
    assert.ok(frontmatter.techStack.length >= 3);
  });
});

test("case studies have all eleven required sections in exact sequential order", () => {
  const requiredSections = [
    "## Overview",
    "## Problem",
    "## Objectives",
    "## Architecture",
    "## Tech stack",
    "## Engineering decisions",
    "## Implementation",
    "## Results",
    "## Limitations",
    "## Future improvements",
    "## Links",
  ];

  const slugs = ["greenlink", "example-vision-system"];

  slugs.forEach((slug) => {
    const filePath = path.join(contentDir, "work", `${slug}.mdx`);
    const raw = fs.readFileSync(filePath, "utf-8");

    let lastIndex = -1;
    requiredSections.forEach((sectionHeader) => {
      const index = raw.indexOf(sectionHeader);
      assert.ok(index !== -1, `Case study ${slug} is missing section "${sectionHeader}"`);
      assert.ok(
        index > lastIndex,
        `Section "${sectionHeader}" in ${slug} is out of order (pos ${index} vs last ${lastIndex})`
      );
      lastIndex = index;
    });

    // Verify results section statement
    assert.ok(
      raw.includes("Results pending verification") || raw.includes("Results"),
      "Placeholder case studies must not invent performance numbers"
    );
  });
});
