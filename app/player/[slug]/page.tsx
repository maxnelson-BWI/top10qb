import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { QBHeadshot } from "@/components/QBHeadshot";
import { XIcon } from "@/components/FollowButton";
import { getPlayer } from "@/lib/data";
import { X_URL } from "@/lib/site";

export const revalidate = 3600;

type PlayerPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);
  if (!player) return {};

  return {
    title: `${player.name} Ranking History`,
    description: `${player.name}'s week-by-week position on the Top10QB list.`,
    alternates: { canonical: `/player/${slug}` },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;
  const player = await getPlayer(slug);
  if (!player) notFound();

  const ranks = player.history.map((h) => h.rank);
  const current = ranks.length ? ranks[ranks.length - 1] : null;
  const highest = ranks.length ? Math.min(...ranks) : null;
  const lowest = ranks.length ? Math.max(...ranks) : null;
  const [first, ...rest] = player.name.split(" ");

  return (
    <div className="app-shell">
      <Nav active="list" />

      <Link
        href="/"
        className="link-accent inline-flex items-center gap-2 font-body font-semibold text-[12px] uppercase"
        style={{ padding: "16px 20px 6px", letterSpacing: ".06em", color: "#8a8578" }}
      >
        ← Back to the list
      </Link>

      {/* Header */}
      <div
        style={{ padding: "6px 20px 22px", background: "radial-gradient(130% 70% at 12% 0%,#2a1a5c 0%,#0b0a0c 60%)" }}
      >
        <div
          className="font-body font-bold text-[11px] uppercase"
          style={{ letterSpacing: ".24em", color: "#e8462f" }}
        >
          Player Profile
        </div>
        <div className="flex items-center gap-4 mt-[14px]">
          <div style={{ width: 128, flexShrink: 0 }}>
            <QBHeadshot espnId={player.espnId} name={player.name} height={128} bg={player.teamColor} />
          </div>
          <div>
            <h1
              className="font-display font-extrabold text-[44px] uppercase text-white"
              style={{ lineHeight: 0.86 }}
            >
              {first}
              <br />
              {rest.join(" ")}
            </h1>
            <div
              className="inline-flex items-center gap-[7px] mt-2 rounded-full"
              style={{ background: "rgba(255,255,255,.06)", padding: "5px 11px" }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: player.teamColor,
                  boxShadow: "0 0 0 2px #c9a227",
                }}
              />
              <span
                className="font-body font-semibold text-[10px] uppercase"
                style={{ letterSpacing: ".08em", color: "#c9a227" }}
              >
                {player.teamName} · QB
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-[10px] mt-5">
          <StatCard value={current ? `#${current}` : "—"} label="Current" tone="neutral" />
          <StatCard value={highest ? `#${highest}` : "—"} label="Highest" tone="green" />
          <StatCard value={lowest ? `#${lowest}` : "—"} label="Lowest" tone="accent" />
        </div>
      </div>

      <TrendChart history={player.history} />

      {/* Week by week (newest first) */}
      <div style={{ padding: "0 20px 8px" }}>
        <div
          className="font-body font-bold text-[12px] uppercase mb-[6px]"
          style={{ letterSpacing: ".2em", color: "#6b6862" }}
        >
          Week by Week
        </div>
        <div>
          {player.history
            .slice()
            .reverse()
            .map((pt, idx, arr) => {
              const prev = arr[idx + 1]; // previous week (older) is next in reversed array
              let move = "—";
              let mc = "#8a8578";
              if (prev) {
                if (pt.rank < prev.rank) {
                  move = `▲ ${prev.rank - pt.rank}`;
                  mc = "#3fb950";
                } else if (pt.rank > prev.rank) {
                  move = `▼ ${pt.rank - prev.rank}`;
                  mc = "#e8462f";
                }
              }
              return (
                <div
                  key={pt.weekNumber}
                  className="flex items-center gap-[14px]"
                  style={{ padding: "13px 0", borderTop: "1px solid rgba(255,255,255,.06)" }}
                >
                  <div
                    className="font-body font-semibold text-[10px] uppercase"
                    style={{ letterSpacing: ".08em", color: "#6b6862", width: 52, flexShrink: 0 }}
                  >
                    Week {pt.weekNumber}
                  </div>
                  <div
                    className="font-display font-extrabold text-[26px]"
                    style={{ color: pt.rank === 1 ? "#c9a227" : "#fff", width: 44 }}
                  >
                    #{pt.rank}
                  </div>
                  <div className="flex-1 font-serif italic text-[14px]" style={{ color: "#8a8578" }}>
                    {pt.note ? `"${pt.note}"` : ""}
                  </div>
                  <div className="font-body font-bold text-[12px]" style={{ color: mc, whiteSpace: "nowrap" }}>
                    {move}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* CTA */}
      <div
        className="mt-4 mx-5 rounded-[18px] flex items-center justify-between gap-[14px] flex-wrap"
        style={{ padding: "20px 22px", background: "#100f12", border: "1px solid rgba(255,255,255,.08)" }}
      >
        <div>
          <div className="font-display font-extrabold text-[22px] uppercase text-white">
            Agree? Disagree?
          </div>
          <div className="font-body font-medium text-[12px]" style={{ color: "#8a8578" }}>
            New rankings every Tuesday.
          </div>
        </div>
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[11px] font-body font-bold text-[13px] text-white"
          style={{ background: "#e8462f", padding: "12px 16px", whiteSpace: "nowrap" }}
        >
          <XIcon size={15} />
          Come argue
        </a>
      </div>

      <div
        className="mt-[30px] px-5 pt-[26px] pb-10 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}
      >
        <div className="font-display font-black text-[20px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
          My list. My biases. Your problem.
        </div>
      </div>
    </div>
  );
}
