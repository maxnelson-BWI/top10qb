import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { FollowButton } from "@/components/FollowButton";
import { SHOW_ABOUT } from "@/lib/site";

export const revalidate = 3600;

const RULES = [
  "The list drops every Tuesday in season. Periodically in the offseason, when the spirit moves me.",
  "The eye test matters. Numbers support the argument; they don't win it.",
  "Gunslingers over checkdown merchants. Every time.",
  "I am not an advanced-analytics guy. I know what EPA is. I choose peace.",
  "I'm allowed to change my mind on a QB. It just doesn't happen very often.",
];

export default function AboutPage() {
  if (!SHOW_ABOUT) notFound();

  return (
    <div className="app-shell">
      <Nav active="about" />

      {/* Hero with faint RM watermark */}
      <div
        className="relative overflow-hidden"
        style={{ padding: "30px 20px 28px", background: "radial-gradient(130% 70% at 85% 0%,#2a1a5c 0%,#0b0a0c 62%)" }}
      >
        <div
          className="font-display font-black absolute"
          style={{ top: -16, right: -8, fontSize: 190, lineHeight: 0.7, color: "rgba(255,255,255,.04)", pointerEvents: "none" }}
        >
          RM
        </div>
        <div className="relative">
          <div
            className="font-body font-bold text-[11px] uppercase"
            style={{ letterSpacing: ".24em", color: "#e8462f" }}
          >
            The Man Behind the List
          </div>
          <div className="font-display font-extrabold text-[60px] uppercase text-white mt-2" style={{ lineHeight: 0.84 }}>
            The
            <br />
            Rankmaster
          </div>
          <div className="font-serif italic text-[20px] mt-[14px]" style={{ color: "#e6ddd0", lineHeight: 1.36, maxWidth: 340 }}>
            &ldquo;It&apos;s not glamorous work, producing the World Renowned List. But somebody has to
            do it.&rdquo;
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: "24px 20px 6px" }}>
        <div
          className="stripe relative overflow-hidden"
          style={{
            width: 130,
            height: 150,
            borderRadius: 14,
            background: "#161318",
            float: "left",
            margin: "0 16px 8px 0",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center font-body font-medium text-[9px] text-center"
            style={{ color: "rgba(255,255,255,.4)", padding: 8 }}
          >
            HOODED FIGURE PHOTO
          </div>
        </div>
        <p className="font-body text-[16px]" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          I&apos;ve never played football. Never worked in football. I have no insider sources, no
          film-room access, and no one on speed dial.
        </p>
        <p className="font-body text-[16px] mt-3" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          What I do have: opinions, a television, and an eye test that has never once let me down —
          except for the seven times it did, which are documented in full over on{" "}
          <Link href="/wrong" className="link-accent" style={{ color: "#e8462f", fontWeight: 600 }}>
            I Was Wrong
          </Link>
          .
        </p>
        <div style={{ clear: "both" }} />
      </div>

      {/* Credentials */}
      <div style={{ padding: "20px 20px 0" }}>
        <div className="font-body font-bold text-[11px] uppercase" style={{ letterSpacing: ".2em", color: "#6b6862" }}>
          Credentials
        </div>
        <div className="flex gap-[10px] mt-3">
          {[
            { v: "0", l: "Years Played", c: "#fff", big: true },
            { v: "A LOT", l: "Games Watched", c: "#c9a227", big: false },
            { v: "89%", l: "Hit Rate", c: "#3fb950", big: false },
          ].map((s) => (
            <div
              key={s.l}
              className="flex-1 text-center rounded-[14px]"
              style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.08)", padding: "16px 6px" }}
            >
              <div
                className="font-display font-extrabold"
                style={{ color: s.c, fontSize: s.big ? 34 : 20, lineHeight: s.big ? 0.9 : 1, padding: s.big ? 0 : "7px 0" }}
              >
                {s.v}
              </div>
              <div
                className="font-body font-semibold text-[8px] uppercase mt-[5px]"
                style={{ letterSpacing: ".1em", color: "#8a8578" }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* House Rules */}
      <div style={{ padding: "26px 20px 0" }}>
        <div className="font-body font-bold text-[11px] uppercase" style={{ letterSpacing: ".2em", color: "#6b6862" }}>
          The House Rules
        </div>
        <div className="mt-2">
          {RULES.map((r, i) => (
            <div
              key={i}
              className="flex gap-4"
              style={{ padding: "14px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}
            >
              <div
                className="font-display font-extrabold text-[26px]"
                style={{ color: "#e8462f", width: 34, flexShrink: 0, lineHeight: 1 }}
              >
                0{i + 1}
              </div>
              <div className="font-body text-[15px] flex-1" style={{ color: "#c9c4bb", lineHeight: 1.45 }}>
                {r}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bias disclosure */}
      <div
        className="mt-[26px] mx-5 rounded-[18px]"
        style={{ padding: 22, background: "rgba(232,70,47,.08)", border: "1px solid rgba(232,70,47,.3)" }}
      >
        <div className="font-body font-bold text-[11px] uppercase" style={{ letterSpacing: ".14em", color: "#e8462f" }}>
          Full Bias Disclosure
        </div>
        <div className="font-serif italic text-[19px] mt-[10px]" style={{ color: "#e6ddd0", lineHeight: 1.4 }}>
          &ldquo;I am openly, unapologetically higher on the Ravens and 49ers than a neutral party
          would be. This is not a bug. You knew what this was when you clicked.&rdquo;
        </div>
      </div>

      <div className="mt-[22px]">
        <FollowButton subline={false} />
      </div>

      <div className="mt-[30px] px-5 pt-[26px] pb-10 text-center" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div className="font-display font-black text-[20px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
          My list. My biases. Your problem.
        </div>
        <div className="font-body font-medium text-[11px] mt-4" style={{ color: "#3a3630" }}>
          © The Rankmaster. Biased since Week 1. No refunds.
        </div>
      </div>
    </div>
  );
}
