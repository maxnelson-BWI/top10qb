-- Top10QB database schema.
-- Paste this whole file into the Supabase SQL editor and run it once.
-- Safe to re-run: everything uses "if not exists" / "or replace".

-- Reference: NFL teams (code + display name + accent color).
create table if not exists public.teams (
  code text primary key,
  name text not null,
  primary_color text not null
);

-- Reference: quarterbacks. espn_id drives the hotlinked headshot.
create table if not exists public.qbs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  espn_id integer,
  default_team_code text references public.teams (code),
  created_at timestamptz not null default now()
);

-- One row per weekly list.
create table if not exists public.weeks (
  id uuid primary key default gen_random_uuid(),
  season integer not null,
  week_number integer not null,
  display_date text not null default '',
  tagline text not null default 'your favorite rapper''s favorite top 10 list',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  -- Optional custom list name (shows instead of "Week N"), e.g. "Offseason Rankings 1"
  label text,
  -- Optional action/tunnel photo URL for the #1 hero (falls back to headshot)
  hero_image_url text,
  -- Worst QB of the Week
  worst_name text,
  worst_take text,
  -- Dropped Out: [{ "name": "...", "previousRank": 7 }, ...]
  dropped_out jsonb not null default '[]'::jsonb,
  -- One-line note shown on the Archive row for this week
  archive_note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season, week_number)
);

-- The ranked QBs (1..10) for a given week.
create table if not exists public.rankings (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.weeks (id) on delete cascade,
  rank integer not null check (rank between 1 and 20),
  qb_id uuid references public.qbs (id),
  qb_slug text not null,
  name text not null,            -- snapshot of the QB name at publish time
  team_code text not null references public.teams (code),  -- snapshot team
  take text not null default '',
  -- Movement vs. previous published week, e.g. {"kind":"up","delta":2}
  -- or {"kind":"holds","weeks":6} for the #1 hero.
  movement jsonb not null default '{"kind":"same"}'::jsonb,
  unique (week_id, rank)
);

create index if not exists rankings_week_idx on public.rankings (week_id);
create index if not exists rankings_slug_idx on public.rankings (qb_slug);

-- "Rankmaster Was Wrong" accountability entries.
create table if not exists public.wrong_entries (
  id uuid primary key default gen_random_uuid(),
  sort integer not null default 0,
  grade text not null default 'F',
  week_ref text not null default '',
  take text not null default '',
  what_happened text not null default '',
  verdict text not null default '',
  created_at timestamptz not null default now()
);

-- Email signups.
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'homepage',
  created_at timestamptz not null default now()
);

-- Keep weeks.updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists weeks_touch on public.weeks;
create trigger weeks_touch before update on public.weeks
  for each row execute function public.touch_updated_at();
