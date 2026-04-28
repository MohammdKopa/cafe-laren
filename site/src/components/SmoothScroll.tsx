"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Buttery-smooth scroll powered by Lenis. Hands its frame ticker to
 * gsap.ticker so ScrollTrigger reads Lenis's scroll position instead of
 * the native one — keeps every scroll-driven animation 1:1 with the lerp.
 *
 * Disabled when prefers-reduced-motion is set; native scroll then runs.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 4), // power4.out — snappy + soft tail
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    // ScrollTriggers may have been created by descendant components BEFORE
    // Lenis was wired (children's effects fire before this parent effect).
    // Refresh once now so they recalculate against Lenis's scroll source,
    // and again after the next paint to catch font/image-driven layout shifts.
    ScrollTrigger.refresh();
    const refreshAfterPaint = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshAfterPaint);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
