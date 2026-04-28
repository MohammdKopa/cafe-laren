import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireOwnerOrRedirect } from "@/lib/auth";
import { toggleDealActive } from "@/lib/admin-actions";
import {
  Card,
  EmptyState,
  LinkButton,
  PageHeader,
  SecondaryButton,
} from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

export default async function DealsListPage() {
  await requireOwnerOrRedirect();

  const deals = await db
    .select()
    .from(schema.deals)
    .orderBy(asc(schema.deals.sortOrder), asc(schema.deals.id));

  return (
    <>
      <PageHeader
        overline="Aktionen"
        title="Wochenangebote"
        description="Was diese Woche zum Vorzugspreis läuft. Erscheint in der Aktionen-Sektion auf der Startseite."
        actions={<LinkButton href="/admin/angebote/new">+ Neues Angebot</LinkButton>}
      />

      {deals.length === 0 ? (
        <EmptyState
          title="Noch keine Aktionen."
          body="Lege das erste Wochenangebot an — z. B. Coppa Italia, Mittwochs."
          action={<LinkButton href="/admin/angebote/new">Aktion anlegen</LinkButton>}
        />
      ) : (
        <Card className="divide-y divide-espresso-700/8 overflow-hidden">
          {deals.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-4 px-5 md:px-7 py-4"
            >
              <Link
                href={`/admin/angebote/${d.id}`}
                className="min-w-0 flex-1 group"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="font-display italic text-espresso-700 text-xl md:text-2xl truncate group-hover:text-espresso-900 transition">
                    {d.title}
                  </p>
                  {d.badge && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sun-400/20 text-espresso-700 text-[10px] uppercase tracking-[0.32em]">
                      <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-sun-400" />
                      {d.badge}
                    </span>
                  )}
                  {!d.active && (
                    <span className="text-[10px] uppercase tracking-[0.32em] text-red-700/85 px-2 py-0.5 rounded-full bg-red-700/8">
                      Inaktiv
                    </span>
                  )}
                </div>
                {d.body && (
                  <p className="mt-1 text-espresso-600/75 text-sm line-clamp-1 max-w-2xl">
                    {d.body}
                  </p>
                )}
                {(d.wasText || d.priceText) && (
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.32em] text-espresso-600/65 flex items-baseline gap-2">
                    {d.wasText && (
                      <span className="line-through text-espresso-700/45">
                        {d.wasText}
                      </span>
                    )}
                    {d.priceText && (
                      <span className="text-espresso-700">{d.priceText}</span>
                    )}
                    {d.validityText && (
                      <>
                        <span className="text-espresso-600/40" aria-hidden>
                          ·
                        </span>
                        <span>{d.validityText}</span>
                      </>
                    )}
                  </p>
                )}
              </Link>

              <form action={toggleDealActive} className="flex-shrink-0">
                <input type="hidden" name="id" value={d.id} />
                <input
                  type="hidden"
                  name="current"
                  value={d.active ? "true" : "false"}
                />
                <SecondaryButton>
                  {d.active ? "Pausieren" : "Aktivieren"}
                </SecondaryButton>
              </form>

              <Link
                href={`/admin/angebote/${d.id}`}
                aria-label={`${d.title} bearbeiten`}
                className="text-espresso-600/45 text-lg flex-shrink-0 hover:text-espresso-700 transition"
              >
                →
              </Link>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
