/**
 * Seeds Supabase with reference data (teams + QBs), the "Rankmaster Was Wrong"
 * sample entries, and a fully-populated Week 14 (plus the prior 13 weeks' #1s so
 * the Archive shows a real streak).
 *
 * Run once after creating the DB:  npm run seed
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 *
 * Safe to re-run: upserts by natural key.
 */
import { createClient } from "@supabase/supabase-js";
import { QBS, QB_BY_SLUG, TEAMS } from "../lib/reference";
import { ARCHIVE, WEEK_14, WRONG_ENTRIES } from "../lib/fixtures";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // 1. Teams
  console.log("Seeding teams…");
  {
    const rows = TEAMS.map((t) => ({
      code: t.code,
      name: t.name,
      primary_color: t.primaryColor,
    }));
    const { error } = await db.from("teams").upsert(rows, { onConflict: "code" });
    if (error) throw error;
  }

  // 2. QBs
  console.log("Seeding quarterbacks…");
  {
    const rows = QBS.map((q) => ({
      slug: q.slug,
      full_name: q.fullName,
      espn_id: q.espnId,
      default_team_code: q.defaultTeamCode,
    }));
    const { error } = await db.from("qbs").upsert(rows, { onConflict: "slug" });
    if (error) throw error;
  }

  // 3. Wrong entries
  console.log("Seeding 'Rankmaster Was Wrong' entries…");
  {
    const rows = WRONG_ENTRIES.map((e, i) => ({
      sort: i,
      grade: e.grade,
      week_ref: e.weekRef,
      take: e.take,
      what_happened: e.whatHappened,
      verdict: e.verdict,
    }));
    // Replace existing sample set to stay idempotent.
    await db.from("wrong_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await db.from("wrong_entries").insert(rows);
    if (error) throw error;
  }

  // Helper: map a QB slug -> qb id
  const { data: qbRows, error: qbErr } = await db.from("qbs").select("id, slug");
  if (qbErr) throw qbErr;
  const qbIdBySlug = new Map((qbRows ?? []).map((r) => [r.slug, r.id as string]));

  // 4. Prior weeks 1–13: seed each week's #1 only (for Archive streak + trend).
  console.log("Seeding archive weeks 1–13 (#1 only)…");
  for (const entry of ARCHIVE.filter((a) => a.weekNumber < 14)) {
    const slug = Object.entries(QB_BY_SLUG).find(
      ([, q]) => q.fullName === entry.no1Name,
    )?.[0];
    if (!slug) continue;
    const week = await upsertWeek({
      season: entry.season,
      week_number: entry.weekNumber,
      display_date: entry.displayDate,
      status: "published",
      published_at: new Date().toISOString(),
      archive_note: entry.note,
      dropped_out: [],
      worst_name: null,
      worst_take: null,
    });
    await db.from("rankings").delete().eq("week_id", week.id);
    const { error } = await db.from("rankings").insert({
      week_id: week.id,
      rank: 1,
      qb_id: qbIdBySlug.get(slug) ?? null,
      qb_slug: slug,
      name: entry.no1Name,
      team_code: entry.no1TeamCode,
      take: "",
      movement: { kind: "same" },
    });
    if (error) throw error;
  }

  // 5. Week 14: full top-10 + worst + dropped.
  console.log("Seeding Week 14 (full)…");
  {
    const week = await upsertWeek({
      season: WEEK_14.season,
      week_number: WEEK_14.weekNumber,
      display_date: WEEK_14.displayDate,
      status: "published",
      published_at: WEEK_14.publishedAt,
      archive_note: "Bought the courthouse. Renamed it.",
      dropped_out: WEEK_14.droppedOut,
      worst_name: WEEK_14.worst?.name ?? null,
      worst_take: WEEK_14.worst?.take ?? null,
      tagline: WEEK_14.tagline,
    });
    await db.from("rankings").delete().eq("week_id", week.id);
    const rows = WEEK_14.ranked.map((r) => ({
      week_id: week.id,
      rank: r.rank,
      qb_id: qbIdBySlug.get(r.qbSlug) ?? null,
      qb_slug: r.qbSlug,
      name: r.name,
      team_code: r.teamCode,
      take: r.take,
      movement: r.movement,
    }));
    const { error } = await db.from("rankings").insert(rows);
    if (error) throw error;
  }

  console.log("✓ Seed complete.");
}

async function upsertWeek(w: {
  season: number;
  week_number: number;
  display_date: string;
  status: string;
  published_at: string | null;
  archive_note: string;
  dropped_out: unknown;
  worst_name: string | null;
  worst_take: string | null;
  tagline?: string;
}): Promise<{ id: string }> {
  const { data, error } = await db
    .from("weeks")
    .upsert(w, { onConflict: "season,week_number" })
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
