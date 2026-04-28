"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export type BloomSilhouette = {
  /** SVG `path d` string for the bloom shape. */
  path: string;
  /** SVG viewBox dimensions, e.g. "0 0 200 240". */
  viewBox: string;
  /** Aspect ratio behavior on the bloom SVG. */
  preserveAspectRatio?: string;
};

type BloomModalProps = {
  open: boolean;
  origin: { x: number; y: number } | null;
  silhouette: BloomSilhouette;
  /** CSS color value (e.g. "var(--color-sun-400)"). */
  color: string;
  /** Element that opened the modal — focus is restored here on close. */
  returnFocusTo?: HTMLElement | null;
  /** Called after the close animation finishes — parent should unmount on this. */
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
};

/**
 * Click-bloom modal — port of barber4you's StudioModal pattern adapted
 * with arbitrary SVG silhouettes (sundae glass, scoop, çay glass, swirl).
 *
 * Open: bloom SVG painted in the brand color, sized 200vmax, scaled
 *  0 → 1 from the click origin via gsap, content card lags in.
 * Close: bloom retracts back to 0 at origin while the content fades —
 *  triggered by Escape, the explicit ×, or clicking the bloom backdrop.
 *
 * Reduced-motion: skip all scales, 120ms opacity in/out only.
 */
export function BloomModal({
  open,
  origin,
  silhouette,
  color,
  returnFocusTo,
  onClose,
  ariaLabel,
  children,
}: BloomModalProps) {
  const bloomRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // Body scroll lock while open — prevents background page scrolling
  // behind the modal, also pauses Lenis's smooth scroll.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Open animation
  useEffect(() => {
    if (!open || !origin) return;
    closingRef.current = false;
    const bloom = bloomRef.current;
    const card = cardRef.current;
    if (!bloom || !card) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(bloom, {
      left: origin.x,
      top: origin.y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      rotation: -10,
      transformOrigin: "50% 50%",
      autoAlpha: 1,
    });
    gsap.set(card, { autoAlpha: 0, scale: 0.94, y: 26 });

    if (reduce) {
      gsap.to(bloom, { scale: 1, rotation: 0, duration: 0.12, ease: "none" });
      gsap.to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.12, ease: "none" });
      return;
    }

    const tl = gsap.timeline();
    tl.to(bloom, {
      scale: 1,
      rotation: 4,
      duration: 0.78,
      ease: "expo.out",
    });
    tl.to(
      card,
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: "expo.out",
      },
      "-=0.42",
    );
  }, [open, origin]);

  // Animated close — used by Escape, the × button, and bloom-backdrop click.
  const animateClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const bloom = bloomRef.current;
    const card = cardRef.current;
    if (!bloom || !card) {
      onClose();
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.to([bloom, card], {
        autoAlpha: 0,
        duration: 0.12,
        ease: "none",
        onComplete: () => {
          onClose();
          returnFocusTo?.focus();
        },
      });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        returnFocusTo?.focus();
      },
    });
    tl.to(card, {
      autoAlpha: 0,
      scale: 0.96,
      y: 14,
      duration: 0.32,
      ease: "power3.in",
    });
    tl.to(
      bloom,
      {
        scale: 0,
        rotation: -8,
        duration: 0.55,
        ease: "expo.in",
      },
      "-=0.20",
    );
  };

  // Escape closes; focus the first focusable inside the card on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        animateClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => {
      const focusable = cardRef.current?.querySelector<HTMLElement>(
        "a, button, [tabindex='0']",
      );
      focusable?.focus();
    });
    return () => window.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Bloom silhouette — single SVG, painted in brand color, scaled
          from the click origin out to 200vmax. Click anywhere on the
          bloom to close. */}
      <svg
        ref={bloomRef}
        aria-hidden
        onClick={animateClose}
        viewBox={silhouette.viewBox}
        preserveAspectRatio={silhouette.preserveAspectRatio ?? "xMidYMid meet"}
        className="absolute z-0 cursor-pointer will-change-transform"
        style={{
          width: "200vmax",
          height: "200vmax",
        }}
      >
        <path d={silhouette.path} fill={color} />
      </svg>

      {/* Content card — data-lenis-prevent tells Lenis to skip this
          element so native wheel/touch scrolling works inside. */}
      <div
        ref={cardRef}
        data-lenis-prevent
        className="relative z-10 mx-auto mt-12 mb-8 max-h-[88vh] w-[min(92vw,640px)] overflow-y-auto overscroll-contain rounded-2xl bg-paper-50 text-espresso-700 shadow-[var(--shadow-paper)] md:mt-[12vh] md:max-h-[80vh]"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Close button — owned by BloomModal so the close animation
            always plays, no matter how the user dismisses. */}
        <button
          type="button"
          aria-label="Schließen"
          onClick={animateClose}
          className="focus-on-dark absolute top-4 right-4 z-20 grid place-items-center w-10 h-10 rounded-full text-espresso-700 hover:bg-espresso-700/10 transition"
        >
          <span aria-hidden className="text-xl leading-none">×</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
