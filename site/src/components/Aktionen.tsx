import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AktionenClient, type DealCardData } from "./AktionenClient";

export const revalidate = 60;

/**
 * Sample fallback used while the deals table is empty. The site never
 * looks broken on first launch, and the owner can override by adding
 * deals in /admin/angebote.
 */
const SAMPLE_DEALS: DealCardData[] = [
  {
    id: -1,
    title: "Coppa Italia",
    badge: "Mittwoch",
    body: "Der Becher des Hauses, einen Tag in der Woche im Vorzugspreis.",
    wasText: "5,90 €",
    priceText: "4,50 €",
    validityText: "Mittwochs · ganzen Tag",
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: -2,
    title: "Frühstück Klassik",
    badge: "Werktags · 9–13",
    body: "Brötchen, Aufstriche, Filterkaffee oder Schwarztee — werktags.",
    wasText: "9,90 €",
    priceText: "7,90 €",
    validityText: "Mo–Fr · 9 bis 13 Uhr",
    imageUrl:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: -3,
    title: "Italiener-Frühstück",
    badge: "Werktags · ganzen Tag",
    body: "Cappuccino oder Espresso mit Croissant — der schnelle Gruß.",
    wasText: "4,90 €",
    priceText: "3,80 €",
    validityText: "Mo–Fr · ganzen Tag",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
];

async function loadDeals(): Promise<DealCardData[]> {
  try {
    const rows = await db
      .select({
        id: schema.deals.id,
        title: schema.deals.title,
        badge: schema.deals.badge,
        body: schema.deals.body,
        wasText: schema.deals.wasText,
        priceText: schema.deals.priceText,
        validityText: schema.deals.validityText,
        imageUrl: schema.deals.imageUrl,
      })
      .from(schema.deals)
      .where(eq(schema.deals.active, true))
      .orderBy(asc(schema.deals.sortOrder), asc(schema.deals.id));
    if (rows.length === 0) return SAMPLE_DEALS;
    return rows;
  } catch (err) {
    console.warn("[Aktionen] DB fetch failed, using sample deals:", err);
    return SAMPLE_DEALS;
  }
}

export async function Aktionen() {
  const deals = await loadDeals();
  if (deals.length === 0) return null;
  return <AktionenClient deals={deals} />;
}
