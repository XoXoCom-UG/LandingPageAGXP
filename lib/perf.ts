/**
 * Render quality, decided at run time.
 *
 * The same page has to hold up on a laptop at 60 Hz and 100% scaling and on a
 * desktop at 144 Hz, 150% scaling and an integrated GPU — which is four to six
 * times the pixels per second. So quality is a tier that starts optimistic and
 * steps down when the frame rate does:
 *
 *   2 — full: bloom, vignette, beams, all particles
 *   1 — reduced: lower resolution, no beams, fewer particles
 *   0 — minimal: no post-processing, lowest resolution, and the CSS drops
 *       backdrop blur (html.perf-low), which is expensive over a moving canvas
 *
 * Module-level like lib/scroll.ts, so the FPS meter can read it per frame
 * without React renders.
 */

export type Tier = 0 | 1 | 2;

export const perf = {
  tier: 2 as Tier,
  fps: 0,
  dpr: 1,
  /** Canvas size in device pixels, for the meter. */
  pixels: 0,
};

/** Frames per second the scene is allowed to draw, whatever the monitor's refresh rate. */
export const FPS_CAP = 60;

/**
 * The most device pixels the canvas may cover, per tier. A 2560x1440 screen at
 * 150% scaling is 8.3 M device pixels; nobody can tell the difference between
 * that and ~2.4 M for a soft-focus background scene, but the GPU can.
 */
const PIXEL_BUDGET: Record<Tier, number> = { 2: 2_400_000, 1: 1_500_000, 0: 900_000 };
const DPR_CAP: Record<Tier, number> = { 2: 1.5, 1: 1.15, 0: 1 };

/** The device-pixel ratio to render at, given the viewport and the tier. */
export function dprFor(tier: Tier): number {
  if (typeof window === "undefined") return 1;
  const native = window.devicePixelRatio || 1;
  const cssPixels = window.innerWidth * window.innerHeight;
  const byBudget = Math.sqrt(PIXEL_BUDGET[tier] / Math.max(1, cssPixels));
  // Never upscale past native, and never go below 0.6 — under that the scene
  // turns visibly soft even as a background.
  return Math.max(0.6, Math.min(native, DPR_CAP[tier], byBudget));
}

/**
 * True when WebGL would run on the CPU instead of a graphics card — browser
 * hardware acceleration switched off, a blocklisted driver, a remote desktop.
 * The scene is unusable there (single-digit frame rates that also stall the
 * scrolling), so the page shows a static backdrop instead.
 *
 * Two checks, because each catches cases the other misses: the context flag
 * refuses software fallbacks outright where the browser honours it, and the
 * renderer string names the software rasterisers where it does not.
 */
export function softwareRendering(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const strict = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      ?? canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!strict) return true;

    const gl = strict as WebGLRenderingContext;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render driver/i.test(renderer);
  } catch {
    return true;
  }
}

export function applyTierClass(tier: Tier): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("perf-low", tier === 0);
}
