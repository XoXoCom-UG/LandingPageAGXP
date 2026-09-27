"use client";

import dynamic from "next/dynamic";

/**
 * The WebGL scene is client-only and heavy, so it is split out of the initial
 * payload: the page renders, reads and scrolls perfectly with nothing but CSS,
 * and the scene fades in behind it once it has loaded.
 */
const Stage = dynamic(() => import("@/components/three/stage").then(m => m.Stage), {
  ssr: false,
  loading: () => null,
});

export function StageMount() {
  return <Stage />;
}
