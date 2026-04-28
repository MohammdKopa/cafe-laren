import {
  Field,
  PrimaryButton,
  Toggle,
  inputClass,
} from "./AdminUI";
import type { Deal } from "@/lib/schema";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  deal?: Deal | null;
  submitLabel?: string;
};

function toDatetimeLocal(d: Date | null | undefined): string {
  if (!d) return "";
  // Build "YYYY-MM-DDTHH:mm" in local time so the picker shows what the
  // server stored.
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

export function DealForm({ action, deal, submitLabel = "Speichern" }: Props) {
  return (
    <form action={action} className="space-y-5 max-w-3xl">
      {deal && <input type="hidden" name="id" value={deal.id} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <Field label="Titel *" hint="Erscheint groß auf der Karte.">
            <input
              name="title"
              type="text"
              required
              maxLength={128}
              defaultValue={deal?.title ?? ""}
              placeholder="z. B. Coppa Italia"
              className={inputClass()}
            />
          </Field>
        </div>
        <Field label="Badge" hint='Pille oben links, z. B. „Mittwoch".'>
          <input
            name="badge"
            type="text"
            maxLength={64}
            defaultValue={deal?.badge ?? ""}
            placeholder="optional"
            className={inputClass()}
          />
        </Field>
      </div>

      <Field label="Beschreibung *" hint="Eine ehrliche Zeile reicht.">
        <textarea
          name="body"
          rows={3}
          required
          maxLength={600}
          defaultValue={deal?.body ?? ""}
          placeholder="Der Becher des Hauses, einen Tag in der Woche im Vorzugspreis."
          className={inputClass("resize-y min-h-[88px]")}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Alter Preis" hint="Wird durchgestrichen.">
          <input
            name="wasText"
            type="text"
            maxLength={32}
            defaultValue={deal?.wasText ?? ""}
            placeholder="z. B. 5,90 €"
            className={inputClass("tabular-nums")}
          />
        </Field>
        <Field label="Aktion-Preis" hint="Der neue Preis.">
          <input
            name="priceText"
            type="text"
            maxLength={32}
            defaultValue={deal?.priceText ?? ""}
            placeholder="z. B. 4,50 €"
            className={inputClass("tabular-nums")}
          />
        </Field>
        <Field label="Gültigkeits-Hinweis" hint='Microcopy unter dem Preis.'>
          <input
            name="validityText"
            type="text"
            maxLength={96}
            defaultValue={deal?.validityText ?? ""}
            placeholder="Mittwochs · ganzen Tag"
            className={inputClass()}
          />
        </Field>
      </div>

      <Field label="Bild-URL" hint="Optional. Spätere Uploads ersetzen das.">
        <input
          name="imageUrl"
          type="url"
          maxLength={500}
          defaultValue={deal?.imageUrl ?? ""}
          placeholder="https://..."
          className={inputClass()}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Gültig ab" hint="Optional. Lokale Zeit.">
          <input
            name="validFrom"
            type="datetime-local"
            defaultValue={toDatetimeLocal(deal?.validFrom)}
            className={inputClass()}
          />
        </Field>
        <Field label="Gültig bis" hint="Optional. Lokale Zeit.">
          <input
            name="validTo"
            type="datetime-local"
            defaultValue={toDatetimeLocal(deal?.validTo)}
            className={inputClass()}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Sortierung" hint="Niedriger = weiter vorn.">
          <input
            name="sortOrder"
            type="number"
            defaultValue={deal?.sortOrder ?? 0}
            className={inputClass("tabular-nums")}
          />
        </Field>
        <div className="self-end pb-1">
          <Toggle
            name="active"
            defaultChecked={deal?.active ?? true}
            label="Sichtbar"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <PrimaryButton>{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
