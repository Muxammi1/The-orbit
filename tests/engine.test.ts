import test from "node:test";
import assert from "node:assert/strict";
import { sceneStore } from "../scenes/engine/sceneStore.ts";
import { getSceneStateForSection, SECTION_SCENE_MAP } from "../scenes/engine/registry.ts";

test("sceneStore manages state transitions and subscription lifecycle", () => {
  let callCount = 0;
  const unsubscribe = sceneStore.subscribe(() => {
    callCount++;
  });

  sceneStore.setState({ activeSection: "twin", state: "avatar" });
  assert.equal(sceneStore.getState().activeSection, "twin");
  assert.equal(sceneStore.getState().state, "avatar");
  assert.equal(callCount, 1);

  unsubscribe();
  sceneStore.setState({ activeSection: "entry", state: "rings" });
  assert.equal(callCount, 1, "Unsubscribed listener is not notified");
});

test("registry maps sections to required scene states", () => {
  assert.equal(getSceneStateForSection("entry"), "rings");
  assert.equal(getSceneStateForSection("person"), "dim");
  assert.equal(getSceneStateForSection("work"), "dim");
  assert.equal(getSceneStateForSection("twin"), "avatar");
  assert.equal(getSceneStateForSection("stack"), "constellation");
  assert.equal(getSceneStateForSection("research"), "dim");
  assert.equal(getSceneStateForSection("connect"), "rings");
});

test("all seven canonical sections are registered in SECTION_SCENE_MAP", () => {
  const sections = ["entry", "person", "work", "twin", "stack", "research", "connect"];
  sections.forEach((s) => {
    assert.ok(s in SECTION_SCENE_MAP, `Section ${s} must exist in registry map`);
  });
});
