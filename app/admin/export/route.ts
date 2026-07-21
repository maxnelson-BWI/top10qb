import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/supabase/config";
import { WEEK_14 } from "@/lib/fixtures";

/** Exports every week's rankings as CSV — the Google Sheet backup. */
export async function GET() {
  await requireAdmin();

  const header = [
    "season",
    "week",
    "status",
    "published_at",
    "rank",
    "qb_slug",
    "name",
    "team_code",
    "take",
    "movement",
    "worst_name",
    "worst_take",
    "dropped_out",
    "archive_note",
  ];

  type Row = (string | number)[];
  const rows: Row[] = [];

  if (!hasSupabase) {
    for (const r of WEEK_14.ranked) {
      rows.push([
        WEEK_14.season,
        WEEK_14.weekNumber,
        "published",
        WEEK_14.publishedAt ?? "",
        r.rank,
        r.qbSlug,
        r.name,
        r.teamCode,
        r.take,
        JSON.stringify(r.movement),
        WEEK_14.worst?.name ?? "",
        WEEK_14.worst?.take ?? "",
        JSON.stringify(WEEK_14.droppedOut),
        "",
      ]);
    }
  } else {
    const db = createSupabaseAdminClient();
    const { data: weeks } = await db
      .from("weeks")
      .select("*")
      .order("season", { ascending: false })
      .order("week_number", { ascending: false });
    for (const w of weeks ?? []) {
      const { data: rankings } = await db
        .from("rankings")
        .select("rank, qb_slug, name, team_code, take, movement")
        .eq("week_id", w.id)
        .order("rank");
      for (const r of rankings ?? []) {
        rows.push([
          w.season,
          w.week_number,
          w.status,
          w.published_at ?? "",
          r.rank,
          r.qb_slug,
          r.name,
          r.team_code,
          r.take,
          JSON.stringify(r.movement),
          w.worst_name ?? "",
          w.worst_take ?? "",
          JSON.stringify(w.dropped_out ?? []),
          w.archive_note ?? "",
        ]);
      }
    }
  }

  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="top10qb-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
