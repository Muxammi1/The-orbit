"use client";

import { RingsMesh } from "./RingsMesh";

export function RingsScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <RingsMesh />
    </>
  );
}
