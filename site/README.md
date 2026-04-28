# Café Laren

Showcase site for Café Laren with owner admin panel.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- Drizzle ORM + Supabase Postgres (project ref `puztfjxdgpehzbhkwlls`)
- GSAP for scroll-triggered animations
- Owner-password admin (`/admin`) for menu + deals CRUD

## Getting started

```bash
npm install
cp .env.example .env.local
# fill DATABASE_URL (pooler), DIRECT_URL (5432), ADMIN_PASSWORD, SESSION_SECRET

npm run db:push        # apply schema to Supabase (uses DIRECT_URL)
npm run db:seed        # seed (after menu extraction)
npm run dev            # http://localhost:3000
```

## Project layout

- `src/app/` — public pages (landing, gallery, menu)
- `src/app/admin/` — owner dashboard
- `src/lib/schema.ts` — `menu_categories`, `menu_items`, `deals`
- `src/lib/auth.ts` — owner-password session cookie
- `scripts/seed.ts` — seeds DB from extracted menu

## Customer info

See `../info.md` for hours, phone, Instagram, email.
