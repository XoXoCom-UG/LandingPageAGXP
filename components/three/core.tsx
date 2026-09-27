"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ease, scroll } from "@/lib/scroll";

/**
 * The hero object: the project.
 *
 * A faceted shell that the two agents orbit, with a lit core at the centre.
 * As you scroll away from the hero the shell opens up and the orbit widens —
 * the first, wordless statement of what the product is: two of them, one of
 * you, one thing being built in the middle.
 */
export function Core({
  accent,
  soft,
  lowPower,
  light,
}: {
  accent: string;
  soft: string;
  lowPower: boolean;
  /** Light mode: additive blending adds nothing on a white page, so the glows
      switch to normal blending and the line work switches to the deep tone. */
  light: boolean;
}) {
  const glowBlend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  const lineColor = light ? accent : soft;
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);

  const softColor = useMemo(() => new THREE.Color(soft), [soft]);
  const deepColor = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = ease(scroll.sectionProgress("hero"));

    if (group.current) {
      group.current.rotation.y = t * 0.12 + scroll.pointer.x * 0.25;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        scroll.pointer.y * 0.16 - p * 0.35,
        2.5,
        delta,
      );
      // It drifts back and grows as the page moves on, so the hero object
      // becomes the backdrop of the section after it rather than disappearing.
      group.current.position.z = -p * 5;
      group.current.scale.setScalar(1 + p * 0.55);
    }

    if (shell.current) {
      shell.current.rotation.z = -t * 0.08;
      const mat = shell.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + (1 - p) * 0.12;
    }

    if (inner.current) {
      const breathe = 1 + Math.sin(t * 1.1) * 0.035;
      inner.current.scale.setScalar(breathe);
      inner.current.rotation.y = -t * 0.3;
    }

    if (halo.current) {
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.5 - p * 0.3;
      halo.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.06 + p * 0.5);
    }

    // The two agents circle the project on opposite sides, widening as you go.
    const radius = 2.5 + p * 1.6;
    if (orbitA.current) {
      orbitA.current.position.x = Math.cos(t * 0.5) * radius;
      orbitA.current.position.z = Math.sin(t * 0.5) * radius;
      orbitA.current.position.y = Math.sin(t * 0.8) * 0.35;
    }
    if (orbitB.current) {
      orbitB.current.position.x = Math.cos(t * 0.5 + Math.PI) * radius;
      orbitB.current.position.z = Math.sin(t * 0.5 + Math.PI) * radius;
      orbitB.current.position.y = Math.sin(t * 0.8 + Math.PI) * 0.35;
    }
  });

  return (
    <group ref={group}>
      {/* the outer shell — the project boundary */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshBasicMaterial color={lineColor} wireframe transparent opacity={light ? 0.5 : 0.2} toneMapped={false} />
      </mesh>

      {/* a second, denser shell sitting just inside, for depth */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[1.82, 2]} />
        <meshBasicMaterial color={deepColor} wireframe transparent opacity={light ? 0.22 : 0.08} toneMapped={false} />
      </mesh>

      {/* the core */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.92, lowPower ? 1 : 3]} />
        <meshStandardMaterial
          color={deepColor}
          emissive={softColor}
          emissiveIntensity={0.75}
          metalness={0.9}
          roughness={0.12}
          flatShading
        />
      </mesh>

      {/* the glow around the core */}
      <mesh ref={halo} scale={1.6}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={softColor}
          transparent
          opacity={light ? 0.18 : 0.5}
          side={THREE.BackSide}
          blending={glowBlend}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* the plane both agents work on */}
      <mesh rotation={[Math.PI / 2 - 0.35, 0, 0]}>
        <ringGeometry args={[2.7, 2.74, 96]} />
        <meshBasicMaterial color={lineColor} transparent opacity={light ? 0.55 : 0.35} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2 - 0.35, 0, 0]}>
        <ringGeometry args={[3.35, 3.37, 96]} />
        <meshBasicMaterial color={lineColor} transparent opacity={light ? 0.28 : 0.14} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <group ref={orbitA}>
        <AgentNode color={softColor} blend={glowBlend} />
      </group>
      <group ref={orbitB}>
        <AgentNode color={softColor} blend={glowBlend} />
      </group>
    </group>
  );
}

/** One of the two agents, as a point of light circling the project. */
function AgentNode({ color, blend }: { color: THREE.Color; blend: THREE.Blending }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh scale={2.6}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={blend}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * The dust the whole page falls through. Points rather than meshes, wrapped
 * around the camera path so there is always depth in frame no matter where
 * the scroll has got to.
 */
export function Dust({
  count = 900,
  soft,
  deep,
  depth,
  light,
}: {
  count?: number;
  soft: string;
  deep: string;
  depth: number;
  light: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -Math.random() * depth;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 4;
      scales[i] = 0.5 + Math.random() * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [count, depth]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // A slow drift, plus a nudge in the direction of travel so a fast scroll
    // feels like moving through the dust rather than past a static field.
    ref.current.rotation.y += delta * 0.012;
    ref.current.position.y = THREE.MathUtils.damp(
      ref.current.position.y,
      scroll.velocity * 0.02,
      4,
      delta,
    );
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={light ? deep : soft}
        size={light ? 0.038 : 0.045}
        sizeAttenuation
        transparent
        opacity={light ? 0.4 : 0.6}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Light shafts that hang in the space between sections. Cheap: long, thin,
 * additive planes that always face the camera.
 */
export function Beams({ soft, depth, light }: { soft: string; depth: number; light: boolean }) {
  const group = useRef<THREE.Group>(null);
  const falloff = useSoftFalloff();

  const beams = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: (Math.random() - 0.5) * 16,
        y: -(i + 0.5) * (depth / 7),
        z: -6 - Math.random() * 6,
        rot: (Math.random() - 0.5) * 0.7,
        h: 8 + Math.random() * 12,
        w: 0.6 + Math.random() * 2.2,
        o: 0.05 + Math.random() * 0.07,
      })),
    [depth],
  );

  useFrame(state => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = beams[i].o * (light ? 0.55 : 1) * (0.6 + Math.sin(t * 0.4 + i) * 0.4);
    });
  });

  return (
    <group ref={group}>
      {beams.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} rotation={[0, 0, b.rot]}>
          <planeGeometry args={[b.w, b.h]} />
          <meshBasicMaterial
            color={soft}
            alphaMap={falloff}
            transparent
            opacity={light ? b.o * 0.55 : b.o}
            blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * A soft elliptical falloff, generated once into a canvas and reused as the
 * alpha of every light shaft — without it a "beam" is just a lit rectangle
 * with four hard edges.
 */
function useSoftFalloff(): THREE.Texture | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.45, "rgba(255,255,255,0.45)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}
