"use client";

import { useEffect, useRef, useState } from "react";
import { scroll } from "@/lib/scroll";

/**
 * Registers a DOM section with the scroll store so the 3D scene can ask how far
 * it has travelled, and returns the ref to attach.
 */
export function useSectionRef<T extends HTMLElement = HTMLElement>(id: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return scroll.register(id, el);
  }, [id]);
  return ref;
}

/**
 * Flags an element as on-screen once, for the reveal transition. One observer
 * per element is cheap here and keeps the API a single hook.
 */
export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** True once the component has mounted on the client. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Coarse pointer / small screen / low core count — the scene drops its heaviest
 * passes rather than stuttering.
 */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 900;
    const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setLow(coarse || small || fewCores);
  }, []);
  return low;
}
