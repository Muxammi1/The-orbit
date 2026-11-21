import type { SceneState } from "./sceneStore";

export const SECTION_SCENE_MAP: Record<string, SceneState> = {
  entry: "rings",
  person: "dim",
  work: "dim",
  twin: "avatar",
  stack: "constellation",
  research: "dim",
  connect: "rings",
};

export function getSceneStateForSection(sectionId: string): SceneState {
  return SECTION_SCENE_MAP[sectionId] ?? "dim";
}
