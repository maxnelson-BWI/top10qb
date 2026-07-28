"use client";

import { track } from "@vercel/analytics";
import { X_URL, X_HANDLE } from "@/lib/site";

export function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Full-width white Follow button + sub-line. Used on Home and Wrong. */
export function FollowButton({ subline = true }: { subline?: boolean }) {
  return (
    <div className="mt-4 px-5">
      <a
        href={X_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("X Follow Click", { location: "follow_button" })}
        className="btn-follow flex items-center justify-center gap-[10px] rounded-[14px] p-[17px] font-body font-bold text-[15px]"
        style={{ background: "#fff", color: "#0b0a0c", letterSpacing: ".02em" }}
      >
        <XIcon />
        Follow @{X_HANDLE}
      </a>
      {subline && (
        <div
          className="text-center font-body font-medium text-[12px] mt-[10px]"
          style={{ color: "#6b6862" }}
        >
          Argue with the list. That&apos;s the whole point.
        </div>
      )}
    </div>
  );
}
