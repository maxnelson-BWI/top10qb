import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { FollowButton } from "@/components/FollowButton";
import { SHOW_ABOUT } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "About the List",
  description: "What the list actually means, the four rules, and a full accounting of my credentials (there are none).",
  alternates: { canonical: "/about" },
};

const RULES = [
  "Who I'd want playing QB for me this Sunday. Not fantasy points, not a lifetime achievement award.",
  "Stats are evidence, not the verdict.",
  "One great game can move you. One bad quarter usually can't.",
  "I change my mind. When a take ages badly it goes on I Was Wrong.",
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
            That&apos;s the whole operation.
          </div>
        </div>
      </div>

      <div style={{ padding: "26px 20px 4px" }}>
        <p className="font-body text-[16px]" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          I don&apos;t have sources. I watch the games like you do, I just have way more opinions
          about it.
        </p>
        <p className="font-body text-[16px] mt-3" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          Every week I put ten guys in order, explain the ones people are going to yell about, and
          leave the old lists up. No quietly editing last month once it looks dumb.
        </p>
        <p className="font-body text-[16px] mt-3" style={{ color: "#c9c4bb", lineHeight: 1.55 }}>
          The takes are real. The graphics looking this official is the bit. When I miss, it goes on{" "}
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
          Checkdown merchants bore me even when they&apos;re winning. And I stay loyal to my guys
          about a month longer than I should. You&apos;ll notice.
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
          One guy ranking ten quarterbacks he has never met.
        </div>
        <div className="font-body font-medium text-[11px] mt-4" style={{ color: "#3a3630" }}>
          New lists Tuesdays in season. Offseason lists when there&apos;s something worth arguing about.
        </div>
      </div>
    </div>
  );
}
