-- Trim the archive to just two lists (Playoffs 2025 + the current Offseason
-- list) and clear the sample Hall of Shame so it starts empty.
delete from public.weeks where season = 2024;
delete from public.wrong_entries;

-- "Playoffs 2025" — the board before the Super Bowl, reconstructed from the
-- movement arrows in the current Offseason list.
insert into public.weeks (season, week_number, display_date, tagline, label, status, published_at, archive_note)
values (2025, 1, 'Jan 2025', 'your favorite rapper''s favorite top 10 list', 'Playoffs 2025', 'published', now(), 'The pre-Super Bowl board.')
on conflict (season, week_number) do update set label = excluded.label, status = excluded.status, published_at = excluded.published_at, archive_note = excluded.archive_note, display_date = excluded.display_date;

delete from public.rankings where week_id = (select id from public.weeks where season = 2025 and week_number = 1);
insert into public.rankings (week_id, rank, qb_slug, name, team_code, take, movement) values
  ((select id from public.weeks where season=2025 and week_number=1), 1, 'lamar-jackson', 'Lamar Jackson', 'BAL', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 2, 'josh-allen', 'Josh Allen', 'BUF', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 3, 'patrick-mahomes', 'Patrick Mahomes', 'KC', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 4, 'matthew-stafford', 'Matthew Stafford', 'LAR', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 5, 'drake-maye', 'Drake Maye', 'NE', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 6, 'justin-herbert', 'Justin Herbert', 'LAC', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 7, 'trevor-lawrence', 'Trevor Lawrence', 'JAX', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 8, 'dak-prescott', 'Dak Prescott', 'DAL', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 9, 'joe-burrow', 'Joe Burrow', 'CIN', '', '{"kind":"same"}'::jsonb),
  ((select id from public.weeks where season=2025 and week_number=1), 10, 'jalen-hurts', 'Jalen Hurts', 'PHI', '', '{"kind":"same"}'::jsonb);

-- Point the current Offseason list's #1 hero at the action shot (file to be
-- dropped into /public as hero-1.jpg).
update public.weeks set hero_image_url = '/hero-1.jpg' where season = 2026 and week_number = 1;
