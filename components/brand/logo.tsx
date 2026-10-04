"use client";

/**
 * The AgxP mark.
 *
 * Two paths enter a rounded frame from opposite corners and cross in the
 * middle — the Consultant and the Coach meeting on one project. The crossing is
 * the "x" in AgxP, and it is also the only lit point in the mark, because the
 * whole product is about what happens where those two lines meet.
 *
 * Drawn from `currentColor` and the accent variables, so it re-colours with the
 * rest of the page and works at 20px in the nav and at 200px in the hero.
 */
export function Mark({ size = 40, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <svg
      className={`mark${animated ? " mark-animated" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mark-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary-soft)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <radialGradient id="mark-core">
          <stop offset="0%" stopColor="var(--primary-soft)" />
          <stop offset="100%" stopColor="var(--primary-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the project: the frame both agents work inside */}
      <rect
        className="mark-frame"
        x="3.5"
        y="3.5"
        width="41"
        height="41"
        rx="13"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.6"
      />

      {/* the glow at the crossing */}
      <circle className="mark-halo" cx="24" cy="24" r="13" fill="url(#mark-core)" opacity="0.5" />

      {/* consultant path, top-left to bottom-right */}
      <path
        className="mark-path mark-path-a"
        d="M13 13 C 19 19, 21 21, 24 24 C 27 27, 29 29, 35 35"
        stroke="url(#mark-stroke)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* coach path, top-right to bottom-left */}
      <path
        className="mark-path mark-path-b"
        d="M35 13 C 29 19, 27 21, 24 24 C 21 27, 19 29, 13 35"
        stroke="url(#mark-stroke)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* the two agents, and the point where they meet */}
      <circle className="mark-node" cx="13" cy="13" r="2.6" fill="var(--primary-soft)" />
      <circle className="mark-node mark-node-b" cx="35" cy="13" r="2.6" fill="var(--primary-soft)" />
      <circle className="mark-core" cx="24" cy="24" r="3.4" fill="currentColor" />
      <circle className="mark-core-ring" cx="24" cy="24" r="6.2" stroke="var(--primary-soft)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/** Mark plus wordmark. The `x` is the mark echoed in type. */
export function Logo({ size = 34, compact = false }: { size?: number; compact?: boolean }) {
  return (
    <span className="logo">
      <Mark size={size} />
      {!compact && (
        <span className="logo-word">
          <span className="logo-name">
            Agenti<span className="logo-x">X</span>
          </span>
          <span className="logo-sub">Projects</span>
        </span>
      )}
    </span>
  );
}

/** The short form — used big, as a graphic element. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span className={`monogram ${className}`.trim()} aria-label="AgxP">
      Ag<span className="monogram-x">x</span>P
    </span>
  );
}
