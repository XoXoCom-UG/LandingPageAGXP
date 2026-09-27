"use client";

import { PeekCard } from "@/components/ui/peeks";
import { PickerPeek } from "@/components/ui/peeks";
import { Section } from "@/components/ui/section";

/**
 * The roster. Consultant and Coach are the two seats; who sits in them is your
 * choice, and the pick changes the lens rather than the process — every profile
 * runs the same interview toward the same two documents.
 */
const CONSULTANTS = [
  { name: "AI Strategy Consultant", focus: "Strategy & AI transformation" },
  { name: "Business Analyst", focus: "Process & requirements" },
  { name: "Solution Architect", focus: "Systems & integration" },
];

const COACHES = [
  { name: "Change Management Coach", focus: "Change & adoption" },
  { name: "IT-Coaching Coach", focus: "IT coaching & enablement" },
];

export function Roster() {
  return (
    <Section id="roster" tall className="roster">
      <div className="veil" />

      <div className="split">
        <div className="split-text">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-index">02</span> The roster
          </p>
          <h2 className="display h-1" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            Pick who
            <br />
            <span className="grad-text">you work with.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            Both seats have profiles. A strategist reads your project differently than an architect,
            and a change coach differently than an enablement coach — same interview, different lens.
          </p>

          <div className="roster-lists" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
            <div>
              <span className="roster-head">Consultant seat</span>
              <ul>
                {CONSULTANTS.map(c => (
                  <li key={c.name}>
                    <b>{c.name}</b>
                    <span>{c.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="roster-head">Coach seat</span>
              <ul>
                {COACHES.map(c => (
                  <li key={c.name}>
                    <b>{c.name}</b>
                    <span>{c.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="split-peek">
          <PeekCard title="Your consultant" tag="picker">
            <PickerPeek />
          </PeekCard>
        </div>
      </div>
    </Section>
  );
}
