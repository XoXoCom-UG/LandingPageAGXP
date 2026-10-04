"use client";

import { useEffect, useRef, useState } from "react";
import { perf } from "@/lib/perf";

/**
 * A small readout for checking a machine: add ?fps to the URL. Shows the
 * frames actually drawn, the quality tier the page settled on, and how many
 * device pixels the canvas covers. Invisible to everyone else.
 */
export function FpsMeter() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOn(new URLSearchParams(window.location.search).has("fps"));
  }, []);

  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const staticStage = !!document.querySelector(".stage-static");
      el.textContent = staticStage
        ? "static backdrop (no GPU)"
        : `${perf.fps} fps · tier ${perf.tier} · dpr ${perf.dpr.toFixed(2)} · ${(perf.pixels / 1e6).toFixed(2)} MP`;
    }, 500);
    return () => window.clearInterval(id);
  }, [on]);

  if (!on) return null;
  return <div ref={ref} className="fps-meter" aria-hidden="true" />;
}
