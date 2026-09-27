"use client";

import { ACCENTS } from "@/lib/accent";
import { useTheme } from "@/lib/theme";
import { Section } from "@/components/ui/section";
import { ThemeToggle } from "@/components/ui/nav";

/**
 * The theming section is the one place where the page is the demo: the swatches
 * below are the app's real accents, and picking one here re-colours this page,
 * the glass and the WebGL scene at once — because all three read the same two
 * custom properties the app reads.
 */
export function Accents() {
  const { accent, setAccent, theme } = useTheme();

  return (
    <Section id="accents" tall className="accents-section">
      <div className="veil" />

      <header className="sec-head sec-head-center" data-reveal>
        <p className="eyebrow">
          <span className="eyebrow-index">06</span> Yours
        </p>
        <h2 className="display h-1">
          Your screen,
          <br />
          <span className="grad-text">your colour.</span>
        </h2>
        <p className="lede lede-wide">
          Six accents, light and dark. Try them here — the whole page, the glass and the scene behind
          it all move together.
        </p>
      </header>

      <div className="swatches" data-reveal>
        {ACCENTS.map((a, i) => (
          <button
            key={a.id}
            type="button"
            className={`swatch${a.id === accent.id ? " is-active" : ""}`}
            onClick={() => setAccent(a)}
            style={{
              ["--sw" as string]: a.soft,
              ["--sw-deep" as string]: a.primary,
              ["--reveal-delay" as string]: `${i * 60}ms`,
            }}
            aria-pressed={a.id === accent.id}
          >
            <span className="swatch-chip" />
            <span className="swatch-label">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="theme-row" data-reveal>
        <span className="muted">Currently {theme}</span>
        <ThemeToggle />
        <span className="muted">Remembered on this device</span>
      </div>
    </Section>
  );
}
