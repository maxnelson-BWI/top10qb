import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { FollowButton } from "@/components/FollowButton";
import { SHOW_ABOUT } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "About the List",
  description: "What Top10QB ranks, how the list works, and the very limited credentials behind it.",
  alternates: { canonical: "/about" },
};

const RULES = [
  "This is a ranking of who I trust most to play quarterback this Sunday — not a career résumé and not a prediction of who wins MVP.",
  "The numbers are evidence. They are not an automatic answer.",
  "One great game can move a quarterback. One terrible quarter usually cannot.",
  "I will change my mind. When a take ages badly enough, it goes on I Was Wrong.",
];

export default function AboutPage() {
  if (!SHOW_ABOUT) notFound();

  return (
    <div className="app-shell">
      <Nav active="about" />

      <div
        className="relative overflow-hidden"
        style={{
          padding: "34px 20px 30px",
          background: "radial-gradient(130% 70% at 85% 0%,#2a1a5c 0%,#0b0a0c 62%)",
        }}
      >
        <div
          className="font-display font-black absolute"
          style={{
            top: -16,
            right: -8,
            fontSize: 190,
            lineHeight: 0.7,
            color: "rgba(255,255,255,.04)",
            pointerEvents: "none",
          }}
        >
          10
        </div>
        <div className="relative">
          <div
            className="font-body font-bold text-[11px] uppercase"
            style={{ letterSpacing: ".24em", color: "#e8462f" }}
          >
            About the List
          </div>
          <h1
            className="font-display font-extrabold text-[54px] uppercase text-white mt-2"
            style={{ lineHeight: 0.86 }}
          >
            I rank
            <br />
            quarterbacks.
          </h1>
          <div
            className="font-serif italic text-[20px] mt-[16px]"
            style={{ color: "#e6ddd0", lineHeight: 1.36, maxWidth: 360 }}
          >
            That is the whole operation.
          </div>
        </div>
      </div>

      <div style={{ padding: "26px 20px 4px" }}>
        <p className="font-body text-[16px]" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          I&apos;m one person with a television, too many opinions, and no job in football. I do not
          have sources, a proprietary model, or a former scout whispering in my ear.
        </p>
        <p className="font-body text-[16px] mt-3" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          I publish the ten quarterbacks I believe are best right now, explain the parts people
          will yell about, and keep the old lists so nobody has to pretend I always knew what was
          coming.
        </p>
        <p className="font-body text-[16px] mt-3" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          The opinions are sincere. The overly official presentation is the joke. When I&apos;m
          wrong, the receipt belongs on{" "}
          <Link href="/wrong" className="link-accent" style={{ color: "#e8462f", fontWeight: 600 }}>
            I Was Wrong
          </Link>
          .
        </p>
      </div>

      <div style={{ padding: "26px 20px 0" }}>
        <h2
          className="font-body font-bold text-[11px] uppercase"
          style={{ letterSpacing: ".2em", color: "#6b6862" }}
        >
          What the ranking means
        </h2>
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

      <div
        className="mt-[26px] mx-5 rounded-[18px]"
        style={{ padding: 22, background: "rgba(232,70,47,.08)", border: "1px solid rgba(232,70,47,.3)" }}
      >
        <div className="font-body font-bold text-[11px] uppercase" style={{ letterSpacing: ".14em", color: "#e8462f" }}>
          Full Bias Disclosure
        </div>
        <div className="font-serif italic text-[19px] mt-[10px]" style={{ color: "#e6ddd0", lineHeight: 1.4 }}>
          I like aggressive quarterbacks, pocket movement, and throws that make the reasonable
          decision look boring. I am probably too patient with quarterbacks I already believe in.
          You will notice.
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
          One guy. Ten quarterbacks. A completely unnecessary amount of confidence.
        </div>
        <div className="font-body font-medium text-[11px] mt-4" style={{ color: "#3a3630" }}>
          New lists Tuesdays in season. Offseason lists when there is enough to argue about.
        </div>
      </div>
    </div>
  );
}
