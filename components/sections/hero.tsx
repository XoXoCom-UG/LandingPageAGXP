"use client";

import { Mascot } from "@/components/ui/mascot";
import { Section } from "@/components/ui/section";

/**
 * The hero says one thing and shows one object. Everything else about the
 * product is earned further down the page.
 */
export function Hero() {
  return (
    <Section id="hero" tall className="hero">
      <div className="veil" />
      <div className="hero-inner">
        <p className="eyebrow" data-reveal>
          <span className="chip chip-live" style={{ marginLeft: 2 }}>
            <span className="chip-dot" />
            Closed beta
          </span>
        </p>

        <h1 className="display h-hero hero-title" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
          Two agents.
          <br />
          <span className="grad-text">One project.</span>
        </h1>

        <p className="lede hero-lede" data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
          An AI Consultant plans your AI or IT transformation with you. An AI Coach gets your people
          through it. Same project, same screen.
        </p>

        <div className="hero-actions" data-reveal style={{ ["--reveal-delay" as string]: "260ms" }}>
          <a href="#beta" className="btn btn-primary">
            Request a beta token
          </a>
          <a href="#duo" className="btn btn-ghost">
            See how it works
          </a>
        </div>

        <div className="hero-pair" data-reveal style={{ ["--reveal-delay" as string]: "340ms" }}>
          <span className="hero-pair-item">
            <Mascot role="consultant" size={30} level={3} state="idle" />
            Consultant <em>→ Transformation Concept</em>
          </span>
          <span className="hero-pair-sep" />
          <span className="hero-pair-item">
            <Mascot role="coach" size={30} level={3} state="listening" />
            Coach <em>→ Change Plan</em>
          </span>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-line" />
        <span className="scroll-hint-label">scroll</span>
      </div>
    </Section>
  );
}
