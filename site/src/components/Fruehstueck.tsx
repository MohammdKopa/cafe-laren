"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BloomModal } from "./BloomModal";
import { CAY_GLASS } from "@/lib/bloomSilhouettes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type BreakfastItem = {
  name: string;
  blurb: string;
  ingredients: string;
  photo: string;
  origin: "tr" | "de" | "it";
};

const FEATURED: BreakfastItem = {
  name: "Simit Frühstück",
  blurb: "Das Original aus Istanbul. Sesam-Ring, Eier, Käse, Tee — bei Tageslicht.",
  ingredients:
    "Simitring · gekochtes Ei · Tomate · Gurke · Oliven · Schafskäse · türkischer Schwarztee",
  photo:
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1600&q=80",
  origin: "tr",
};

const HIGHLIGHTS: BreakfastItem[] = [
  {
    name: "Menemen",
    blurb: "Rührei mit Paprika und Tomate, türkisch geschmort.",
    ingredients: "Eier · Paprika · Tomate · Olivenöl · Gewürze",
    photo:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    origin: "tr",
  },
  {
    name: "Rührei mit Sucuk",
    blurb: "Türkische Knoblauchwurst, frisch geröstet.",
    ingredients: "Eier · Sucuk · Olivenöl · Gewürze",
    photo:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1200&q=80",
    origin: "tr",
  },
  {
    name: "Frühstück Klassik",
    blurb: "Brötchen, Körnerbrötchen, Aufstriche, dazu Filterkaffee oder Schwarztee.",
    ingredients: "2 Brötchen · 2 Körnerbrötchen · Butter · Marmelade · Honig · Käse · Aufschnitt",
    photo:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
    origin: "de",
  },
  {
    name: "Toast Sucuk & Käse",
    blurb: "Sucuk und Schmelzkäse, knusprig getoastet.",
    ingredients: "Toastbrot · Sucuk · Schmelzkäse",
    photo:
      "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=1200&q=80",
    origin: "tr",
  },
  {
    name: "Der Sportler",
    blurb: "Joghurt-Müsli-Schale mit frischen Früchten.",
    ingredients: "Joghurt · Müsli · saisonales Obst · Honig",
    photo:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    origin: "de",
  },
  {
    name: "Der Italiener",
    blurb: "Espresso oder Cappuccino mit Croissant.",
    ingredients: "Espresso oder Cappuccino · 1 Croissant",
    photo:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    origin: "it",
  },
];

const ORIGIN_LABEL = { tr: "Türkiye", de: "Deutschland", it: "Italia" } as const;

type ModalState = {
  item: BreakfastItem;
  origin: { x: number; y: number };
  trigger: HTMLElement | null;
} | null;

export function Fruehstueck() {
  const ref = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // immediateRender:false → elements stay at natural state until the
      // trigger fires. If the trigger ever misses (pin layout shifts,
      // unusual scroll), content is still visible — never stuck invisible.
      const ST_BASE = { invalidateOnRefresh: true };

      // BOUNDARY MOMENT — scrub-driven seam approach + halo wash + rise
      gsap.fromTo("[data-seam-wrapper]",
        { yPercent: -32, scaleY: 0.5 },
        { yPercent: 0, scaleY: 1, ease: "none", transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 50%", scrub: 0.5 } });
      // Frühstück variant: halo lingers harder + extends deeper into
      // the section before fading. This is the chapter cut into the
      // espresso world — the gold has to push through the dark.
      gsap.timeline({
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 10%", scrub: 0.5 },
      })
        .fromTo("[data-seam-halo]", { autoAlpha: 0 }, { autoAlpha: 0.92, duration: 0.5, ease: "none" })
        .to("[data-seam-halo]", { autoAlpha: 0, duration: 0.5, ease: "none" });
      gsap.to("[data-seam='ridge']", {
        yPercent: 28, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 0.5 },
      });
      gsap.fromTo("[data-section-rise]",
        { yPercent: 6 },
        { yPercent: 0, ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 55%", scrub: 0.5 } });

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
      gsap.fromTo("[data-reveal='featured']",
        { autoAlpha: 0, y: 60, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-reveal='featured']", start: "top 90%" } });
      // (Highlight-title row + the 6 highlight cards stay static.
      //  Their scroll-trigger was unreliable in this section's layout.)
    },
    { scope: ref },
  );

  const openItem = (item: BreakfastItem) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setModal({
        item,
        origin: { x: e.clientX, y: e.clientY },
        trigger: e.currentTarget,
      });
    };

  return (
    <>
      <section
        id="fruehstueck"
        ref={ref}
        aria-label="Türkisches Frühstück"
        className="relative bg-espresso-700 text-paper-100 pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
      >
        {/* Gold arc seam — same brand swoop dipping into the dark
            section. Reads as the cream above folding into espresso. */}
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
                "linear-gradient(180deg, var(--color-sun-400) 0%, var(--color-sun-500) 28%, transparent 80%)",
            }}
          />
          <svg
            className="absolute inset-x-0 top-0 w-full h-full"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path
              data-seam="primary"
              d="M 0 0 L 1440 0 L 1440 32 C 1240 72, 980 92, 700 120 C 420 148, 200 172, 0 184 Z"
              fill="var(--color-sun-400)"
            />
            <path
              data-seam="ridge"
              d="M 0 184 C 200 172, 420 148, 700 120 C 980 92, 1240 72, 1440 32 L 1440 50 C 1240 92, 980 114, 700 142 C 420 170, 200 194, 0 200 Z"
              fill="var(--color-sun-500)"
              opacity="0.55"
            />
          </svg>
        </div>

        {/* Section header */}
        <div data-section-rise className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-16">
          <p data-reveal="overline" className="font-body text-[11px] uppercase tracking-[0.42em] text-chiffon-200/75">
            <span className="inline-block w-8 h-px bg-chiffon-200/60 align-middle mr-3" />
            Kapitel vier · Frühstück
          </p>
          <h2 className="mt-6 font-display italic text-chiffon-200 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
            <span className="block overflow-hidden">
              <span data-mask-line className="inline-block will-change-transform">
                Türkisches Frühstück.
              </span>
            </span>
            <span className="block overflow-hidden mt-1">
              <span data-mask-line className="inline-block will-change-transform text-chiffon-200/55">
                Den ganzen Tag lang.
              </span>
            </span>
          </h2>
          <p data-reveal="body" className="mt-6 max-w-md text-paper-100/80 text-base md:text-lg leading-relaxed">
            Simit, Menemen, Sucuk — serviert mit türkischem Schwarztee, ohne
            Eile. Dazu Klassiker, Toasts und ein italienischer Gruß.
          </p>
        </div>

        {/* Featured card — the Simit Frühstück hero */}
        <div data-reveal="featured" className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-20">
          <FeaturedCard item={FEATURED} onClick={openItem(FEATURED)} />
        </div>

        {/* Highlights grid */}
        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)]">
          <div className="flex items-baseline gap-3 mb-6 md:mb-8">
            <h3 className="font-display italic text-chiffon-200 text-2xl md:text-3xl">
              Weitere Klassiker
            </h3>
            <span className="flex-1 h-px bg-chiffon-200/20" />
            <span className="text-[10px] uppercase tracking-[0.42em] text-chiffon-200/55">
              {HIGHLIGHTS.length} mehr
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {HIGHLIGHTS.map((item) => (
              <HighlightCard
                key={item.name}
                item={item}
                onClick={openItem(item)}
              />
            ))}
          </div>
        </div>

        {/* Footer label */}
        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-16 md:mt-24 flex items-center justify-between text-[11px] uppercase tracking-[0.42em] text-chiffon-200/60">
          <span>Frühstück · 9—22:30 · täglich</span>
          <span className="hidden md:inline">tippen für Details</span>
        </div>
      </section>

      <BloomModal
        open={!!modal}
        origin={modal?.origin ?? null}
        silhouette={CAY_GLASS}
        color="var(--color-espresso-700)"
        returnFocusTo={modal?.trigger ?? null}
        onClose={() => setModal(null)}
        ariaLabel={modal?.item.name}
      >
        {modal && (
          <article className="p-8 md:p-12">
            <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
              <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
              {ORIGIN_LABEL[modal.item.origin]} · Frühstück
            </p>
            <h4 className="mt-4 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.4rem,6vw,4rem)]">
              {modal.item.name}
            </h4>
            <p className="mt-6 text-espresso-600/90 text-base md:text-lg leading-relaxed">
              {modal.item.blurb}
            </p>
            <div className="mt-6 pt-6 border-t border-espresso-700/15">
              <p className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/70 mb-3">
                Zutaten
              </p>
              <p className="text-espresso-700 text-sm md:text-base">
                {modal.item.ingredients}
              </p>
            </div>
            <div className="mt-8">
              <p className="font-display italic text-espresso-700 text-2xl md:text-3xl">
                Tagespreis
              </p>
            </div>
          </article>
        )}
      </BloomModal>
    </>
  );
}

function FeaturedCard({
  item,
  onClick,
}: {
  item: BreakfastItem;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-label={`${item.name} — Details öffnen`}
      className="
        group relative grid grid-cols-1 md:grid-cols-5 w-full overflow-hidden rounded-2xl
        bg-espresso-800 text-left ring-1 ring-chiffon-200/10
        hover:ring-chiffon-200/25 transition-all duration-500
      "
    >
      <div className="relative md:col-span-3 aspect-[16/10] md:aspect-auto md:min-h-[420px] overflow-hidden">
        <Image
          src={item.photo}
          alt={`${item.name} im Café Laren — ${item.ingredients}`}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(20,12,7,0.55)_100%)] md:bg-[linear-gradient(90deg,transparent_55%,rgba(20,12,7,0.55)_100%)]" />
      </div>

      <div className="relative md:col-span-2 p-7 md:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.42em] text-chiffon-200/75">
            <span>★ Empfehlung</span>
            <span className="w-10 h-px bg-chiffon-200/30" />
            <span>{ORIGIN_LABEL[item.origin]}</span>
          </div>
          <h3 className="mt-5 font-display italic text-chiffon-200 leading-[0.95] text-[clamp(2.2rem,5.5vw,3.6rem)]">
            {item.name}
          </h3>
          <p className="mt-4 text-paper-100/85 text-base md:text-lg leading-relaxed max-w-md">
            {item.blurb}
          </p>
          <p className="mt-5 text-paper-100/55 text-[11px] uppercase tracking-[0.32em] max-w-md leading-relaxed">
            {item.ingredients}
          </p>
        </div>
        <div className="mt-8 inline-flex items-center gap-2 pb-1 text-chiffon-200 text-[11px] uppercase tracking-[0.32em] border-b border-chiffon-200/40 group-hover:border-chiffon-200 transition-colors duration-300 self-start">
          Mehr ansehen
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </button>
  );
}

function HighlightCard({
  item,
  onClick,
}: {
  item: BreakfastItem;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-label={`${item.name} — Details öffnen`}
      className="
        group relative aspect-[4/5] overflow-hidden rounded-2xl
        bg-espresso-800 ring-1 ring-chiffon-200/10
        hover:ring-chiffon-200/25 transition-all duration-500 text-left
      "
    >
      <Image
        src={item.photo}
        alt={`${item.name} — ${item.ingredients}`}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,7,0.05)_0%,rgba(20,12,7,0.15)_45%,rgba(20,12,7,0.85)_100%)]" />

      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso-900/80 backdrop-blur-sm">
        <span className="text-[10px] uppercase tracking-[0.32em] text-chiffon-200/85">
          {ORIGIN_LABEL[item.origin]}
        </span>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6">
        <h4 className="font-display italic text-chiffon-200 text-2xl md:text-3xl leading-[1.05]">
          {item.name}
        </h4>
        <p className="mt-2 text-paper-100/80 text-sm leading-snug line-clamp-2 max-w-[28ch]">
          {item.blurb}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 pb-1 text-chiffon-200 text-[10px] uppercase tracking-[0.32em] border-b border-chiffon-200/40 group-hover:border-chiffon-200 transition-colors duration-300">
          Details
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </button>
  );
}
