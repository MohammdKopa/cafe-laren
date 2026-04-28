"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { InstagramFeed } from "./InstagramFeed";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tile = {
  src: string;
  alt: string;
  /** CSS classes for grid positioning + aspect ratio. */
  spanClasses: string;
};

const TILES: Tile[] = [
  {
    src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80",
    alt: "Hausgemachtes Gelato im Café Laren",
    spanClasses: "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[460px]",
  },
  {
    src: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=80",
    alt: "Türkisches Frühstück — Simit und Tee",
    spanClasses: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    alt: "Italienischer Espresso wird eingeschenkt",
    spanClasses: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
    alt: "Pistazieneis Nahaufnahme",
    spanClasses: "aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80",
    alt: "Menemen — Rührei mit Paprika und Tomate",
    spanClasses: "md:col-span-2 aspect-[16/9]",
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
    alt: "Hand mit Eiskugel im Café Laren",
    spanClasses: "aspect-square",
  },
];

export function Galerie() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ST_BASE = { invalidateOnRefresh: true };

      // Galerie variant: closing flourish — mirrored arc with a small
      // rotation pulse. The seam tilts as it drops, settling level by
      // the time it's anchored.
      gsap.fromTo("[data-seam-wrapper]",
        { yPercent: -32, scaleY: 0.5, rotation: -2.5 },
        { yPercent: 0, scaleY: 1, rotation: 0, ease: "none", transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 50%", scrub: 0.5 } });
      gsap.timeline({
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: 0.5 },
      })
        .fromTo("[data-seam-halo]", { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 0.6, ease: "none" })
        .to("[data-seam-halo]", { autoAlpha: 0, duration: 0.4, ease: "none" });
      gsap.to("[data-seam='ridge']", {
        yPercent: 28, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 0.5 },
      });
      gsap.fromTo("[data-section-rise]",
        { yPercent: 6 },
        { yPercent: 0, ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 55%", scrub: 0.5 } });

      // Header entrance
      gsap.fromTo("[data-reveal='overline']",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 90%" } });

      // Title — mask reveal
      gsap.fromTo("[data-mask-line]",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.15, stagger: 0.1, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 88%" } });

      gsap.fromTo("[data-reveal='body']",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.18, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 85%" } });

      // Tile entrance — photo clip-path swipe + stagger fade-up
      gsap.fromTo("[data-tile-photo]",
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0 0)", duration: 1.05, stagger: 0.08, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-reveal='tile']", start: "top 88%" } });
      gsap.fromTo("[data-reveal='tile']",
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.08, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-reveal='tile']", start: "top 88%" } });

      // (Instagram strip animations live inside InstagramFeed.)

      if (reduce) return;

      // Scrub parallax — each photo translates yPercent within its tile
      // (tile is overflow-hidden, photo is sized 110% so movement reveals).
      gsap.utils.toArray<HTMLElement>("[data-gallery-photo]").forEach((photo, i) => {
        const range = i % 2 === 0 ? 8 : 12; // alternate intensity
        gsap.fromTo(
          photo,
          { yPercent: -range / 2 },
          {
            yPercent: range / 2,
            ease: "none",
            scrollTrigger: {
              trigger: photo.closest<HTMLElement>("[data-gallery-tile]") ?? photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="galerie"
      ref={ref}
      aria-label="Galerie"
      className="relative bg-paper-100 pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
    >
      {/* Gold arc seam */}
      <div
        data-seam-wrapper
        aria-hidden
        className="absolute -top-px left-0 right-0 pointer-events-none z-0 will-change-transform"
        style={{ height: "clamp(180px, 28vh, 380px)" }}
      >
        <div
          data-seam-halo
          className="absolute inset-x-0 top-0 will-change-[opacity]"
          style={{
            height: "100%",
            background:
              "linear-gradient(180deg, var(--color-sun-400) 0%, var(--color-sun-400) 22%, transparent 75%)",
          }}
        />
        <svg
          className="absolute inset-x-0 top-0 w-full h-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          {/* Mirrored arc — deep dip on the RIGHT (closing rhyme with
              TwoWorlds, paired across the page like bookends). */}
          <path
            data-seam="primary"
            d="M 1440 0 L 0 0 L 0 32 C 200 72, 460 92, 740 120 C 1020 148, 1240 172, 1440 184 Z"
            fill="var(--color-sun-400)"
          />
          <path
            data-seam="ridge"
            d="M 1440 184 C 1240 172, 1020 148, 740 120 C 460 92, 200 72, 0 32 L 0 50 C 200 92, 460 114, 740 142 C 1020 170, 1240 194, 1440 200 Z"
            fill="var(--color-sun-500)"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Section header */}
      <div data-section-rise className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-16">
        <p data-reveal="overline" className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80">
          <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
          Kapitel sechs · Galerie
        </p>
        <h2 className="mt-6 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
          <span className="block overflow-hidden">
            <span data-mask-line className="inline-block will-change-transform">
              Augenblicke
            </span>
          </span>
          <span className="block overflow-hidden mt-1">
            <span data-mask-line className="inline-block will-change-transform text-espresso-700/55">
              aus dem Café.
            </span>
          </span>
        </h2>
        <p data-reveal="body" className="mt-6 max-w-md text-espresso-600/90 text-base md:text-lg leading-relaxed">
          Eis, Espresso, Frühstück, Marl. Bilder, die ohne Worte erklären,
          warum Stammgäste hier wieder ausparken.
        </p>
      </div>

      {/* Grid */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-[minmax(180px,auto)] md:auto-rows-[minmax(220px,auto)]">
          {TILES.map((tile, i) => (
            <div
              key={tile.src}
              data-reveal="tile"
              data-gallery-tile
              className={`relative overflow-hidden rounded-2xl bg-paper-200 ring-1 ring-espresso-700/8 ${tile.spanClasses}`}
            >
              <div
                data-gallery-photo
                data-tile-photo
                className="absolute inset-0 will-change-[transform,clip-path]"
                style={{ height: "112%", top: "-6%" }}
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                  priority={i < 2}
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_75%,rgba(20,12,7,0.18)_100%)] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <InstagramFeed />

      {/* Footer label */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-14 md:mt-20 flex items-center justify-between text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
        <span>Café Laren · Marl</span>
        <span className="hidden md:inline">@cafelaren · Instagram</span>
      </div>
    </section>
  );
}

