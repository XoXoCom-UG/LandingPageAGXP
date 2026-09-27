"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ACCENTS } from "@/lib/accent";
import { clamp01, ease, mapRange, scroll } from "@/lib/scroll";

/* ── The interview ──────────────────────────────────────────────────────────
   Eight stations for the Consultant, six for the Coach. The agent stays on one
   until it actually understands it, so the rail fills unevenly, in steps —
   which is exactly how it behaves on screen.
   ────────────────────────────────────────────────────────────────────────── */
export function StationPath({
  soft,
  accent,
  count = 8,
  sectionId,
}: {
  soft: string;
  accent: string;
  count?: number;
  sectionId: string;
}) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  const line = useRef<THREE.Mesh>(null);

  const softColor = useMemo(() => new THREE.Color(soft), [soft]);
  const deepColor = useMemo(() => new THREE.Color(accent), [accent]);

  const spread = 1.35;
  const total = (count - 1) * spread;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = ease(scroll.sectionProgress(sectionId));
    // The rail is read left to right as the section scrolls past.
    const reached = p * (count + 0.5);

    nodes.current.forEach((node, i) => {
      if (!node) return;
      const lit = clamp01(reached - i);
      const mat = node.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + lit * 2.6;
      mat.color.lerpColors(deepColor, softColor, lit);
      const bob = Math.sin(t * 1.4 + i * 0.7) * 0.06 * lit;
      node.position.y = bob;
      node.scale.setScalar(0.65 + lit * 0.55);
    });

    if (line.current) {
      line.current.scale.x = Math.max(0.001, clamp01(reached / count));
    }

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        -0.45 + scroll.pointer.x * 0.12,
        2,
        delta,
      );
      group.current.rotation.x = -0.12 + scroll.pointer.y * 0.06;
    }
  });

  return (
    <group ref={group}>
      {/* the unlit track */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[total, 0.02]} />
        <meshBasicMaterial color={deepColor} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      {/* the filled part, scaled from the left edge */}
      <group position={[-total / 2, 0, 0]}>
        <mesh ref={line} position={[total / 2, 0, 0]}>
          <planeGeometry args={[total, 0.045]} />
          <meshBasicMaterial color={softColor} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>

      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={el => {
            nodes.current[i] = el;
          }}
          position={[-total / 2 + i * spread, 0, 0]}
        >
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color={deepColor}
            emissive={softColor}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── The deliverable ────────────────────────────────────────────────────────
   The documents are graphics, not prose: KPI tiles, today-vs-target bars, an
   as-is/to-be chain, a roadmap and a risk matrix. Here those same six blocks
   fly in from scattered space and stack into one document as you scroll.
   ────────────────────────────────────────────────────────────────────────── */
type BlockKind = "kpi" | "gap" | "flow" | "roadmap" | "risks" | "stake";

const BLOCKS: { kind: BlockKind; from: [number, number, number]; spin: number }[] = [
  { kind: "kpi", from: [-6.5, 3.4, -5], spin: -0.9 },
  { kind: "gap", from: [6.2, 2.2, -3], spin: 0.7 },
  { kind: "flow", from: [-5.4, -2.6, -6], spin: 1.1 },
  { kind: "roadmap", from: [5.8, -3.4, -4], spin: -0.6 },
  { kind: "risks", from: [-7, 0.4, -2], spin: 0.5 },
  { kind: "stake", from: [6.8, -0.8, -6], spin: -1.2 },
];

export function DocumentStack({
  soft,
  accent,
  sectionId,
}: {
  soft: string;
  accent: string;
  sectionId: string;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.55 + scroll.pointer.x * 0.2,
      2,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.1 + scroll.pointer.y * 0.1,
      2,
      delta,
    );
    group.current.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group ref={group}>
      {BLOCKS.map((b, i) => (
        <Panel key={b.kind} {...b} index={i} soft={soft} accent={accent} sectionId={sectionId} />
      ))}
    </group>
  );
}

function Panel({
  kind,
  from,
  spin,
  index,
  soft,
  accent,
  sectionId,
}: {
  kind: BlockKind;
  from: [number, number, number];
  spin: number;
  index: number;
  soft: string;
  accent: string;
  sectionId: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo<[number, number, number]>(() => [0, 1.5 - index * 0.6, index * 0.035], [index]);

  useFrame(() => {
    if (!ref.current) return;
    // Each panel lands slightly after the one before it, so the document
    // assembles top-down instead of snapping together at once.
    const raw = scroll.sectionProgress(sectionId);
    const staggered = mapRange(raw, 0.12 + index * 0.06, 0.62 + index * 0.06);
    const p = ease(staggered);

    ref.current.position.set(
      THREE.MathUtils.lerp(from[0], target[0], p),
      THREE.MathUtils.lerp(from[1], target[1], p),
      THREE.MathUtils.lerp(from[2], target[2], p),
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(spin, 0, p);
    ref.current.rotation.y = THREE.MathUtils.lerp(spin * 0.8, 0, p);
    ref.current.scale.setScalar(0.55 + p * 0.45);
  });

  return (
    <group ref={ref}>
      {/* The panel reads as a lit pane of glass, not a black slab: a dark body
          with the accent glowing faintly through it, and a lit rim. */}
      <RoundedBox args={[3.4, 0.54, 0.035]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={"#161d28"}
          emissive={accent}
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.35}
          transparent
          opacity={0.78}
        />
      </RoundedBox>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[3.46, 0.6]} />
        <meshBasicMaterial
          color={soft}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* a lit edge on the left, the way every section leads with its visual */}
      <mesh position={[-1.63, 0, 0.022]}>
        <planeGeometry args={[0.05, 0.4]} />
        <meshBasicMaterial color={soft} toneMapped={false} />
      </mesh>
      <BlockGlyph kind={kind} soft={soft} accent={accent} />
    </group>
  );
}

/** The miniature of each visual block, drawn with flat emissive planes. */
function BlockGlyph({ kind, soft, accent }: { kind: BlockKind; soft: string; accent: string }) {
  const bars = useMemo(() => {
    switch (kind) {
      case "kpi":
        return [0.34, 0.34, 0.34, 0.34].map((w, i) => ({ x: -1.2 + i * 0.44, w, h: 0.3, lit: i % 3 === 0 }));
      case "gap":
        return [0.9, 0.55, 1.25].map((w, i) => ({ x: -1.3 + w / 2, w, h: 0.07, y: 0.12 - i * 0.12, lit: true }));
      case "flow":
        return [0.5, 0.5, 0.5, 0.5].map((w, i) => ({ x: -1.2 + i * 0.6, w, h: 0.18, lit: i > 1 }));
      case "roadmap":
        return [0.08, 0.08, 0.08].map((w, i) => ({ x: -1.1 + i * 0.85, w, h: 0.08, lit: true }));
      case "risks":
        return Array.from({ length: 6 }, (_, i) => ({
          x: -1.2 + (i % 3) * 0.28,
          y: 0.09 - Math.floor(i / 3) * 0.2,
          w: 0.22,
          h: 0.15,
          lit: i === 2 || i === 5,
        }));
      default:
        return [1.2, 0.9, 1.4].map((w, i) => ({ x: -1.3 + w / 2, w, h: 0.08, y: 0.12 - i * 0.12, lit: i === 1 }));
    }
  }, [kind]);

  return (
    <group position={[0, 0, 0.025]}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, (b as { y?: number }).y ?? 0, 0]}>
          <planeGeometry args={[b.w, b.h]} />
          <meshBasicMaterial
            color={b.lit ? soft : accent}
            transparent
            opacity={b.lit ? 0.95 : 0.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Memory ─────────────────────────────────────────────────────────────────
   Agents carry lessons from one project into the next. Past projects orbit the
   agent as shards and feed a rising level.
   ────────────────────────────────────────────────────────────────────────── */
export function MemoryShards({
  soft,
  accent,
  sectionId,
  count = 14,
}: {
  soft: string;
  accent: string;
  sectionId: string;
  count?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        radius: 2.3 + (i % 3) * 0.55,
        y: ((i % 5) - 2) * 0.42,
        speed: 0.16 + (i % 4) * 0.05,
        tilt: (i % 7) * 0.4,
        size: 0.26 + (i % 3) * 0.1,
      })),
    [count],
  );

  useFrame(state => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = ease(scroll.sectionProgress(sectionId));
    group.current.children.forEach((child, i) => {
      const s = shards[i];
      if (!s) return;
      const a = s.angle + t * s.speed;
      // They spiral inward as the section advances: memory being absorbed.
      const r = s.radius * (1 - p * 0.42);
      child.position.set(Math.cos(a) * r, s.y + Math.sin(t * 0.6 + i) * 0.12, Math.sin(a) * r);
      child.rotation.set(s.tilt + t * 0.2, a, s.tilt * 0.5);
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + p * 1.8;
    });
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i}>
          <boxGeometry args={[s.size, s.size * 0.7, 0.02]} />
          <meshStandardMaterial
            color={accent}
            emissive={soft}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── The accents ────────────────────────────────────────────────────────────
   One beam enters the prism, six come out — the six accents the app ships,
   in their real hex values. Picking one on this page picks the same one there.
   ────────────────────────────────────────────────────────────────────────── */
export function Prism({ sectionId, activeIndex }: { sectionId: string; activeIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const rays = useRef<(THREE.Mesh | null)[]>([]);
  const body = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = ease(scroll.sectionProgress(sectionId));

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        t * 0.15 + scroll.pointer.x * 0.3,
        2,
        delta,
      );
    }
    if (body.current) {
      body.current.rotation.z = Math.sin(t * 0.4) * 0.12;
    }

    rays.current.forEach((ray, i) => {
      if (!ray) return;
      const mat = ray.material as THREE.MeshBasicMaterial;
      const isActive = i === activeIndex;
      const base = 0.1 + p * 0.22;
      mat.opacity = THREE.MathUtils.damp(
        mat.opacity,
        isActive ? base + 0.5 : base,
        4,
        delta,
      );
      ray.scale.y = THREE.MathUtils.damp(ray.scale.y, isActive ? 1.25 : 1, 4, delta);
    });
  });

  const spread = 0.34;

  return (
    <group ref={group}>
      {/* the incoming beam */}
      <mesh position={[-3.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.06, 3.4]} />
        <meshBasicMaterial
          color={"#ffffff"}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* the prism */}
      <mesh ref={body} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.9, 3]} />
        <meshPhysicalMaterial
          color={"#cfe3ff"}
          metalness={0}
          roughness={0.03}
          transmission={0.96}
          thickness={1.6}
          ior={1.6}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* the six accents leaving it */}
      {ACCENTS.map((a, i) => {
        const angle = (i - (ACCENTS.length - 1) / 2) * spread * 0.5;
        return (
          <mesh
            key={a.id}
            ref={el => {
              rays.current[i] = el;
            }}
            position={[2.6, angle * 3.2, 0]}
            rotation={[0, 0, Math.PI / 2 + angle]}
          >
            <planeGeometry args={[0.1, 4.6]} />
            <meshBasicMaterial
              color={a.soft}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Beta ───────────────────────────────────────────────────────────────────
   The closing object: a token. Access is handed out, not bought — so the last
   thing on the page is a key, slowly turning.
   ────────────────────────────────────────────────────────────────────────── */
export function BetaToken({ soft, accent, sectionId }: { soft: string; accent: string; sectionId: string }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = ease(scroll.sectionProgress(sectionId));
    if (group.current) {
      group.current.rotation.y = t * 0.45 + scroll.pointer.x * 0.4;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.28 + scroll.pointer.y * 0.15, 2, delta);
      group.current.scale.setScalar(0.7 + p * 0.5);
    }
    if (ring.current) {
      ring.current.rotation.z = -t * 0.8;
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + p * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* the coin */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.16, 6]} />
        <meshStandardMaterial color={accent} metalness={0.95} roughness={0.18} flatShading />
      </mesh>

      {/* the mark etched into it: two paths crossing */}
      {[0.78, -0.78].map((r, i) => (
        <mesh key={i} position={[0, 0, 0.1]} rotation={[0, 0, r]}>
          <planeGeometry args={[1.5, 0.11]} />
          <meshStandardMaterial
            color={soft}
            emissive={soft}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.17, 24]} />
        <meshStandardMaterial color={soft} emissive={soft} emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* an orbiting ring, so the token reads as active rather than minted */}
      <mesh ref={ring} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.012, 8, 96]} />
        <meshBasicMaterial color={soft} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}
