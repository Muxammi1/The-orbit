"use client";

import dynamic from "next/dynamic";
import { Poster } from "@/components/media/Poster";

export const SceneShell = dynamic(
  () => import("@/scenes/engine/SceneCanvas").then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => <Poster alt="Loading atmospheric scene canvas" />,
  }
);
