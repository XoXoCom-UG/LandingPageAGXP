"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ACCENTS } from "@/lib/accent";
import { useLowPower } from "@/lib/hooks";
import { applyTierClass, dprFor, FPS_CAP, perf, type Tier } from "@/lib/perf";
import { useTheme } from "@/lib/theme";
import { clamp01, ease, prefersReducedMotion, scroll } from "@/lib/scroll";
import { Beams, Core, Dust } from "@/components/three/core";
import { BetaToken, DocumentStack, MemoryShards, Prism, StationPath } from "@/components/three/artifacts";
import { Robot } from "@/components/three/robot";

/**
 * The scene behind the whole page.
 *
 * The camera never moves. Each scene is parked in its own slot and travels
 * through the frame as its DOM section scrolls past — so the 3D and the words
 * are locked together by construction, and a resize or a font swap can never
 * put them out of sync.
 *
 * Cost is governed in three places, because the same page has to hold up on a
 * 60 Hz laptop and on a 144 Hz desktop with display scaling (lib/perf.ts):
 * frames are capped at FPS_CAP, the canvas renders to a pixel budget rather
 * than at native resolution, and a performance monitor steps the quality tier
 * down when the frame rate falls and back up when it recovers.
 */
export function Stage() {
  const { accent, theme } = useTheme();
  const lowPower = useLowPower();
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  const [tier, setTier] = useState<Tier>(2);
  const [dpr, setDpr] = useState(1);

  // Phones and small screens start one step down instead of finding out.
  useEffect(() => {
    if (lowPower) setTier(t => (t > 1 ? 1 : t));
  }, [lowPower]);

  useEffect(() => {
    function update() {
      const next = dprFor(tier);
      perf.tier = tier;
      perf.dpr = next;
      setDpr(next);
    }
    update();
    applyTierClass(tier);
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [tier]);

  const fogColor = theme === "light" ? "#FAFAF9" : "#0B0C0E";
  const light = theme === "light";

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 90 }}
        // Frames are driven by FrameLimiter, not by the monitor's refresh rate.
        frameloop="demand"
      >
        <FrameLimiter fps={reduced ? 30 : FPS_CAP} />
        <FpsProbe />
        <PerformanceMonitor
          // Judged against the capped rate, so a 144 Hz screen is not "slow"
          // for drawing 60.
          bounds={() => [Math.round(FPS_CAP * 0.78), FPS_CAP + 1]}
          flipflops={4}
          onDecline={() => setTier(t => (t > 0 ? ((t - 1) as Tier) : t))}
          onIncline={() => setTier(t => (t < 2 && !lowPower ? ((t + 1) as Tier) : t))}
          onFallback={() => setTier(0)}
        />

        <fog attach="fog" args={[fogColor, 14, 42]} />

        <Suspense fallback={null}>
          <Lighting accent={accent.primary} soft={accent.soft} theme={theme} />
          <World accent={accent.primary} soft={accent.soft} lowPower={lowPower} light={light} />
          <Ambience soft={accent.soft} deep={accent.primary} tier={tier} light={light} />
        </Suspense>

        {tier >= 1 && (
          // multisampling defaults to 8 (8x MSAA on full-size buffers); that
          // alone was the single biggest cost on integrated GPUs.
          <EffectComposer enableNormalPass={false} multisampling={tier === 2 ? 2 : 0}>
            <Bloom
              intensity={light ? 0.42 : 1.15}
              luminanceThreshold={light ? 0.72 : 0.18}
              luminanceSmoothing={0.35}
              mipmapBlur
              levels={tier === 2 ? 6 : 4}
            />
            <Vignette eskil={false} offset={0.28} darkness={light ? 0.18 : 0.62} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

/**
 * Asks for a frame at most `fps` times a second. With frameloop="demand",
 * nothing else draws, so a 144 Hz monitor costs the same as a 60 Hz one.
 */
function FrameLimiter({ fps }: { fps: number }) {
  const { invalidate } = useThree();

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const interval = 1000 / fps;
    function tick(now: number) {
      // A millisecond of slack so 60 on a 60 Hz screen does not alias to 30.
      if (now - last >= interval - 1) {
        last = now;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);

  return null;
}

/** Counts drawn frames into perf.fps for the ?fps meter. */
function FpsProbe() {
  const frames = useRef(0);
  const since = useRef(0);
  const { gl } = useThree();

  useFrame(state => {
    frames.current++;
    const t = state.clock.elapsedTime;
    if (t - since.current >= 0.5) {
      perf.fps = Math.round(frames.current / (t - since.current));
      const size = gl.getDrawingBufferSize(new THREE.Vector2());
      perf.pixels = size.x * size.y;
      frames.current = 0;
      since.current = t;
    }
  });

  return null;
}

function Lighting({ accent, soft, theme }: { accent: string; soft: string; theme: string }) {
  const key = useRef<THREE.PointLight>(null);

  useFrame(state => {
    if (!key.current) return;
    // The key light follows the pointer, so the metal on every object catches
    // a highlight that moves with you.
    key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, scroll.pointer.x * 8, 0.04);
    key.current.position.y = THREE.MathUtils.lerp(key.current.position.y, -scroll.pointer.y * 5 + 3, 0.04);
    key.current.intensity = 55 + Math.sin(state.clock.elapsedTime * 0.7) * 8;
  });

  return (
    <>
      <ambientLight intensity={theme === "light" ? 1.5 : 0.35} />
      <pointLight ref={key} position={[4, 3, 6]} intensity={55} color={soft} distance={30} decay={2} />
      <pointLight position={[-7, -3, 4]} intensity={28} color={accent} distance={28} decay={2} />
      <directionalLight position={[0, 8, 3]} intensity={theme === "light" ? 1.1 : 0.5} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 4, -6]} scale={[12, 6, 1]} color={soft} />
        <Lightformer form="circle" intensity={1.4} position={[-6, 2, 4]} scale={5} color={accent} />
        <Lightformer form="rect" intensity={1} position={[6, -3, 3]} scale={[8, 4, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

/** Dust and light shafts that stay with the camera the whole way down. */
function Ambience({
  soft,
  deep,
  tier,
  light,
}: {
  soft: string;
  deep: string;
  tier: Tier;
  light: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Parallax only — the field never actually leaves the frame.
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, scroll.progress * 6, 2, delta);
    group.current.rotation.y += delta * 0.008;
  });

  return (
    <group ref={group}>
      <Dust key={tier} count={tier === 2 ? 1000 : tier === 1 ? 500 : 260} soft={soft} deep={deep} depth={18} light={light} />
      {tier === 2 && <Beams soft={soft} depth={18} light={light} />}
    </group>
  );
}

/** Every scene, each parked in the slot of the section it belongs to. */
function World({
  accent,
  soft,
  lowPower,
  light,
}: {
  accent: string;
  soft: string;
  lowPower: boolean;
  light: boolean;
}) {
  const [accentIndex, setAccentIndex] = useState(0);
  const { accent: current } = useTheme();

  // Which ray in the prism lights up: the accent actually selected.
  const activeIndex = useMemo(() => {
    const i = ACCENTS.findIndex(a => a.id === current.id);
    return i < 0 ? 0 : i;
  }, [current.id]);

  if (activeIndex !== accentIndex) setAccentIndex(activeIndex);

  return (
    // On a phone the objects would fill the screen and fight the words, so the
    // whole world steps back rather than each scene being tuned twice.
    <group scale={lowPower ? 0.68 : 1}>
      <Slot id="hero" travel={13} depth={5}>
        <Core accent={accent} soft={soft} lowPower={lowPower} light={light} />
      </Slot>

      <Slot id="duo" travel={14} depth={7}>
        <Duo accent={accent} soft={soft} />
      </Slot>

      <Slot id="roster" travel={14} depth={7}>
        {/* Lifted above the copy: the lineup is the point of this section, so it
            sits in the open space rather than behind the picker card. */}
        <group position={[0, 1.7, 0]}>
          <RobotArc accent={accent} soft={soft} />
        </group>
      </Slot>

      <Slot id="interview" travel={14} depth={6}>
        <StationPath accent={accent} soft={soft} sectionId="interview" count={8} />
      </Slot>

      <Slot id="document" travel={15} depth={8}>
        <DocumentStack accent={accent} soft={soft} sectionId="document" />
      </Slot>

      <Slot id="memory" travel={14} depth={7}>
        <group>
          <Robot role="consultant" accent={accent} soft={soft} scale={1.1} level={3} position={[0, 0, 0]} />
          <MemoryShards accent={accent} soft={soft} sectionId="memory" count={lowPower ? 8 : 16} />
        </group>
      </Slot>

      <Slot id="accents" travel={14} depth={6}>
        <Prism sectionId="accents" activeIndex={accentIndex} />
      </Slot>

      <Slot id="beta" travel={12} depth={6}>
        {/* Dropped below centre so the token sits under the copy rather than
            behind the buttons. */}
        <group position={[0, -1.6, 0]}>
          <BetaToken accent={accent} soft={soft} sectionId="beta" />
        </group>
      </Slot>
    </group>
  );
}

/**
 * The roster, as a lineup: the five seeded profiles waiting on an arc, one lit
 * at a time. Only the highlighted one is fully present — the rest sit back in
 * the dark, which is what picking one actually feels like.
 */
const ROSTER: { role: "consultant" | "coach" }[] = [
  { role: "consultant" },
  { role: "consultant" },
  { role: "consultant" },
  { role: "coach" },
  { role: "coach" },
];

function RobotArc({ accent, soft }: { accent: string; soft: string }) {
  const group = useRef<THREE.Group>(null);
  const [picked, setPicked] = useState(0);
  const last = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (t - last.current > 2.6) {
      last.current = t;
      setPicked(p => (p + 1) % ROSTER.length);
    }
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, scroll.pointer.x * 0.18, 2, delta);
      group.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  const spread = 2.05;
  const mid = (ROSTER.length - 1) / 2;

  return (
    <group ref={group}>
      {ROSTER.map((r, i) => {
        const offset = i - mid;
        const isPicked = i === picked;
        return (
          <Robot
            key={i}
            role={r.role}
            accent={accent}
            soft={soft}
            // The arc bends away from the camera at the edges.
            position={[offset * spread, -offset * 0.12, -Math.abs(offset) * 0.9]}
            rotation={[0, -offset * 0.22, 0]}
            scale={isPicked ? 0.86 : 0.66}
            level={isPicked ? 3 : 1}
            talking={isPicked}
            presence={isPicked ? 1 : 0.42}
          />
        );
      })}
    </group>
  );
}

/** The two agents, facing the same project from opposite sides. */
function Duo({ accent, soft }: { accent: string; soft: string }) {
  const group = useRef<THREE.Group>(null);
  const [talking, setTalking] = useState<"consultant" | "coach">("consultant");
  const last = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // They take turns, the way the two panels take turns on screen.
    if (t - last.current > 3.4) {
      last.current = t;
      setTalking(p => (p === "consultant" ? "coach" : "consultant"));
    }
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, scroll.pointer.x * 0.22, 2, delta);
    }
  });

  return (
    <group ref={group}>
      <Robot
        role="consultant"
        accent={accent}
        soft={soft}
        position={[-2.35, 0.1, 0]}
        rotation={[0, 0.34, 0]}
        scale={1.15}
        level={3}
        talking={talking === "consultant"}
      />
      <Robot
        role="coach"
        accent={accent}
        soft={soft}
        position={[2.35, 0.1, 0]}
        rotation={[0, -0.34, 0]}
        scale={1.15}
        level={3}
        talking={talking === "coach"}
      />

      {/* the project they share, held between them */}
      <SharedProject soft={soft} accent={accent} />
    </group>
  );
}

function SharedProject({ soft, accent }: { soft: string; accent: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(state => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.35;
    ref.current.position.y = -1.5 + Math.sin(t * 0.9) * 0.1;
  });

  return (
    <group ref={ref} position={[0, -1.5, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={soft}
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.15}
          flatShading
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[1.05, 0.008, 6, 64]} />
        <meshBasicMaterial color={soft} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      {/* the two feeds into it */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * 1.15, 0.75, 0]} rotation={[0, 0, side * -0.95]}>
          <planeGeometry args={[0.02, 2.3]} />
          <meshBasicMaterial
            color={soft}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * One scene's slot. Rides its DOM section through the frame: in from below,
 * forward toward the camera as it centres, and out through the top.
 */
function Slot({
  id,
  children,
  travel = 13,
  depth = 6,
}: {
  id: string;
  children: React.ReactNode;
  travel?: number;
  depth?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const p = scroll.sectionProgress(id);
    const focus = clamp01(1 - Math.abs(p - 0.5) * 2);

    // Off-frame scenes stop drawing entirely.
    const visible = focus > 0.015;
    if (g.visible !== visible) g.visible = visible;
    if (!visible) return;

    const eased = ease(focus);
    g.position.y = (p - 0.5) * travel;
    g.position.z = -depth * (1 - eased);
    g.scale.setScalar(0.72 + eased * 0.28);
  });

  return <group ref={ref}>{children}</group>;
}
