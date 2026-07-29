/**
 * Server-only admin data layer. Writes use the service-role client (bypasses
 * RLS). When Supabase isn't configured, functions run in "dev mode": reads
 * return fixtures and writes are no-ops, so the admin UI is usable locally.
 */
import "server-only";
import { createSupabaseAdminClient } from "./supabase/admin";
import { hasSupabase } from "./supabase/config";
import { QBS } from "./reference";
import { WEEK_14 } from "./fixtures";
import { autoMovement } from "./movement";
import type { Movement } from "./types";

export type EditableRanking = {
  rank: number;
  qbSlug: string;
  name: string;
  teamCode: string;
  take: string;
  movement: Movement;
};

export type EditableWeek = {
  id: string | null;
  season: number;
  weekNumber: number;
  displayDate: string;
  tagline: string;
  label: string; // "" = none (shows "Week N" instead)
  heroImageUrl: string; // "" = none (uses the QB headshot)
  status: "draft" | "published";
  archiveNote: string;
  ranked: EditableRanking[];
  worstName: string;
  worstTake: string;
  droppedOut: { name: string; previousRank: number }[];
};

export type WeekSummary = {
  id: string;
  season: number;
  weekNumber: number;
  label: string | null; // display name, e.g. "Playoffs 2025"
  status: "draft" | "published";
  publishedAt: string | null;
};

export const DEFAULT_TAGLINE = "your favorite rapper's favorite top 10 list";

function week14Editable(): EditableWeek {
  return {
    id: "fixture-2024-14",
    season: WEEK_14.season,
    weekNumber: WEEK_14.weekNumber,
    displayDate: WEEK_14.displayDate,
    tagline: WEEK_14.tagline,
    status: "published",
    archiveNote: "Bought the courthouse. Renamed it.",
    ranked: WEEK_14.ranked.map((r) => ({
      rank: r.rank,
      qbSlug: r.qbSlug,
      name: r.name,
      teamCode: r.teamCode,
      take: r.take,
      movement: r.movement,
    })),
    worstName: WEEK_14.worst?.name ?? "",
    worstTake: WEEK_14.worst?.take ?? "",
    droppedOut: WEEK_14.droppedOut,
    label: WEEK_14.label ?? "",
    heroImageUrl: WEEK_14.heroImageUrl ?? "",
  };
}

export function blankWeek(season: number, weekNumber: number): EditableWeek {
  return {
    id: null,
    season,
    weekNumber,
    displayDate: "",
    tagline: DEFAULT_TAGLINE,
    label: "",
    heroImageUrl: "",
    status: "draft",
    archiveNote: "",
    ranked: [],
    worstName: "",
    worstTake: "",
    droppedOut: [],
  };
}

export async function listWeeks(): Promise<WeekSummary[]> {
  if (!hasSupabase) {
    return [
      {
        id: "fixture-2024-14",
        season: 2024,
        weekNumber: 14,
        label: WEEK_14.label ?? null,
        status: "published",
        publishedAt: WEEK_14.publishedAt,
      },
    ];
  }
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("weeks")
    .select("id, season, week_number, label, status, published_at")
    .order("season", { ascending: false })
    .order("week_number", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((w) => ({
    id: w.id,
    season: w.season,
    weekNumber: w.week_number,
    label: w.label ?? null,
    status: w.status,
    publishedAt: w.published_at,
  }));
}

export async function getEditableWeek(id: string): Promise<EditableWeek | null> {
  if (!hasSupabase) return id === "fixture-2024-14" ? week14Editable() : null;
  const db = createSupabaseAdminClient();
  const { data: w, error } = await db.from("weeks").select("*").eq("id", id).single();
  if (error || !w) return null;
  const { data: rankings } = await db
    .from("rankings")
    .select("rank, qb_slug, name, team_code, take, movement")
    .eq("week_id", id)
    .order("rank");
  return {
    id: w.id,
    season: w.season,
    weekNumber: w.week_number,
    displayDate: w.display_date,
    tagline: w.tagline,
    label: w.label ?? "",
    heroImageUrl: w.hero_image_url ?? "",
    status: w.status,
    archiveNote: w.archive_note ?? "",
    ranked: (rankings ?? []).map((r) => ({
      rank: r.rank,
      qbSlug: r.qb_slug,
      name: r.name,
      teamCode: r.team_code,
      take: r.take,
      movement: r.movement as Movement,
    })),
    worstName: w.worst_name ?? "",
    worstTake: w.worst_take ?? "",
    droppedOut: (w.dropped_out ?? []) as { name: string; previousRank: number }[],
  };
}

/** The most recent week by (season, week) — used by "duplicate last week". */
export async function getLatestWeek(): Promise<EditableWeek | null> {
  if (!hasSupabase) return week14Editable();
  const summaries = await listWeeks();
  if (!summaries.length) return null;
  return getEditableWeek(summaries[0].id);
}

/** Previous published week's ranks as slug->rank, for movement auto-calc. */
export async function getPreviousRanks(
  season: number,
  weekNumber: number,
): Promise<Map<string, number>> {
  if (!hasSupabase) {
    return new Map(WEEK_14.ranked.map((r) => [r.qbSlug, r.rank]));
  }
  const db = createSupabaseAdminClient();
  const { data: weeks } = await db
    .from("weeks")
    .select("id, season, week_number")
    .eq("status", "published")
    .or(`season.lt.${season},and(season.eq.${season},week_number.lt.${weekNumber})`)
    .order("season", { ascending: false })
    .order("week_number", { ascending: false })
    .limit(1);
  const prev = weeks?.[0];
  if (!prev) return new Map();
  const { data: rankings } = await db
    .from("rankings")
    .select("qb_slug, rank")
    .eq("week_id", prev.id);
  return new Map((rankings ?? []).map((r) => [r.qb_slug, r.rank]));
}

export const QB_OPTIONS = QBS.map((q) => ({
  slug: q.slug,
  name: q.fullName,
  teamCode: q.defaultTeamCode,
  espnId: q.espnId,
}));

/** Auto-calculate movement for each ranked QB vs. the previous week. */
export function computeMovements(
  ranked: EditableRanking[],
  prev: Map<string, number>,
  no1HoldWeeks?: number,
): EditableRanking[] {
  return ranked.map((r) => ({
    ...r,
    movement: autoMovement(r.rank, prev.get(r.qbSlug), no1HoldWeeks),
  }));
}
