import Link from "next/link";
import { Nav } from "@/components/Nav";
import { XIcon } from "@/components/FollowButton";
import { getWrongEntries } from "@/lib/data";
import { X_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function WrongPage() {
  const entries = await getWrongEntries();

  return (
    <div className="app-shell">
      <Nav active="wrong" />

      {/* Header */}
      <div style={{ padding: "30px 20px 26px", background: "radial-gradient(130% 70% at 20% 0%,#3a0f0a 0%,#0b0a0c 62%)" }}>
        <div
          className="font-body font-bold text-[11px] uppercase"
          style={{ letterSpacing: ".24em", color: "#e8462f" }}
        >
          The Accountability Desk
        </div>
        <div
          className="font-display font-extrabold text-[62px] uppercase text-white mt-2"
          style={{ lineHeight: 0.82 }}
        >
          Rankmaster
          <br />
          Was Wrong
        </div>
        <div className="font-serif italic text-[20px] mt-4" style={{ color: "#e6ddd0", lineHeight: 1.36, maxWidth: 360 }}>
          &ldquo;A self-appointed authority with the humility to admit it — occasionally, and only when
          the tape is truly undeniable.&rdquo;
        </div>

        {entries.length > 0 && (
          <div className="flex gap-[10px] mt-[22px]">
            {[
              { v: String(entries.length), l: "Bad Calls", vc: "#e8462f", lc: "#c9a89f", bg: "rgba(232,70,47,.1)", bd: "rgba(232,70,47,.3)" },
              { v: "2", l: "All-Timers", vc: "#fff", lc: "#8a8578", bg: "rgba(255,255,255,.05)", bd: "rgba(255,255,255,.09)" },
              { v: "89%", l: "Still Right", vc: "#c9a227", lc: "#c9b98a", bg: "rgba(201,162,39,.1)", bd: "rgba(201,162,39,.3)" },
            ].map((s) => (
              <div
                key={s.l}
                className="flex-1 text-center rounded-[14px]"
                style={{ background: s.bg, border: `1px solid ${s.bd}`, padding: "14px 8px" }}
              >
                <div className="font-display font-extrabold text-[42px]" style={{ color: s.vc, lineHeight: 0.9 }}>
                  {s.v}
                </div>
                <div
                  className="font-body font-semibold text-[9px] uppercase mt-1"
                  style={{ letterSpacing: ".1em", color: s.lc }}
                >
                  {s.l}
                </div>
              </div>
            ))}
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
              Nothing here.
              <br />
              Yet.
            </div>
            <div className="font-serif italic text-[18px] mt-4" style={{ color: "#8a8578", lineHeight: 1.4 }}>
              &ldquo;The Rankmaster has not yet been wrong. Check back after he inevitably blows one.&rdquo;
            </div>
          </div>
        </div>
      ) : (
      <>
      {/* Header end */}

      <div className="flex items-center gap-2" style={{ padding: "16px 20px 8px" }}>
        <div
          className="font-body font-bold text-[12px] uppercase"
          style={{ letterSpacing: ".18em", color: "#6b6862" }}
        >
          The Hall of Shame · 2024
        </div>
      </div>

      {/* Entries */}
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

      {/* Share CTA */}
      <div
        className="mt-[26px] mx-5 rounded-[20px] relative overflow-hidden"
        style={{ padding: "24px 22px", background: "linear-gradient(150deg,#e8462f 0%,#a8281a 90%)" }}
      >
        <div className="font-display font-extrabold text-[30px] uppercase text-white" style={{ lineHeight: 0.94 }}>
          Screenshot it.
          <br />
          Send it. Gloat.
        </div>
        <div className="font-body text-[14px] mt-2" style={{ color: "#ffe4dd", lineHeight: 1.4, maxWidth: 300 }}>
          Every bad take, immortalized. Because a ranking you can&apos;t hold accountable isn&apos;t a
          ranking — it&apos;s a horoscope.
        </div>
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-follow inline-flex items-center gap-2 mt-4 rounded-[12px] font-body font-bold text-[14px] text-white"
          style={{ background: "#0b0a0c", padding: "14px 20px", letterSpacing: ".02em" }}
        >
          <XIcon size={16} />
          Follow the reckoning
        </a>
      </div>
      </>
      )}

      {/* Footer */}
      <div className="mt-[30px] px-5 pt-[26px] pb-10 text-center" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div className="font-display font-black text-[20px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
          Wrong sometimes. Boring never.
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
