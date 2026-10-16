"use client";

import { useEffect, useState } from "react";
import { ACCENTS } from "@/lib/accent";
import { useTheme } from "@/lib/theme";
import { BETA_REQUEST } from "@/lib/links";
import { Logo } from "@/components/brand/logo";

/**
 * The bar is a door, not a table of contents. During the closed beta there is
 * no login, so the one door is asking for a key.
 */
export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    function onScroll() {
      setLifted(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${lifted ? " is-lifted" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" aria-label="AgentiX Projects, back to top">
          <Logo size={30} />
        </a>

        <div className="nav-tools">
          <ThemeToggle />
          <a href={BETA_REQUEST} className="btn btn-primary nav-request">
            Request a beta key
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * The same six accents the app ships. Picking one writes --primary and
 * --primary-soft on <html>, which re-colours the page, the glass and the 3D
 * scene in a single paint — there is no second theme to keep in sync.
 */
export function AccentPicker({ expanded = false }: { expanded?: boolean }) {
  const { accent, setAccent } = useTheme();

  return (
    <div className={`accents${expanded ? " is-expanded" : ""}`} role="group" aria-label="Accent colour">
      {ACCENTS.map(a => (
        <button
          key={a.id}
          type="button"
          className={`accent-dot${a.id === accent.id ? " is-active" : ""}`}
          style={{ ["--dot" as string]: a.soft, ["--dot-deep" as string]: a.primary }}
          onClick={() => setAccent(a)}
          aria-pressed={a.id === accent.id}
          title={a.label}
        >
          <span className="sr-only">{a.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      data-ready={ready}
    >
      <span className="theme-track">
        <span className="theme-thumb" />
      </span>
      <svg className="theme-icon theme-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <path
            key={deg}
            d="M12 2.6 V4.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </svg>
      <svg className="theme-icon theme-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
