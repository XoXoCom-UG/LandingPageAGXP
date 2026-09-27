"use client";

import { useSectionRef } from "@/lib/hooks";

/**
 * A page section that registers itself with the scroll store, so the scene
 * parked in its slot knows exactly where it is without measuring anything at
 * frame time.
 */
export function Section({
  id,
  children,
  className = "",
  tall = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  tall?: boolean;
}) {
  const ref = useSectionRef<HTMLElement>(id);

  return (
    <section
      ref={ref}
      id={id}
      className={`section${tall ? " section-tall" : ""} ${className}`.trim()}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/** The label above every headline — section number, then name. */
export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow" data-reveal>
      {index && <span className="eyebrow-index">{index}</span>}
      {children}
    </p>
  );
}
