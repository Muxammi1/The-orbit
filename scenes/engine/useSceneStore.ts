import { useSyncExternalStore } from "react";
import { sceneStore, type SceneStoreState } from "./sceneStore";

export function useSceneStore(): SceneStoreState {
  return useSyncExternalStore(
    sceneStore.subscribe,
    sceneStore.getState,
    sceneStore.getState
  );
}
