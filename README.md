# Top10QB.com

One person's weekly NFL quarterback rankings, presented with intentionally excessive authority.
Mobile-first public site + a private admin and graphics tool, backed by Supabase, deployed on
Vercel.

**New here / setting it up? Read [SETUP.md](SETUP.md) first.**

**Reviewing the July 2026 strategy and site changes? Start with
[START-HERE-FOR-CLAUDE.md](START-HERE-FOR-CLAUDE.md).**

## Stack
- **Next.js (App Router) + TypeScript + Tailwind** — the public site and admin.
- **Supabase** — Postgres database + magic-link auth for the single admin.
- **Vercel Analytics** — page views, referrals, email-signup events, and follow-button clicks.
- QB headshots are hotlinked from ESPN by player id (no stored images).
- Deployed GitHub → Vercel. Design source lives in `/design`.

## Local development
```bash
npm install
cp .env.example .env.local   # then fill in Supabase values (see SETUP.md)
npm run dev                  # http://localhost:3000
npm run seed                 # load reference data + Week 14 sample into Supabase
npm run build                # production build + typecheck
```
Without `.env.local`, the site runs in **dev mode**: it renders from the design fixtures in
`lib/fixtures.ts` and the admin is open but read-only, so you can explore the UI before wiring up
the database.

## Structure
```
app/                     Routes
  page.tsx               Home (latest published week)
  archive/               Honest record of every published list
  week/[season]/[week]/  A specific archived week
  wrong/                 "I Was Wrong" accountability page
  player/[slug]/         Player profile + trend chart
  about/                 Ranking definition + one-person premise
  graphics/list/         Automatically rendered weekly social graphics
  admin/                 Private admin (auth-gated by middleware)
    week/[id]/           Week editor (drag-reorder, drafts, publish)
    graphics/            Preview + download the weekly graphics
    actions.ts           Server actions: save / publish / duplicate / export
    export/              CSV export
  api/subscribe/         Email capture endpoint
components/              UI (public + admin/)
lib/                     data.ts (reads), admin-data.ts (writes), reference.ts,
                         fixtures.ts, supabase/ clients, movement.ts, types.ts
supabase/                schema.sql + rls.sql (run once in Supabase)
scripts/seed.ts          One-shot data seeder
```

## Data model
`teams`, `qbs` (reference) · `weeks` + `rankings` (one row per rank) · `wrong_entries` ·
`subscribers`. Only `published` weeks are readable by the public (enforced by RLS). Movement vs.
the previous week is auto-computed at publish time and stored so archived weeks stay stable.

## Secrets
Never commit keys. `.env*` is gitignored. `NEXT_PUBLIC_*` values are browser-safe; the
`SUPABASE_SERVICE_ROLE_KEY` is server-only. Set all values in Vercel too (see SETUP.md).
