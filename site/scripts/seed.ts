import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../src/lib/db";
import { menuCategories, menuItems, deals } from "../src/lib/schema";

type RawItem = {
  name: string;
  description?: string | null;
  price_eur?: number;
  allergens?: string[];
  tags?: string[];
  kind?: "Milcheis" | "Fruchteis";
  flavorIndex?: number;
};

type RawCategory = {
  category: string;
  subtitle?: string;
  items: RawItem[];
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "und")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function main() {
  const path = resolve(process.cwd(), "..", "menu.json");
  const raw = JSON.parse(readFileSync(path, "utf8")) as RawCategory[];

  console.log(`Loading ${raw.length} categories from ${path}`);

  await db.delete(menuItems);
  await db.delete(menuCategories);
  await db.delete(deals);

  for (const [catIdx, cat] of raw.entries()) {
    const catSlug = slugify(cat.category);
    const [insertedCat] = await db
      .insert(menuCategories)
      .values({
        slug: catSlug,
        name: cat.category,
        description: cat.subtitle ?? null,
        sortOrder: catIdx + 1,
      })
      .returning({ id: menuCategories.id });

    let itemSort = 0;
    for (const item of cat.items) {
      itemSort++;
      const isFlavor = item.kind != null;
      const isTea = catSlug === "tee-auswahl";
      const tags: string[] = [...(item.tags ?? [])];
      if (isFlavor) tags.push("flavor", item.kind!.toLowerCase());
      if (isTea) tags.push("tea-flavor");

      const itemSlug = `${catSlug}-${slugify(item.name)}`.slice(0, 90);
      const priceCents = Math.round((item.price_eur ?? 0) * 100);

      await db.insert(menuItems).values({
        categoryId: insertedCat.id,
        slug: itemSlug,
        name: item.name,
        description: item.description ?? null,
        priceCents,
        allergens: item.allergens ?? [],
        tags,
        sortOrder: itemSort,
      });
    }
    console.log(`  · ${cat.category} (${cat.items.length} items)`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
