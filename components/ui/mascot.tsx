"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/scroll";

export type AgentRole = "consultant" | "coach";
export type MascotState = "idle" | "listening" | "thinking" | "speaking";

/**
 * The agent's face, lifted from the product (components/layout/agent-mascot.tsx).
 *
 * Same geometry, same rules: Consultant wears a tie, Coach wears a headset,
 * always; on top of that both grow through three purely visual levels — a
 * pulsing antenna glow at 2, an accessory at 3 (a HUD lens for the Consultant,
 * a visor and mic for the Coach). The eyes follow the cursor, written straight
 * to CSS custom properties every frame so tracking never causes a render.
 */
export function Mascot({
  role,
  state = "idle",
  size = 48,
  level = 1,
}: {
  role: AgentRole;
  state?: MascotState;
  size?: number;
  /** 1–3. Purely decorative — in the app it comes from projects worked together. */
  level?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const lvl = Math.max(1, Math.min(3, Math.round(level)));
  const glow = lvl >= 2;
  const accessory = lvl >= 3;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let curX = 0;
    let curY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let hasMouse = false;
    // The Consultant tracks slower and more contained than the Coach.
    const k = role === "consultant" ? 0.1 : 0.18;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMouse = true;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function tick() {
      const el = ref.current;
      if (el && hasMouse) {
        const box = el.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        // Up close it looks right at you; far away it still glances the right
        // way, just at a calmer amplitude.
        const max = dist < 120 ? 3 : 2;
        const mag = Math.min(max, dist / 40);
        const tx = (dx / dist) * mag;
        const ty = (dy / dist) * mag;
        curX += (tx - curX) * k;
        curY += (ty - curY) * k;
        el.style.setProperty("--eye-x", `${curX.toFixed(2)}px`);
        el.style.setProperty("--eye-y", `${curY.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [role]);

  const cls = [
    "mascot",
    `mascot-${role}`,
    `is-${state}`,
    glow ? "has-glow" : "",
    accessory ? "has-accessory" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} className={cls} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        {/* antenna, glowing from level 2, plus a spinner ring while thinking */}
        <path className="m-antenna" d="M24 12 V7" strokeWidth="2" strokeLinecap="round" />
        <circle className="m-work-ring" cx="24" cy="5" r="7.4" strokeWidth="1" strokeDasharray="4 3.4" />
        <circle className="m-rank" cx="24" cy="5" r="4.6" strokeWidth="1" />
        <circle className="m-antenna-dot" cx="24" cy="5" r="2.6" />

        {/* coach headset — a band with an ear pad each side */}
        <g className="m-headset">
          <path d="M11 24 A13 13 0 0 1 37 24" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="7.5" y="22" width="5" height="9" rx="2.5" />
          <rect x="35.5" y="22" width="5" height="9" rx="2.5" />
        </g>

        {/* coach visor + mic — level 3 */}
        {role === "coach" && accessory && (
          <>
            <g className="m-visor">
              <rect x="13" y="13" width="22" height="4" rx="2" />
              <path className="m-visor-line" d="M14 16.6 H34" strokeWidth="1" strokeLinecap="round" />
            </g>
            <g className="m-mic">
              <path className="m-mic-arm" d="M38 29.5 Q32.5 35 27 33.6" strokeWidth="1" strokeLinecap="round" fill="none" />
              <circle className="m-mic-tip" cx="27" cy="33.6" r="1.15" />
            </g>
          </>
        )}

        {/* head */}
        <g className="m-head">
          <rect className="m-face" x="9" y="12" width="30" height="25" rx="9" />
          <rect className="m-face-panel" x="12.5" y="17" width="23" height="13.5" rx="6.5" />
          <g className="m-eyes">
            <g className="m-eye-track">
              <circle className="m-eye" cx="19.5" cy="23.5" r="2.7" />
            </g>
            <g className="m-eye-track">
              <circle className="m-eye" cx="28.5" cy="23.5" r="2.7" />
            </g>
          </g>
          <rect className="m-mouth" x="21" y="32" width="6" height="2.2" rx="1.1" />
          <g className="m-dots">
            <circle className="m-dot" cx="21" cy="33" r="1.05" />
            <circle className="m-dot" cx="24" cy="33" r="1.05" />
            <circle className="m-dot" cx="27" cy="33" r="1.05" />
          </g>

          {/* consultant HUD lens — level 3 */}
          {role === "consultant" && accessory && (
            <g className="m-hud-lens">
              <circle className="m-hud-ring" cx="28.5" cy="23.5" r="4.3" strokeWidth="1" />
              <circle className="m-hud-inner" cx="28.5" cy="23.5" r="3.1" />
              <circle className="m-hud-spark" cx="31.6" cy="20.9" r=".65" />
              <path className="m-hud-scan" d="M33 22 H36.4" strokeWidth=".8" strokeLinecap="round" />
              <path className="m-hud-scan" d="M33 23.6 H35.2" strokeWidth=".8" strokeLinecap="round" />
              <path className="m-hud-scan" d="M33 25.2 H36.8" strokeWidth=".8" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* consultant tie, with a small star at level 3 */}
        <g className="m-tie">
          <path d="M24 37 L21.6 39.4 L24 45 L26.4 39.4 Z" />
          {role === "consultant" && accessory && (
            <g className="m-star" transform="translate(20.76 37.56) scale(0.27)">
              <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1Z" />
            </g>
          )}
        </g>
      </svg>
    </span>
  );
}
