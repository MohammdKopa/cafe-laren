"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BloomModal } from "./BloomModal";
import { SUN_DISC } from "@/lib/bloomSilhouettes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type DealCardData = {
  id: number;
  title: string;
  badge: string | null;
  body: string;
  wasText: string | null;
  priceText: string | null;
  validityText: string | null;
  imageUrl: string | null;
};

type ModalState = {
  deal: DealCardData;
  index: string;
  origin: { x: number; y: number };
  trigger: HTMLElement | null;
} | null;

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function AktionenClient({ deals }: { deals: DealCardData[] }) {
  const ref = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      // BOUNDARY MOMENT — scrub-driven seam approach.
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

      gsap.fromTo("[data-reveal='overline']",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 90%" } });

      gsap.fromTo("[data-mask-line]",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.15, stagger: 0.1, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 88%" } });

      gsap.fromTo("[data-reveal='body']",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.18, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 86%" } });

      gsap.fromTo("[data-deal-photo]",
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 1.1, stagger: 0.14, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-deal-grid]", start: "top 85%" } });

      gsap.fromTo("[data-deal-card]",
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.14, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-deal-grid]", start: "top 85%" } });

      gsap.fromTo("[data-deal-content] > *",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.55, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-deal-grid]", start: "top 85%" } });
    },
    { scope: ref },
  );

  const openDeal = (deal: DealCardData, index: string) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setModal({
        deal,
        index,
        origin: { x: e.clientX, y: e.clientY },
        trigger: e.currentTarget,
      });
    };

  return (
    <>
      <section
        id="aktionen"
        ref={ref}
        aria-label="Aktionen — Diese Woche"
        className="relative bg-paper-50 pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
      >
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

        <div
          data-section-rise
          className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-20"
        >
          <p
            data-reveal="overline"
            className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3"
          >
            <span className="inline-block w-8 h-px bg-espresso-600/60" />
            <span>Diese Woche · Aktionen</span>
            <span className="inline-block w-2 h-2 rounded-full bg-sun-400 animate-pulse" />
          </p>

          <h2 className="mt-6 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
            <span className="block overflow-hidden">
              <span data-mask-line className="inline-block will-change-transform">
                Drei Klassiker.
              </span>
            </span>
            <span className="block overflow-hidden mt-1">
              <span
                data-mask-line
                className="inline-block will-change-transform text-espresso-700/55"
              >
                Drei ehrliche Preise.
              </span>
            </span>
          </h2>

          <p
            data-reveal="body"
            className="mt-6 max-w-md text-espresso-600/90 text-base md:text-lg leading-relaxed"
          >
            Kleine Aktionen, die einen Tag oder eine Tageszeit lang gelten.
            Wechseln gelegentlich. Tippe für die Details.
          </p>
        </div>

        <div
          data-deal-grid
          className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {deals.map((deal, i) => {
            const index = pad(i + 1);
            return (
              <DealCard
                key={deal.id}
                deal={deal}
                index={index}
                onClick={openDeal(deal, index)}
              />
            );
          })}
        </div>

        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-14 md:mt-20 flex items-center justify-between text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
          <span>Aktionen wechseln · Stand diese Woche</span>
          <span className="hidden md:inline">tippen für Details</span>
        </div>
      </section>

      <BloomModal
        open={!!modal}
        origin={modal?.origin ?? null}
        silhouette={SUN_DISC}
        color="var(--color-sun-400)"
        returnFocusTo={modal?.trigger ?? null}
        onClose={() => setModal(null)}
        ariaLabel={modal?.deal.title}
      >
        {modal && (
          <article className="p-8 md:p-12">
            <div className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
              <span>{modal.index}</span>
              <span className="w-8 h-px bg-espresso-600/40" />
              <span>
                Aktion{modal.deal.badge ? ` · ${modal.deal.badge}` : ""}
              </span>
            </div>
            <h4 className="mt-4 font-display italic text-espresso-700 leading-[0.92] text-[clamp(2.4rem,6vw,4rem)]">
              {modal.deal.title}
            </h4>
            <p className="mt-6 text-espresso-600/90 text-base md:text-lg leading-relaxed">
              {modal.deal.body}
            </p>

            {(modal.deal.wasText || modal.deal.priceText) && (
              <div className="mt-8 pt-6 border-t border-espresso-700/15 flex items-baseline gap-4">
                {modal.deal.wasText && (
                  <span className="font-display italic text-espresso-700/45 text-xl md:text-2xl line-through tabular-nums">
                    {modal.deal.wasText}
                  </span>
                )}
                {modal.deal.priceText && (
                  <span className="font-display italic text-espresso-700 text-3xl md:text-4xl tabular-nums">
                    {modal.deal.priceText}
                  </span>
                )}
              </div>
            )}
            {modal.deal.validityText && (
              <p className="mt-3 text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
                {modal.deal.validityText}
              </p>
            )}
          </article>
        )}
      </BloomModal>
    </>
  );
}

function DealCard({
  deal,
  index,
  onClick,
}: {
  deal: DealCardData;
  index: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const photo = deal.imageUrl ?? FALLBACK_PHOTO;
  const ariaParts = [`${deal.title} — Aktion`];
  if (deal.priceText) ariaParts.push(deal.priceText);
  if (deal.wasText) ariaParts.push(`statt ${deal.wasText}`);
  ariaParts.push("Details öffnen");

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      data-deal-card
      aria-label={ariaParts.join(" · ")}
      className="
        group relative text-left rounded-2xl bg-paper-100 overflow-hidden
        ring-1 ring-espresso-700/10
        shadow-[var(--shadow-paper)]
        transition-all duration-500
        hover:-translate-y-1 hover:ring-espresso-700/25
        hover:shadow-[var(--shadow-paper-hover)]
        focus-visible:outline-2 focus-visible:outline-espresso-700
      "
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div data-deal-photo className="absolute inset-0 will-change-[clip-path]">
          <Image
            src={photo}
            alt={`${deal.title} im Café Laren`}
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        </div>

        {deal.badge && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-50/95 backdrop-blur-sm shadow-sm">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-sun-400" />
            <span className="text-[10px] uppercase tracking-[0.32em] text-espresso-700">
              {deal.badge}
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 grid place-items-center w-12 h-12 rounded-full bg-sun-400 text-espresso-700 shadow-md rotate-[-8deg] group-hover:rotate-0 transition-transform duration-500">
          <span className="font-display italic text-[10px] uppercase tracking-[0.18em] leading-none">
            Aktion
          </span>
        </div>
      </div>

      <div data-deal-content className="p-6 md:p-7">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.42em] text-espresso-600/70">
          <span>{index}</span>
          <span className="w-8 h-px bg-espresso-600/40" />
          <span className="text-espresso-700/60">Aktion</span>
        </div>

        <h3 className="mt-3 font-display italic text-espresso-700 text-3xl md:text-4xl leading-[1.05]">
          {deal.title}
        </h3>

        <p className="mt-3 text-espresso-600/85 text-sm md:text-base leading-snug line-clamp-2">
          {deal.body}
        </p>

        {(deal.wasText || deal.priceText) && (
          <div className="mt-5 flex items-baseline gap-3">
            {deal.wasText && (
              <span className="font-body text-espresso-700/45 text-sm md:text-base line-through tabular-nums">
                {deal.wasText}
              </span>
            )}
            {deal.priceText && (
              <span className="font-display italic text-espresso-700 text-2xl md:text-[1.7rem] tabular-nums">
                {deal.priceText}
              </span>
            )}
          </div>
        )}

        {deal.validityText && (
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.32em] text-espresso-600/65">
            {deal.validityText}
          </p>
        )}

        <span
          aria-hidden
          className="absolute left-6 right-6 md:left-7 md:right-7 bottom-3 h-px bg-sun-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        />
      </div>
    </button>
  );
}
