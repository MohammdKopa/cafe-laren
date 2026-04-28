"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BloomModal } from "./BloomModal";
import { Marquee } from "./Marquee";
import { TRIPLE_SCOOP } from "@/lib/bloomSilhouettes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Flavor = {
  name: string;
  blurb: string;
  family: "milch" | "frucht";
  photo: string;
  /** Subtle accent color used as the family chip dot. */
  accent: string;
};

// Photos are placeholder Unsplash imagery; swap for owner-supplied
// finals when they're available. Reused across families with intent —
// e.g. cherry photo for Amarenakirsch, etc.
const PHOTO = {
  cream:    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  chocolate:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
  pistachio:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
  hazelnut: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  coffee:   "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
  caramel:  "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=800&q=80",
  mint:     "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80",
  cherry:   "https://images.unsplash.com/photo-1505250463725-5ed4e6e6cb3a?auto=format&fit=crop&w=800&q=80",
  strawberry:"https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&w=800&q=80",
  raspberry:"https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=800&q=80",
  lemon:    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
  blueberry:"https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
  banana:   "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?auto=format&fit=crop&w=800&q=80",
  pineapple:"https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=800&q=80",
  berry:    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  melon:    "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&w=800&q=80",
};

const MILCHEIS: Flavor[] = [
  { name: "Vanille",       blurb: "Madagaskar-Vanille, langsam gerührt.",       family: "milch", photo: PHOTO.cream,     accent: "#fce18a" },
  { name: "Schokolade",    blurb: "Dunkle Schokolade, ohne Kompromiss.",        family: "milch", photo: PHOTO.chocolate, accent: "#5c4033" },
  { name: "Stracciatella", blurb: "Vanille mit Schokostreifen — der Klassiker.",family: "milch", photo: PHOTO.cream,     accent: "#2a1c16" },
  { name: "Pistazie",      blurb: "Sizilianische Pistazien, fein gemahlen.",     family: "milch", photo: PHOTO.pistachio, accent: "#88b04b" },
  { name: "Nuss",          blurb: "Geröstete Haselnüsse, satt und tief.",        family: "milch", photo: PHOTO.hazelnut,  accent: "#8b5e3c" },
  { name: "Joghurt",       blurb: "Cremig, leicht säuerlich, frisch.",           family: "milch", photo: PHOTO.cream,     accent: "#f2ebe1" },
  { name: "Tiramisu",      blurb: "Mascarpone, Espresso, ein Hauch Kakao.",      family: "milch", photo: PHOTO.coffee,    accent: "#7a5240" },
  { name: "Kaffee",        blurb: "Espresso, mehr Espresso.",                    family: "milch", photo: PHOTO.coffee,    accent: "#432e25" },
  { name: "Malaga",        blurb: "Rosinen in Marsala — Eis für Erwachsene.",    family: "milch", photo: PHOTO.caramel,   accent: "#a87718" },
  { name: "Alpenkaramell", blurb: "Karamell, gesalzen, butterzart.",             family: "milch", photo: PHOTO.caramel,   accent: "#d99a26" },
  { name: "After Eight",   blurb: "Frische Pfefferminze, dunkle Schokolade.",    family: "milch", photo: PHOTO.mint,      accent: "#3a6e57" },
  { name: "Amarenakirsch", blurb: "Italienische Amarena-Kirschen im Sirup.",     family: "milch", photo: PHOTO.cherry,    accent: "#9b1c2c" },
];

const FRUCHTEIS: Flavor[] = [
  { name: "Erdbeer",     blurb: "Sommer-Erdbeeren, kein Aroma, kein Kompromiss.", family: "frucht", photo: PHOTO.strawberry, accent: "#d24a59" },
  { name: "Himbeere",    blurb: "Himbeeren, intensiv, knapp süß.",                family: "frucht", photo: PHOTO.raspberry,  accent: "#c2255c" },
  { name: "Zitrone",     blurb: "Sizilianische Zitrone — wach, scharf, klar.",    family: "frucht", photo: PHOTO.lemon,      accent: "#f5b841" },
  { name: "Heidelbeer",  blurb: "Wilde Heidelbeeren, dunkel und kühl.",           family: "frucht", photo: PHOTO.blueberry,  accent: "#2c3e6e" },
  { name: "Banane",      blurb: "Reife Banane, ohne künstlichen Geschmack.",      family: "frucht", photo: PHOTO.banana,     accent: "#fbe978" },
  { name: "Ananas",      blurb: "Saftige Ananas, tropisch hell.",                 family: "frucht", photo: PHOTO.pineapple,  accent: "#f5b841" },
  { name: "Waldbeeren",  blurb: "Brombeere, Erdbeere, Heidelbeere zusammen.",     family: "frucht", photo: PHOTO.berry,      accent: "#9b1c2c" },
  { name: "Melone",      blurb: "Honigmelone, kalt und ruhig.",                   family: "frucht", photo: PHOTO.melon,      accent: "#88b04b" },
];

type ModalState = {
  flavor: Flavor;
  origin: { x: number; y: number };
  trigger: HTMLElement | null;
} | null;

export function Eissorten() {
  const ref = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      // BOUNDARY MOMENT — Eissorten variant: slide-from-left (kinetic,
      // matches the marquee energy that follows). The seam glides
      // across instead of dropping.
      gsap.fromTo("[data-seam-wrapper]",
        { xPercent: -100 },
        { xPercent: 0, ease: "none",
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
      gsap.fromTo("[data-reveal='row-label']",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 80%" } });
    },
    { scope: ref },
  );

  const openFlavor = (flavor: Flavor) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setModal({
        flavor,
        origin: { x: e.clientX, y: e.clientY },
        trigger: e.currentTarget,
      });
    };

  return (
    <>
      <section
        id="eissorten"
        ref={ref}
        aria-label="Eissorten — 20 Sorten täglich"
        className="relative bg-paper-100 pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
      >
        {/* Gold arc seam — same brand swoop family as TwoWorlds, dipping
            into Eissorten from above. */}
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
          <p data-reveal="overline" className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80">
            <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
            Kapitel drei · Eissorten
          </p>
          <h2 className="mt-6 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
            <span className="block overflow-hidden">
              <span data-mask-line className="inline-block will-change-transform">
                Zwanzig Sorten —
              </span>
            </span>
            <span className="block overflow-hidden mt-1">
              <span data-mask-line className="inline-block will-change-transform text-espresso-700/55">
                täglich frisch.
              </span>
            </span>
          </h2>
          <p data-reveal="body" className="mt-6 max-w-md text-espresso-600/90 text-base md:text-lg leading-relaxed">
            Milcheis und Fruchteis. Tippe oder klicke eine Sorte für mehr —
            mit der Maus über eine Reihe fahren bremst sie aus.
          </p>
        </div>

        {/* Row 1 — Milcheis, slow leftward */}
        <div data-reveal="row-label" className="mt-2 mb-4 md:mb-6 px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] flex items-end gap-3 max-w-[var(--shell-max)] mx-auto">
          <span className="font-display italic text-espresso-700/75 text-2xl md:text-3xl">Milcheis</span>
          <span className="flex-1 h-px bg-espresso-700/15 mb-3" />
          <span className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/60">12 Sorten</span>
        </div>
        <Marquee
          items={MILCHEIS}
          ariaLabel="Milcheis"
          direction="left"
          speed={80}
          className="py-4 md:py-6"
          renderItem={(flavor, i) => (
            <FlavorCard key={`m-${i}`} flavor={flavor} onClick={openFlavor(flavor)} />
          )}
        />

        {/* Row 2 — Fruchteis, faster rightward */}
        <div data-reveal="row-label" className="mt-12 mb-4 md:mb-6 px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] flex items-end gap-3 max-w-[var(--shell-max)] mx-auto">
          <span className="font-display italic text-espresso-700/75 text-2xl md:text-3xl">Fruchteis</span>
          <span className="flex-1 h-px bg-espresso-700/15 mb-3" />
          <span className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/60">8 Sorten</span>
        </div>
        <Marquee
          items={FRUCHTEIS}
          ariaLabel="Fruchteis"
          direction="right"
          speed={64}
          className="py-4 md:py-6"
          renderItem={(flavor, i) => (
            <FlavorCard key={`f-${i}`} flavor={flavor} onClick={openFlavor(flavor)} />
          )}
        />

        {/* Footer label row */}
        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-12 md:mt-16 flex items-center justify-between text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
          <span>20 Sorten · Milcheis &amp; Fruchteis</span>
          <span className="hidden md:inline">tippen für Details</span>
        </div>
      </section>

      <BloomModal
        open={!!modal}
        origin={modal?.origin ?? null}
        silhouette={TRIPLE_SCOOP}
        color="var(--color-sun-400)"
        returnFocusTo={modal?.trigger ?? null}
        onClose={() => setModal(null)}
        ariaLabel={modal?.flavor.name}
      >
        {modal && (
          <article className="p-8 md:p-12">
            <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
              <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
              {modal.flavor.family === "milch" ? "Milcheis" : "Fruchteis"}
            </p>
            <h4 className="mt-4 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.4rem,7vw,4.5rem)]">
              {modal.flavor.name}
            </h4>
            <p className="mt-6 text-espresso-600/90 text-base md:text-lg leading-relaxed max-w-md">
              {modal.flavor.blurb}
            </p>
            <div className="mt-8 pt-6 border-t border-espresso-700/15 flex items-baseline justify-between gap-6">
              <span className="text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
                Eine Kugel
              </span>
              <span className="font-display italic text-espresso-700 text-2xl md:text-3xl">
                Tagespreis
              </span>
            </div>
          </article>
        )}
      </BloomModal>
    </>
  );
}

function FlavorCard({
  flavor,
  onClick,
}: {
  flavor: Flavor;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const familyLabel = flavor.family === "milch" ? "Milcheis" : "Fruchteis";
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-label={`${flavor.name} — ${familyLabel}, Details öffnen`}
      className="
        group relative flex-shrink-0 mx-3 md:mx-4
        w-[300px] h-[420px] md:w-[360px] md:h-[500px]
        text-left rounded-2xl overflow-hidden bg-paper-200
        shadow-[var(--shadow-paper)] transition-all duration-500
        hover:shadow-[var(--shadow-paper-hover)]
        focus-visible:outline-2 focus-visible:outline-espresso-700
      "
    >
      {/* Full-bleed photo */}
      <Image
        src={flavor.photo}
        alt={`${flavor.name} — ${familyLabel}`}
        fill
        sizes="(min-width: 768px) 360px, 300px"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />

      {/* Legibility gradient — dark base for the text/CTA, transparent up top */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,7,0.05)_0%,rgba(20,12,7,0.1)_45%,rgba(20,12,7,0.78)_100%)]" />

      {/* Family chip — top-left */}
      <div className="absolute top-4 left-4 md:top-5 md:left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-50/95 backdrop-blur-sm shadow-sm">
        <span
          aria-hidden
          className="w-2 h-2 rounded-full"
          style={{ background: flavor.accent }}
        />
        <span className="text-[10px] uppercase tracking-[0.32em] text-espresso-700">
          {familyLabel}
        </span>
      </div>

      {/* Bottom content — name, blurb, CTA — all on the photo */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-7">
        <h3 className="font-display italic text-paper-50 text-3xl md:text-4xl leading-[1.05] tracking-[-0.01em] drop-shadow-sm">
          {flavor.name}
        </h3>
        <p className="mt-2 text-paper-100/85 text-sm leading-snug line-clamp-2 max-w-[28ch]">
          {flavor.blurb}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 pb-1 text-paper-50 text-[10px] uppercase tracking-[0.32em] border-b border-paper-50/40 group-hover:border-paper-50 transition-colors duration-300">
          Mehr ansehen
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </button>
  );
}
