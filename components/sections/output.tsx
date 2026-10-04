"use client";

import {
  FlowPeek,
  GapPeek,
  KpiPeek,
  PeekCard,
  RisksPeek,
  RoadmapPeek,
  StakeholdersPeek,
  ToolsPeek,
} from "@/components/ui/peeks";
import { Section } from "@/components/ui/section";

/**
 * The output. The rule in the product is blunt — the document is graphics plus
 * short bullets, never paragraphs — so the page shows the vocabulary rather
 * than describing it.
 */
export function Output() {
  return (
    <Section id="document" className="output">
      <div className="veil" />

      <header className="sec-head sec-head-wide" data-reveal>
        <p className="eyebrow">
          <span className="eyebrow-index">05</span> The output
        </p>
        <h2 className="display h-1">
          The document is <span className="grad-text">drawn</span>,
          <br />
          not written.
        </h2>
        <p className="lede lede-wide">
          Goals, KPIs, named tools with their trade-offs, a roadmap with owners and dates. Every
          section leads with a graphic filled from your own conversation — bullets underneath, no
          paragraphs anywhere.
        </p>
      </header>

      <div className="peek-grid">
        <PeekCard title="At a glance" tag="agxp-kpi">
          <KpiPeek />
        </PeekCard>

        <PeekCard title="Today vs target" tag="agxp-gap">
          <GapPeek />
        </PeekCard>

        <PeekCard title="Measures" tag="agxp-roadmap">
          <RoadmapPeek />
        </PeekCard>

        {/* The flow block is the one that needs real width, so it takes a row of
            its own and the grid is left without a hole in it. */}
        <PeekCard title="Process: today and tomorrow" tag="agxp-flow" className="peek-full">
          <FlowPeek />
        </PeekCard>

        <PeekCard title="Risks" tag="agxp-risks">
          <RisksPeek />
        </PeekCard>

        <PeekCard title="Stakeholders" tag="agxp-stakeholders">
          <StakeholdersPeek />
        </PeekCard>

        <PeekCard title="Tools and technologies" tag="table">
          <ToolsPeek />
        </PeekCard>
      </div>

      <p className="sec-foot" data-reveal>
        Ask for a change and it rebuilds the whole document — never a patched section.
      </p>
    </Section>
  );
}
