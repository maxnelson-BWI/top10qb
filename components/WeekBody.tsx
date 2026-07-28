import type { Week } from "@/lib/types";
import { Hero } from "./Hero";
import { RankRow } from "./RankRow";

/** Hero (#1) + ranks 2–10 + Worst QB + Dropped Out. Shared by Home and /week. */
export function WeekBody({ week }: { week: Week }) {
  const no1 = week.ranked.find((r) => r.rank === 1);
  const rest = week.ranked.filter((r) => r.rank >= 2).sort((a, b) => a.rank - b.rank);
  const isOffseason = week.label?.toLowerCase().includes("offseason") ?? false;

  return (
    <>
      {no1 && (
        <Hero
          no1={no1}
          weekNumber={week.weekNumber}
          label={week.label}
          heroImageUrl={week.heroImageUrl}
        />
      )}

      {rest.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between px-5 pt-5 pb-2">
            <h2
              className="font-body font-bold text-[12px] uppercase"
              style={{ letterSpacing: ".2em", color: "#6b6862" }}
            >
              The Rest of the List
            </h2>
            <div
              className="font-body font-medium text-[11px] uppercase"
              style={{ letterSpacing: ".06em", color: "#4a4842" }}
            >
              Tap a name for the take
            </div>
          </div>
          <div>
            {rest.map((qb) => (
              <RankRow key={qb.rank} qb={qb} />
            ))}
          </div>
        </div>
      )}

      {week.worst && (
        <div
          className="mt-[22px] mx-5 rounded-[18px]"
          style={{ padding: 22, background: "rgba(232,70,47,.08)", border: "1px solid rgba(232,70,47,.3)" }}
        >
          <div
            className="flex items-center gap-2 font-body font-bold text-[11px] uppercase"
            style={{ letterSpacing: ".14em", color: "#e8462f" }}
          >
            {isOffseason ? "QB I'm Worried About" : "Roughest QB Week"}
          </div>
          <div
            className="font-display font-extrabold text-[42px] uppercase text-white"
            style={{ marginTop: 8, lineHeight: 0.9 }}
          >
            {week.worst.name}
          </div>
          <div className="font-serif italic text-[19px]" style={{ lineHeight: 1.4, color: "#e6ddd0", marginTop: 12 }}>
            &ldquo;{week.worst.take}&rdquo;
          </div>
          <div
            className="font-body font-bold text-[10px] uppercase"
            style={{ letterSpacing: ".16em", color: "#8a5c50", marginTop: 14 }}
          >
            — One guy&apos;s opinion, with love
          </div>
        </div>
      )}

      {week.droppedOut.length > 0 && (
        <div
          className="mt-[22px] mx-5 rounded-[18px]"
          style={{ padding: 20, background: "#100f12", border: "1px solid rgba(255,255,255,.07)" }}
        >
          <div
            className="font-body font-bold text-[11px] uppercase"
            style={{ letterSpacing: ".16em", color: "#6b6862" }}
          >
            Dropped Out This Week
          </div>
          <div className="flex flex-col gap-[2px] mt-3">
            {week.droppedOut.map((d, i) => (
              <div
                key={d.name}
                className="flex items-center gap-3 py-[9px]"
                style={{
                  borderBottom:
                    i < week.droppedOut.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
                }}
              >
                <span className="font-body font-bold text-[16px] flex-1" style={{ color: "#c9c4bb" }}>
                  {d.name}
                </span>
                <span className="font-body font-semibold text-[12px]" style={{ color: "#8a8578" }}>
                  was #{d.previousRank}
                </span>
                <span className="font-body font-bold text-[13px]" style={{ color: "#e8462f" }}>
                  ▼ OUT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
