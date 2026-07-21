/**
 * One-off: generates supabase/offseason-import.sql to (a) add the label +
 * hero_image_url columns and (b) load the live "Offseason Rankings 1" list
 * (scraped from top10qb.com) as the current published list.
 */
import { writeFileSync } from "node:fs";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const SEASON = 2026;
const WEEK = 1;

const ranked: Array<{ slug: string; name: string; team: string; take: string; movement: unknown }> = [
  { slug: "lamar-jackson", name: "Lamar Jackson", team: "BAL", take: "Anyone that doesn’t have Lamar number one is telling on themselves.", movement: { kind: "same" } },
  { slug: "josh-allen", name: "Josh Allen", team: "BUF", take: "We love the cannon arm. We love the running ability. That one fumble before half against Denver though. Yikes.", movement: { kind: "same" } },
  { slug: "matthew-stafford", name: "Matthew Stafford", team: "LAR", take: "Decent chance he falls off a cliff next year and I regret this rating.", movement: { kind: "up", delta: 1 } },
  { slug: "patrick-mahomes", name: "Patrick Mahomes", team: "KC", take: "He's hurt and felt like he was sneaky not good last year. But he's Mahomes.", movement: { kind: "down", delta: 1 } },
  { slug: "trevor-lawrence", name: "Trevor Lawrence", team: "JAX", take: "Including the Clemson years, feels like I’ve spent almost a decade calling him a bust. I'm not apologizing, but I am putting him at 5.", movement: { kind: "up", delta: 2 } },
  { slug: "dak-prescott", name: "Dak Prescott", team: "DAL", take: "Cowboys were awful last year, Dak was awesome. If you think he's the problem in Dallas, I can't help you.", movement: { kind: "up", delta: 2 } },
  { slug: "joe-burrow", name: "Joe Burrow", team: "CIN", take: "Most overrated player in the league, but I guess he's top 7.", movement: { kind: "up", delta: 2 } },
  { slug: "brock-purdy", name: "Brock Purdy", team: "SF", take: "The Purdy thing is real. Sorry if you don't see it yet.", movement: { kind: "new" } },
  { slug: "justin-herbert", name: "Justin Herbert", team: "LAC", take: "The Justin Herbert leap has to come eventually. Right? Right???", movement: { kind: "down", delta: 3 } },
  { slug: "drake-maye", name: "Drake Maye", team: "NE", take: "Heart says I never want him in the top 10 again. Head says 10 is fair.", movement: { kind: "down", delta: 5 } },
];

const worstName = "Drake Maye";
const worstTake = "I know he's top 10. He's also the worst. Super Bowl was SO bad.";
const dropped = [{ name: "Jalen Hurts", previousRank: 10 }];
const archiveNote = "The offseason list opens with Lamar. Obviously.";

const lines: string[] = [];
lines.push("-- Add the new columns (safe if already present) and load Offseason Rankings 1.");
lines.push("alter table public.weeks add column if not exists label text;");
lines.push("alter table public.weeks add column if not exists hero_image_url text;");
lines.push("");
lines.push(
  "insert into public.weeks (season, week_number, display_date, tagline, label, status, published_at, worst_name, worst_take, dropped_out, archive_note) values",
);
lines.push(
  `  (${SEASON}, ${WEEK}, 'Feb 2026', 'your favorite rapper''s favorite top 10 list', 'Offseason Rankings 1', 'published', now(), ${q(worstName)}, ${q(worstTake)}, ${q(JSON.stringify(dropped))}::jsonb, ${q(archiveNote)})`,
);
lines.push(
  "on conflict (season, week_number) do update set display_date = excluded.display_date, label = excluded.label, status = excluded.status, published_at = excluded.published_at, worst_name = excluded.worst_name, worst_take = excluded.worst_take, dropped_out = excluded.dropped_out, archive_note = excluded.archive_note;",
);
lines.push("");
lines.push(
  `delete from public.rankings where week_id = (select id from public.weeks where season = ${SEASON} and week_number = ${WEEK});`,
);
for (const r of ranked) {
  lines.push(
    `insert into public.rankings (week_id, rank, qb_slug, name, team_code, take, movement) values ` +
      `((select id from public.weeks where season = ${SEASON} and week_number = ${WEEK}), ${ranked.indexOf(r) + 1}, ${q(r.slug)}, ${q(r.name)}, ${q(r.team)}, ${q(r.take)}, ${q(JSON.stringify(r.movement))}::jsonb);`,
  );
}
lines.push("");

writeFileSync(new URL("../supabase/offseason-import.sql", import.meta.url), lines.join("\n") + "\n");
console.log("Wrote supabase/offseason-import.sql");
