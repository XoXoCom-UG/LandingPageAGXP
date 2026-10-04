"use client";

import { Monogram } from "@/components/brand/logo";
import { BetaForm } from "@/components/ui/beta-form";
import { Section } from "@/components/ui/section";

/**
 * The close: the same beta-key door as the hero, for whoever read the whole
 * page first. Keys are minted in the app and redeemed there.
 */

export function Beta() {
  return (
    <Section id="beta" tall className="beta">
      <div className="veil" />

      <div className="beta-inner">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow-index">08</span> Access
        </p>

        <h2 className="display h-1" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          Beta keys,
          <br />
          <span className="grad-text">handed out in batches.</span>
        </h2>

        <p className="lede lede-center" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
          One key opens one workspace, with both agents in it. Got an invitation? Enter it below.
        </p>

        <div className="beta-register" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
          <BetaForm />
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
