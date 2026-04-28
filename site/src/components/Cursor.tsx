"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

type Mode = "idle" | "link";

const subscribeMedia = (cb: () => void) => {
  const m1 = window.matchMedia("(hover: hover) and (pointer: fine)");
  const m2 = window.matchMedia("(prefers-reduced-motion: reduce)");
  m1.addEventListener("change", cb);
  m2.addEventListener("change", cb);
  return () => {
    m1.removeEventListener("change", cb);
    m2.removeEventListener("change", cb);
  };
};

const getMediaSnapshot = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getMediaServerSnapshot = () => false;

/**
 * Signature cursor — a small Golden Sun dot that follows the mouse with
 * subtle lag and elongates into a thin caret over interactive elements.
 *
 * Initial render is `visibility: hidden`; the cursor only reveals on the
 * first real pointermove. That kills the top-left flash that happens
 * between first paint and JS execution.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeMedia,
    getMediaSnapshot,
    getMediaServerSnapshot,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-custom-cursor");
    return () => document.body.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    if (!wrap || !dot) return;

    gsap.set(wrap, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.28, ease: "power3.out" });

    let revealed = false;
    let mode: Mode = "idle";

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      if (next === "link") {
        gsap.to(dot, {
          width: 56,
          height: 6,
          borderRadius: 3,
          duration: 0.28,
          ease: "power3.out",
        });
      } else {
        gsap.to(dot, {
          width: 14,
          height: 14,
          borderRadius: 9999,
          duration: 0.32,
          ease: "power3.out",
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (!revealed) {
        revealed = true;
        gsap.set(wrap, { x: e.clientX, y: e.clientY });
        wrap.style.visibility = "visible";
      }

      const target = e.target as Element | null;
      const interactive = target?.closest(
        "a, button, [role='button'], [data-cursor='link']",
      );
      setMode(interactive ? "link" : "idle");
    };

    const onLeave = () => {
      gsap.to(wrap, { autoAlpha: 0, duration: 0.18, ease: "power2.out" });
    };
    const onEnter = () => {
      gsap.to(wrap, { autoAlpha: 1, duration: 0.18, ease: "power2.out" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="fixed top-0 left-0 z-[200] pointer-events-none will-change-transform"
      style={{ visibility: "hidden" }}
    >
      <div
        ref={dotRef}
        className="will-change-[width,height] shadow-[0_2px_10px_rgba(60,40,25,0.35)]"
        style={{
          width: 14,
          height: 14,
          borderRadius: 9999,
          background: "var(--color-sun-500)",
        }}
      />
    </div>
  );
}
