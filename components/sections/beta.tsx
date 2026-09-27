"use client";

import { Monogram } from "@/components/brand/logo";
import { Section } from "@/components/ui/section";

/**
 * The close.
 *
 * The waiting list is not live yet, so this section does not pretend to collect
 * addresses — it points at a mailbox and says plainly where things stand. Swap
 * BETA_CONTACT for the real signup URL once the list exists.
 */
const BETA_CONTACT = "mailto:beta@agentixprojects.com?subject=AgXP%20beta%20token";

export function Beta() {
  return (
    <Section id="beta" tall className="beta">
      <div className="veil" />

      <div className="beta-inner">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow-index">07</span> Access
        </p>

        <h2 className="display h-1" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          Beta tokens,
          <br />
          <span className="grad-text">handed out in batches.</span>
        </h2>

        <p className="lede lede-center" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
          One token opens one workspace, with both agents in it. The waiting list opens soon.
        </p>

        <div className="hero-actions" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
          <a href={BETA_CONTACT} className="btn btn-primary">
            Ask for a token
          </a>
          <a href="#duo" className="btn btn-ghost">
            Read it again
          </a>
        </div>

        <ul className="beta-facts" data-reveal style={{ ["--reveal-delay" as string]: "320ms" }}>
          <li>
            <b>5</b>
            <span>agent profiles</span>
          </li>
          <li>
            <b>14</b>
            <span>interview stations</span>
          </li>
          <li>
            <b>6</b>
            <span>visual block types</span>
          </li>
          <li>
            <b>∞</b>
            <span>projects, one memory</span>
          </li>
        </ul>

        <Monogram className="beta-monogram" />
      </div>
    </Section>
  );
}
