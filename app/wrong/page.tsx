import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { XIcon } from "@/components/FollowButton";
import { getWrongEntries } from "@/lib/data";
import { X_URL } from "@/lib/site";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "I Was Wrong",
  description: "The Top10QB accountability page: old quarterback takes revisited in public.",
  alternates: { canonical: "/wrong" },
};

export default async function WrongPage() {
  const entries = await getWrongEntries();

  return (
    <div className="app-shell">
      <Nav active="wrong" />

      <div style={{ padding: "30px 20px 26px", background: "radial-gradient(130% 70% at 20% 0%,#3a0f0a 0%,#0b0a0c 62%)" }}>
        <div
          className="font-body font-bold text-[11px] uppercase"
          style={{ letterSpacing: ".24em", color: "#e8462f" }}
        >
          Public Accountability
        </div>
        <h1
          className="font-display font-extrabold text-[62px] uppercase text-white mt-2"
          style={{ lineHeight: 0.82 }}
        >
          I Was
          <br />Wrong
        </h1>
        <div className="font-serif italic text-[20px] mt-4" style={{ color: "#e6ddd0", lineHeight: 1.36, maxWidth: 360 }}>
          &ldquo;If I make the list in public, I should take the losses in public too.&rdquo;
        </div>

        {entries.length > 0 && (
          <div
            className="inline-flex items-baseline gap-3 mt-[22px] rounded-[14px]"
            style={{ background: "rgba(232,70,47,.1)", border: "1px solid rgba(232,70,47,.3)", padding: "12px 16px" }}
          >
            <div className="font-display font-extrabold text-[42px]" style={{ color: "#e8462f", lineHeight: 0.9 }}>
              {entries.length}
            </div>
            <div className="font-body font-semibold text-[10px] uppercase" style={{ letterSpacing: ".12em", color: "#c9a89f" }}>
              calls revisited
            </div>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="px-5 py-10">
          <div
            className="rounded-[18px] text-center"
            style={{ padding: "36px 24px", background: "#100f12", border: "1px dashed rgba(255,255,255,.14)" }}
          >
            <div className="font-display font-extrabold text-[34px] uppercase text-white" style={{ lineHeight: 0.9 }}>
              No entries yet.
            </div>
            <div className="font-serif italic text-[18px] mt-4" style={{ color: "#8a8578", lineHeight: 1.4 }}>
              That is a data-entry problem, not proof I have never been wrong. The first real miss
              goes here.
            </div>
          </div>
        </div>
      ) : (
      <>
      <div className="flex items-center gap-2" style={{ padding: "16px 20px 8px" }}>
        <div
          className="font-body font-bold text-[12px] uppercase"
          style={{ letterSpacing: ".18em", color: "#6b6862" }}
        >
          The Receipts
        </div>
      </div>

      <div className="flex flex-col gap-[14px]" style={{ padding: "6px 20px 0" }}>
        {entries.map((c) => (
          <div
            key={c.id}
            className="rounded-[16px] overflow-hidden"
            style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.08)" }}
          >
            <div className="flex items-stretch">
              <div
                className="flex flex-col items-center justify-center"
                style={{ width: 64, flexShrink: 0, background: "rgba(232,70,47,.12)", borderRight: "1px solid rgba(232,70,47,.2)" }}
              >
                <div className="font-display font-extrabold text-[44px]" style={{ color: "#e8462f", lineHeight: 0.8 }}>
                  {c.grade}
                </div>
                <div
                  className="font-body font-semibold text-[8px] uppercase mt-[3px]"
                  style={{ letterSpacing: ".08em", color: "#a8685c" }}
                >
                  {c.weekRef}
                </div>
              </div>
              <div className="flex-1 min-w-0" style={{ padding: "16px 16px 18px" }}>
                <div
                  className="font-body font-semibold text-[9px] uppercase"
                  style={{ letterSpacing: ".14em", color: "#e8462f" }}
                >
                  The Take
                </div>
                <div className="font-serif italic text-[18px] mt-1" style={{ color: "#f4f1ea", lineHeight: 1.34 }}>
                  &ldquo;{c.take}&rdquo;
                </div>
                <div
                  className="font-body font-semibold text-[9px] uppercase mt-[14px]"
                  style={{ letterSpacing: ".14em", color: "#3fb950" }}
                >
                  What Actually Happened
                </div>
                <div className="font-body font-medium text-[14px] mt-[3px]" style={{ color: "#c9c4bb", lineHeight: 1.4 }}>
                  {c.whatHappened}
                </div>
                <div
                  className="font-body font-medium text-[13px]"
                  style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(255,255,255,.12)", color: "#8a8578", lineHeight: 1.4 }}
                >
                  <span style={{ color: "#c9a227", fontWeight: 700 }}>Verdict:</span> {c.verdict}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-[26px] mx-5 rounded-[20px] relative overflow-hidden"
        style={{ padding: "24px 22px", background: "linear-gradient(150deg,#e8462f 0%,#a8281a 90%)" }}
      >
        <div className="font-display font-extrabold text-[30px] uppercase text-white" style={{ lineHeight: 0.94 }}>
          Think I missed one?
          <br />Send the receipt.
        </div>
        <div className="font-body text-[14px] mt-2" style={{ color: "#ffe4dd", lineHeight: 1.4, maxWidth: 300 }}>
          The point is not to never be wrong. The point is to make an actual call and come back to it.
        </div>
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-follow inline-flex items-center gap-2 mt-4 rounded-[12px] font-body font-bold text-[14px] text-white"
          style={{ background: "#0b0a0c", padding: "14px 20px", letterSpacing: ".02em" }}
        >
          <XIcon size={16} />
          Make your case
        </a>
      </div>
      </>
      )}

      <div className="mt-[30px] px-5 pt-[26px] pb-10 text-center" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div className="font-display font-black text-[20px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
          Wrong sometimes. Still ranking.
        </div>
        <div
          className="flex justify-center gap-[18px] mt-4 font-body font-semibold text-[12px] uppercase"
          style={{ letterSpacing: ".08em", color: "#6b6862" }}
        >
          <Link className="link-accent" href="/">
            The List
          </Link>
          <Link className="link-accent" href="/archive">
            Archive
          </Link>
          <a className="link-accent" href={X_URL} target="_blank" rel="noreferrer">
            @top10qb
          </a>
        </div>
      </div>
    </div>
  );
}
