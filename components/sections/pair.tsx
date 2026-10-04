"use client";

import { Mascot } from "@/components/ui/mascot";
import { Section } from "@/components/ui/section";

/**
 * The pair. Two agents that ask different questions, because a transformation
 * that works on paper and fails in the corridor is still a failure.
 */
export function Pair() {
  return (
    <Section id="duo" tall className="pair">
      <div className="veil" />

      <header className="sec-head" data-reveal>
        <p className="eyebrow">
          <span className="eyebrow-index">01</span> The pair
        </p>
        <h2 className="display h-1">
          One plans <span className="grad-text">the work</span>.
          <br />
          The other plans <span className="grad-text">the people</span>.
        </h2>
      </header>

      <div className="pair-grid">
        <AgentCard
          role="consultant"
          name="Consultant"
          deliverable="Execution & Growth · Transformation Concept"
          line="Plans the project with you, station by station: from where you stand today to a concrete concept with goals, KPIs, named tools and a roadmap — the document you take into a budget decision."
          stations={["Current process", "People & systems", "Pain points", "Target state", "Success metrics"]}
          delay={0}
        />
        <AgentCard
          role="coach"
          name="Coach"
          deliverable="Process & Support · Change Plan"
          line="Your sparring partner for the half that decides whether it lands: resistance, team dynamics, communication. Not ready-made answers — the right questions, until you find the next step yourself."
          stations={["Affected roles", "Mood & resistance", "Champions", "Skills & training", "Rollout"]}
          delay={120}
        />
      </div>

      <p className="sec-foot" data-reveal>
        Both run in the same screen, side by side. Neither waits for the other.
      </p>
    </Section>
  );
}

function AgentCard({
  role,
  name,
  deliverable,
  line,
  stations,
  delay,
}: {
  role: "consultant" | "coach";
  name: string;
  deliverable: string;
  line: string;
  stations: string[];
  delay: number;
}) {
  return (
    <article
      className="glass glass-lit agent-card"
      data-reveal
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      <div className="agent-card-head">
        <Mascot role={role} size={54} level={3} state={role === "coach" ? "listening" : "thinking"} />
        <div>
          <h3 className="agent-name">{name}</h3>
          <p className="agent-deliverable">{deliverable}</p>
        </div>
      </div>

      <p className="agent-line">{line}</p>

      <ul className="agent-stations">
        {stations.map(s => (
          <li key={s}>
            <span className="agent-station-dot" />
            {s}
          </li>
        ))}
        <li className="agent-station-more">+ more</li>
      </ul>
    </article>
  );
}
