/**
 * One scroll source of truth, shared by the DOM and the WebGL scene.
 *
 * The 3D scene has to react on every frame, and React state at 120fps is a
 * non-starter, so scroll lives in this module-level store instead: Lenis writes
 * to it once per frame, `useFrame` reads from it. Nothing here triggers a
 * render.
 *
 * Section positions are measured on resize and cached, never per frame — so
 * reading a section's progress is arithmetic, not a forced reflow.
 */

interface SectionBox {
  el: HTMLElement;
  top: number;
  height: number;
}

class ScrollStore {
  /** Pixels scrolled from the top. */
  y = 0;
  /** 0 at the top of the document, 1 at the bottom. */
  progress = 0;
  /** Signed pixels-per-frame, smoothed. Drives the scene's motion blur/lean. */
  velocity = 0;
  /** Viewport height, cached. */
  vh = typeof window === "undefined" ? 800 : window.innerHeight;
  /** Pointer position, normalised to -1..1, for parallax. */
  pointer = { x: 0, y: 0 };

  private boxes = new Map<string, SectionBox>();

  register(id: string, el: HTMLElement): () => void {
    this.boxes.set(id, { el, top: 0, height: 0 });
    this.measure();
    return () => {
      this.boxes.delete(id);
    };
  }

  measure(): void {
    if (typeof window === "undefined") return;
    this.vh = window.innerHeight;
    const scrollY = window.scrollY;
    for (const box of this.boxes.values()) {
      const rect = box.el.getBoundingClientRect();
      box.top = rect.top + scrollY;
      box.height = rect.height;
    }
  }

  /**
   * How far a section has travelled through the viewport.
   * 0 while it is still fully below the fold, 1 once it has fully left the top.
   */
  sectionProgress(id: string): number {
    const box = this.boxes.get(id);
    if (!box) return 0;
    const span = box.height + this.vh;
    if (span <= 0) return 0;
    const travelled = this.y + this.vh - box.top;
    return clamp01(travelled / span);
  }

  /**
   * 0 → 1 → 0 as a section passes the middle of the screen. Useful for scenes
   * that should bloom in and fade back out rather than run once.
   */
  sectionFocus(id: string): number {
    const p = this.sectionProgress(id);
    return 1 - Math.abs(p - 0.5) * 2;
  }
}

export const scroll = new ScrollStore();

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Maps v from [inMin,inMax] to [outMin,outMax], clamped at both ends. */
export function mapRange(v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number {
  const t = clamp01((v - inMin) / (inMax - inMin || 1));
  return outMin + (outMax - outMin) * t;
}

/** Smoothstep easing — the default for anything scroll-driven here. */
export function ease(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
