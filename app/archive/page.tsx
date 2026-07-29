import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { getArchive, archiveStats } from "@/lib/data";
import { TEAM_BY_CODE } from "@/lib/reference";
import { X_URL, listName } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "The Archive",
  description: "Every list I've published, still up. No quiet edits.",
  alternates: { canonical: "/archive" },
};

function nickname(teamCode: string): string {
  const full = TEAM_BY_CODE[teamCode]?.name ?? teamCode;
  return full.split(" ").pop() ?? full;
}

export default async function ArchivePage() {
  const entries = await getArchive();
  const stats = archiveStats(entries);

  return (
    <div className="app-shell">
      <Nav active="archive" />

      <div style={{ padding: "26px 20px 24px", background: "radial-gradient(130% 70% at 80% 0%,#2a1a5c 0%,#0b0a0c 58%)" }}>
        <div className="font-serif italic text-[17px]" style={{ color: "#e8462f" }}>
          The World Renowned List
        </div>
        <h1
          className="font-display font-extrabold text-[46px] uppercase text-white mt-1"
          style={{ lineHeight: 0.88 }}
        >
          The Archive
        </h1>
        <div className="font-body text-[15px] mt-[10px]" style={{ color: "#b8b2a8", lineHeight: 1.45, maxWidth: 340 }}>
          Every list I&apos;ve published, still up. Tap one to see the full ten and how badly it
          aged.
        </div>

        <div className="flex gap-[10px] mt-5">
          {[
            { v: String(stats.weeksRanked), l: "Lists Kept", c: "#c9a227", small: false },
            { v: stats.since || "—", l: "Since", c: "#fff", small: true },
            { v: String(stats.distinctNo1), l: "No.1 QBs", c: "#e8462f", small: false },
          ].map((s) => (
            <div
              key={s.l}
              className="flex-1 rounded-[14px] flex flex-col justify-between"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", padding: 14 }}
            >
              {/* "Since" holds a date, not a numeral, so it needs its own size
                  to sit on one line in a third of a phone screen. */}
              <div
                className={`font-display font-extrabold ${s.small ? "text-[21px]" : "text-[40px]"}`}
                style={{ color: s.c, lineHeight: 0.9, paddingTop: s.small ? 12 : 0 }}
              >
                {s.v}
              </div>
              <div
                className="font-body font-semibold text-[10px] uppercase mt-1"
                style={{ letterSpacing: ".12em", color: "#8a8578" }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center gap-2 overflow-hidden"
        style={{
          padding: "14px 20px",
          background: "#100f12",
          borderTop: "1px solid rgba(255,255,255,.07)",
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <span
          className="font-body font-bold text-[10px] uppercase whitespace-nowrap"
          style={{ letterSpacing: ".16em", color: "#c9a227" }}
        >
          ● The complete record
        </span>
        <div className="flex gap-[3px] flex-1">
          {Array.from({ length: Math.max(stats.weeksRanked, 1) }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 8, borderRadius: 2, background: "#e8462f" }} />
          ))}
        </div>
      </div>

      <div>
        {entries.length === 0 ? (
          <div className="px-5 py-12 text-center font-serif italic text-[18px]" style={{ color: "#8a8578" }}>
            First list shows up here.
          </div>
        ) : entries.map((w) => (
          <Link
            key={`${w.season}-${w.weekNumber}`}
            href={`/week/${w.season}/${w.weekNumber}`}
            className="flex items-center gap-[14px]"
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              background: w.isCurrent ? "rgba(232,70,47,.06)" : undefined,
            }}
          >
            {/* The list's name is the headline. The old big week numeral is gone
                for every row, not just labelled ones — "Week 7" already says the
                number, and one row shape beats two. */}
            <span className="self-stretch rounded-[3px]" style={{ width: 4, background: w.no1TeamColor }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-display font-extrabold text-[22px] uppercase text-white"
                  style={{ lineHeight: 1 }}
                >
                  {listName(w)}
                </span>
                {w.isCurrent && (
                  <span
                    className="font-body font-bold text-[8px] uppercase"
                    style={{
                      letterSpacing: ".1em",
                      color: "#e8462f",
                      background: "rgba(232,70,47,.14)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-center gap-[6px] mt-[5px]">
                <span
                  className="font-body font-bold text-[8px] uppercase"
                  style={{ letterSpacing: ".14em", color: "#c9a227" }}
                >
                  No.1
                </span>
                <span className="font-body font-bold text-[15px] text-white">{w.no1Name}</span>
              </div>
              {w.note && (
                <div className="font-serif italic text-[14px] mt-[2px]" style={{ color: "#8a8578" }}>
                  &ldquo;{w.note}&rdquo;
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                className="font-body font-semibold text-[11px] uppercase"
                style={{ letterSpacing: ".04em", color: "#8a8578" }}
              >
                {nickname(w.no1TeamCode)}
              </div>
              <div className="font-body font-medium text-[10px] mt-[2px]" style={{ color: "#4a4842" }}>
                {w.displayDate}
              </div>
              <div
                className="font-body font-bold text-[9px] uppercase mt-[6px]"
                style={{ letterSpacing: ".08em", color: "#c9a227" }}
              >
                View list →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        className="mt-5 px-5 pt-[26px] pb-10 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}
      >
        <div className="font-display font-black text-[20px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
          Your favorite rapper&apos;s favorite top 10 list
        </div>
        <div
          className="flex justify-center gap-[18px] mt-4 font-body font-semibold text-[12px] uppercase"
          style={{ letterSpacing: ".08em", color: "#6b6862" }}
        >
          <Link className="link-accent" href="/">
            The List
          </Link>
          <Link className="link-accent" href="/wrong">
            I Was Wrong
          </Link>
          <a className="link-accent" href={X_URL} target="_blank" rel="noreferrer">
            @top10qb
          </a>
        </div>
      </div>
    </div>
  );
}
