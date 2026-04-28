"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BloomModal } from "./BloomModal";
import { SUNDAE_GLASS } from "@/lib/bloomSilhouettes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Sundae = {
  name: string;
  index: string;
  description: string;
  ingredients: string;
  price?: string;
  photo: string;
};

// Photos are placeholders (Unsplash); swap when owner provides finals.
const SUNDAES: Sundae[] = [
  {
    name: "Coppa Italia",
    index: "01",
    description: "Das Original — eine Hommage an den italienischen Sommer.",
    ingredients: "Gemischtes Eis · Frische Früchte · Hausgemachte Soße · Sahne",
    photo:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Coppa Mango",
    index: "02",
    description: "Tropisch, cremig, kompromisslos reif.",
    ingredients: "Gemischtes Eis · Frische Mango · Mangosauce · Sahne",
    photo:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Coppa Anguria",
    index: "03",
    description: "Wassermelone und Sahne — der Sommerbecher.",
    ingredients: "Gemischtes Eis · Wassermelone · Erdbeersauce · Sahne",
    photo:
      "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Tartufo Becher",
    index: "04",
    description: "Schokolade, Likör, Sahne. Drei Geräusche.",
    ingredients: "Milcheis · Schokoladenlikör · Schokosoße · Sahne",
    photo:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Bananensplit Spezial",
    index: "05",
    description: "Banane, Schokolade, Streusel — kein Wort mehr nötig.",
    ingredients: "Gemischtes Eis · Banane · Schokoladensoße · Streusel · Sahne",
    photo:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Coppa Melone",
    index: "06",
    description: "Frische Melone, kalter Becher, ruhiger Tag.",
    ingredients: "Gemischtes Eis · Frische Melone · Fruchtsoße · Sahne",
    photo:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=1400&q=80",
  },
];

type ModalState = {
  sundae: Sundae;
  origin: { x: number; y: number };
  trigger: HTMLElement | null;
} | null;

export function Eisbecher() {
  const ref = useRef<HTMLElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [modal, setModal] = useState<ModalState>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
      if (scenes.length < 2) return;

      if (reduce) {
        // Stack scenes vertically — no pin, no scrub.
        scenes.forEach((s) => gsap.set(s, { position: "relative", yPercent: 0 }));
        return;
      }

      // Layer state — scene 0 visible, others queued below.
      gsap.set(scenes[0], { yPercent: 0 });
      scenes.slice(1).forEach((s) => gsap.set(s, { yPercent: 100 }));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // Each scene takes ~70% of viewport scroll instead of 100% — total
          // pin distance for 6 scenes drops from 500vh to ~350vh, less "stuck".
          end: `+=${(scenes.length - 1) * 70}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each transition: outgoing scene yPercent 0 → -100,
      // incoming yPercent 100 → 0. Simultaneous, slight overlap.
      for (let i = 1; i < scenes.length; i++) {
        tl.to(scenes[i - 1], { yPercent: -100, duration: 1 }, ">").to(
          scenes[i],
          { yPercent: 0, duration: 1 },
          "<",
        );
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: ref },
  );

  const openSundae = (sundae: Sundae) => (e: React.MouseEvent<HTMLButtonElement>) => {
    setModal({
      sundae,
      origin: { x: e.clientX, y: e.clientY },
      trigger: e.currentTarget,
    });
  };

  return (
    <>
      <section
        id="eisbecher"
        ref={ref}
        aria-label="Eisbecher Showcase"
        className="relative h-screen w-full overflow-hidden bg-paper-50"
      >
        {/* Section overline + chapter mark — sits above the pinned scenes */}
        <div className="absolute top-8 md:top-12 left-[var(--shell-px-mobile)] md:left-[var(--shell-px-desktop)] z-30 pointer-events-none">
          <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80">
            <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
            Kapitel zwei · Eisbecher
          </p>
        </div>


        {/* Scene stack */}
        {SUNDAES.map((sundae, i) => (
          <div
            key={sundae.name}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            aria-hidden={modal ? true : undefined}
          >
            {/* Photo — right half, full-bleed */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[52%] z-0">
              <Image
                src={sundae.photo}
                alt={`${sundae.name} im Café Laren — ${sundae.ingredients}`}
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                priority={i === 0}
                className="object-cover"
              />
              {/* Warm wash */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-paper-50)_0%,transparent_22%,transparent_70%,var(--overlay-warm-mid)_100%)]" />
              <div className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,var(--color-paper-50)_0%,transparent_28%,var(--overlay-warm-strong)_100%)]" />
            </div>

            {/* Type column */}
            <div className="relative z-10 mx-auto h-full max-w-[var(--shell-max)] px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] flex flex-col justify-center pt-24 md:pt-20 pb-16">
              {/* Index */}
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-espresso-600/80 mb-6">
                <span>{sundae.index}</span>
                <span className="w-10 h-px bg-espresso-600/40" />
                <span className="text-espresso-700/60">{`${i + 1} / ${SUNDAES.length}`}</span>
              </div>

              {/* Display name — single line, italic, masive */}
              <h3 className="font-display italic leading-[0.86] text-espresso-700 select-none text-[clamp(3.5rem,11vw,9rem)] max-w-[14ch]">
                {sundae.name}
              </h3>

              {/* Description */}
              <p className="mt-6 max-w-md text-espresso-600/90 text-base md:text-lg leading-relaxed">
                {sundae.description}
              </p>

              {/* Ingredients */}
              <p className="mt-3 max-w-md text-espresso-600/70 text-[11px] md:text-xs uppercase tracking-[0.32em]">
                {sundae.ingredients}
              </p>

              {/* CTA */}
              <div className="mt-10">
                <button
                  type="button"
                  data-cursor="link"
                  onClick={openSundae(sundae)}
                  className="focus-on-dark inline-flex items-center gap-3 bg-espresso-700 hover:bg-espresso-800 text-paper-50 px-7 py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-medium transition"
                >
                  Mehr ansehen
                  <span aria-hidden className="text-base">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll progress indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-[var(--shell-px-mobile)] md:left-[var(--shell-px-desktop)] right-[var(--shell-px-mobile)] md:right-[var(--shell-px-desktop)] flex items-end justify-between text-[10px] uppercase tracking-[0.42em] text-espresso-600/70 z-20 pointer-events-none">
          <span>Klassische Eisbecher</span>
          <span className="hidden md:inline">scroll ↓</span>
        </div>
      </section>

      <BloomModal
        open={!!modal}
        origin={modal?.origin ?? null}
        silhouette={SUNDAE_GLASS}
        color="var(--color-sun-400)"
        returnFocusTo={modal?.trigger ?? null}
        onClose={() => setModal(null)}
        ariaLabel={modal?.sundae.name}
      >
        {modal && (
          <article className="p-8 md:p-12">
            <div className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
              <span>{modal.sundae.index}</span>
              <span className="w-8 h-px bg-espresso-600/40" />
              <span>Eisbecher</span>
            </div>
            <h4 className="mt-4 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.4rem,6vw,4rem)]">
              {modal.sundae.name}
            </h4>
            <p className="mt-6 text-espresso-600/90 text-base md:text-lg leading-relaxed">
              {modal.sundae.description}
            </p>
            <div className="mt-6 pt-6 border-t border-espresso-700/15">
              <p className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/70 mb-3">
                Zutaten
              </p>
              <p className="text-espresso-700 text-sm md:text-base">
                {modal.sundae.ingredients}
              </p>
            </div>
            <div className="mt-8">
              <p className="font-display italic text-espresso-700 text-2xl md:text-3xl">
                {modal.sundae.price ?? "Tagespreis"}
              </p>
            </div>
          </article>
        )}
      </BloomModal>
    </>
  );
}
