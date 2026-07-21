# Top10QB — Setup Guide (plain English)

This is the new Top10QB site: a **Next.js** app (public site + private admin) backed by a
**Supabase** database, deployed on **Vercel** via **GitHub** — the same hosting flow you already
use. QB headshots load live from ESPN (no images to manage). This guide walks you through the
one-time setup. Nothing here requires you to write code.

You'll do five things:
1. Create a free Supabase project (the database + your admin login).
2. Run two SQL files to create the tables.
3. Put four secret values into a local file and into Vercel.
4. Load the starter data (one command).
5. Push to GitHub and connect Vercel.

Take your time — each step is copy/paste.

---

## 0. What you need
- A GitHub account (you have one).
- A Vercel account connected to GitHub (you have one).
- A free Supabase account — sign up at https://supabase.com with GitHub.
- Node.js installed on your computer (to run the site locally + load starter data).

---

## 1. Create the Supabase project
1. Go to https://supabase.com → **New project**.
2. Name it `top10qb`, pick a region near you, set a database password (save it somewhere).
3. Wait ~2 minutes for it to finish setting up.

### Grab your keys (Project Settings → API)
You'll copy **three** values:
- **Project URL** — looks like `https://abcdxyz.supabase.co`
- **anon public** key — a long string (safe to expose in the browser)
- **service_role** key — a long string that is **SECRET**. Never share it or put it in the
  public site. We only use it on the server.

Keep this tab open.

---

## 2. Create the tables
1. In Supabase, open the **SQL Editor** (left sidebar) → **New query**.
2. Open the file `supabase/schema.sql` from this project, copy **everything**, paste it in, and
   click **Run**. You should see "Success".
3. New query again. Open `supabase/rls.sql`, copy everything, paste, **Run**. "Success".

That's the whole database created, with security rules so the public can only ever read
**published** weeks.

---

## 3. Add your secret values

### Locally
1. In the project, copy `.env.example` to a new file named **`.env.local`**.
2. Fill in the four values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...(your Project URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...(anon public key)
   SUPABASE_SERVICE_ROLE_KEY=...(service_role key — secret)
   ADMIN_EMAIL=maxnelson2@gmail.com
   ```
   `.env.local` is **gitignored** — it never gets committed. Good.

### In Vercel (do this in step 5, after the project exists)
Add the **same four** values under **Project → Settings → Environment Variables**, for both
**Production** and **Preview**. Also add:
   ```
   NEXT_PUBLIC_SITE_URL=https://top10qb.com
   ```

> Why two places? `.env.local` is for running on your computer. Vercel's copy is for the live
> site. Same values, two homes.

---

## 4. Load the starter data
This fills the database with the QB/team reference list and the Week 14 sample so the site isn't
empty. In a terminal, from the project folder:

```
npm install
npm run seed
```

You should see "✓ Seed complete." Refresh your Supabase **Table editor** and you'll see rows in
`teams`, `qbs`, `weeks`, and `rankings`.

### Run it locally to check
```
npm run dev
```
Open http://localhost:3000 — the site should look exactly like the design, now reading from your
database. Open http://localhost:3000/admin — since the DB is connected, it'll ask you to log in.

---

## 5. Deploy: GitHub → Vercel
1. Create a new GitHub repo (e.g. `top10qb`) and push this project to it.
2. In Vercel → **Add New Project** → import that repo. Framework auto-detects as **Next.js**.
3. Add the environment variables from step 3 (all five) before the first deploy.
4. Deploy. Vercel gives you a URL; once it looks good, point `top10qb.com` (Namecheap DNS) at the
   Vercel project — Vercel shows the exact DNS records under **Settings → Domains**.

Every future `git push` auto-deploys, same as today.

---

## Using the admin tool
- Go to `yoursite.com/admin`. Enter **your** email (`ADMIN_EMAIL`). You get a magic sign-in link
  by email — click it. No password to remember. Only that one email can get in.
- **Duplicate last week** to start a new week fast, then drag to reorder, edit each take, set teams
  (which drives the accent colors), and fill in Worst QB / Dropped Out.
- **Save draft** keeps it private. **Publish** puts it live and auto-calculates movement arrows
  vs. the previous week.
- **Export CSV** downloads every week — keep it as a Google Sheet backup whenever you like.

## Email signups
The homepage form saves addresses into the `subscribers` table in Supabase. To see them:
Supabase → **Table editor** → `subscribers`. When you're ready to send newsletters, export that
table (or wire up a provider like Resend later) — you own the list.

## Headshots
QB photos load automatically from ESPN using each QB's ESPN id (already stored in the `qbs`
table). New QB coming into the league? Add a row to `qbs` with their ESPN id (find it in the
ESPN player URL) — no image files to upload.

## Safety notes
- The **service_role** key is powerful. It lives only in `.env.local` (never committed) and in
  Vercel's server-side env. It is never sent to browsers.
- If you ever think a key leaked, rotate it in Supabase (Settings → API) and update both places.
