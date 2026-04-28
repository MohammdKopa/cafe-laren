import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => menuCategories.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 96 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    priceNote: varchar("price_note", { length: 32 }),
    allergens: jsonb("allergens").$type<string[]>().notNull().default([]),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("menu_items_category_idx").on(t.categoryId, t.sortOrder)],
);

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  /** Cadence pill on the card, e.g. "Mittwoch", "Werktags · 9–13". */
  badge: varchar("badge", { length: 64 }),
  body: text("body").notNull(),
  /** Old (struck-through) price as display text, e.g. "5,90 €". */
  wasText: varchar("was_text", { length: 32 }),
  /** Aktion price as display text, e.g. "4,50 €". */
  priceText: varchar("price_text", { length: 32 }),
  /** Microcopy under price, e.g. "Mittwochs · ganzen Tag". */
  validityText: varchar("validity_text", { length: 96 }),
  imageUrl: text("image_url"),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validTo: timestamp("valid_to", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ many }) => ({
    items: many(menuItems),
  }),
);

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
}));

export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Deal = typeof deals.$inferSelect;
