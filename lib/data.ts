/**
 * Read-side data access for the public site. Reads published data from Supabase
 * when configured; otherwise falls back to the design fixtures so the site
 * renders locally before the DB is wired up. All functions are safe to call
 * from Server Components.
 */
import { createSupabasePublicClient } from "./supabase/public";
import { hasSupabase } from "./supabase/config";
import { TEAM_BY_CODE } from "./reference";
import {
  ARCHIVE,
  WEEK_14,
  WRONG_ENTRIES,
  fixturePlayer,
} from "./fixtures";
import type {
  ArchiveEntry,
  Movement,
  PlayerProfile,
  RankedQB,
  TrendPoint,
  Week,
  WrongEntry,
} from "./types";

type WeekRow = {
  id: string;
  season: number;
  week_number: number;
  display_date: string;
  tagline: string;
  label: string | null;
  hero_image_url: string | null;
  status: string;
  published_at: string | null;
  worst_name: string | null;
  worst_take: string | null;
  dropped_out: { name: string; previousRank: number }[] | null;
  archive_note: string | null;
};

type RankingRow = {
  rank: number;
  qb_slug: string;
  name: string;
  team_code: string;
  take: string;
  movement: Movement;
};

function teamColor(code: string): string {
  return TEAM_BY_CODE[code]?.primaryColor ?? "#8a8578";
}
function teamName(code: string): string {
  return TEAM_BY_CODE[code]?.name ?? code;
}

function mapRanking(r: RankingRow): RankedQB {
  return {
    rank: r.rank,
    qbSlug: r.qb_slug,
    name: r.name,
    teamCode: r.team_code,
    teamName: teamName(r.team_code),
    teamColor: teamColor(r.team_code),
    espnId: 0, // filled below from join or reference
    take: r.take,
    movement: r.movement,
  };
}

function mapWeek(w: WeekRow, rankings: RankingRow[]): Week {
  return {
    id: w.id,
    season: w.season,
    weekNumber: w.week_number,
    displayDate: w.display_date,
    tagline: w.tagline,
    label: w.label ?? null,
    heroImageUrl: w.hero_image_url ?? null,
    status: w.status === "published" ? "published" : "draft",
    publishedAt: w.published_at,
    ranked: rankings
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map(mapRanking),
    worst: w.worst_name ? { name: w.worst_name, take: w.worst_take ?? "" } : null,
    droppedOut: (w.dropped_out ?? []).map((d) => ({
      name: d.name,
      previousRank: d.previousRank,
    })),
  };
}

// Attach ESPN ids to ranked QBs from the reference table (by slug).
async function fillEspnIds(week: Week): Promise<Week> {
  const { QB_BY_SLUG } = await import("./reference");
  week.ranked = week.ranked.map((q) => ({
    ...q,
    espnId: q.espnId || QB_BY_SLUG[q.qbSlug]?.espnId || 0,
  }));
  return week;
}

/** The latest published week (drives Home). */
export async function getCurrentWeek(): Promise<Week | null> {
  if (!hasSupabase) return WEEK_14;
  try {
    const supabase = createSupabasePublicClient();
    const { data: weeks } = await supabase
      .from("weeks")
      .select("*")
      .eq("status", "published")
      .order("season", { ascending: false })
      .order("week_number", { ascending: false })
      .limit(1);
    const w = weeks?.[0] as WeekRow | undefined;
    if (!w) return null;
    const { data: rankings } = await supabase
      .from("rankings")
      .select("rank, qb_slug, name, team_code, take, movement")
      .eq("week_id", w.id);
    return fillEspnIds(mapWeek(w, (rankings ?? []) as RankingRow[]));
  } catch {
    return WEEK_14;
  }
}

/** A specific published week (drives /week/[season]/[week]). */
export async function getWeek(season: number, weekNumber: number): Promise<Week | null> {
  if (!hasSupabase) {
    return season === WEEK_14.season && weekNumber === WEEK_14.weekNumber ? WEEK_14 : null;
  }
  try {
    const supabase = createSupabasePublicClient();
    const { data: weeks } = await supabase
      .from("weeks")
      .select("*")
      .eq("status", "published")
      .eq("season", season)
      .eq("week_number", weekNumber)
      .limit(1);
    const w = weeks?.[0] as WeekRow | undefined;
    if (!w) return null;
    const { data: rankings } = await supabase
      .from("rankings")
      .select("rank, qb_slug, name, team_code, take, movement")
      .eq("week_id", w.id);
    return fillEspnIds(mapWeek(w, (rankings ?? []) as RankingRow[]));
  } catch {
    return null;
  }
}

/** All published weeks as archive rows (newest first). */
export async function getArchive(): Promise<ArchiveEntry[]> {
  if (!hasSupabase) return ARCHIVE;
  try {
    const supabase = createSupabasePublicClient();
    const { data: weeks } = await supabase
      .from("weeks")
      .select("id, season, week_number, display_date, archive_note, label")
      .eq("status", "published")
      .order("season", { ascending: false })
      .order("week_number", { ascending: false });
    if (!weeks?.length) return [];
    const ids = weeks.map((w) => w.id);
    const { data: no1s } = await supabase
      .from("rankings")
      .select("week_id, name, team_code")
      .eq("rank", 1)
      .in("week_id", ids);
    const byWeek = new Map((no1s ?? []).map((r) => [r.week_id, r]));
    const maxWk = weeks[0];
    return weeks.map((w) => {
      const no1 = byWeek.get(w.id);
      const code = no1?.team_code ?? "BAL";
      return {
        season: w.season,
        weekNumber: w.week_number,
        displayDate: w.display_date,
        label: (w as { label?: string | null }).label ?? null,
        no1Name: no1?.name ?? "—",
        no1TeamCode: code,
        no1TeamColor: teamColor(code),
        note: w.archive_note ?? "",
        isCurrent: w.season === maxWk.season && w.week_number === maxWk.week_number,
      };
    });
  } catch {
    return ARCHIVE;
  }
}

/** Honest archive header stats derived only from published lists. */
export function archiveStats(entries: ArchiveEntry[]) {
  const distinctNo1 = new Set(entries.map((e) => e.no1Name)).size;
  const seasons = new Set(entries.map((e) => e.season)).size;
  return { weeksRanked: entries.length, seasons, distinctNo1 };
}

export async function getWrongEntries(): Promise<WrongEntry[]> {
  if (!hasSupabase) return WRONG_ENTRIES;
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("wrong_entries")
      .select("id, grade, week_ref, take, what_happened, verdict, sort")
      .order("sort", { ascending: true });
    // With the DB connected, an empty table is a real "no entries yet" state.
    return (data ?? []).map((e) => ({
      id: e.id,
      grade: e.grade,
      weekRef: e.week_ref,
      take: e.take,
      whatHappened: e.what_happened,
      verdict: e.verdict,
    }));
  } catch {
    return WRONG_ENTRIES;
  }
}

/** A QB's ranking history across published weeks (drives the trend chart). */
export async function getPlayer(slug: string): Promise<PlayerProfile | null> {
  if (!hasSupabase) return fixturePlayer(slug);
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("rankings")
      .select("rank, name, team_code, take, weeks!inner(week_number, season, status)")
      .eq("qb_slug", slug)
      .eq("weeks.status", "published")
      .order("week_number", { foreignTable: "weeks", ascending: true });
    if (!data?.length) return null;
    const rows = data as unknown as Array<{
      rank: number;
      name: string;
      team_code: string;
      take: string;
      weeks: { week_number: number };
    }>;
    const history: TrendPoint[] = rows.map((r) => ({
      weekNumber: r.weeks.week_number,
      rank: r.rank,
    }));
    const last = rows[rows.length - 1];
    const { QB_BY_SLUG } = await import("./reference");
    return {
      slug,
      name: last.name,
      teamCode: last.team_code,
      teamName: teamName(last.team_code),
      teamColor: teamColor(last.team_code),
      espnId: QB_BY_SLUG[slug]?.espnId ?? 0,
      history,
    };
  } catch {
    return fixturePlayer(slug);
  }
}
