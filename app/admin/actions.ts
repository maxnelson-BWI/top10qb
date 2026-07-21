"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/supabase/config";
import { requireAdmin } from "@/lib/auth";
import {
  computeMovements,
  getLatestWeek,
  getPreviousRanks,
  type EditableWeek,
} from "@/lib/admin-data";

export type ActionResult = { ok: boolean; id?: string; error?: string };

const DEV_MSG = "Connect Supabase (see SETUP.md) to save. Running in local dev mode.";

/** Create or update a week as a draft (or keep its current status). */
export async function saveWeek(week: EditableWeek): Promise<ActionResult> {
  await requireAdmin();
  if (!hasSupabase) return { ok: false, error: DEV_MSG };

  const db = createSupabaseAdminClient();
  try {
    const { data: weekRow, error: weekErr } = await db
      .from("weeks")
      .upsert(
        {
          ...(week.id ? { id: week.id } : {}),
          season: week.season,
          week_number: week.weekNumber,
          display_date: week.displayDate,
          tagline: week.tagline,
          label: week.label || null,
          hero_image_url: week.heroImageUrl || null,
          archive_note: week.archiveNote,
          worst_name: week.worstName || null,
          worst_take: week.worstTake || null,
          dropped_out: week.droppedOut,
        },
        { onConflict: "season,week_number" },
      )
      .select("id")
      .single();
    if (weekErr) throw weekErr;
    const weekId = weekRow.id as string;

    await db.from("rankings").delete().eq("week_id", weekId);
    if (week.ranked.length) {
      const rows = week.ranked.map((r) => ({
        week_id: weekId,
        rank: r.rank,
        qb_id: null,
        qb_slug: r.qbSlug,
        name: r.name,
        team_code: r.teamCode,
        take: r.take,
        movement: r.movement,
      }));
      const { error } = await db.from("rankings").insert(rows);
      if (error) throw error;
    }

    revalidatePath("/admin");
    return { ok: true, id: weekId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

/** Publish a week: recompute movement vs. the previous week, then go live. */
export async function publishWeek(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!hasSupabase) return { ok: false, error: DEV_MSG };

  const db = createSupabaseAdminClient();
  try {
    const { data: w, error: wErr } = await db.from("weeks").select("*").eq("id", id).single();
    if (wErr || !w) throw wErr ?? new Error("Week not found");

    const { data: rankings } = await db
      .from("rankings")
      .select("rank, qb_slug, name, team_code, take, movement")
      .eq("week_id", id)
      .order("rank");

    const prev = await getPreviousRanks(w.season, w.week_number);
    const no1 = (rankings ?? []).find((r) => r.rank === 1);
    const holdWeeks = no1 ? await countNo1Streak(no1.qb_slug, w.season, w.week_number) : 0;

    const editable = (rankings ?? []).map((r) => ({
      rank: r.rank,
      qbSlug: r.qb_slug,
      name: r.name,
      teamCode: r.team_code,
      take: r.take,
      movement: r.movement,
    }));
    const withMovement = computeMovements(editable, prev, holdWeeks);

    // Persist recomputed movement.
    for (const r of withMovement) {
      await db.from("rankings").update({ movement: r.movement }).eq("week_id", id).eq("rank", r.rank);
    }

    const { error: pubErr } = await db
      .from("weeks")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", id);
    if (pubErr) throw pubErr;

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/admin");
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Publish failed." };
  }
}

/** Move a published week back to draft (unpublish). */
export async function unpublishWeek(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!hasSupabase) return { ok: false, error: DEV_MSG };
  const db = createSupabaseAdminClient();
  const { error } = await db.from("weeks").update({ status: "draft" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/admin");
  return { ok: true, id };
}

/**
 * Clone the latest week into a new draft (week number + 1). Invoked from a
 * <form action>, so it returns void and redirects into the editor on success.
 */
export async function duplicateLastWeek(): Promise<void> {
  await requireAdmin();
  if (!hasSupabase) redirect("/admin?msg=dev");

  const latest = await getLatestWeek();
  if (!latest) redirect("/admin?msg=none");

  const clone: EditableWeek = {
    ...latest,
    id: null,
    weekNumber: latest.weekNumber + 1,
    status: "draft",
    displayDate: "",
    archiveNote: "",
    // Carry the lineup + order + teams as a starting point, but clear all the
    // writing so a fresh take is written each week. Movement recalced on publish.
    ranked: latest.ranked.map((r) => ({ ...r, take: "", movement: { kind: "same" } })),
    worstName: "",
    worstTake: "",
    droppedOut: [],
    label: "",
    heroImageUrl: "",
  };
  const res = await saveWeek(clone);
  if (res.ok && res.id) redirect(`/admin/week/${res.id}`);
  redirect("/admin?msg=error");
}

/** Create a fresh empty draft. Invoked from a <form action>. */
export async function createWeek(season: number, weekNumber: number): Promise<void> {
  await requireAdmin();
  if (!hasSupabase) redirect("/admin?msg=dev");
  const res = await saveWeek({
    id: null,
    season,
    weekNumber,
    displayDate: "",
    tagline: "your favorite rapper's favorite top 10 list",
    label: "",
    heroImageUrl: "",
    status: "draft",
    archiveNote: "",
    ranked: [],
    worstName: "",
    worstTake: "",
    droppedOut: [],
  });
  if (res.ok && res.id) redirect(`/admin/week/${res.id}`);
  redirect("/admin?msg=error");
}

export async function deleteWeek(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!hasSupabase) return { ok: false, error: DEV_MSG };
  const db = createSupabaseAdminClient();
  const { error } = await db.from("weeks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/archive");
  return { ok: true };
}

/** Count the trailing streak of consecutive published weeks at #1 for a slug. */
async function countNo1Streak(slug: string, season: number, weekNumber: number): Promise<number> {
  const db = createSupabaseAdminClient();
  const { data: weeks } = await db
    .from("weeks")
    .select("id, season, week_number")
    .eq("status", "published")
    .or(`season.lt.${season},and(season.eq.${season},week_number.lt.${weekNumber})`)
    .order("season", { ascending: false })
    .order("week_number", { ascending: false });
  let streak = 1; // this week counts as 1
  for (const w of weeks ?? []) {
    const { data: no1 } = await db
      .from("rankings")
      .select("qb_slug")
      .eq("week_id", w.id)
      .eq("rank", 1)
      .maybeSingle();
    if (no1?.qb_slug === slug) streak += 1;
    else break;
  }
  return streak;
}
