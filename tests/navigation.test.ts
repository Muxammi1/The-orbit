import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { navigationSchema } from "../lib/content/schemas.ts";

const navPath = path.resolve(process.cwd(), "content/navigation.json");

test("navigation items map to all seven required section hashes", () => {
  const raw = fs.readFileSync(navPath, "utf-8");
  const data = navigationSchema.parse(JSON.parse(raw));

  const expectedIds = ["entry", "person", "work", "twin", "stack", "research", "connect"];
  const ids = data.items.map((i) => i.id);

  assert.deepEqual(ids, expectedIds, "All seven canonical section IDs must be present in exact order");
  data.items.forEach((item) => {
    assert.equal(item.href, `#${item.id}`, `Hash link must match #${item.id}`);
    assert.ok(item.ring.startsWith("RING "), "Each item must have a ring prefix label");
  });
});

test("ring index calculation correctly formats ring numbers", () => {
  function formatRing(index: number): string {
    return String(index + 1).padStart(2, "0");
  }

  assert.equal(formatRing(0), "01");
  assert.equal(formatRing(6), "07");
});

test("command center quick actions include CV, Twin, and Connect", () => {
  const raw = fs.readFileSync(navPath, "utf-8");
  const data = navigationSchema.parse(JSON.parse(raw));

  const actionIds = data.actions.map((a) => a.id);
  assert.ok(actionIds.includes("cmd"));
  assert.ok(actionIds.includes("cv"));
  assert.ok(actionIds.includes("contact"));
});
