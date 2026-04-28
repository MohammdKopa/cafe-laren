"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "./db";
import { requireOwner } from "./auth";

// ─── Helpers ────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "und")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function str(v: FormDataEntryValue | null, max = 1000): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function strOrNull(v: FormDataEntryValue | null, max = 1000): string | null {
  const s = str(v, max);
  return s ? s : null;
}

function int(v: FormDataEntryValue | null, fallback = 0): number {
  if (typeof v !== "string") return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}

function dateOrNull(v: FormDataEntryValue | null): Date | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function priceCentsFromForm(v: FormDataEntryValue | null): number {
  if (typeof v !== "string") return 0;
  // Accept "4,50", "4.50", "450", "0" — store cents.
  const cleaned = v.trim().replace(",", ".").replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

const PUBLIC_PATHS = ["/", "/karte"];
function revalidatePublic() {
  for (const p of PUBLIC_PATHS) revalidatePath(p);
}

// ─── Categories ─────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  await requireOwner();
  const name = str(formData.get("name"), 128);
  if (!name) return;
  const slugInput = str(formData.get("slug"), 64);
  const slug = slugify(slugInput || name);

  const [row] = await db
    .insert(schema.menuCategories)
    .values({
      slug,
      name,
      description: strOrNull(formData.get("description"), 600),
      sortOrder: int(formData.get("sortOrder"), 0),
      active: bool(formData.get("active")),
    })
    .returning({ id: schema.menuCategories.id });

  revalidatePath("/admin/menu");
  revalidatePublic();
  redirect(`/admin/menu/${row.id}`);
}

export async function updateCategory(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  if (!id) return;
  const name = str(formData.get("name"), 128);
  const slugInput = str(formData.get("slug"), 64);
  const slug = slugify(slugInput || name);
  await db
    .update(schema.menuCategories)
    .set({
      slug,
      name,
      description: strOrNull(formData.get("description"), 600),
      sortOrder: int(formData.get("sortOrder"), 0),
      active: bool(formData.get("active")),
    })
    .where(eq(schema.menuCategories.id, id));

  revalidatePath("/admin/menu");
  revalidatePath(`/admin/menu/${id}`);
  revalidatePublic();
}

export async function deleteCategory(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  if (!id) return;
  await db.delete(schema.menuCategories).where(eq(schema.menuCategories.id, id));
  revalidatePath("/admin/menu");
  revalidatePublic();
  redirect("/admin/menu");
}

// ─── Menu items ─────────────────────────────────────────────────────────

export async function createMenuItem(formData: FormData) {
  await requireOwner();
  const categoryId = int(formData.get("categoryId"));
  const name = str(formData.get("name"), 160);
  if (!categoryId || !name) return;
  const slugInput = str(formData.get("slug"), 96);

  await db.insert(schema.menuItems).values({
    categoryId,
    slug: slugify(slugInput || name),
    name,
    description: strOrNull(formData.get("description"), 800),
    priceCents: priceCentsFromForm(formData.get("price")),
    priceNote: strOrNull(formData.get("priceNote"), 32),
    sortOrder: int(formData.get("sortOrder"), 0),
    active: bool(formData.get("active")),
    imageUrl: strOrNull(formData.get("imageUrl"), 500),
  });

  revalidatePath(`/admin/menu/${categoryId}`);
  revalidatePublic();
}

export async function updateMenuItem(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  const categoryId = int(formData.get("categoryId"));
  if (!id || !categoryId) return;
  const name = str(formData.get("name"), 160);
  const slugInput = str(formData.get("slug"), 96);

  await db
    .update(schema.menuItems)
    .set({
      slug: slugify(slugInput || name),
      name,
      description: strOrNull(formData.get("description"), 800),
      priceCents: priceCentsFromForm(formData.get("price")),
      priceNote: strOrNull(formData.get("priceNote"), 32),
      sortOrder: int(formData.get("sortOrder"), 0),
      active: bool(formData.get("active")),
      imageUrl: strOrNull(formData.get("imageUrl"), 500),
      updatedAt: new Date(),
    })
    .where(eq(schema.menuItems.id, id));

  revalidatePath(`/admin/menu/${categoryId}`);
  revalidatePublic();
}

export async function deleteMenuItem(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  const categoryId = int(formData.get("categoryId"));
  if (!id) return;
  await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
  if (categoryId) revalidatePath(`/admin/menu/${categoryId}`);
  revalidatePublic();
}

export async function toggleMenuItemActive(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  const categoryId = int(formData.get("categoryId"));
  const current = bool(formData.get("current"));
  if (!id) return;
  await db
    .update(schema.menuItems)
    .set({ active: !current, updatedAt: new Date() })
    .where(eq(schema.menuItems.id, id));
  if (categoryId) revalidatePath(`/admin/menu/${categoryId}`);
  revalidatePublic();
}

// ─── Deals (Aktionen) ───────────────────────────────────────────────────

export async function createDeal(formData: FormData) {
  await requireOwner();
  const title = str(formData.get("title"), 128);
  if (!title) return;

  const [row] = await db
    .insert(schema.deals)
    .values({
      title,
      badge: strOrNull(formData.get("badge"), 64),
      body: str(formData.get("body"), 600),
      wasText: strOrNull(formData.get("wasText"), 32),
      priceText: strOrNull(formData.get("priceText"), 32),
      validityText: strOrNull(formData.get("validityText"), 96),
      imageUrl: strOrNull(formData.get("imageUrl"), 500),
      validFrom: dateOrNull(formData.get("validFrom")),
      validTo: dateOrNull(formData.get("validTo")),
      sortOrder: int(formData.get("sortOrder"), 0),
      active: bool(formData.get("active")),
    })
    .returning({ id: schema.deals.id });

  revalidatePath("/admin/angebote");
  revalidatePublic();
  redirect(`/admin/angebote/${row.id}`);
}

export async function updateDeal(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  if (!id) return;
  await db
    .update(schema.deals)
    .set({
      title: str(formData.get("title"), 128),
      badge: strOrNull(formData.get("badge"), 64),
      body: str(formData.get("body"), 600),
      wasText: strOrNull(formData.get("wasText"), 32),
      priceText: strOrNull(formData.get("priceText"), 32),
      validityText: strOrNull(formData.get("validityText"), 96),
      imageUrl: strOrNull(formData.get("imageUrl"), 500),
      validFrom: dateOrNull(formData.get("validFrom")),
      validTo: dateOrNull(formData.get("validTo")),
      sortOrder: int(formData.get("sortOrder"), 0),
      active: bool(formData.get("active")),
      updatedAt: new Date(),
    })
    .where(eq(schema.deals.id, id));

  revalidatePath("/admin/angebote");
  revalidatePath(`/admin/angebote/${id}`);
  revalidatePublic();
}

export async function deleteDeal(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  if (!id) return;
  await db.delete(schema.deals).where(eq(schema.deals.id, id));
  revalidatePath("/admin/angebote");
  revalidatePublic();
  redirect("/admin/angebote");
}

export async function toggleDealActive(formData: FormData) {
  await requireOwner();
  const id = int(formData.get("id"));
  const current = bool(formData.get("current"));
  if (!id) return;
  await db
    .update(schema.deals)
    .set({ active: !current, updatedAt: new Date() })
    .where(eq(schema.deals.id, id));
  revalidatePath("/admin/angebote");
  revalidatePublic();
}
