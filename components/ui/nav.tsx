"use client";

import { useEffect, useState } from "react";
import { ACCENTS } from "@/lib/accent";
import { useTheme } from "@/lib/theme";
import { LOGIN_URL } from "@/lib/links";
import { Logo } from "@/components/brand/logo";

/**
 * The bar is a door, not a table of contents: log in, or continue with Google.
 * Both go to the app's own login page, because sessions live on the app's
 * origin — a form here could not sign anyone in over there.
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

        <a href={LOGIN_URL} className="nav-login">
          Log in
        </a>

        <div className="nav-tools">
          <ThemeToggle />
          <a href={LOGIN_URL} className="btn-google">
            <GoogleG />
            <span>Continue with Google</span>
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

/** Google's four-colour G, drawn inline so the bar loads nothing extra. */
function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
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
