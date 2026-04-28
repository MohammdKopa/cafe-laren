"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type MarqueeProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Direction the marquee scrolls. */
  direction?: "left" | "right";
  /** Seconds for one *copy* of the items to traverse the track. Lower = faster. */
  speed?: number;
  /** Slow the timeline to this rate while the row is hovered. Default 0.2. */
  hoverTimeScale?: number;
  /** Optional CSS class for the marquee viewport. */
  className?: string;
  /** ARIA label for the row (helps screen readers). */
  ariaLabel?: string;
};

/**
 * Mirage-pattern marquee row — 4 copies of `items` rendered in a single
 * track, animated with xPercent 0 → ±25% repeat: -1 (so one copy slides
 * out the side while another slides in, seamless). Hover slows the
 * timeline so the user can read what they're aiming at.
 *
 * Reduced-motion: items render statically with horizontal overflow scroll.
 */
export function Marquee<T>({
  items,
  renderItem,
  direction = "left",
  speed = 45,
  hoverTimeScale = 0.2,
  className = "",
  ariaLabel,
}: MarqueeProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // 4 copies in the track. For "left" scroll, track travels 0 → -25%
      // (one copy off the left edge). For "right" scroll, track starts
      // pre-shifted at -25% (so there's content extending off-screen to
      // the LEFT to scroll INTO view) and travels back to 0%. Both cases
      // share an identical-content overlap so the loop snap is invisible.
      const fromX = direction === "left" ? 0 : -25;
      const toX = direction === "left" ? -25 : 0;

      tlRef.current = gsap.fromTo(
        track,
        { xPercent: fromX },
        {
          xPercent: toX,
          duration: speed,
          ease: "none",
          repeat: -1,
        },
      );
    },
    { scope: trackRef, dependencies: [direction, speed] },
  );

  const handleEnter = () => {
    if (tlRef.current) gsap.to(tlRef.current, { timeScale: hoverTimeScale, duration: 0.4 });
  };
  const handleLeave = () => {
    if (tlRef.current) gsap.to(tlRef.current, { timeScale: 1, duration: 0.6 });
  };

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={`overflow-hidden ${className}`}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        // 4 copies = 100% track width. xPercent: -25 shifts exactly one
        // copy, which is invisible because copies 2-4 fill the gap.
      >
        {[0, 1, 2, 3].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy > 0}
            className="flex items-center flex-shrink-0"
          >
            {items.map((item, i) => renderItem(item, i + copy * items.length))}
          </div>
        ))}
      </div>
    </div>
  );
}
