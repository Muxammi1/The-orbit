import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { stackSchema } from "../lib/content/schemas.ts";

const contentDir = path.resolve(process.cwd(), "content");

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf-8"));
}

test("stack.json contains exact 5 required system clusters", () => {
  const data = loadJson("stack.json");
  const parsed = stackSchema.parse(data);

  assert.equal(parsed.clusters.length, 5);
  const clusterIds = parsed.clusters.map((c) => c.id);
  assert.ok(clusterIds.includes("ai-ml"));
  assert.ok(clusterIds.includes("llm-eng"));
  assert.ok(clusterIds.includes("computer-vision"));
  assert.ok(clusterIds.includes("backend"));
  assert.ok(clusterIds.includes("infrastructure"));
});

test("stack nodes have valid cluster assignments and no fake percentages", () => {
  const data = loadJson("stack.json");
  const parsed = stackSchema.parse(data);

  assert.ok(parsed.nodes.length >= 20);

  parsed.nodes.forEach((node) => {
    assert.ok(node.id.length > 0);
    assert.ok(node.label.length > 0);
    assert.ok(node.description.length > 0);

    // NON-NEGOTIABLE: No percentage, proficiency, or score values
    const rawNode = node as unknown as Record<string, unknown>;
    assert.equal(rawNode.percentage, undefined);
    assert.equal(rawNode.proficiency, undefined);
    assert.equal(rawNode.score, undefined);
    assert.equal(rawNode.years, undefined);
  });
});

test("stack edges connect existing nodes only", () => {
  const data = loadJson("stack.json");
  const parsed = stackSchema.parse(data);

  const nodeIds = new Set(parsed.nodes.map((n) => n.id));

  assert.ok(parsed.edges.length > 0);
  parsed.edges.forEach((edge) => {
    assert.ok(nodeIds.has(edge.from), `Edge origin ${edge.from} must exist in nodes`);
    assert.ok(nodeIds.has(edge.to), `Edge destination ${edge.to} must exist in nodes`);
    assert.ok(edge.relation.length > 0);
  });
});
