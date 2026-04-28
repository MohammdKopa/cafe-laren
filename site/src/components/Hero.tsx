import Image from "next/image";
import { HeroIntro } from "./HeroIntro";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&q=80";

const ARC_PATH_PRIMARY =
  "M 0 0 L 1440 0 L 1440 220 C 1100 360, 820 540, 520 700 C 320 810, 140 870, 0 880 Z";
const ARC_PATH_RIDGE =
  "M 0 880 C 140 870, 320 810, 520 700 C 820 540, 1100 360, 1440 220 L 1440 240 C 1100 380, 820 560, 520 720 C 320 830, 140 890, 0 900 Z";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[100svh] w-full overflow-hidden bg-paper-100"
    >
      <HeroIntro>
        {/* Photo — clipped on first paint, revealed by HeroIntro via clip-path */}
        <div
          data-anim="photo"
          className="absolute inset-y-0 right-0 w-full md:w-[58%] z-0 will-change-[clip-path,transform]"
        >
          <Image
            src={HERO_PHOTO}
            alt="Schale mit hausgemachtem Gelato im Café Laren — Schoko-, Pistazien- und Vanille-Sorten"
            fill
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
          {/* Warm wash to tie photo to brand */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-paper-100)_0%,transparent_18%,transparent_70%,var(--overlay-warm-mid)_100%)]" />
          <div className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,var(--color-paper-100)_0%,transparent_25%,var(--overlay-warm-strong)_100%)]" />
        </div>

        {/* Brand-signature arc — inlined here so HeroIntro's scoped GSAP
            can reach it. z-[8] keeps it above the photo (z-0) and the
            warm-wash gradient inside, but below the type column (z-10). */}
        <svg
          data-anim="arc"
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none z-[8] will-change-transform"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path d={ARC_PATH_PRIMARY} fill="var(--color-sun-400)" />
          <path d={ARC_PATH_RIDGE} fill="var(--color-sun-500)" opacity="0.55" />
        </svg>

        <div className="relative z-10 mx-auto h-full max-w-[var(--shell-max)] px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] flex flex-col justify-center pt-24 md:pt-20">
          {/* Side stamp */}
          <div className="absolute left-[var(--shell-px-mobile)] md:left-[var(--shell-px-desktop)] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-espresso-700/60">
            <div data-anim="overline" className="rotate-180 [writing-mode:vertical-rl] translate-y-2">
              Marl · Nordrhein-Westfalen
            </div>
            <div className="w-px h-24 bg-espresso-700/30" />
          </div>

          <p
            data-anim="overline"
            className="font-body text-[11px] md:text-xs uppercase tracking-[0.45em] text-espresso-600 mb-6 md:mb-10 translate-y-2"
          >
            <span className="inline-block w-8 h-px bg-espresso-600/60 align-middle mr-3" />
            Italienisches Eiscafé · Türkisches Frühstück
          </p>

          <h1 className="font-display leading-[0.86] italic text-espresso-700 select-none">
            <span className="block overflow-hidden">
              <span
                data-anim="word"
                data-kern="0em"
                className="inline-block will-change-[transform,letter-spacing] text-[clamp(4.5rem,15vw,12rem)]"
              >
                Café
              </span>
            </span>
            <span className="block overflow-hidden mt-3 md:mt-4">
              <span
                data-anim="word"
                data-kern="0.06em"
                className="inline-block not-italic font-display text-chiffon-200 bg-espresso-700 px-5 md:px-8 pt-2 pb-4 leading-none rounded-sm text-[clamp(3.5rem,12vw,10rem)] will-change-[transform,letter-spacing]"
              >
                LAREN
              </span>
            </span>
          </h1>

          <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end gap-6 md:gap-12 max-w-3xl">
            <p
              data-anim="tagline"
              className="font-body text-xs md:text-sm uppercase tracking-[0.45em] text-espresso-700 translate-y-2 md:flex-shrink-0"
            >
              Eis · Kaffee · Kuchen
            </p>
            <p
              data-anim="body"
              className="text-espresso-600/90 text-base md:text-lg leading-relaxed max-w-md translate-y-2"
            >
              Hausgemachtes Gelato, italienischer Espresso und ein
              türkisches Frühstück, das den ganzen Tag bleibt.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              data-anim="cta"
              href="#karte"
              className="focus-on-dark inline-flex items-center gap-3 bg-espresso-700 hover:bg-espresso-800 text-paper-50 px-7 py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-medium transition translate-y-2"
            >
              Zur Eiskarte
              <span aria-hidden className="text-base">→</span>
            </a>
            <a
              data-anim="cta"
              href="#fruehstueck"
              className="inline-flex items-center gap-3 border border-espresso-700/35 hover:border-espresso-800 text-espresso-700 px-7 py-4 rounded-sm uppercase tracking-[0.25em] text-[11px] font-medium transition translate-y-2"
            >
              Türkisches Frühstück
            </a>
          </div>
        </div>

        {/* Bottom marker row */}
        <div className="absolute bottom-6 md:bottom-8 left-[var(--shell-px-mobile)] md:left-[var(--shell-px-desktop)] right-[var(--shell-px-mobile)] md:right-[var(--shell-px-desktop)] flex items-end justify-between text-[10px] uppercase tracking-[0.42em] text-espresso-600/70 z-10 pointer-events-none">
          <span data-anim="cta" className="translate-y-2">9—22:30 · täglich</span>
          <span data-anim="cta" className="translate-y-2 hidden md:inline">scroll ↓</span>
        </div>
      </HeroIntro>
    </section>
  );
}
