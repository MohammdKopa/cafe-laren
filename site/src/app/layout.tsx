import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ConsentProvider } from "@/components/Consent";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cafe-laren.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Café Laren — Italienisches Eiscafé & Türkisches Frühstück in Marl",
    template: "%s · Café Laren",
  },
  description:
    "Hausgemachtes Gelato, italienischer Espresso und ein türkisches Frühstück, das den ganzen Tag bleibt. Café Laren in Marl, NRW — täglich 9 bis 22:30.",
  applicationName: "Café Laren",
  keywords: [
    "Eiscafé Marl",
    "Gelato Marl",
    "Türkisches Frühstück Marl",
    "Café Laren",
    "Eiscafé NRW",
    "italienisches Eis",
  ],
  authors: [{ name: "Café Laren" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Café Laren",
    title: "Café Laren — Italienisches Eiscafé & Türkisches Frühstück in Marl",
    description:
      "Hausgemachtes Gelato, italienischer Espresso, türkisches Frühstück. Marl, NRW.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Laren — Eis · Kaffee · Frühstück",
    description:
      "Hausgemachtes Gelato + türkisches Frühstück in Marl. Täglich 9—22:30.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2ebe1" },
    { media: "(prefers-color-scheme: dark)", color: "#110a05" },
  ],
};

const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Café Laren",
  description:
    "Italienisches Eiscafé und türkisches Frühstückscafé in Marl, Nordrhein-Westfalen.",
  url: SITE_URL,
  servesCuisine: ["Italian", "Turkish", "Breakfast", "Ice cream"],
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marl",
    addressRegion: "Nordrhein-Westfalen",
    addressCountry: "DE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "22:30",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <ConsentProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <Cursor />
        </ConsentProvider>
      </body>
    </html>
  );
}
