import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireOwnerOrRedirect } from "@/lib/auth";
import { deleteDeal, updateDeal } from "@/lib/admin-actions";
import {
  Card,
  DangerButton,
  PageHeader,
} from "@/components/admin/AdminUI";
import { DealForm } from "@/components/admin/DealForm";

export const dynamic = "force-dynamic";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerOrRedirect();
  const { id } = await params;
  const dealId = parseInt(id, 10);
  if (!Number.isFinite(dealId)) notFound();

  const deal = await db.query.deals.findFirst({
    where: eq(schema.deals.id, dealId),
  });
  if (!deal) notFound();

  return (
    <>
      <PageHeader
        overline={`Aktionen · ${deal.title}`}
        title="Aktion bearbeiten"
        description="Änderungen sind sofort auf der Startseite sichtbar."
        actions={
          <Link
            href="/admin/angebote"
            className="text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition border-b border-espresso-700/30 hover:border-espresso-700 pb-1"
          >
            ← Zurück
          </Link>
        }
      />

      <Card className="p-6 md:p-8 mb-10">
        <DealForm action={updateDeal} deal={deal} submitLabel="Speichern" />
      </Card>

      <Card className="p-6 md:p-8 ring-red-700/15">
        <h3 className="font-display italic text-espresso-700 text-xl md:text-2xl">
          Aktion löschen
        </h3>
        <p className="mt-2 text-espresso-600/85 text-sm md:text-base leading-relaxed max-w-xl">
          Entfernt <strong>{deal.title}</strong> dauerhaft. Wenn du sie nur
          vorübergehend ausblenden willst, setze sie oben auf „nicht sichtbar".
        </p>
        <form action={deleteDeal} className="mt-5">
          <input type="hidden" name="id" value={deal.id} />
          <DangerButton>Aktion löschen</DangerButton>
        </form>
      </Card>
    </>
  );
}
