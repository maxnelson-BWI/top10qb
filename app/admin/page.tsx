import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listWeeks } from "@/lib/admin-data";
import { createWeek, duplicateLastWeek } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const weeks = await listWeeks();

  const nextSeason = weeks[0]?.season ?? new Date().getFullYear();
  const nextWeek = (weeks[0]?.weekNumber ?? 0) + 1;

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div className="font-display font-black text-[22px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB{" "}
          <span className="font-body font-bold text-[11px] uppercase align-middle" style={{ color: "#8a8578", letterSpacing: ".2em" }}>
            Admin
          </span>
        </div>
        <a href="/" className="link-accent font-body font-semibold text-[11px] uppercase" style={{ color: "#8a8578", letterSpacing: ".06em" }}>
          View site →
        </a>
      </div>

      {session.devMode && (
        <div className="mx-5 mt-4 rounded-[12px]" style={{ padding: "12px 14px", background: "rgba(201,162,39,.1)", border: "1px solid rgba(201,162,39,.3)" }}>
          <div className="font-body font-semibold text-[12px]" style={{ color: "#c9a227" }}>
            Dev mode — database not connected. You can explore the editor, but saving/publishing is
            disabled until Supabase is set up (see SETUP.md).
          </div>
        </div>
      )}

      <div className="px-5 py-5 flex gap-2 flex-wrap">
        <form action={duplicateLastWeek}>
          <button
            type="submit"
            className="rounded-[10px] font-body font-bold text-[13px] uppercase text-white cursor-pointer"
            style={{ background: "#e8462f", border: "none", padding: "12px 16px", letterSpacing: ".04em" }}
          >
            ⧉ Duplicate last week
          </button>
        </form>
        <form action={createWeek.bind(null, nextSeason, nextWeek)}>
          <button
            type="submit"
            className="rounded-[10px] font-body font-bold text-[13px] uppercase cursor-pointer"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.18)", color: "#c9c4bb", padding: "12px 16px", letterSpacing: ".04em" }}
          >
            + New week (S{nextSeason} W{nextWeek})
          </button>
        </form>
        <a
          href="/admin/export"
          className="rounded-[10px] font-body font-bold text-[13px] uppercase inline-flex items-center"
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.18)", color: "#c9c4bb", padding: "12px 16px", letterSpacing: ".04em" }}
        >
          ⬇ Export CSV
        </a>
      </div>

      <div className="px-5">
        <div className="font-body font-bold text-[11px] uppercase mb-2" style={{ letterSpacing: ".2em", color: "#6b6862" }}>
          All Weeks
        </div>
        {weeks.length === 0 ? (
          <div className="font-serif italic text-[16px] py-6" style={{ color: "#8a8578" }}>
            No weeks yet. Duplicate last week or create a new one to start.
          </div>
        ) : (
          <div className="pb-10">
            {weeks.map((w) => (
              <Link
                key={w.id}
                href={`/admin/week/${w.id}`}
                className="flex items-center gap-3 py-3"
                style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
              >
                <div className="font-display font-extrabold text-[26px] text-white" style={{ width: 44 }}>
                  {w.weekNumber}
                </div>
                <div className="flex-1">
                  <div className="font-body font-bold text-[15px] text-white">
                    Season {w.season} · Week {w.weekNumber}
                  </div>
                  <div className="font-body font-medium text-[11px] uppercase" style={{ letterSpacing: ".06em", color: "#6b6862" }}>
                    {w.publishedAt ? "Published" : "Draft"}
                  </div>
                </div>
                <span
                  className="font-body font-bold text-[10px] uppercase rounded-full"
                  style={{
                    padding: "4px 10px",
                    letterSpacing: ".08em",
                    color: w.status === "published" ? "#3fb950" : "#c9a227",
                    background: w.status === "published" ? "rgba(63,185,80,.12)" : "rgba(201,162,39,.12)",
                  }}
                >
                  {w.status}
                </span>
                <span className="font-body text-[16px]" style={{ color: "#4a4842" }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
