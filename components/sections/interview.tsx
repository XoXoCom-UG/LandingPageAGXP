"use client";

import { ChatPeek, PeekCard, RailPeek } from "@/components/ui/peeks";
import { Section } from "@/components/ui/section";

/**
 * The interview is the product's actual opinion: depth comes from staying on
 * one question, not from firing a list of them. Worth showing, because it is
 * the part nobody expects.
 */
export function Interview() {
  return (
    <Section id="interview" tall className="interview">
      <div className="veil" />

      <div className="split">
        <div className="split-text">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-index">03</span> The interview
          </p>
          <h2 className="display h-1" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            It interviews you.
            <br />
            <span className="grad-text">One question at a time.</span>
          </h2>
          <p className="lede" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            Eight stations for the Consultant, six for the Coach. It stays on one until it actually
            understands it — and it keeps asking until you give it a number.
          </p>

          <ul className="facts" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
            <li>
              <b>Never</b> a list of questions
            </li>
            <li>
              <b>2–4</b> follow-ups per station
            </li>
            <li>
              <b>Numbers</b> or a concrete example, every time
            </li>
            <li>
              <b>Questions</b>, not answers — the call stays yours
            </li>
          </ul>
        </div>

        <div className="split-peek">
          <PeekCard title="Consultant · station 4 of 8" tag="[[PROGRESS: 45]]">
            <RailPeek total={8} done={3} label="4/8 Pain points" progress={45} />
            <ChatPeek />
          </PeekCard>
        </div>
      </div>
    </Section>
  );
}
