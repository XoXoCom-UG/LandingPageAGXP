"use client";

import { BetaForm } from "@/components/ui/beta-form";
import { Mascot } from "@/components/ui/mascot";
import { Section } from "@/components/ui/section";

/**
 * The hero, as drawn on the strategy board: the name, the promise, five
 * reasons, the two agents, and the door — a beta key — all on the first screen.
 */
const PROMISES = [
  "Execute your own AI business ideas",
  "Progress your team with AI innovation trends",
  "Foster your company's success with high-quality AI support",
  "Protect your enterprise's data with our 100% private service — no user data is visible",
  "Achieve your project goals with AgentiX's AI Coaches and Consultants",
];

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
          Agenti<span className="grad-text">X</span>
          <br />
          Projects
        </h1>

        <p className="hero-tagline" data-reveal style={{ ["--reveal-delay" as string]: "170ms" }}>
          {/* Non-breaking hyphen: on a phone the line must not split inside the name. */}
          Train your AI Project&#8209;Agents
        </p>

        <ul className="glass hero-promises" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
          {PROMISES.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <div className="hero-pair" data-reveal style={{ ["--reveal-delay" as string]: "320ms" }}>
          <span className="hero-pair-item">
            <Mascot role="consultant" size={30} level={3} state="idle" />
            Consultant <em>→ Execution &amp; Growth</em>
          </span>
          <span className="hero-pair-sep" />
          <span className="hero-pair-item">
            <Mascot role="coach" size={30} level={3} state="listening" />
            Coach <em>→ Process &amp; Support</em>
          </span>
        </div>

        <div className="hero-register" data-reveal style={{ ["--reveal-delay" as string]: "400ms" }}>
          <BetaForm />
        </div>
      </div>
    </Section>
  );
}
