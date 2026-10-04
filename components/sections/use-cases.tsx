"use client";

import { Section } from "@/components/ui/section";

/**
 * The test cases from the strategy board. Two deliberately different worlds,
 * so the reader stops thinking "this is for IT projects" and starts thinking
 * "this is for my project".
 *
 * Named generically on purpose: putting a real company's name on a public page
 * as a test case needs that company's OK first. See README.
 */
const CASES = [
  {
    tag: "Infrastructure",
    title: "Rail route planning with AI tooling",
    consultant: "Maps how routes are planned today, where AI tooling can take over, and what it has to save.",
    coach: "Brings the planners and the approval chain along — the people who have to trust the new tool.",
  },
  {
    tag: "Media",
    title: "Producing videos for YouTube",
    consultant: "Lays out the pipeline from idea to upload and which AI tools fit which step, at what cost per video.",
    coach: "Works out who scripts, films and edits, and how the team takes on the new way of working.",
  },
];

export function UseCases() {
  return (
    <Section id="cases" tall className="cases">
      <div className="veil" />

      <header className="sec-head sec-head-center" data-reveal>
        <p className="eyebrow">
          <span className="eyebrow-index">06</span> Test cases
        </p>
        <h2 className="display h-1">
          From rail routes
          <br />
          <span className="grad-text">to YouTube.</span>
        </h2>
        <p className="lede lede-wide lede-center">
          What we are running through the two agents right now. Different worlds, same two documents
          at the end.
        </p>
      </header>

      <div className="case-grid">
        {CASES.map((c, i) => (
          <article
            key={c.title}
            className="glass glass-lit case-card"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
          >
            <span className="marker">{c.tag}</span>
            <h3 className="case-title">{c.title}</h3>
            <dl className="case-roles">
              <div>
                <dt>Consultant · Execution &amp; Growth</dt>
                <dd>{c.consultant}</dd>
              </div>
              <div>
                <dt>Coach · Process &amp; Support</dt>
                <dd>{c.coach}</dd>
              </div>
            </dl>
            <p className="case-out">
              <span>Transformation Concept</span>
              <span>Change Plan</span>
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
