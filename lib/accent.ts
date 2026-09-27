/**
 * The accent palette, taken verbatim from the product (agxp-frontend
 * lib/accent.ts) so a colour picked here is the same colour the app ships.
 *
 * Everything visible — CSS and WebGL alike — is drawn from `primary` and
 * `soft`, which is why writing these two custom properties on <html> re-colours
 * the whole page, glass, glow and 3D scene included.
 */

export interface Accent {
  id: string;
  /** Shown in the picker. Plain words — the audience is not designers. */
  label: string;
  /** The deep tone: fills, borders, the far side of every gradient. */
  primary: string;
  /** The lighter tone: highlights, rings, emissive light in the 3D scene. */
  soft: string;
}

export const ACCENTS: Accent[] = [
  { id: "blue", label: "Blue", primary: "#154E80", soft: "#2E7BC4" },
  { id: "teal", label: "Teal", primary: "#14625C", soft: "#2A9D8F" },
  { id: "violet", label: "Violet", primary: "#453A8C", soft: "#7A6CD4" },
  { id: "amber", label: "Amber", primary: "#8A5514", soft: "#D89434" },
  { id: "rose", label: "Rose", primary: "#8A2F4A", soft: "#D4607F" },
  { id: "graphite", label: "Graphite", primary: "#3C4450", soft: "#77808D" },
];

export const DEFAULT_ACCENT = ACCENTS[0];

export const ACCENT_KEY = "agxp-accent";
export const THEME_KEY = "agxp-theme";

export type Theme = "dark" | "light";

export function accentById(id: string | null | undefined): Accent {
  return ACCENTS.find(a => a.id === id) ?? DEFAULT_ACCENT;
}

/** Paints an accent onto <html>. Safe to call before hydration. */
export function paintAccent(accent: Accent): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--primary", accent.primary);
  root.style.setProperty("--primary-soft", accent.soft);
}
