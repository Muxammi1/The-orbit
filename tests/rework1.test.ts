import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("components/stage/Stage.tsx exists and is wired to Drei View", () => {
  const stagePath = path.resolve(process.cwd(), "components/stage/Stage.tsx");
  assert.ok(fs.existsSync(stagePath), "Stage component must exist");

  const content = fs.readFileSync(stagePath, "utf-8");
  assert.ok(content.includes("View"), "Stage must use Drei View");
  assert.ok(content.includes("PerspectiveCamera"), "Stage must support camera prop");
  assert.ok(content.includes("fallback"), "Stage must support fallback prop");
  assert.ok(content.includes("IntersectionObserver"), "Stage must track viewport visibility");
});

test("HeroSculpture implements exact gyroscope parameters", () => {
  const sculpturePath = path.resolve(process.cwd(), "scenes/hero/HeroSculpture.tsx");
  assert.ok(fs.existsSync(sculpturePath), "HeroSculpture must exist");

  const content = fs.readFileSync(sculpturePath, "utf-8");

  // Verify all 5 ring radius and tube thickness values
  assert.ok(content.includes("2.6") && content.includes("0.07"), "Ring 1 radius 2.6 tube 0.07");
  assert.ok(content.includes("2.15") && content.includes("0.09"), "Ring 2 radius 2.15 tube 0.09");
  assert.ok(content.includes("1.7") && content.includes("0.06"), "Ring 3 radius 1.7 tube 0.06");
  assert.ok(content.includes("1.3") && content.includes("0.1"), "Ring 4 radius 1.3 tube 0.1");
  assert.ok(content.includes("0.9") && content.includes("0.05"), "Ring 5 radius 0.9 tube 0.05");

  // Verify core sphere and emissive green
  assert.ok(content.includes("0.22"), "Core radius must be 0.22");
  assert.ok(content.includes("#B6E36A"), "Core must be Ion Green #B6E36A");

  // Verify MeshPhysicalMaterial and procedural brushed metal texture
  assert.ok(content.includes("MeshPhysicalMaterial"), "Rings must use MeshPhysicalMaterial");
  assert.ok(content.includes("createBrushedMetalTexture"), "Procedural brushed metal texture generator must exist");

  // Verify Lightformer strips inside Environment
  assert.ok(content.includes("Lightformer"), "Must use Lightformer reflection strips");
  assert.ok(content.includes("Environment"), "Must use Environment lighting");
});

test("SceneCanvas mounts single Canvas with View.Port", () => {
  const canvasPath = path.resolve(process.cwd(), "scenes/engine/SceneCanvas.tsx");
  const content = fs.readFileSync(canvasPath, "utf-8");

  assert.ok(content.includes("View.Port"), "Canvas must mount Drei View.Port");
  assert.ok(content.includes("pointer-events-none"), "Canvas must be fixed with pointer-events-none");
  assert.ok(content.includes("eventSource"), "Canvas must bind eventSource");
});

test("EntryHero two-column separation and clutter reduction", () => {
  const heroPath = path.resolve(process.cwd(), "components/entry/EntryHero.tsx");
  const content = fs.readFileSync(heroPath, "utf-8");

  // Verify 42% left text and 58% right 3D stage on desktop
  assert.ok(content.includes("lg:w-[42%]"), "Text column must be 42% on desktop");
  assert.ok(content.includes("lg:w-[58%]"), "Stage column must be 58% on desktop");

  // Verify clutter removed: no RING 01 badge
  assert.ok(!content.includes("RING 01 / ENTRY"), "Cluttered RING 01 badge must be removed");

  // Verify stage component integration
  assert.ok(content.includes("<Stage"), "Hero must mount 3D Stage");
  assert.ok(content.includes("<HeroSculpture"), "Hero must mount HeroSculpture inside Stage");
});
