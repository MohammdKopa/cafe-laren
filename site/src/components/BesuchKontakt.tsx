"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useConsent } from "./Consent";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PHONE_DISPLAY = "0152 5899 0000";
const PHONE_HREF = "tel:+4915258990000";
const EMAIL = "info@cafe-laren.de";
const EMAIL_HREF = "mailto:info@cafe-laren.de";
const INSTAGRAM = "@cafelaren";
const INSTAGRAM_HREF = "https://www.instagram.com/cafelaren/";
const MAPS_HREF = "https://maps.app.goo.gl/BMcGY4ppLwkzoE9C6";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Caf%C3%A9+Laren+Marl&output=embed";

export function BesuchKontakt() {
  const ref = useRef<HTMLElement>(null);
  const { consent, setChoice, reopen } = useConsent();
  const mapsAllowed = consent.embeds;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const ST_BASE = { invalidateOnRefresh: true };

      // BOUNDARY MOMENT — Besuch & Kontakt variant: KISSED-ARCS (both
      // original and mirrored paths layered). Quieter scrub, the
      // closing settle. Smaller halo because espresso-800 is the
      // resting surface of the whole page.
      gsap.fromTo(
        "[data-seam-wrapper]",
        { yPercent: -28, scaleY: 0.6 },
        {
          yPercent: 0,
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 50%", scrub: 0.6 },
        },
      );
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: 0.6 },
        })
        .fromTo("[data-seam-halo]", { autoAlpha: 0 }, { autoAlpha: 0.6, duration: 0.55, ease: "none" })
        .to("[data-seam-halo]", { autoAlpha: 0, duration: 0.45, ease: "none" });
      gsap.to("[data-seam='ridge']", {
        yPercent: 24,
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

      // Standard reveals
      gsap.fromTo(
        "[data-reveal='overline']",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 90%" },
        },
      );
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
      gsap.fromTo(
        "[data-reveal='body']",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: 0.18,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: root, start: "top 84%" },
        },
      );
      gsap.fromTo(
        "[data-reveal='ledger']",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-reveal='ledger']", start: "top 88%" },
        },
      );
      gsap.fromTo(
        "[data-reveal='map']",
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.0,
          ease: "expo.out",
          immediateRender: false,
          scrollTrigger: { ...ST_BASE, trigger: "[data-reveal='map']", start: "top 88%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      id="kontakt"
      ref={ref}
      aria-label="Besuch & Kontakt"
      className="relative bg-espresso-800 text-paper-100 pt-32 md:pt-44 pb-12 md:pb-16 overflow-hidden"
    >
      {/* Boundary wrapper — KISSED-ARCS variant, signature of this final
          section: both original and mirrored arc paths are layered, so
          the seam reads as a symmetric bow. None of the other sections
          do this. */}
      <div
        data-seam-wrapper
        aria-hidden
        className="absolute -top-px left-0 right-0 pointer-events-none z-0 will-change-transform"
        style={{ height: "clamp(160px, 24vh, 320px)" }}
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
          {/* Original arc — deep dip on the LEFT */}
          <path
            data-seam="primary"
            d="M 0 0 L 1440 0 L 1440 32 C 1240 72, 980 92, 700 120 C 420 148, 200 172, 0 184 Z"
            fill="var(--color-sun-400)"
          />
          {/* Mirrored arc layered — deep dip on the RIGHT, kissed bow */}
          <path
            d="M 1440 0 L 0 0 L 0 32 C 200 72, 460 92, 740 120 C 1020 148, 1240 172, 1440 184 Z"
            fill="var(--color-sun-400)"
            opacity="0.55"
          />
          <path
            data-seam="ridge"
            d="M 0 184 C 200 172, 420 148, 700 120 C 980 92, 1240 72, 1440 32 L 1440 50 C 1240 92, 980 114, 700 142 C 420 170, 200 194, 0 200 Z"
            fill="var(--color-sun-500)"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Header */}
      <div
        data-section-rise
        className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mb-12 md:mb-20"
      >
        <p
          data-reveal="overline"
          className="font-body text-[11px] uppercase tracking-[0.42em] text-chiffon-200/75"
        >
          <span className="inline-block w-8 h-px bg-chiffon-200/60 align-middle mr-3" />
          Kapitel sieben · Besuch &amp; Kontakt
        </p>
        <h2 className="mt-6 font-display italic text-chiffon-200 leading-[0.92] text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl">
          <span className="block overflow-hidden">
            <span data-mask-line className="inline-block will-change-transform">
              Schaut vorbei.
            </span>
          </span>
          <span className="block overflow-hidden mt-1">
            <span
              data-mask-line
              className="inline-block will-change-transform text-chiffon-200/55"
            >
              Wir bleiben offen.
            </span>
          </span>
        </h2>
        <p
          data-reveal="body"
          className="mt-6 max-w-md text-paper-100/80 text-base md:text-lg leading-relaxed"
        >
          Mitten in Marl. Eis, Kaffee, Frühstück — und Zeit. Täglich ab 9 Uhr.
        </p>
      </div>

      {/* Content grid: ledger left, map right */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-14">
        {/* Ledger column */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6">
          <LedgerRow
            label="Öffnungszeiten"
            value={
              <>
                <p className="font-display italic text-chiffon-200 text-3xl md:text-[2.4rem] leading-none tabular-nums">
                  9:00 – 22:30
                </p>
                <p className="mt-2 text-paper-100/70 text-sm">Montag bis Sonntag · täglich</p>
              </>
            }
          />

          <LedgerRow
            label="Adresse"
            value={
              <>
                <p className="font-display italic text-chiffon-200 text-3xl md:text-[2.4rem] leading-tight">
                  Marl
                </p>
                <p className="mt-1 text-paper-100/70 text-sm">
                  Nordrhein-Westfalen, Deutschland
                </p>
                <a
                  href={MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-on-dark mt-3 inline-flex items-center gap-2 text-chiffon-200 text-[11px] uppercase tracking-[0.32em] border-b border-chiffon-200/40 hover:border-chiffon-200 pb-1 transition rounded-[2px]"
                >
                  Auf Google Maps öffnen
                  <span aria-hidden>→</span>
                </a>
              </>
            }
          />

          <LedgerRow
            label="Telefon"
            value={
              <a
                href={PHONE_HREF}
                className="focus-on-dark group inline-flex items-baseline gap-3"
                data-cursor="link"
              >
                <span className="font-display italic text-chiffon-200 text-2xl md:text-[1.8rem] tabular-nums">
                  {PHONE_DISPLAY}
                </span>
                <span
                  aria-hidden
                  className="text-chiffon-200/60 text-base group-hover:translate-x-1 transition-transform duration-300"
                >
                  →
                </span>
              </a>
            }
          />

          <LedgerRow
            label="E-Mail"
            value={
              <a
                href={EMAIL_HREF}
                className="focus-on-dark group inline-flex items-baseline gap-3"
                data-cursor="link"
              >
                <span className="font-display italic text-chiffon-200 text-xl md:text-2xl">
                  {EMAIL}
                </span>
                <span
                  aria-hidden
                  className="text-chiffon-200/60 group-hover:translate-x-1 transition-transform duration-300"
                >
                  →
                </span>
              </a>
            }
          />

          <LedgerRow
            label="Instagram"
            value={
              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noreferrer"
                className="focus-on-dark group inline-flex items-baseline gap-3"
                data-cursor="link"
              >
                <span className="font-display italic text-chiffon-200 text-2xl md:text-[1.8rem]">
                  {INSTAGRAM}
                </span>
                <span
                  aria-hidden
                  className="text-chiffon-200/60 group-hover:translate-x-1 transition-transform duration-300"
                >
                  →
                </span>
              </a>
            }
          />
        </div>

        {/* Map column */}
        <div
          data-reveal="map"
          className="lg:col-span-3 relative aspect-[4/3] lg:aspect-auto lg:min-h-[540px] rounded-2xl overflow-hidden ring-1 ring-chiffon-200/15 bg-espresso-900 will-change-transform"
        >
          {mapsAllowed ? (
            <>
              <iframe
                src={MAPS_EMBED}
                title="Café Laren · Marl auf Google Maps"
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                style={{
                  border: 0,
                  filter: "grayscale(0.18) contrast(1.05) brightness(0.96)",
                }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-espresso-900/30"
              />
              <a
                href={MAPS_HREF}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="focus-on-dark absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-espresso-900/85 backdrop-blur-sm text-chiffon-200 text-[11px] uppercase tracking-[0.32em] hover:bg-espresso-900 transition shadow-md"
              >
                In Google Maps
                <span aria-hidden>→</span>
              </a>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-8 bg-[radial-gradient(circle_at_50%_30%,var(--color-espresso-700)_0%,var(--color-espresso-900)_70%)]">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-sun-400/15 ring-1 ring-sun-400/30 mb-5">
                <svg viewBox="0 0 16 16" className="w-5 h-5 text-sun-400" fill="none" aria-hidden>
                  <path
                    d="M8 14.5s5.25-4.4 5.25-9a5.25 5.25 0 1 0-10.5 0c0 4.6 5.25 9 5.25 9z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="5.5" r="1.6" fill="currentColor" />
                </svg>
              </div>
              <p className="font-display italic text-chiffon-200 text-2xl md:text-3xl leading-tight">
                Karte über Google Maps?
              </p>
              <p className="mt-3 max-w-sm text-paper-100/75 text-sm md:text-base leading-relaxed">
                Wir laden die Karte erst nach deiner Zustimmung — Google
                setzt dabei Cookies.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChoice({ embeds: true })}
                  data-cursor="link"
                  className="focus-on-dark inline-flex items-center gap-2 px-5 py-3 rounded-full bg-sun-400 text-espresso-700 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-sun-300 transition active:scale-[0.97]"
                >
                  Karte laden
                  <span aria-hidden>→</span>
                </button>
                <a
                  href={MAPS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-on-dark inline-flex items-center gap-2 px-5 py-3 rounded-full ring-1 ring-chiffon-200/30 text-chiffon-200 text-[11px] uppercase tracking-[0.32em] hover:ring-chiffon-200/60 transition"
                >
                  In Google Maps öffnen
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
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] mt-20 md:mt-28 pt-8 border-t border-chiffon-200/15">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[11px] uppercase tracking-[0.42em] text-chiffon-200/55">
          <span>© {new Date().getFullYear()} Café Laren · Marl, NRW</span>

          <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/impressum"
              className="focus-on-dark hover:text-chiffon-200 transition rounded-[2px]"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="focus-on-dark hover:text-chiffon-200 transition rounded-[2px]"
            >
              Datenschutz
            </a>
            <button
              type="button"
              onClick={reopen}
              className="focus-on-dark hover:text-chiffon-200 transition rounded-[2px]"
            >
              Cookie-Einstellungen
            </button>
          </nav>

          <span className="inline-flex items-center gap-3 md:order-last">
            Eis · Kaffee · Kuchen
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full bg-sun-400"
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function LedgerRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div data-reveal="ledger" className="border-b border-chiffon-200/10 pb-5 md:pb-6">
      <p className="text-[10px] uppercase tracking-[0.42em] text-chiffon-200/55 mb-2">
        {label}
      </p>
      {value}
    </div>
  );
}
