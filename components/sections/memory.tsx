"use client";

import { Mascot } from "@/components/ui/mascot";
import { Section } from "@/components/ui/section";

const LEVELS = [
  { level: 1, name: "New", note: "First project together" },
  { level: 2, name: "Medium", note: "Antenna lights up" },
  { level: 3, name: "High", note: "Earns its instrument" },
];

/**
 * Memory. The agents carry lessons from one of your projects into the next, and
 * the character visibly grows with them — which is the part people tell each
 * other about.
 */
export function Memory() {
  return (
    <Section id="memory" tall className="memory">
      <div className="veil" />

      <div className="split split-reverse">
        <div className="split-text">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-index">05</span> Memory
          </p>
          <h2 className="display h-1" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            They remember
            <br />
            <span className="grad-text">the last project.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            What an agent learned working with you carries into your next project. The more you build
            together, the further it gets before it has to ask.
          </p>
          <p className="note" data-reveal style={{ ["--reveal-delay" as string]: "220ms" }}>
            Scoped to your account. One user&rsquo;s projects never teach another user&rsquo;s agent.
          </p>
        </div>

        <div className="split-peek">
          <div className="levels" data-reveal>
            {LEVELS.map((l, i) => (
              <figure
                key={l.level}
                className="glass level-card"
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
              >
                <Mascot role="consultant" size={64} level={l.level} state={i === 2 ? "speaking" : "idle"} />
                <figcaption>
                  <b>{l.name}</b>
                  <span>{l.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
