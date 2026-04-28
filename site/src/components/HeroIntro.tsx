"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Hero arrival sequence (Phase 1 — Hero Reborn):
 *
 *  ⤿ photo (right pane) reveals via clip-path inset 100% → 0 with a
 *    soft scale 1.06 → 1.0 (Savor-style "page laid down")
 *  ⤿ Café + LAREN slide up from below (yPercent 110 → 0) AND settle
 *    their letter-spacing from 0.4em → final tracking — combined the
 *    letters feel like they "land and tighten"
 *  ⤿ overline / tagline / body / CTAs cascade in with staggered fade-ups
 *  ⤿ brand-signature arc scales out from top-left (0% 0% origin)
 *  ⤿ magnetic CTAs lift on hover (listeners auto-cleaned via contextSafe)
 */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Initial states — locked synchronously so first paint matches the
      // intro's start frame (no flicker).
      gsap.set("[data-anim='photo']", {
        clipPath: "inset(0% 0% 0% 100%)",
        scale: 1.06,
        transformOrigin: "60% 50%",
      });
      gsap.set("[data-anim='arc']", {
        scaleX: 0.4,
        scaleY: 0.6,
        autoAlpha: 0,
        transformOrigin: "0% 0%",
      });
      gsap.set("[data-anim='word']", { yPercent: 110, letterSpacing: "0.4em" });
      gsap.set("[data-anim='overline']", { autoAlpha: 0, y: 14 });
      gsap.set("[data-anim='tagline']",  { autoAlpha: 0, y: 18 });
      gsap.set("[data-anim='body']",     { autoAlpha: 0, y: 18 });
      gsap.set("[data-anim='cta']",      { autoAlpha: 0, y: 14 });

      if (reduce) {
        // Settle every animated prop instantly so the page is correct + static.
        gsap.set("[data-anim='photo']", { clipPath: "inset(0%)", scale: 1 });
        gsap.set("[data-anim='arc']", { autoAlpha: 1, scaleX: 1, scaleY: 1 });
        gsap.utils.toArray<HTMLElement>("[data-anim='word']").forEach((el) => {
          const target = el.dataset.kern ?? "0em";
          gsap.set(el, { yPercent: 0, letterSpacing: target });
        });
        gsap.set(
          [
            "[data-anim='overline']",
            "[data-anim='tagline']",
            "[data-anim='body']",
            "[data-anim='cta']",
          ],
          { autoAlpha: 1, y: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });

      // 0.0 — photo lays down + arc rises from top-left
      tl.to(
        "[data-anim='photo']",
        {
          clipPath: "inset(0%)",
          scale: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        0,
      ).to(
        "[data-anim='arc']",
        {
          autoAlpha: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 1.4,
          ease: "expo.out",
        },
        0.05,
      );

      // 0.45 — overline + side stamp arrive
      tl.to(
        "[data-anim='overline']",
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0.45,
      );

      // 0.5 — words slide up AND settle their tracking simultaneously
      gsap.utils.toArray<HTMLElement>("[data-anim='word']").forEach((el, i) => {
        const target = el.dataset.kern ?? "0em";
        tl.to(
          el,
          {
            yPercent: 0,
            letterSpacing: target,
            duration: 1.05,
            ease: "expo.out",
          },
          0.5 + i * 0.14,
        );
      });

      // 1.0+ — text cascade
      tl.to("[data-anim='tagline']", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.0)
        .to("[data-anim='body']",    { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" }, 1.15)
        .to("[data-anim='cta']",     { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" }, 1.3);

      // Magnetic / lift hover on CTAs — listeners cleaned automatically.
      if (!contextSafe) return;
      const ctas = gsap.utils.toArray<HTMLElement>("[data-anim='cta']");
      const cleanups: Array<() => void> = [];
      ctas.forEach((btn) => {
        const onEnter = contextSafe(() =>
          gsap.to(btn, { y: -3, duration: 0.35, ease: "power3.out" }),
        );
        const onLeave = contextSafe(() =>
          gsap.to(btn, { y: 0, duration: 0.45, ease: "power3.out" }),
        );
        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mouseenter", onEnter);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative h-full">
      {children}
    </div>
  );
}
