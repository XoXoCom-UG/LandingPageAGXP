"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { lerp, prefersReducedMotion, scroll } from "@/lib/scroll";

/**
 * Drives the page: smooth scroll, the shared scroll store, pointer parallax and
 * the reveal transitions. Mounted once in the layout.
 *
 * Lenis is the only thing that touches `window.scrollY` behaviour; everything
 * else — DOM and WebGL — reads the store it feeds, so the text and the 3D scene
 * can never drift a frame apart.
 */
export function ScrollRuntime() {
  useEffect(() => {
    const reduced = prefersReducedMotion();

    const lenis = reduced
      ? null
      : new Lenis({
          lerp: 0.085,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.6,
          smoothWheel: true,
        });

    let raf = 0;
    let lastY = window.scrollY;

    function frame(time: number) {
      lenis?.raf(time);
      const y = lenis ? lenis.scroll : window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scroll.y = y;
      scroll.progress = Math.min(1, Math.max(0, y / max));
      // Smoothed so a flick of the wheel leans the scene instead of snapping it.
      scroll.velocity = lerp(scroll.velocity, y - lastY, 0.18);
      lastY = y;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onResize() {
      scroll.measure();
    }
    // Sections move when fonts land and when the viewport changes.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize).catch(() => {});

    function onPointer(e: PointerEvent) {
      scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Reveals: one observer for every [data-reveal] on the page.
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));

    // Anchor links go through Lenis so they share the page's easing.
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    }
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
