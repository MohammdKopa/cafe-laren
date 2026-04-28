import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireOwnerOrRedirect } from "@/lib/auth";
import {
  Card,
  EmptyState,
  LinkButton,
  PageHeader,
} from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

async function loadCategoriesWithCounts() {
  const counts = await db
    .select({
      categoryId: schema.menuItems.categoryId,
      count: sql<number>`count(*)::int`.as("count"),
      activeCount: sql<number>`count(*) filter (where ${schema.menuItems.active} = true)::int`.as(
        "active_count",
      ),
    })
    .from(schema.menuItems)
    .groupBy(schema.menuItems.categoryId);

  const countById = new Map(counts.map((c) => [c.categoryId, c]));

  const cats = await db
    .select()
    .from(schema.menuCategories)
    .orderBy(asc(schema.menuCategories.sortOrder), asc(schema.menuCategories.name));

  return cats.map((c) => ({
    ...c,
    itemCount: countById.get(c.id)?.count ?? 0,
    activeItemCount: countById.get(c.id)?.activeCount ?? 0,
  }));
}

export default async function MenuListPage() {
  await requireOwnerOrRedirect();
  const categories = await loadCategoriesWithCounts();

  return (
    <>
      <PageHeader
        overline="Menü"
        title="Kategorien & Artikel"
        description="Pflege Preise, Beschreibungen und Reihenfolge. Klick auf eine Kategorie, um ihre Artikel zu öffnen."
        actions={<LinkButton href="/admin/menu/new">+ Neue Kategorie</LinkButton>}
      />

      {categories.length === 0 ? (
        <EmptyState
          title="Noch keine Kategorien."
          body="Lege die erste Kategorie an — z. B. Eissorten oder Frühstück."
          action={<LinkButton href="/admin/menu/new">Kategorie anlegen</LinkButton>}
        />
      ) : (
        <Card className="divide-y divide-espresso-700/8 overflow-hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/menu/${c.id}`}
              className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 hover:bg-paper-100/60 transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="font-display italic text-espresso-700 text-xl md:text-2xl truncate">
                    {c.name}
                  </p>
                  {!c.active && (
                    <span className="text-[10px] uppercase tracking-[0.32em] text-red-700/85 px-2 py-0.5 rounded-full bg-red-700/8">
                      Inaktiv
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-espresso-600/55">
                  /{c.slug} · Sortierung {c.sortOrder}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="font-display italic text-espresso-700 text-lg md:text-xl tabular-nums">
                  {c.itemCount}
                </p>
                <p className="text-[10px] uppercase tracking-[0.32em] text-espresso-600/55">
                  {c.itemCount === 1 ? "Artikel" : "Artikel"} · {c.activeItemCount} aktiv
                </p>
              </div>
              <span aria-hidden className="text-espresso-600/45 text-lg">→</span>
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
