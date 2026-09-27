"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ACCENT_KEY,
  DEFAULT_ACCENT,
  THEME_KEY,
  accentById,
  paintAccent,
  type Accent,
  type Theme,
} from "@/lib/accent";

interface ThemeValue {
  theme: Theme;
  accent: Accent;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setAccent: (a: Accent) => void;
  /** False until the stored preference has been read, so nothing animates on load. */
  ready: boolean;
}

const Ctx = createContext<ThemeValue | null>(null);

/**
 * Dark is the default, exactly like the app. The stored choice is read in an
 * inline script before paint (see `themeBootScript`), so this provider only has
 * to catch up with whatever the document already shows — it never re-paints on
 * mount, which is what would cause the flash.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedTheme: string | null = null;
    let storedAccent: string | null = null;
    try {
      storedTheme = window.localStorage.getItem(THEME_KEY);
      storedAccent = window.localStorage.getItem(ACCENT_KEY);
    } catch {
      // Storage blocked — the defaults still apply for this session.
    }
    setThemeState(storedTheme === "light" ? "light" : "dark");
    setAccentState(accentById(storedAccent));
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.style.colorScheme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Ignored: the theme still applies for this session.
    }
  }, []);

  const setAccent = useCallback((next: Accent) => {
    setAccentState(next);
    paintAccent(next);
    try {
      window.localStorage.setItem(ACCENT_KEY, next.id);
    } catch {
      // Ignored: the accent still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains("light") ? "dark" : "light");
  }, [setTheme]);

  const value = useMemo<ThemeValue>(
    () => ({ theme, accent, setTheme, toggleTheme, setAccent, ready }),
    [theme, accent, setTheme, toggleTheme, setAccent, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Runs before first paint, straight from <head>: applies the stored theme class
 * and accent variables so the page never flashes dark-then-light (or blue-then-
 * amber) on reload. Kept as a string because it has to be inline.
 */
export const themeBootScript = `
(function () {
  try {
    var root = document.documentElement;
    // Reveal transitions only exist once JS is running — without this class the
    // page renders fully visible, so a failed or slow bundle never leaves a
    // reader staring at an empty screen.
    root.classList.add("js");
    var t = localStorage.getItem("agxp-theme");
    var a = localStorage.getItem("agxp-accent");
    if (t === "light") { root.classList.add("light"); root.style.colorScheme = "light"; }
    else { root.style.colorScheme = "dark"; }
    var map = {
      blue: ["#154E80", "#2E7BC4"],
      teal: ["#14625C", "#2A9D8F"],
      violet: ["#453A8C", "#7A6CD4"],
      amber: ["#8A5514", "#D89434"],
      rose: ["#8A2F4A", "#D4607F"],
      graphite: ["#3C4450", "#77808D"]
    };
    var c = map[a] || map.blue;
    root.style.setProperty("--primary", c[0]);
    root.style.setProperty("--primary-soft", c[1]);
  } catch (e) {}
})();
`;
