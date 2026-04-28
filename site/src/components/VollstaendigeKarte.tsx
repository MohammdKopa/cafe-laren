import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { KarteGrid } from "./KarteGrid";

export const revalidate = 60;

type CategoryWithItems = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  itemCount: number;
  items: {
    id: number;
    name: string;
    description: string | null;
    priceCents: number;
    priceNote: string | null;
  }[];
};

async function fetchMenu(): Promise<CategoryWithItems[]> {
  try {
    const rows = await db.query.menuCategories.findMany({
      where: eq(schema.menuCategories.active, true),
      orderBy: schema.menuCategories.sortOrder,
      with: {
        items: {
          where: eq(schema.menuItems.active, true),
          orderBy: schema.menuItems.sortOrder,
          columns: {
            id: true,
            name: true,
            description: true,
            priceCents: true,
            priceNote: true,
          },
        },
      },
    });
    return rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      itemCount: c.items.length,
      items: c.items,
    }));
  } catch (err) {
    // DB unavailable at build time — render empty state instead of crashing.
    console.warn("[VollstaendigeKarte] Menu fetch failed:", err);
    return [];
  }
}

export async function VollstaendigeKarte() {
  const categories = await fetchMenu();
  return <KarteGrid categories={categories} />;
}
