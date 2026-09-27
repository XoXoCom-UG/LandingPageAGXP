"use client";

/**
 * A band of things the page does not stop to explain. It exists to leave the
 * reader with more questions than answers — which is the job of a site for a
 * product nobody can log into yet.
 */
const TEASERS = [
  "Five agent profiles",
  "Side-by-side panels",
  "Live document reader",
  "Choice chips",
  "Progress rail",
  "Project history",
  "Agent picker",
  "Memory across projects",
  "Light & dark",
  "Six accents",
  "Graphics-only deliverables",
];

export function Marquee() {
  // Rendered twice so the loop has no seam.
  const row = [...TEASERS, ...TEASERS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-item" key={`${t}-${i}`}>
            {t}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
