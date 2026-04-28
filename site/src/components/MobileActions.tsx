"use client";

import { useEffect, useRef, useState } from "react";

// Universal directions URL — opens iOS Maps / Android Maps natively, falls
// back to Google Maps web on desktop.
const MAPS_DIR_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Caf%C3%A9+Laren+Marl";

type SubItem = { href: string; label: string };
type MenuItem = { label: string; href?: string; sub?: SubItem[] };

const MENU: MenuItem[] = [
  { label: "Aktionen", href: "#aktionen" },
  {
    label: "Eiskarte",
    sub: [
      { href: "#eisbecher", label: "Eisbecher" },
      { href: "#eissorten", label: "Eissorten" },
      { href: "#karte", label: "Vollständige Karte" },
    ],
  },
  {
    label: "Frühstück",
    sub: [
      { href: "#fruehstueck", label: "Türkisches Frühstück" },
      { href: "#karte", label: "Vollständige Karte" },
    ],
  },
  { label: "Galerie", href: "#galerie" },
  { label: "Kontakt", href: "#kontakt" },
];

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path
        d="M8 14.5s5.25-4.4 5.25-9a5.25 5.25 0 1 0-10.5 0c0 4.6 5.25 9 5.25 9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="5.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Chevron({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 250ms ease",
      }}
    >
      <path
        d="M3 4.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Phone-only sticky bottom bar with two thumb-reach CTAs:
 *   - Route → Google Maps directions to Café Laren (native Maps app on iOS/Android)
 *   - Karte → toggles a sheet with the full nav, two items have submenus
 *
 * Auto-hidden on md+ — desktop uses the header nav. Hidden on iOS keyboards
 * via env(safe-area-inset-bottom) padding.
 */
export function MobileActions() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Fade out when the Kontakt section is in view — its own footer has the
  // route + nav already, the bottom bar would be redundant clutter.
  useEffect(() => {
    const target = document.getElementById("kontakt");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.intersectionRatio > 0.35);
      },
      { threshold: [0, 0.2, 0.35, 0.5, 1] },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  // Escape closes; restore focus to the toggle for a11y.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setExpanded(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the sheet for keyboard / screen-reader users.
    const firstFocusable = sheetRef.current?.querySelector<HTMLElement>(
      "a, button",
    );
    firstFocusable?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Body scroll lock while sheet is open — prevents page scroll behind it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      {/* Backdrop — visible only when sheet is open */}
      <div
        aria-hidden
        onClick={closeAll}
        className={[
          "md:hidden fixed inset-0 z-[55] bg-espresso-900/45 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Sheet — bottom-anchored card that slides up above the bottom bar */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        aria-hidden={!open}
        className={[
          "md:hidden fixed left-3 right-3 z-[65] transition-all duration-300 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.25rem)" }}
      >
        <div className="rounded-2xl bg-paper-50/98 backdrop-blur-md shadow-[var(--shadow-paper-hover)] ring-1 ring-espresso-700/10 px-5 pt-4 pb-4 max-h-[68vh] overflow-y-auto">
          {/* Sheet header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-espresso-700/10">
            <p className="font-body text-[10px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-espresso-600/60" />
              Karte
            </p>
            <button
              type="button"
              onClick={closeAll}
              aria-label="Schließen"
              className="grid place-items-center w-8 h-8 rounded-full text-espresso-700 hover:bg-espresso-700/10 transition"
            >
              <span aria-hidden className="text-xl leading-none">×</span>
            </button>
          </div>

          {/* Menu */}
          <ul className="flex flex-col">
            {MENU.map((item, i) => {
              const isLast = i === MENU.length - 1;
              const itemBorder = isLast
                ? ""
                : "border-b border-espresso-700/10";

              if (item.sub) {
                const isExpanded = expanded === item.label;
                return (
                  <li key={item.label} className={itemBorder}>
                    <button
                      type="button"
                      tabIndex={open ? 0 : -1}
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpanded(isExpanded ? null : item.label)
                      }
                      className="w-full flex items-center justify-between py-3.5 font-display italic text-2xl text-espresso-700 rounded-[2px] text-left"
                    >
                      <span>{item.label}</span>
                      <Chevron
                        className="w-3.5 h-3.5 text-espresso-700/55"
                        open={isExpanded}
                      />
                    </button>
                    <div
                      className={[
                        "overflow-hidden transition-[max-height,opacity] duration-300",
                        isExpanded
                          ? "max-h-64 opacity-100"
                          : "max-h-0 opacity-0",
                      ].join(" ")}
                      aria-hidden={!isExpanded}
                    >
                      <ul className="pb-3 pl-1 flex flex-col">
                        {item.sub.map((s) => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              tabIndex={open && isExpanded ? 0 : -1}
                              onClick={closeAll}
                              className="flex items-center py-2 text-[11px] uppercase tracking-[0.32em] text-espresso-700/85 hover:text-espresso-900 rounded-[2px]"
                            >
                              <span
                                aria-hidden
                                className="inline-block w-5 h-px bg-sun-400 mr-3"
                              />
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.label} className={itemBorder}>
                  <a
                    href={item.href}
                    tabIndex={open ? 0 : -1}
                    onClick={closeAll}
                    className="block py-3.5 font-display italic text-2xl text-espresso-700 rounded-[2px]"
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Hours microcopy */}
          <p className="mt-4 pt-3 border-t border-espresso-700/10 text-[10px] uppercase tracking-[0.42em] text-espresso-600/65 flex items-center justify-between">
            <span>9:00 – 22:30</span>
            <span>täglich</span>
          </p>
        </div>
      </div>

      {/* Bottom CTA bar — sticky on phone, thumb-reach. Auto-hides while
          the Kontakt section is in view (footer state). */}
      <div
        aria-hidden={hidden && !open}
        className={[
          "md:hidden fixed left-3 right-3 z-[70] flex items-stretch gap-2 transition-all duration-400 ease-out",
          hidden && !open
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0",
        ].join(" ")}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <a
          href={MAPS_DIR_HREF}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          aria-label="Route zum Café Laren in Google Maps öffnen"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-paper-50 text-espresso-700 ring-1 ring-espresso-700/15 text-[11px] uppercase tracking-[0.32em] font-medium shadow-[var(--shadow-paper)] hover:bg-paper-200 transition active:scale-[0.97]"
        >
          <PinIcon className="w-4 h-4" />
          <span>Route</span>
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Karte schließen" : "Karte öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="focus-on-dark flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.32em] font-medium shadow-[var(--shadow-paper)] hover:bg-espresso-800 transition active:scale-[0.97]"
        >
          <span>Karte</span>
          <Chevron className="w-3 h-3" open={open} />
        </button>
      </div>
    </>
  );
}
