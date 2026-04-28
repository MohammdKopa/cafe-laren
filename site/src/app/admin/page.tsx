import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireOwnerOrRedirect } from "@/lib/auth";
import {
  Card,
  LinkButton,
  PageHeader,
  StatCard,
} from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

async function loadStats() {
  const [categories, items, dealsRows, recent] = await Promise.all([
    db.select().from(schema.menuCategories),
    db.select().from(schema.menuItems),
    db.select().from(schema.deals),
    db
      .select({
        id: schema.menuItems.id,
        name: schema.menuItems.name,
        categoryId: schema.menuItems.categoryId,
        updatedAt: schema.menuItems.updatedAt,
      })
      .from(schema.menuItems)
      .orderBy(desc(schema.menuItems.updatedAt))
      .limit(6),
  ]);

  const categoriesById = new Map(categories.map((c) => [c.id, c.name]));
  const recentWithCategory = recent.map((r) => ({
    ...r,
    categoryName: categoriesById.get(r.categoryId) ?? "—",
  }));

  return {
    categoryCount: categories.length,
    activeCategoryCount: categories.filter((c) => c.active).length,
    itemCount: items.length,
    activeItemCount: items.filter((i) => i.active).length,
    dealCount: dealsRows.length,
    activeDealCount: dealsRows.filter((d) => d.active).length,
    recent: recentWithCategory,
  };
}

export default async function AdminDashboard() {
  await requireOwnerOrRedirect();
  const stats = await loadStats();

  return (
    <>
      <PageHeader
        overline="Übersicht"
        title="Willkommen zurück."
        description="Pflege Karte und Aktionen direkt von hier. Änderungen erscheinen sofort auf der Website."
        actions={
          <>
            <LinkButton href="/admin/menu" variant="secondary">
              Menü öffnen
            </LinkButton>
            <LinkButton href="/admin/angebote">Aktionen öffnen</LinkButton>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          label="Kategorien"
          value={stats.categoryCount}
          sublabel={`${stats.activeCategoryCount} aktiv`}
        />
        <StatCard
          label="Artikel"
          value={stats.itemCount}
          sublabel={`${stats.activeItemCount} sichtbar`}
        />
        <StatCard
          label="Aktionen"
          value={stats.dealCount}
          sublabel={`${stats.activeDealCount} aktiv`}
        />
      </div>

      {/* Recent updates */}
      <section className="mt-12 md:mt-16">
        <header className="flex items-baseline justify-between mb-5">
          <h2 className="font-display italic text-espresso-700 text-2xl md:text-[1.8rem]">
            Zuletzt aktualisiert
          </h2>
          <Link
            href="/admin/menu"
            className="text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition border-b border-espresso-700/30 hover:border-espresso-700 pb-1 rounded-[2px]"
          >
            Alle ansehen <span aria-hidden>→</span>
          </Link>
        </header>

        {stats.recent.length === 0 ? (
          <Card className="px-6 py-8 text-espresso-600/70 text-sm">
            Noch keine Artikel gepflegt. Lege in <Link href="/admin/menu" className="underline">Menü</Link> los.
          </Card>
        ) : (
          <Card className="divide-y divide-espresso-700/8">
            {stats.recent.map((r) => (
              <Link
                key={r.id}
                href={`/admin/menu/${r.categoryId}`}
                className="flex items-baseline justify-between gap-4 px-5 md:px-7 py-4 hover:bg-paper-100/60 transition rounded-2xl"
              >
                <div className="min-w-0">
                  <p className="font-display italic text-espresso-700 text-lg md:text-xl truncate">
                    {r.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.32em] text-espresso-600/60">
                    {r.categoryName}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.32em] text-espresso-600/55 whitespace-nowrap">
                  {formatRelativeDate(r.updatedAt)}
                </span>
              </Link>
            ))}
          </Card>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <QuickCard
          title="Menü verwalten"
          body="23 Kategorien, ~200 Artikel. Preise, Beschreibungen, Reihenfolge, Sichtbarkeit."
          href="/admin/menu"
          cta="Zum Menü"
        />
        <QuickCard
          title="Aktionen pflegen"
          body="Wochenangebote für die Aktionen-Sektion. Werden auf der Startseite ausgespielt."
          href="/admin/angebote"
          cta="Zu den Aktionen"
        />
      </section>
    </>
  );
}

function QuickCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Card className="p-6 md:p-7 flex flex-col">
      <h3 className="font-display italic text-espresso-700 text-2xl md:text-[1.8rem] leading-tight">
        {title}
      </h3>
      <p className="mt-3 text-espresso-600/85 text-sm md:text-base leading-relaxed flex-1">
        {body}
      </p>
      <div className="mt-5">
        <LinkButton href={href} variant="secondary">
          {cta} →
        </LinkButton>
      </div>
    </Card>
  );
}

function formatRelativeDate(d: Date): string {
  try {
    const now = Date.now();
    const then = d.getTime();
    const diff = Math.max(0, now - then);
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;
    if (diff < min) return "gerade eben";
    if (diff < hour) return `vor ${Math.floor(diff / min)} min`;
    if (diff < day) return `vor ${Math.floor(diff / hour)} Std.`;
    if (diff < 7 * day) return `vor ${Math.floor(diff / day)} Tg.`;
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}
