<div align="center">

# Café Laren

**Italienisches Eiscafé & Türkisches Frühstück — Marl, NRW**

Showcase site with owner admin (menu + Aktionen CRUD), built as a portfolio piece.

[**Live site →**](https://cafe-laren.vercel.app) · [**Customer**](https://www.instagram.com/cafelaren/) · [**Admin**](https://cafe-laren.vercel.app/admin)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MohammdKopa/cafe-laren&root-directory=site&env=DATABASE_URL,DIRECT_URL,ADMIN_PASSWORD,SESSION_SECRET,NEXT_PUBLIC_SITE_URL&envDescription=Supabase+connection+strings,+admin+password,+and+session+secret.+See+the+README+for+how+to+generate+each.&envLink=https://github.com/MohammdKopa/cafe-laren%23environment-variables&project-name=cafe-laren&repository-name=cafe-laren)

</div>

---

## What this is

A full-stack café showcase plus an owner admin dashboard. Eight scroll-driven sections (Hero → Aktionen → Two Worlds → Eisbecher pinned scenes → Eissorten marquee → Frühstück → Vollständige Karte → Galerie → Besuch & Kontakt), each with its own boundary-moment choreography (mask-reveal titles, scrub-driven gold seam, halo wash). Cookie-gated Google Maps + Instagram embeds. GDPR-compliant Impressum + Datenschutz pages. The owner manages the entire menu (~200 items across 23 categories) and the weekly Aktionen from `/admin` — no code changes needed.

## Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16 (App Router, RSC, Server Actions) + React 19 |
| Styling | Tailwind CSS v4 with custom design tokens |
| Animation | GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis smooth scroll |
| Database | Supabase Postgres (connection-pooled) |
| ORM | Drizzle |
| Auth | HMAC-signed session cookie (single-owner password) |
| Hosting | Vercel |
| Type system | TypeScript 5 strict |

## One-click deploy

The fastest way to spin up your own instance:

1. **Provision a Postgres database** — easiest is [Supabase](https://database.new). Copy the **Pooler** connection string (Transaction mode, port 6543) and the **Direct** connection (port 5432).
2. **Click the Vercel deploy button above** — it forks the repo, asks for the env vars, and deploys.
3. **Apply the schema** — clone your fork locally, set `.env.local`, then run:
   ```bash
   cd site && npm install && npm run db:push
   ```
4. **Log in to `/admin`** with the `ADMIN_PASSWORD` you set, and start adding categories, items, and Aktionen.

## Local development

```bash
git clone https://github.com/MohammdKopa/cafe-laren.git
cd cafe-laren/site

# Install
npm install

# Configure
cp .env.example .env.local
#   → fill in DATABASE_URL, DIRECT_URL, ADMIN_PASSWORD, SESSION_SECRET, NEXT_PUBLIC_SITE_URL

# Apply schema (uses DIRECT_URL)
npm run db:push

# (optional) Seed sample data from menu.json
npm run db:seed

# Dev server
npm run dev
#   → http://localhost:3000        (public site)
#   → http://localhost:3000/admin  (owner dashboard)
```

## Environment variables

Set these in `.env.local` for local dev, or in your Vercel project → Settings → Environment Variables for production.

| Variable | Required | What it is |
|---|---|---|
| `DATABASE_URL` | yes | Supabase **pooler** connection string (port 6543, Transaction mode). Used at runtime. |
| `DIRECT_URL` | yes | Supabase **direct** connection string (port 5432). Used by drizzle-kit migrations. |
| `ADMIN_PASSWORD` | yes | The password the owner enters at `/admin/login`. |
| `SESSION_SECRET` | yes | Any 32+ char random string. Signs the session cookie. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `NEXT_PUBLIC_SITE_URL` | yes | Public URL of the site (e.g. `https://cafe-laren.de`). Used for SEO metadata + LocalBusiness JSON-LD. |

## Project layout

```
.
├── site/                    # Next.js app — all code lives here
│   ├── src/
│   │   ├── app/             # Pages & route handlers
│   │   │   ├── admin/       # Owner dashboard (menu + Aktionen CRUD)
│   │   │   ├── impressum/   # § 5 DDG legal page
│   │   │   ├── datenschutz/ # GDPR privacy policy
│   │   │   ├── layout.tsx   # Root layout (fonts, JSON-LD, ConsentProvider)
│   │   │   └── page.tsx     # Landing page composition
│   │   ├── components/      # Sections + shared UI (Hero, Aktionen, BloomModal, …)
│   │   ├── lib/
│   │   │   ├── auth.ts            # HMAC session cookie
│   │   │   ├── db.ts              # Drizzle client
│   │   │   ├── schema.ts          # menu_categories, menu_items, deals
│   │   │   ├── admin-actions.ts   # Server actions for CRUD
│   │   │   └── bloomSilhouettes.ts# SVG silhouettes for click-bloom modal
│   │   └── app/globals.css        # Tailwind theme + design tokens
│   ├── scripts/
│   │   ├── seed.ts          # Seed DB from menu.json
│   │   └── smoke.mjs        # Smoke tests
│   └── drizzle/             # Migration files
├── menu.json                # Source-of-truth menu data (committed)
├── info.md                  # Owner contact info (committed)
└── README.md
```

## Admin dashboard

`/admin` (password: whatever you set as `ADMIN_PASSWORD`)

- **Dashboard** — counts of categories, items, deals + recently updated items
- **Menü** — manage 23 categories and ~200 items. Inline edit per row. Slug auto-generates from name. Active toggle. Sort order. Bulk-safe delete (cascades).
- **Aktionen** — weekly deals shown on the public landing page. Each has a title, badge ("Mittwoch"), description, struck-through old price, new price, validity microcopy, optional image, validFrom/validTo timestamps, sort order, active toggle.

Mutations call `revalidatePath("/")` so the public site updates instantly.

## Design highlights

A few things that took the long route on purpose:

- **Boundary-moment choreography.** Every section's gold-arc seam is scrub-driven: drops down + grows + halo washes in as you cross the boundary, ridge tracks downward as you scroll. Six sections, six visibly distinct beats (mirrored arc, slide-in from left, kissed-arcs, deeper halo, taller seam + slow scrub, rotation pulse).
- **Mask-reveal titles.** Every section heading lives in `overflow-hidden` slots — letters rise from below into place. Done via `gsap.fromTo([data-mask-line], { yPercent: 110 }, …)` with `immediateRender: false` so the page never hangs in a half-revealed state.
- **Click-bloom modals.** Per-section silhouette (sundae glass, triple scoop, çay glass, soft-serve swirl, sun disc) blooms from the click origin in brand color and the content card lags in. Reduced-motion path is a 120 ms opacity fade.
- **Cookie-gated embeds.** Google Maps and Instagram (when wired) only load after explicit consent. Without consent: a styled placeholder + one-tap "load" button that grants consent and loads the embed.
- **Mobile bottom CTA bar.** Two thumb-reach pills (Route + Karte) on phone only. Karte opens a sheet with submenu nav. Auto-hides when the Kontakt section enters viewport.

## Customer

- **Café Laren** · [@cafelaren](https://www.instagram.com/cafelaren/) · Marl, Nordrhein-Westfalen
- Daily 9:00–22:30 · [Google Maps](https://maps.app.goo.gl/BMcGY4ppLwkzoE9C6)

## License

[MIT](./LICENSE) — feel free to fork this as a template for your own café / restaurant / small-business site.

---

<div align="center">
Built with care · <a href="https://www.instagram.com/cafelaren/">@cafelaren</a>
</div>
