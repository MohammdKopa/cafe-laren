"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const NAV = [
  { href: "#karte", label: "Eiskarte" },
  { href: "#fruehstueck", label: "Frühstück" },
  { href: "#galerie", label: "Galerie" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intro: header slides in, logo + nav stagger up. Skipped under reduced-motion.
  useGSAP(
    () => {
      if (!ref.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.fromTo(
        ref.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        "[data-h='logo']",
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", delay: 0.55 },
      );
      gsap.fromTo(
        "[data-h='nav-item']",
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.55, ease: "power3.out", delay: 0.65 },
      );
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className={[
        "fixed top-0 inset-x-0 z-[60] transition-all duration-300 will-change-transform",
        scrolled
          ? "bg-paper-100/90 backdrop-blur-md border-b border-espresso-700/10 py-3 shadow-[var(--shadow-paper)]"
          : "bg-paper-100/35 backdrop-blur-[2px] py-5",
      ].join(" ")}
    >
      <div className="mx-auto max-w-[var(--shell-max)] px-[var(--shell-px-mobile)] md:px-[var(--shell-px-desktop)] flex items-center justify-between">
        <a
          data-h="logo"
          href="#"
          aria-label="Café Laren — zurück nach oben"
          className="font-display italic text-espresso-700 text-xl md:text-2xl flex items-baseline gap-2 group rounded-[2px]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
            Café
          </span>
          <span className="not-italic font-display tracking-wider text-chiffon-200 bg-espresso-700 px-2 pt-0.5 pb-1 leading-none rounded-[2px] text-base md:text-lg transition-transform duration-300 group-hover:translate-y-0.5">
            LAREN
          </span>
        </a>

        {/* Desktop nav. On phone, navigation lives in the MobileActions bottom bar. */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Hauptnavigation">
          {NAV.map((n) => (
            <a
              key={n.href}
              data-h="nav-item"
              href={n.href}
              className="text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition relative after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-espresso-700 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
