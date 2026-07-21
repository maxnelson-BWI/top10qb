import Link from "next/link";
import type { RankedQB } from "@/lib/types";
import { heroMovement } from "@/lib/movement";
import { TAGLINE } from "@/lib/site";
import { firstName } from "@/lib/reference";
import { HeroImage } from "./HeroImage";

/** The #1 QB hero — the homepage's centerpiece. */
export function Hero({
  no1,
  weekNumber,
  label,
  heroImageUrl,
}: {
  no1: RankedQB;
  weekNumber: number;
  label?: string | null;
  heroImageUrl?: string | null;
}) {
  const mv = heroMovement(no1.movement);
  const [first, ...rest] = no1.name.split(" ");
  const last = rest.join(" ");
  const kicker = label ?? `Week ${weekNumber}`;
  // Prefer an explicit per-week override, then the per-QB action shot by slug.
  const imageCandidates = [heroImageUrl, `/actions/${no1.qbSlug}.jpg`].filter(
    (s): s is string => Boolean(s),
  );

  return (
    <div
      className="relative px-5 pb-[26px] overflow-hidden"
      style={{ background: "radial-gradient(135% 75% at 15% 0%,#2a1a5c 0%,#0b0a0c 56%)" }}
    >
      <div
        className="text-center font-serif italic text-[18px]"
        style={{ color: "#e8462f", padding: "16px 0 4px" }}
      >
        {TAGLINE}
      </div>
      <div
        className="text-center font-body font-bold text-[11px] uppercase"
        style={{ letterSpacing: ".26em", color: "#c9a227", marginTop: 16, marginBottom: 2 }}
      >
        {kicker} · The No.1 Quarterback in Football
      </div>

      <HeroImage
        candidates={imageCandidates}
        espnId={no1.espnId}
        name={no1.name}
        accent={no1.teamColor}
      />

      <div
        className="font-display font-extrabold text-[60px] uppercase text-white"
        style={{ lineHeight: 0.82, marginTop: 14 }}
      >
        {first}
        <br />
        {last}
      </div>

      <div className="flex flex-wrap gap-2" style={{ marginTop: 14 }}>
        <div
          className="inline-flex items-center gap-2 rounded-full"
          style={{ background: "rgba(255,255,255,.06)", padding: "7px 13px" }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: no1.teamColor,
              boxShadow: "0 0 0 2px #c9a227",
            }}
          />
          <span
            className="font-body font-semibold text-[11px] uppercase"
            style={{ letterSpacing: ".08em", color: "#c9a227" }}
          >
            {no1.teamName} · QB
          </span>
        </div>
        <div
          className="inline-flex items-center gap-[6px] rounded-full"
          style={{ background: "rgba(63,185,80,.12)", padding: "7px 13px" }}
        >
          <span className="font-body font-bold text-[12px]" style={{ color: mv.color }}>
            {mv.main}
          </span>
          {mv.sub && (
            <span className="font-body font-semibold text-[11px]" style={{ color: "#8a8578" }}>
              {mv.sub}
            </span>
          )}
        </div>
      </div>

      {no1.take && (
        <div
          className="rounded-[16px]"
          style={{
            marginTop: 20,
            padding: 20,
            background: "rgba(255,255,255,.04)",
            borderLeft: "3px solid #e8462f",
          }}
        >
          <div className="font-serif italic text-[23px]" style={{ lineHeight: 1.32, color: "#f4f1ea" }}>
            &ldquo;{no1.take}&rdquo;
          </div>
          <div
            className="font-body font-bold text-[10px] uppercase"
            style={{ letterSpacing: ".16em", color: "#8a8578", marginTop: 14 }}
          >
            — The Rankmaster
          </div>
        </div>
      )}

      <Link
        href={`/player/${no1.qbSlug}`}
        className="inline-flex items-center gap-[6px] mt-3 font-body font-bold text-[10px] uppercase"
        style={{ letterSpacing: ".1em", color: "#c9a227" }}
      >
        View {firstName(no1.name)}&apos;s trend →
      </Link>
    </div>
  );
}
