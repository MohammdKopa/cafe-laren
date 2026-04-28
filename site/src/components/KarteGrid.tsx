"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BloomModal } from "./BloomModal";
import { SOFT_SERVE } from "@/lib/bloomSilhouettes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CategoryItem = {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  priceNote: string | null;
};

type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  itemCount: number;
  items: CategoryItem[];
};

type Group = {
  key: string;
  label: string;
  blurb: string;
};

const GROUPS: Group[] = [
  { key: "eis",       label: "Eis",        blurb: "Sorten, Becher, Spezialitäten" },
  { key: "fruehst",   label: "Frühstück",  blurb: "Türkisch, Deutsch, Italienisch" },
  { key: "kaffee",    label: "Kaffee & Tee", blurb: "Heiß, ehrlich, lange" },
  { key: "kalt",      label: "Getränke",   blurb: "Kalt, frisch, von der Karte" },
  { key: "bar",       label: "Bar",        blurb: "Aperitif, Cocktails, Eis-Kaffee" },
];

const SLUG_TO_GROUP: Record<string, string> = {
  "eissorten": "eis",
  "eis-portionen": "eis",
  "klassische-eisbecher": "eis",
  "eisbecher-mit-likoer-und-spezial": "eis",
  "joghurt-spezialitaeten": "eis",
  "eis-spaghetti-und-sondereis": "eis",
  "fuer-unsere-kleinen": "eis",
  "eisgetraenke-und-eis-kaffee": "eis",
  "milch-mix-getraenke": "eis",
  "waffeln": "eis",

  "fruehstueck": "fruehst",
  "belegte-broetchen": "fruehst",
  "toast": "fruehst",
  "extra-fruehstueck": "fruehst",
  "extras-zum-fruehstueck": "fruehst",

  "extra-kaffee": "kaffee",
  "warme-getraenke": "kaffee",
  "tee-auswahl": "kaffee",

  "kalte-getraenke": "kalt",
  "elephant-bay-ice-tea": "kalt",

  "aperitif": "bar",
  "cocktails": "bar",
  "alkoholische-getraenke": "bar",
};

type ModalState = {
  category: Category;
  origin: { x: number; y: number };
  trigger: HTMLElement | null;
} | null;

export function KarteGrid({ categories }: { categories: Category[] }) {
  const ref = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      // KarteGrid variant: architectural — slower scrub over a longer
      // approach range. The seam takes its time falling into place,
      // matches the "opening a tome" feeling of the full menu.
      gsap.fromTo("[data-seam-wrapper]",
        { yPercent: -38, scaleY: 0.4 },
        { yPercent: 0, scaleY: 1, ease: "none", transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 35%", scrub: 1.0 } });
      gsap.timeline({
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 15%", scrub: 1.0 },
      })
        .fromTo("[data-seam-halo]", { autoAlpha: 0 }, { autoAlpha: 0.65, duration: 0.55, ease: "none" })
        .to("[data-seam-halo]", { autoAlpha: 0, duration: 0.45, ease: "none" });
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

      gsap.utils.toArray<HTMLElement>("[data-reveal='group']").forEach((groupEl) => {
        const headers = groupEl.querySelectorAll<HTMLElement>("[data-reveal='group-header']");
        const cards = groupEl.querySelectorAll<HTMLElement>("[data-reveal='card']");
        if (headers.length) {
          gsap.fromTo(headers,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", immediateRender: false,
              scrollTrigger: { ...ST_BASE, trigger: groupEl, start: "top 90%" } });
        }
        if (cards.length) {
          gsap.fromTo(cards,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "expo.out", immediateRender: false,
              scrollTrigger: { ...ST_BASE, trigger: groupEl, start: "top 88%" } });
        }
      });
    },
    { scope: ref },
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const cat of categories) {
      const key = SLUG_TO_GROUP[cat.slug] ?? "eis";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cat);
    }
    return GROUPS.filter((g) => map.has(g.key)).map((g) => ({
      ...g,
      categories: map.get(g.key) ?? [],
    }));
  }, [categories]);

  const totalCategories = categories.length;
  const totalItems = categories.reduce((sum, c) => sum + c.itemCount, 0);

  const openCategory = (category: Category) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setModal({
        category,
        origin: { x: e.clientX, y: e.clientY },
        trigger: e.currentTarget,
      });
    };

  return (
    <>
      <section
        id="karte"
        ref={ref}
        aria-label="Vollständige Karte"
        className="relative bg-paper-50 pt-36 md:pt-52 pb-24 md:pb-32 overflow-hidden"
      >
        {/* Gold seam at top */}
        <div
          data-seam-wrapper
          aria-hidden
          className="absolute -top-px left-0 right-0 pointer-events-none z-0 will-change-transform"
          style={{ height: "clamp(240px, 36vh, 460px)" }}
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
        <div data-section-rise className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-14 md:mb-20">
          <p data-reveal="overline" className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80">
            <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
            Kapitel fünf · Vollständige Karte
          </p>
          <h2 className="mt-6 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
            <span className="block overflow-hidden">
              <span data-mask-line className="inline-block will-change-transform">
                Alles auf
              </span>
            </span>
            <span className="block overflow-hidden mt-1">
              <span data-mask-line className="inline-block will-change-transform text-espresso-700/55">
                einer Seite.
              </span>
            </span>
          </h2>
          <div data-reveal="body" className="mt-6 max-w-md text-espresso-600/90 text-base md:text-lg leading-relaxed flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{totalCategories} Kategorien · {totalItems} Artikel</span>
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-espresso-600/40" />
            <span className="text-espresso-600/75">Tippe eine Kategorie an, um alles zu sehen.</span>
          </div>
        </div>

        {/* Empty-state fallback if DB fetch failed */}
        {grouped.length === 0 && (
          <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] py-16 text-center">
            <p className="text-espresso-600/75 italic">
              Die Karte wird gerade aktualisiert. Bitte einen Moment.
            </p>
          </div>
        )}

        {/* Groups */}
        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] space-y-14 md:space-y-20">
          {grouped.map((group) => (
            <div key={group.key} data-reveal="group">
              <div data-reveal="group-header" className="flex items-baseline gap-3 mb-6 md:mb-8">
                <h3 className="font-display italic text-espresso-700 text-2xl md:text-4xl leading-[0.95]">
                  {group.label}
                </h3>
                <span className="hidden md:inline text-[11px] uppercase tracking-[0.32em] text-espresso-600/60">
                  {group.blurb}
                </span>
                <span className="flex-1 h-px bg-espresso-700/15 mb-1" />
                <span className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/55">
                  {group.categories.length}{" "}
                  {group.categories.length === 1 ? "Kategorie" : "Kategorien"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {group.categories.map((cat) => (
                  <div key={cat.id} data-reveal="card">
                    <CategoryCard
                      category={cat}
                      onClick={openCategory(cat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <BloomModal
        open={!!modal}
        origin={modal?.origin ?? null}
        silhouette={SOFT_SERVE}
        color="var(--color-sun-400)"
        returnFocusTo={modal?.trigger ?? null}
        onClose={() => setModal(null)}
        ariaLabel={modal?.category.name}
      >
        {modal && <CategoryModalContent category={modal.category} />}
      </BloomModal>
    </>
  );
}

function CategoryCard({
  category,
  onClick,
}: {
  category: Category;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-label={`${category.name} öffnen — ${category.itemCount} Artikel`}
      className="
        group relative text-left rounded-xl bg-paper-100 border border-espresso-700/8
        px-5 py-5 md:px-6 md:py-6 min-h-[120px]
        transition-all duration-300
        hover:border-espresso-700/20 hover:-translate-y-0.5 hover:shadow-[var(--shadow-paper)]
        focus-visible:outline-2 focus-visible:outline-espresso-700
      "
    >
      {/* Top: count chip + arrow */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/60">
          {category.itemCount} {category.itemCount === 1 ? "Artikel" : "Artikel"}
        </span>
        <span
          aria-hidden
          className="w-7 h-7 rounded-full grid place-items-center bg-espresso-700/0 group-hover:bg-sun-400/30 text-espresso-700 transition-all duration-300 group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>

      {/* Name */}
      <h4 className="mt-4 font-display italic text-espresso-700 leading-[1.05] text-2xl md:text-[1.7rem] tracking-[-0.005em]">
        {category.name}
      </h4>

      {/* Subtle accent stripe at bottom that animates on hover */}
      <span
        aria-hidden
        className="absolute left-5 right-5 md:left-6 md:right-6 bottom-3 h-px bg-sun-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
      />
    </button>
  );
}

function formatPrice(item: CategoryItem): string {
  if (item.priceNote) return item.priceNote;
  if (!item.priceCents || item.priceCents === 0) return "Tagespreis";
  const euros = item.priceCents / 100;
  return `${euros.toFixed(2).replace(".", ",")} €`;
}

function CategoryModalContent({ category }: { category: Category }) {
  return (
    <article className="p-7 md:p-10">
      <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
        <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
        Kategorie · {category.itemCount} Artikel
      </p>
      <h4 className="mt-4 font-display italic text-espresso-700 leading-[0.95] text-[clamp(2rem,5vw,3.4rem)]">
        {category.name}
      </h4>
      {category.description && (
        <p className="mt-4 text-espresso-600/85 text-base md:text-lg leading-relaxed max-w-md">
          {category.description}
        </p>
      )}

      <ul className="mt-7 divide-y divide-espresso-700/10">
        {category.items.map((item) => (
          <li
            key={item.id}
            className="py-4 flex items-baseline gap-4 md:gap-6"
          >
            <div className="flex-1 min-w-0">
              <p className="font-display italic text-espresso-700 text-lg md:text-xl leading-tight">
                {item.name}
              </p>
              {item.description && (
                <p className="mt-1 text-espresso-600/80 text-sm leading-snug">
                  {item.description}
                </p>
              )}
            </div>
            <span
              className="font-display italic text-espresso-700 text-base md:text-lg whitespace-nowrap tabular-nums"
              aria-label="Preis"
            >
              {formatPrice(item)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
