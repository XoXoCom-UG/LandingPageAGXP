"use client";

import { useInView } from "@/lib/hooks";

/**
 * Sneak peeks.
 *
 * Every block below is a miniature of a surface that exists in the product: the
 * interview rail, a choice chip, and the visual vocabulary the deliverables are
 * assembled from. The numbers are from a plausible logistics case, not from a
 * real customer — enough to recognise the shape of the thing, not enough to
 * give the whole product away before the beta.
 */

export function PeekCard({
  title,
  tag,
  children,
  className = "",
}: {
  title: string;
  tag?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={`glass glass-lit peek-card ${className}`.trim()} data-reveal>
      <div className="peek">
        <div className="peek-head">
          <span className="peek-title">{title}</span>
          {tag && <span className="marker">{tag}</span>}
        </div>
        {children}
      </div>
    </figure>
  );
}

/** agxp-kpi — four numbers, tone only where the number is clearly good or bad. */
export function KpiPeek() {
  const tiles = [
    { label: "Orders per day", value: "180" },
    { label: "Planning per tour", value: "12 min", tone: "warn" },
    { label: "Diesel per month", value: "600 €", tone: "bad" },
    { label: "Tours planned live", value: "94 %", tone: "good" },
  ];

  return (
    <div className="kpi-grid">
      {tiles.map(t => (
        <div key={t.label} className={`kpi${t.tone ? ` is-${t.tone}` : ""}`}>
          <div className="kpi-label">{t.label}</div>
          <div className="kpi-value">{t.value}</div>
        </div>
      ))}
    </div>
  );
}

/** agxp-gap — today against target, with the target marked on the track. */
export function GapPeek() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const rows = [
    { label: "Planning per tour", now: "12 min", target: "3 min", w: 92, t: 24 },
    { label: "Empty-run tours", now: "4 / week", target: "1 / week", w: 78, t: 20 },
    { label: "Lost delivery notes", now: "8 / week", target: "0", w: 66, t: 4 },
  ];

  return (
    <div ref={ref} style={{ display: "grid", gap: 14 }}>
      {rows.map(r => (
        <div className="gap-row" key={r.label}>
          <div className="gap-label">
            <span>{r.label}</span>
            <span>
              <b>{r.now}</b> → <b>{r.target}</b>
            </span>
          </div>
          <div className="gap-track">
            <div className="gap-now" style={{ ["--w" as string]: inView ? `${r.w}%` : "0%" }} />
            <div className="gap-target" style={{ ["--t" as string]: `${r.t}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** agxp-flow — the same chain today and after, with the automated steps marked. */
export function FlowPeek() {
  const asIs = ["Email in", "Type into Excel", "Build tour", "Call driver"];
  const toBe = ["Order recognised", "Tour proposed", "Dispatcher approves", "App notifies"];

  return (
    <div className="flow">
      <div className="flow-row">
        <span className="flow-tag">as-is</span>
        {asIs.map(s => (
          <span className="flow-step" key={s}>
            {s}
          </span>
        ))}
      </div>
      <div className="flow-row">
        <span className="flow-tag">to-be</span>
        {toBe.map((s, i) => (
          <span className={`flow-step${i !== 2 ? " is-auto" : ""}`} key={s}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/** agxp-roadmap — three phases, chronological. */
export function RoadmapPeek() {
  const phases = [
    { when: "now", items: ["Orders collected centrally", "Delivery notes in the app"] },
    { when: "30 days", items: ["Pilot with one region"] },
    { when: "90 days", items: ["Rollout to all regions"] },
  ];

  return (
    <div className="roadmap">
      {phases.map(p => (
        <div className="road-phase" key={p.when}>
          <span className="road-when">{p.when}</span>
          <div className="road-body">
            {p.items.map(i => (
              <span className="road-item" key={i}>
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** agxp-risks — likelihood against impact. */
export function RisksPeek() {
  const cells = [
    { label: "", tone: "" },
    { label: "Data quality", tone: "mid" },
    { label: "Dispatchers block it", tone: "hot" },
    { label: "", tone: "" },
    { label: "", tone: "" },
    { label: "Budget freeze", tone: "mid" },
    { label: "Tooling delay", tone: "" },
    { label: "", tone: "" },
    { label: "", tone: "" },
  ];

  return (
    <div>
      <div className="risk-grid">
        {cells.map((c, i) => (
          <div key={i} className={`risk-cell${c.tone ? ` is-${c.tone}` : ""}`}>
            {c.label}
          </div>
        ))}
      </div>
      <div className="rail-meta" style={{ marginTop: 8 }}>
        <span>likelihood →</span>
        <span>↑ impact</span>
      </div>
    </div>
  );
}

/** agxp-stakeholders — who is affected, and what they actually said. */
export function StakeholdersPeek() {
  const rows = [
    { group: "Dispatchers", n: 5, mood: "skeptic", label: "skeptical" },
    { group: "Drivers", n: 34, mood: "", label: "neutral" },
    { group: "Ops lead", n: 1, mood: "champion", label: "supporter" },
  ];

  return (
    <div className="stake">
      {rows.map(r => (
        <div className="stake-row" key={r.group}>
          <span>{r.group}</span>
          <span className="muted">{r.n}</span>
          <span className={`stake-mood${r.mood ? ` is-${r.mood}` : ""}`}>{r.label}</span>
        </div>
      ))}
      <p className="stake-quote">&ldquo;No computer knows the B75 better than I do.&rdquo;</p>
    </div>
  );
}

/**
 * The agent picker, step one: you choose the profile before anything else
 * happens. The method lines are the plain-language ones the app shows instead
 * of the consulting jargon stored in the database.
 */
export function PickerPeek() {
  const profiles = [
    {
      name: "AI Strategy Consultant",
      desc: "Strategic analysis and structured guidance for AI and IT transformation projects.",
      can: ["Where you are, where you want to be", "What is missing"],
      level: "High",
    },
    {
      name: "Business Analyst",
      desc: "Supports structured discovery, requirements and delivery.",
      can: ["What you actually need", "Your steps, written down"],
      level: "Medium",
    },
    {
      name: "Solution Architect",
      desc: "Designs target-state systems and integration blueprints.",
      can: ["What will change", "Your steps, written down"],
      level: "Medium",
    },
  ];

  return (
    <div className="picker">
      <p className="picker-step">Step 1 of 2 — what kind of help?</p>
      {profiles.map((p, i) => (
        <div className={`picker-row${i === 0 ? " is-active" : ""}`} key={p.name}>
          <div className="picker-main">
            <span className="picker-name">{p.name}</span>
            <span className="picker-desc">{p.desc}</span>
            <span className="picker-can">
              {p.can.map(c => (
                <em key={c}>{c}</em>
              ))}
            </span>
          </div>
          <span className="picker-select">Select</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The one section of the Consultant's document that is a table rather than a
 * graphic: named options, weighed against each other.
 */
export function ToolsPeek() {
  const rows = [
    { tool: "Tour planning suite", verdict: "fits", effort: "M" },
    { tool: "Custom dispatch board", verdict: "maybe", effort: "L" },
    { tool: "Existing ERP module", verdict: "no", effort: "S" },
  ];

  return (
    <div className="stake">
      {rows.map(r => (
        <div className="stake-row" key={r.tool}>
          <span>{r.tool}</span>
          <span
            className={`stake-mood${r.verdict === "fits" ? " is-champion" : r.verdict === "maybe" ? " is-skeptic" : ""}`}
          >
            {r.verdict}
          </span>
          <span className="muted">{r.effort}</span>
        </div>
      ))}
      <p className="stake-quote">Effort: S / M / L — always with a reason attached.</p>
    </div>
  );
}

/** The interview rail: stations done, the one in progress, and the percentage. */
export function RailPeek({
  total = 8,
  done = 3,
  label = "4/8 Pain points",
  progress = 45,
}: {
  total?: number;
  done?: number;
  label?: string;
  progress?: number;
}) {
  return (
    <div className="rail">
      <div className="rail-track">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`rail-seg${i < done ? " is-done" : ""}${i === done ? " is-now" : ""}`}
          />
        ))}
      </div>
      <div className="rail-meta">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}

/** A slice of the conversation, ending in the choice chips the agent offers. */
export function ChatPeek() {
  return (
    <div className="chat">
      <div className="bubble">How many tours does one dispatcher plan on a normal Tuesday?</div>
      <div className="bubble is-user">Around 40. Takes him the whole morning.</div>
      <div className="bubble">
        So roughly 12 minutes a tour. What happens when a driver calls in sick at 06:00?
      </div>
      <div className="choices">
        <button className="choice" type="button">
          He re-plans by hand
        </button>
        <button className="choice" type="button">
          We call the standby list
        </button>
        <button className="choice" type="button">
          Tour gets dropped
        </button>
      </div>
    </div>
  );
}
