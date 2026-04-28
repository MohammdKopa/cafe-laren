import Link from "next/link";
import { requireOwnerOrRedirect } from "@/lib/auth";
import { createDeal } from "@/lib/admin-actions";
import { Card, PageHeader } from "@/components/admin/AdminUI";
import { DealForm } from "@/components/admin/DealForm";

export default async function NewDealPage() {
  await requireOwnerOrRedirect();

  return (
    <>
      <PageHeader
        overline="Aktionen · Neu"
        title="Neue Aktion"
        description="Wochenangebot, das in der Aktionen-Sektion erscheint."
        actions={
          <Link
            href="/admin/angebote"
            className="text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition border-b border-espresso-700/30 hover:border-espresso-700 pb-1"
          >
            ← Zurück
          </Link>
        }
      />
      <Card className="p-6 md:p-8">
        <DealForm action={createDeal} submitLabel="Anlegen" />
      </Card>
    </>
  );
}
