"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Categories = {
  /** Google Maps, Instagram embed, any other third-party content. */
  embeds: boolean;
};

const DEFAULTS: Categories = { embeds: false };
const STORAGE_KEY = "cafe-laren-consent-v1";

type ConsentContext = {
  /** True once the localStorage check has run on the client. */
  loaded: boolean;
  consent: Categories;
  hasChosen: boolean;
  setChoice: (next: Categories) => void;
  reopen: () => void;
};

const Ctx = createContext<ConsentContext | null>(null);

/**
 * Shows a GDPR-compliant cookie banner on first visit. User choice is
 * persisted in localStorage. Embeds (Google Maps, future Instagram feed)
 * stay gated behind `consent.embeds`.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [consent, setConsent] = useState<Categories>(DEFAULTS);
  const [hasChosen, setHasChosen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.embeds === "boolean") {
          setConsent({ embeds: parsed.embeds });
          setHasChosen(true);
        } else {
          setShowBanner(true);
        }
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
    setLoaded(true);
  }, []);

  const setChoice = useCallback((next: Categories) => {
    setConsent(next);
    setHasChosen(true);
    setShowBanner(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore — non-critical, banner just re-shows next visit.
    }
  }, []);

  const reopen = useCallback(() => setShowBanner(true), []);

  return (
    <Ctx.Provider value={{ loaded, consent, hasChosen, setChoice, reopen }}>
      {children}
      {loaded && showBanner && <Banner onChoice={setChoice} initial={consent} />}
    </Ctx.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Server / unwrapped — degrade gracefully.
    return {
      loaded: false,
      consent: DEFAULTS,
      hasChosen: false,
      setChoice: () => {},
      reopen: () => {},
    } as ConsentContext;
  }
  return ctx;
}

function Banner({
  onChoice,
  initial,
}: {
  onChoice: (c: Categories) => void;
  initial: Categories;
}) {
  const [details, setDetails] = useState(false);
  const [embeds, setEmbeds] = useState(initial.embeds);

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-[80] bg-espresso-900/40 backdrop-blur-[1px] animate-fadein"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie-Hinweis"
        className="fixed left-3 right-3 bottom-3 md:left-1/2 md:bottom-6 md:-translate-x-1/2 md:w-[640px] md:max-w-[calc(100vw-3rem)] z-[90] bg-paper-50 rounded-2xl shadow-[var(--shadow-paper-hover)] ring-1 ring-espresso-700/10 p-5 md:p-7 animate-rise"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
          <span aria-hidden className="inline-block w-6 h-px bg-espresso-600/60" />
          Cookies &amp; externe Inhalte
        </p>

        <p className="mt-3 font-display italic text-espresso-700 text-2xl md:text-[1.7rem] leading-tight">
          Bevor du dich hinsetzt.
        </p>

        <p className="mt-3 text-espresso-600/85 text-sm md:text-base leading-relaxed">
          Wir laden Google Maps direkt ein und werden bald unseren Instagram-Feed
          anzeigen. Diese Drittanbieter setzen Cookies. Notwendige Cookies sind
          immer aktiv. Mehr in der{" "}
          <a
            href="/datenschutz"
            className="underline underline-offset-2 hover:text-espresso-900"
          >
            Datenschutzerklärung
          </a>
          .
        </p>

        {details && (
          <div className="mt-5 pt-4 border-t border-espresso-700/10 space-y-4">
            <ToggleRow
              label="Notwendig"
              desc="Speichert deine Cookie-Auswahl. Immer aktiv."
              enabled
              disabled
            />
            <ToggleRow
              label="Externe Inhalte"
              desc="Google Maps. Instagram-Feed (kommt bald)."
              enabled={embeds}
              onChange={setEmbeds}
            />
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => onChoice({ embeds: true })}
            className="focus-on-dark flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-espresso-800 transition active:scale-[0.97]"
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            onClick={() =>
              onChoice({ embeds: details ? embeds : false })
            }
            className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full bg-paper-100 text-espresso-700 ring-1 ring-espresso-700/15 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-paper-200 transition active:scale-[0.97]"
          >
            {details ? "Auswahl speichern" : "Nur notwendige"}
          </button>
        </div>

        {!details && (
          <button
            type="button"
            onClick={() => setDetails(true)}
            className="mt-3 text-[11px] uppercase tracking-[0.32em] text-espresso-600/75 hover:text-espresso-700 inline-flex items-center gap-1"
          >
            Einstellungen anpassen
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </>
  );
}

function ToggleRow({
  label,
  desc,
  enabled,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  enabled: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-espresso-700">{label}</p>
        <p className="text-xs text-espresso-600/75 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={enabled}
        aria-label={`${label} ${enabled ? "aktiviert" : "deaktiviert"}`}
        onClick={() => onChange?.(!enabled)}
        className={[
          "relative w-11 h-6 rounded-full transition flex-shrink-0 mt-0.5",
          enabled ? "bg-sun-400" : "bg-espresso-700/15",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span
          aria-hidden
          className={[
            "absolute top-0.5 w-5 h-5 rounded-full bg-paper-50 shadow transition-all",
            enabled ? "left-[1.375rem]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
