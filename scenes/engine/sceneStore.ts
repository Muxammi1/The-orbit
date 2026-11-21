export type SceneState = "rings" | "constellation" | "avatar" | "dim";
export type DeviceTier = "high" | "medium" | "low";

export interface SceneStoreState {
  activeSection: string;
  progress: number;
  state: SceneState;
  deviceTier: DeviceTier;
  reducedMotion: boolean;
  pointerInteractive: boolean;
  mouse: { x: number; y: number };
}

type Listener = () => void;

let state: SceneStoreState = {
  activeSection: "entry",
  progress: 0,
  state: "rings",
  deviceTier: "high",
  reducedMotion: false,
  pointerInteractive: false,
  mouse: { x: 0, y: 0 },
};

const listeners = new Set<Listener>();

export const sceneStore = {
  getState(): SceneStoreState {
    return state;
  },

  setState(partial: Partial<SceneStoreState>): void {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
