"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { RankedQB } from "@/lib/types";
import { movementLabel } from "@/lib/movement";
import { firstName } from "@/lib/reference";

/** A single rank row (2–10). Tap toggles the "take" drawer open/closed. */
export function RankRow({ qb }: { qb: RankedQB }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);
  const mv = movementLabel(qb.movement);

  useEffect(() => {
    setMaxH(open ? (innerRef.current?.scrollHeight ?? 0) : 0);
  }, [open]);

  return (
    <div
      className="row cursor-pointer select-none active:bg-white/[.03]"
      style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center gap-[14px] px-5 py-[15px]">
        <span
          className="self-stretch rounded-[3px]"
          style={{ width: 5, background: qb.teamColor }}
        />
        <span
          className="font-display font-bold text-[32px] text-white"
          style={{ width: 36, lineHeight: 1 }}
        >
          {qb.rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-body font-bold text-[18px] text-white">{qb.name}</div>
          <div
            className="font-body font-medium text-[11px] uppercase"
            style={{ letterSpacing: ".05em", color: "#8a8578" }}
          >
            {qb.teamName}
          </div>
        </div>
        <span
          className="font-body font-bold text-[12px] whitespace-nowrap"
          style={{ color: mv.color }}
        >
          {mv.label}
        </span>
        <span
          className="chev font-body text-[14px]"
          style={{ color: "#4a4842", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </div>
      <div className="take-drawer" data-open={open} style={{ maxHeight: maxH }}>
        <div ref={innerRef} style={{ padding: "0 20px 18px 55px" }}>
          <div
            className="font-serif italic text-[18px]"
            style={{ lineHeight: 1.42, color: qb.take ? "#e6ddd0" : "#6b6862", borderLeft: `2px solid ${qb.teamColor}`, paddingLeft: 14 }}
          >
            {qb.take ? `“${qb.take}”` : "No take logged for this list."}
          </div>
          <Link
            href={`/player/${qb.qbSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-[6px] mt-3 font-body font-bold text-[10px] uppercase"
            style={{ marginLeft: 14, letterSpacing: ".1em", color: "#c9a227" }}
          >
            View {firstName(qb.name)}&apos;s trend →
          </Link>
        </div>
      </div>
    </div>
  );
}
