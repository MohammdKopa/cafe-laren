import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireOwnerOrRedirect } from "@/lib/auth";
import {
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  toggleMenuItemActive,
  updateCategory,
  updateMenuItem,
} from "@/lib/admin-actions";
import {
  Card,
  DangerButton,
  Field,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  Toggle,
  inputClass,
} from "@/components/admin/AdminUI";
import type { MenuItem } from "@/lib/schema";

export const dynamic = "force-dynamic";

function priceCentsToInputString(cents: number | null | undefined): string {
  if (!cents) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default async function CategoryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerOrRedirect();
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  if (!Number.isFinite(categoryId)) notFound();

  const category = await db.query.menuCategories.findFirst({
    where: eq(schema.menuCategories.id, categoryId),
  });
  if (!category) notFound();

  const items = await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.categoryId, categoryId))
    .orderBy(asc(schema.menuItems.sortOrder), asc(schema.menuItems.name));

  return (
    <>
      <PageHeader
        overline={`Menü · ${category.name}`}
        title="Kategorie bearbeiten"
        description="Eigenschaften der Kategorie + Artikel darin. Änderungen sind sofort sichtbar."
        actions={
          <Link
            href="/admin/menu"
            className="text-[11px] uppercase tracking-[0.32em] text-espresso-700 hover:text-espresso-900 transition border-b border-espresso-700/30 hover:border-espresso-700 pb-1"
          >
            ← Zurück zum Menü
          </Link>
        }
      />

      {/* Category form */}
      <Card className="p-6 md:p-8 mb-10">
        <form action={updateCategory} className="space-y-5 max-w-2xl">
          <input type="hidden" name="id" value={category.id} />

          <Field label="Name *">
            <input
              name="name"
              type="text"
              required
              maxLength={128}
              defaultValue={category.name}
              className={inputClass()}
            />
          </Field>

          <Field label="Slug" hint="Wird automatisch generiert, wenn leer.">
            <input
              name="slug"
              type="text"
              maxLength={64}
              defaultValue={category.slug}
              className={inputClass()}
            />
          </Field>

          <Field label="Beschreibung">
            <textarea
              name="description"
              rows={3}
              maxLength={600}
              defaultValue={category.description ?? ""}
              className={inputClass("resize-y min-h-[88px]")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Sortierung">
              <input
                name="sortOrder"
                type="number"
                defaultValue={category.sortOrder}
                className={inputClass("tabular-nums")}
              />
            </Field>
            <div className="self-end pb-1">
              <Toggle
                name="active"
                defaultChecked={category.active}
                label="Sichtbar"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <PrimaryButton>Speichern</PrimaryButton>
          </div>
        </form>
      </Card>

      {/* Items list */}
      <header className="flex items-baseline justify-between mb-5">
        <h2 className="font-display italic text-espresso-700 text-2xl md:text-[1.8rem]">
          Artikel
          <span className="ml-3 text-[11px] uppercase tracking-[0.32em] text-espresso-600/65 align-middle">
            {items.length}
          </span>
        </h2>
      </header>

      <Card className="overflow-hidden divide-y divide-espresso-700/8 mb-8">
        {items.length === 0 ? (
          <p className="px-5 md:px-7 py-8 text-espresso-600/70 text-sm text-center">
            Keine Artikel in dieser Kategorie. Füge unten den ersten hinzu.
          </p>
        ) : (
          items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              categoryId={categoryId}
            />
          ))
        )}
      </Card>

      {/* New item form */}
      <Card className="p-6 md:p-8 mb-12">
        <h3 className="font-display italic text-espresso-700 text-xl md:text-2xl mb-5">
          Neuen Artikel hinzufügen
        </h3>
        <form
          action={createMenuItem}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <input type="hidden" name="categoryId" value={categoryId} />

          <div className="md:col-span-3">
            <Field label="Name *">
              <input
                name="name"
                type="text"
                required
                maxLength={160}
                placeholder="z. B. Vanille"
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Preis (€)" hint='Z. B. „2,80" oder leer für „Tagespreis".'>
              <input
                name="price"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                className={inputClass("tabular-nums")}
              />
            </Field>
          </div>

          <div className="md:col-span-1">
            <Field label="Sort.">
              <input
                name="sortOrder"
                type="number"
                defaultValue={items.length}
                className={inputClass("tabular-nums")}
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <Field label="Beschreibung">
              <textarea
                name="description"
                rows={2}
                maxLength={800}
                placeholder="Kurze Beschreibung — eine Zeile reicht."
                className={inputClass("resize-y min-h-[64px]")}
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Preis-Vermerk" hint='Ersetzt den Preis, z. B. „Tagespreis".'>
              <input
                name="priceNote"
                type="text"
                maxLength={32}
                placeholder="optional"
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Bild-URL" hint="Optional, später durch Upload ersetzt.">
              <input
                name="imageUrl"
                type="url"
                maxLength={500}
                placeholder="https://..."
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-6 flex items-center justify-between gap-4 pt-2">
            <Toggle name="active" defaultChecked label="Sichtbar" />
            <PrimaryButton>+ Hinzufügen</PrimaryButton>
          </div>
        </form>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 md:p-8 ring-red-700/15">
        <h3 className="font-display italic text-espresso-700 text-xl md:text-2xl">
          Kategorie löschen
        </h3>
        <p className="mt-2 text-espresso-600/85 text-sm md:text-base leading-relaxed max-w-xl">
          Löscht die Kategorie <strong>{category.name}</strong> samt allen{" "}
          {items.length} Artikeln. Das lässt sich nicht rückgängig machen.
        </p>
        <form action={deleteCategory} className="mt-5">
          <input type="hidden" name="id" value={category.id} />
          <DangerButton>Kategorie löschen</DangerButton>
        </form>
      </Card>
    </>
  );
}

function ItemRow({ item, categoryId }: { item: MenuItem; categoryId: number }) {
  return (
    <details className="group">
      <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 md:px-7 py-4 hover:bg-paper-100/60 transition">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <p className="font-display italic text-espresso-700 text-lg md:text-xl truncate">
              {item.name}
            </p>
            {!item.active && (
              <span className="text-[10px] uppercase tracking-[0.32em] text-red-700/85 px-2 py-0.5 rounded-full bg-red-700/8">
                Inaktiv
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-0.5 text-espresso-600/75 text-sm truncate max-w-2xl">
              {item.description}
            </p>
          )}
        </div>
        <div className="text-right whitespace-nowrap">
          <p className="font-display italic text-espresso-700 text-base md:text-lg tabular-nums">
            {item.priceNote ?? formatPrice(item.priceCents)}
          </p>
          <p className="text-[10px] uppercase tracking-[0.32em] text-espresso-600/55">
            Sort. {item.sortOrder}
          </p>
        </div>
        <span
          aria-hidden
          className="text-espresso-600/45 text-base group-open:rotate-180 transition-transform"
        >
          ▾
        </span>
      </summary>

      {/* Inline edit form */}
      <div className="px-5 md:px-7 pb-6 pt-2 border-t border-espresso-700/8 bg-paper-100/30">
        <form
          action={updateMenuItem}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4"
        >
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="categoryId" value={categoryId} />

          <div className="md:col-span-3">
            <Field label="Name">
              <input
                name="name"
                type="text"
                required
                maxLength={160}
                defaultValue={item.name}
                className={inputClass()}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Preis (€)">
              <input
                name="price"
                type="text"
                inputMode="decimal"
                defaultValue={priceCentsToInputString(item.priceCents)}
                className={inputClass("tabular-nums")}
              />
            </Field>
          </div>
          <div className="md:col-span-1">
            <Field label="Sort.">
              <input
                name="sortOrder"
                type="number"
                defaultValue={item.sortOrder}
                className={inputClass("tabular-nums")}
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <Field label="Beschreibung">
              <textarea
                name="description"
                rows={2}
                maxLength={800}
                defaultValue={item.description ?? ""}
                className={inputClass("resize-y min-h-[64px]")}
              />
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field label="Slug">
              <input
                name="slug"
                type="text"
                maxLength={96}
                defaultValue={item.slug}
                className={inputClass()}
              />
            </Field>
          </div>
          <div className="md:col-span-3">
            <Field label="Preis-Vermerk">
              <input
                name="priceNote"
                type="text"
                maxLength={32}
                defaultValue={item.priceNote ?? ""}
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-6">
            <Field label="Bild-URL">
              <input
                name="imageUrl"
                type="url"
                maxLength={500}
                defaultValue={item.imageUrl ?? ""}
                placeholder="https://..."
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-6 flex items-center justify-between gap-3 flex-wrap pt-2">
            <Toggle
              name="active"
              defaultChecked={item.active}
              label="Sichtbar"
            />
            <div className="flex items-center gap-2">
              <PrimaryButton>Speichern</PrimaryButton>
            </div>
          </div>
        </form>

        {/* Quick toggle / delete (separate forms so toggle doesn't submit edits) */}
        <div className="mt-4 pt-4 border-t border-espresso-700/8 flex items-center justify-between gap-3 flex-wrap">
          <form action={toggleMenuItemActive}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="current" value={item.active ? "true" : "false"} />
            <SecondaryButton>
              {item.active ? "Auf inaktiv setzen" : "Aktivieren"}
            </SecondaryButton>
          </form>
          <form action={deleteMenuItem}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <DangerButton>Artikel löschen</DangerButton>
          </form>
        </div>
      </div>
    </details>
  );
}

function formatPrice(cents: number): string {
  if (!cents) return "Tagespreis";
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}
