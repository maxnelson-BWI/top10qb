-- Row Level Security for Top10QB.
-- Run this AFTER schema.sql, once, in the Supabase SQL editor.
--
-- Model: the public (anon) key may READ reference data and PUBLISHED weeks only.
-- All writes (drafts, publishing, subscribers) go through the server-side
-- service-role key, which BYPASSES RLS — so no write policies are needed here.

alter table public.teams          enable row level security;
alter table public.qbs            enable row level security;
alter table public.weeks          enable row level security;
alter table public.rankings       enable row level security;
alter table public.wrong_entries  enable row level security;
alter table public.subscribers    enable row level security;

-- Reference data is world-readable.
drop policy if exists teams_read on public.teams;
create policy teams_read on public.teams for select using (true);

drop policy if exists qbs_read on public.qbs;
create policy qbs_read on public.qbs for select using (true);

drop policy if exists wrong_read on public.wrong_entries;
create policy wrong_read on public.wrong_entries for select using (true);

-- Only PUBLISHED weeks are visible to the public.
drop policy if exists weeks_read_published on public.weeks;
create policy weeks_read_published on public.weeks
  for select using (status = 'published');

-- Rankings are visible only for published weeks.
drop policy if exists rankings_read_published on public.rankings;
create policy rankings_read_published on public.rankings
  for select using (
    exists (
      select 1 from public.weeks w
      where w.id = rankings.week_id and w.status = 'published'
    )
  );

-- subscribers: no anon policies at all => anon cannot read or write.
-- (The /api/subscribe route inserts using the service-role key.)
