"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useConsent } from "./Consent";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HANDLE = "cafelaren";
const PROFILE_HREF = `https://www.instagram.com/${HANDLE}/`;

/**
 * Real Instagram posts to embed. Each entry is the post's *shortcode* —
 * the bit between `/p/` (or `/reel/`) and the trailing slash in a
 * post URL.
 *
 *   https://www.instagram.com/p/C5vQXyZ123/  →  shortcode: "C5vQXyZ123"
 *
 * Add 3, 6 or 9 entries for a clean grid. The grid auto-sizes:
 *   • mobile: 1 col
 *   • tablet: 2 col
 *   • desktop: 3 col
 *
 * When the array is empty the section shows a "follow us" empty state
 * instead of the embed grid. When it has entries, embeds are gated
 * behind the user's `embeds` consent (Instagram sets cookies).
 */
const POSTS: { shortcode: string; type?: "p" | "reel" }[] = [
  { shortcode: "DXkIWAADMRs" },
  { shortcode: "DMqL-TmoEEP" },
  { shortcode: "C8UBWroI6Zd" },
  { shortcode: "C9rkPzFI1Sp" },
  { shortcode: "CFoweGUi6l2" },
  { shortcode: "CFHPAzKiuJc" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramFeed() {
  const { consent, setChoice } = useConsent();
  const ref = useRef<HTMLDivElement>(null);
  const allowed = consent.embeds;
  const hasPosts = POSTS.length > 0;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      gsap.fromTo("[data-reveal='ig-overline']",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 88%" } });
      gsap.fromTo("[data-ig-tile]",
        { autoAlpha: 0, scale: 0.96, y: 16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.85, stagger: 0.06, ease: "expo.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 85%" } });
      gsap.fromTo("[data-reveal='ig-cta']",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out", immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 80%" } });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-ig-strip className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-20 md:mt-28">
      <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
        <div data-reveal="ig-overline">
          <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
            <span aria-hidden className="inline-block w-8 h-px bg-espresso-600/60" />
            Live · Instagram
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full bg-sun-400 animate-pulse"
            />
          </p>
          <h3 className="mt-3 font-display italic text-espresso-700 text-3xl md:text-[2.6rem] leading-[1.05]">
            @{HANDLE}
          </h3>
        </div>
        <a
          href={PROFILE_HREF}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition border-b border-espresso-700/30 hover:border-espresso-700 pb-1 rounded-[2px]"
        >
          Auf Instagram folgen
          <span aria-hidden>→</span>
        </a>
      </div>

      {!hasPosts ? (
        <EmptyState />
      ) : !allowed ? (
        <ConsentGate onAllow={() => setChoice({ embeds: true })} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {POSTS.map((post) => (
            <div
              key={post.shortcode}
              data-ig-tile
              className="relative rounded-2xl overflow-hidden bg-paper-200 ring-1 ring-espresso-700/8 shadow-[var(--shadow-paper)]"
            >
              <iframe
                src={`https://www.instagram.com/${post.type ?? "p"}/${post.shortcode}/embed/captioned/`}
                title={`Instagram-Beitrag von @${HANDLE}`}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                scrolling="no"
                className="w-full block"
                style={{ border: 0, height: 640, background: "var(--color-paper-100)" }}
              />
            </div>
          ))}
        </div>
      )}

      <div data-reveal="ig-cta" className="mt-8 md:mt-10 flex justify-center">
        <a
          href={PROFILE_HREF}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          className="group inline-flex items-center gap-3 px-6 md:px-7 py-3.5 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-espresso-800 transition active:scale-[0.97] focus-on-dark"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Folge uns auf Instagram</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-ig-tile
      className="rounded-2xl bg-paper-50 ring-1 ring-espresso-700/10 px-6 py-10 md:px-10 md:py-14 text-center"
    >
      <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-sun-400/15 ring-1 ring-sun-400/30 mb-5">
        <InstagramIcon className="w-5 h-5 text-espresso-700" />
      </div>
      <p className="font-display italic text-espresso-700 text-2xl md:text-3xl leading-tight">
        Frische Posts kommen direkt vom Profil.
      </p>
      <p className="mt-3 max-w-md mx-auto text-espresso-600/85 text-sm md:text-base leading-relaxed">
        Der Live-Feed wird hier eingebunden, sobald wir die ersten Beiträge
        ausgewählt haben. Bis dahin: vorbeischauen lohnt sich.
      </p>
      <a
        href={PROFILE_HREF}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-espresso-800 transition active:scale-[0.97] focus-on-dark"
      >
        <InstagramIcon className="w-4 h-4" />
        <span>Auf Instagram öffnen</span>
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function ConsentGate({ onAllow }: { onAllow: () => void }) {
  return (
    <div
      data-ig-tile
      className="rounded-2xl bg-[radial-gradient(circle_at_50%_30%,var(--color-espresso-700)_0%,var(--color-espresso-900)_70%)] text-paper-100 ring-1 ring-chiffon-200/15 px-6 py-10 md:px-10 md:py-14 text-center"
    >
      <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-sun-400/15 ring-1 ring-sun-400/30 mb-5">
        <InstagramIcon className="w-5 h-5 text-sun-400" />
      </div>
      <p className="font-display italic text-chiffon-200 text-2xl md:text-3xl leading-tight">
        Instagram-Beiträge?
      </p>
      <p className="mt-3 max-w-md mx-auto text-paper-100/75 text-sm md:text-base leading-relaxed">
        Wir laden den Feed erst nach deiner Zustimmung — Instagram
        setzt dabei Cookies.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAllow}
          data-cursor="link"
          className="focus-on-dark inline-flex items-center gap-2 px-5 py-3 rounded-full bg-sun-400 text-espresso-700 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-sun-300 transition active:scale-[0.97]"
        >
          Feed laden
          <span aria-hidden>→</span>
        </button>
        <a
          href={PROFILE_HREF}
          target="_blank"
          rel="noreferrer"
          className="focus-on-dark inline-flex items-center gap-2 px-5 py-3 rounded-full ring-1 ring-chiffon-200/30 text-chiffon-200 text-[11px] uppercase tracking-[0.32em] hover:ring-chiffon-200/60 transition"
        >
          Auf Instagram öffnen
          <span aria-hidden>→</span>
        </a>
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.42em] text-chiffon-200/50">
        Mehr in der{" "}
        <a
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-chiffon-200"
        >
          Datenschutzerklärung
        </a>
      </p>
    </div>
  );
}
