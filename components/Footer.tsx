import Link from "next/link";
import { SHOW_ABOUT, X_URL } from "@/lib/site";

export function Footer() {
  return (
    <div
      className="mt-[34px] px-5 pt-[26px] pb-10 text-center"
      style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}
    >
      <div className="font-display font-black text-[20px] text-white">
        TOP<span style={{ color: "#e8462f" }}>10</span>QB
      </div>
      <div className="font-serif italic text-[15px] mt-1" style={{ color: "#8a8578" }}>
        The World Renowned List
      </div>
      <div
        className="flex justify-center gap-[18px] mt-4 font-body font-semibold text-[12px] uppercase"
        style={{ letterSpacing: ".08em", color: "#6b6862" }}
      >
        <Link className="link-accent" href="/archive">
          Archive
        </Link>
        <Link className="link-accent" href="/wrong">
          I Was Wrong
        </Link>
        {SHOW_ABOUT && (
          <Link className="link-accent" href="/about">
            About
          </Link>
        )}
        <a className="link-accent" href={X_URL} target="_blank" rel="noreferrer">
          @top10qb
        </a>
      </div>
      <div className="font-body font-medium text-[11px] mt-[18px]" style={{ color: "#3a3630" }}>
        © The Rankmaster. Biased since Week 1. No refunds.
      </div>
    </div>
  );
}
