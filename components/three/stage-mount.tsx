"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { applyTierClass, softwareRendering } from "@/lib/perf";

/**
 * The WebGL scene is client-only and heavy, so it is split out of the initial
 * payload: the page renders, reads and scrolls perfectly with nothing but CSS,
 * and the scene fades in behind it once it has loaded.
 */
const Stage = dynamic(() => import("@/components/three/stage").then(m => m.Stage), {
  ssr: false,
  loading: () => null,
});

/**
 * Mounts the 3D scene only where a graphics card will draw it. Without one
 * (hardware acceleration off, which is exactly what made the page crawl on a
 * desktop Brave) the scene would run on the CPU and drag the scrolling down
 * with it, so those visitors get a static backdrop in the same light instead,
 * and the heavy CSS effects are switched off with it.
 */
export function StageMount() {
  const [mode, setMode] = useState<"pending" | "webgl" | "static">("pending");

  useEffect(() => {
    // ?static forces the fallback, to see what those visitors get.
    const forced = new URLSearchParams(window.location.search).has("static");
    if (forced || softwareRendering()) {
      applyTierClass(0);
      setMode("static");
    } else {
      setMode("webgl");
    }
  }, []);

  if (mode === "webgl") return <Stage />;
  if (mode === "static") return <div className="stage stage-static" aria-hidden="true" />;
  return null;
}
