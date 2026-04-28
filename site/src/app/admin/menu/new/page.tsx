import Link from "next/link";
import { requireOwnerOrRedirect } from "@/lib/auth";
import { createCategory } from "@/lib/admin-actions";
import {
  Card,
  Field,
  PageHeader,
  PrimaryButton,
  Toggle,
  inputClass,
} from "@/components/admin/AdminUI";

export default async function NewCategoryPage() {
  await requireOwnerOrRedirect();

  return (
    <>
      <PageHeader
        overline="Menü · Neu"
        title="Neue Kategorie"
        description="Slug wird automatisch aus dem Namen erzeugt — du kannst ihn aber überschreiben."
      />

      <Card className="p-6 md:p-8">
        <form action={createCategory} className="space-y-5 max-w-xl">
          <Field label="Name *" hint="Erscheint als Überschrift in der Karte.">
            <input
              name="name"
              type="text"
              required
              maxLength={128}
              placeholder="z. B. Eissorten"
              className={inputClass()}
            />
          </Field>

          <Field
            label="Slug"
            hint="URL-Fragment, automatisch generiert wenn leer (z. B. eissorten)."
          >
            <input
              name="slug"
              type="text"
              maxLength={64}
              placeholder="automatisch"
              className={inputClass()}
            />
          </Field>

          <Field label="Beschreibung" hint="Optional, kurze Einleitung über der Kategorie.">
            <textarea
              name="description"
              rows={3}
              maxLength={600}
              className={inputClass("resize-y min-h-[88px]")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Sortierung" hint="Niedriger = weiter oben.">
              <input
                name="sortOrder"
                type="number"
                defaultValue={0}
                className={inputClass("tabular-nums")}
              />
            </Field>
            <div className="self-end pb-1">
              <Toggle name="active" defaultChecked label="Sichtbar" />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <PrimaryButton>Anlegen</PrimaryButton>
            <Link
              href="/admin/menu"
              className="text-[11px] uppercase tracking-[0.32em] text-espresso-600/75 hover:text-espresso-900 transition px-2 py-2"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
