import Link from "next/link";
import type { ReactNode } from "react";

export function LegalShell({
  title,
  overline,
  lastUpdated,
  children,
}: {
  title: string;
  overline: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-paper-100 text-espresso-700 min-h-screen">
      {/* Slim header */}
      <header className="sticky top-0 z-40 bg-paper-100/85 backdrop-blur-md border-b border-espresso-700/10">
        <div className="max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] py-4 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Café Laren — zurück zur Startseite"
            className="font-display italic text-espresso-700 text-xl md:text-2xl flex items-baseline gap-2 group rounded-[2px]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
              Café
            </span>
            <span className="not-italic font-display tracking-wider text-chiffon-200 bg-espresso-700 px-2 pt-0.5 pb-1 leading-none rounded-[2px] text-base md:text-lg transition-transform duration-300 group-hover:translate-y-0.5">
              LAREN
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition rounded-[2px]"
          >
            <span aria-hidden>←</span>
            <span>Zurück</span>
          </Link>
        </div>
      </header>

      {/* Title block */}
      <section className="relative pt-16 md:pt-24 pb-10 md:pb-14 overflow-hidden">
        {/* Quiet seam */}
        <svg
          aria-hidden
          className="absolute -top-px left-0 right-0 w-full pointer-events-none z-0"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: "clamp(110px, 20vh, 240px)" }}
        >
          <path
            d="M 0 0 L 1440 0 L 1440 32 C 1240 72, 980 92, 700 120 C 420 148, 200 172, 0 184 Z"
            fill="var(--color-sun-400)"
          />
          <path
            d="M 0 184 C 200 172, 420 148, 700 120 C 980 92, 1240 72, 1440 32 L 1440 50 C 1240 92, 980 114, 700 142 C 420 170, 200 194, 0 200 Z"
            fill="var(--color-sun-500)"
            opacity="0.55"
          />
        </svg>

        <div className="relative max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)]">
          <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
            <span aria-hidden className="inline-block w-8 h-px bg-espresso-600/60" />
            {overline}
          </p>
          <h1 className="mt-6 font-display italic text-espresso-700 leading-[0.95] text-[clamp(2.4rem,6vw,4.5rem)] max-w-3xl">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-4 text-[11px] uppercase tracking-[0.32em] text-espresso-600/65">
              Stand: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      <article
        className="
          max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] pb-24 md:pb-32
          prose-cafe
        "
      >
        <div className="max-w-2xl text-espresso-700/95 leading-relaxed">
          {children}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-espresso-700/10 bg-paper-50">
        <div className="max-w-[var(--shell-max)] mx-auto px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] uppercase tracking-[0.42em] text-espresso-600/70">
          <span>© {new Date().getFullYear()} Café Laren · Marl, NRW</span>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/impressum" className="hover:text-espresso-900 transition rounded-[2px]">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-espresso-900 transition rounded-[2px]">
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
