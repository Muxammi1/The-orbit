import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("cv page route exists and is configured for fast load without 3D canvas", () => {
  const cvPagePath = path.resolve(process.cwd(), "app/cv/page.tsx");
  assert.ok(fs.existsSync(cvPagePath), "app/cv/page.tsx must exist");

  const content = fs.readFileSync(cvPagePath, "utf-8");

  // Verify no 3D Canvas is imported or rendered
  assert.ok(!content.includes("SceneCanvas"), "CV page must not mount SceneCanvas");
  assert.ok(!content.includes("@react-three"), "CV page must not use R3F");

  // Verify print media styling exists
  assert.ok(content.includes("print:"), "CV page must support print styles");

  // Verify JSON-LD ProfilePage
  assert.ok(content.includes("ProfilePage"), "CV page must provide structured ProfilePage metadata");
});
