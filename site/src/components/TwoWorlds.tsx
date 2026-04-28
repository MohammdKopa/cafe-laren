"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PHOTO_GELATO =
  "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1400&q=80";
const PHOTO_TURKISH =
  "https://images.unsplash.com/photo-1559054663-e8d23213f55c?auto=format&fit=crop&w=1400&q=80";

export function TwoWorlds() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      // BOUNDARY MOMENT — scrub-driven seam approach + halo wash + rise
      gsap.fromTo(
        "[data-seam-wrapper]",
        { yPercent: -32, scaleY: 0.5 },
        {
          yPercent: 0,
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 50%", scrub: 0.5 },
        },
      );
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: 0.5 },
        })
        .fromTo("[data-seam-halo]", { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 0.6, ease: "none" })
        .to("[data-seam-halo]", { autoAlpha: 0, duration: 0.4, ease: "none" });
      gsap.to("[data-seam='ridge']", {
        yPercent: 28,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 0.5 },
      });
      gsap.fromTo(
        "[data-section-rise]",
        { yPercent: 6 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 55%", scrub: 0.5 },
        },
      );

      // Overline
      gsap.fromTo(
        "[data-anim='overline']",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 88%" },
        },
      );

      // Title — mask-reveal lines (yPercent 110 → 0)
      gsap.fromTo(
        "[data-mask-line]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 86%" },
        },
      );

      // Panels: stagger fade-up + photo clip-path swipe
      gsap.fromTo(
        "[data-anim='reveal']",
        { autoAlpha: 0, y: 70 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.18,
          duration: 1.05,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 80%" },
        },
      );
      gsap.fromTo(
        "[data-anim='photo-clip']",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0 0)",
          stagger: 0.18,
          duration: 1.2,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 80%" },
        },
      );

      // Subtle photo parallax inside each panel
      gsap.utils.toArray<HTMLElement>("[data-anim='photo-parallax']").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
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
      id="two-worlds"
      ref={ref}
      className="relative bg-paper-100 pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
    >
      {/* Yellow arc seam — the brand swoop folding down from above into
          Two Worlds. Path is the hero's arc family compressed vertically:
          asymmetric kissed sweep, sloping from a small dip on the right
          down to a deeper drop on the left. Two layered paths (gold +
          ridge) like the hero. */}
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
          {/* Mirrored arc — deep dip on the RIGHT (signature trait of
              the duality section: hints at two sides). */}
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

      {/* Overline */}
      <div data-section-rise className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-20">
        <p data-anim="overline" className="text-[11px] uppercase tracking-[0.42em] text-espresso-600/80">
          <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
          Zwei Welten unter einem Dach
        </p>
        <h2 className="mt-6 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
          <span className="block overflow-hidden">
            <span data-mask-line className="inline-block will-change-transform">
              Italienisches Gelato.
            </span>
          </span>
          <span className="block overflow-hidden mt-1">
            <span
              data-mask-line
              className="inline-block will-change-transform text-espresso-700/55"
            >
              Türkisches Frühstück.
            </span>
          </span>
        </h2>
      </div>

      {/* Two panels */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* GELATO panel — light, gold, paper */}
        <article
          data-anim="reveal"
          className="relative h-[70vh] min-h-[480px] overflow-hidden rounded-sm group"
          style={{
            background:
              "radial-gradient(120% 90% at 100% -10%, var(--color-sun-400) 0%, var(--color-sun-400) 35%, transparent 60%), var(--color-paper-50)",
          }}
        >
          <div data-anim="photo-clip" className="absolute inset-0 will-change-[clip-path]">
            <div data-anim="photo-parallax" className="absolute inset-0 will-change-transform">
              <Image
                src={PHOTO_GELATO}
                alt="Hausgemachtes italienisches Gelato im Café Laren, Marl"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,var(--overlay-warm-strong)_100%)]" />
          </div>

          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 z-10">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.45em] text-paper-50/85">
              <span>01</span>
              <span className="w-10 h-px bg-paper-50/60" />
              <span>Italia</span>
            </div>
            <div>
              <h3 className="font-display italic text-paper-50 text-[clamp(3rem,9vw,6rem)] leading-[0.86]">
                Eis.
              </h3>
              <p className="mt-3 text-paper-50/85 max-w-sm leading-relaxed">
                20 Sorten täglich frisch — Milcheis, Fruchteis und
                Becher-Spezialitäten von Coppa Italia bis Tartufo.
              </p>
              <a
                href="#karte"
                className="focus-on-dark inline-flex items-center gap-3 mt-6 text-paper-50 text-[11px] uppercase tracking-[0.32em] border-b border-paper-50/50 hover:border-paper-50 pb-1 transition rounded-[2px]"
              >
                Zur Eiskarte
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </article>

        {/* TURKISH BREAKFAST panel — dark espresso, chiffon accents */}
        <article
          data-anim="reveal"
          className="relative h-[70vh] min-h-[480px] overflow-hidden rounded-sm group bg-espresso-800"
        >
          <div data-anim="photo-clip" className="absolute inset-0 will-change-[clip-path]">
            <div data-anim="photo-parallax" className="absolute inset-0 will-change-transform">
              <Image
                src={PHOTO_TURKISH}
                alt="Türkisches Frühstück im Café Laren — Simit, Menemen, Sucuk und schwarzer Tee"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover opacity-90"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--overlay-warm-soft)_0%,var(--overlay-warm-strong)_100%)]" />
          </div>

          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 z-10">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.45em] text-chiffon-200/90">
              <span>02</span>
              <span className="w-10 h-px bg-chiffon-200/50" />
              <span>Türkiye</span>
            </div>
            <div>
              <h3 className="font-display italic text-chiffon-200 text-[clamp(3rem,9vw,6rem)] leading-[0.86]">
                Frühstück.
              </h3>
              <p className="mt-3 text-paper-100/85 max-w-sm leading-relaxed">
                Simit, Menemen, Sucuk — serviert mit türkischem
                Schwarztee. Den ganzen Tag lang.
              </p>
              <a
                href="#fruehstueck"
                className="focus-on-dark inline-flex items-center gap-3 mt-6 text-chiffon-200 text-[11px] uppercase tracking-[0.32em] border-b border-chiffon-200/50 hover:border-chiffon-200 pb-1 transition rounded-[2px]"
              >
                Zum Frühstück
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </article>
      </div>

      {/* Footer line */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-16 md:mt-24 flex items-center justify-between text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
        <span>Marl · Nordrhein-Westfalen</span>
        <span className="hidden md:inline">9—22:30 · täglich</span>
      </div>
    </section>
  );
}
