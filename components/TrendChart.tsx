"use client";

import { useMemo, useState } from "react";
import type { TrendPoint } from "@/lib/types";

type Range = 3 | 14 | 99;

/**
 * Inline-SVG ranking trend chart with a Last 3 / Season / All Time toggle.
 * Ported from the design's drawChart(): viewBox 440×150, rank 1 at top.
 */
export function TrendChart({ history }: { history: TrendPoint[] }) {
  const [range, setRange] = useState<Range>(14);

  const data = useMemo(() => {
    const ranks = history.map((h) => h.rank);
    const startWkNum = history.length ? history[0].weekNumber : 1;
    const sliced = range >= 99 ? ranks : ranks.slice(Math.max(0, ranks.length - range));
    const startWk = startWkNum + (ranks.length - sliced.length);
    return { sliced, startWk };
  }, [history, range]);

  const svg = useMemo(() => buildSvg(data.sliced, data.startWk), [data]);

  const segs: Array<{ label: string; value: Range }> = [
    { label: "Last 3", value: 3 },
    { label: "Season", value: 14 },
    { label: "All Time", value: 99 },
  ];

  return (
    <div className="px-5 py-5">
      <div className="flex items-center justify-between">
        <div
          className="font-body font-bold text-[12px] uppercase"
          style={{ letterSpacing: ".2em", color: "#6b6862" }}
        >
          Ranking Trend
        </div>
        <div
          className="flex rounded-[10px]"
          style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.09)", padding: 3 }}
        >
          {segs.map((s) => {
            const active = s.value === range;
            return (
              <button
                key={s.value}
                onClick={() => setRange(s.value)}
                className="font-body font-bold text-[10px] uppercase rounded-[7px] cursor-pointer"
                style={{
                  letterSpacing: ".06em",
                  padding: "7px 10px",
                  background: active ? "#e8462f" : "transparent",
                  color: active ? "#fff" : "#8a8578",
                  border: "none",
                  transition: "background .18s ease, color .18s ease",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-4 rounded-[16px]"
        style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.07)", padding: "18px 14px 10px" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div
        className="flex items-center gap-4 mt-3 font-body font-semibold text-[10px] uppercase"
        style={{ letterSpacing: ".06em", color: "#6b6862" }}
      >
        <span className="inline-flex items-center gap-[6px]">
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a227" }} />
          Weeks at No.1
        </span>
        <span className="inline-flex items-center gap-[6px]">
          <span style={{ width: 10, height: 3, borderRadius: 2, background: "#e8462f" }} />
          Weekly rank
        </span>
      </div>
    </div>
  );
}

function buildSvg(data: number[], startWk: number): string {
  if (!data.length) {
    return `<div style="text-align:center;color:#4a4842;font-family:Barlow;font-size:12px;padding:40px 0;">No ranking history yet.</div>`;
  }
  const W = 440,
    H = 150,
    padL = 30,
    padR = 12,
    padT = 14,
    padB = 24;
  const n = data.length;
  const x = (i: number) => padL + (n === 1 ? 0 : (i * (W - padL - padR)) / (n - 1));
  const y = (r: number) => padT + ((r - 1) * (H - padT - padB)) / 9;

  let line = "";
  data.forEach((r, i) => {
    line += (i ? "L" : "M") + x(i).toFixed(1) + " " + y(r).toFixed(1) + " ";
  });
  const area = line + `L${x(n - 1).toFixed(1)} ${H - padB} L${x(0).toFixed(1)} ${H - padB} Z`;

  let grid = "";
  [1, 4, 7, 10].forEach((r) => {
    grid += `<line x1="${padL}" y1="${y(r)}" x2="${W - padR}" y2="${y(r)}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>`;
    grid += `<text x="${padL - 8}" y="${y(r) + 4}" text-anchor="end" fill="#4a4842" font-family="Barlow" font-size="10" font-weight="600">#${r}</text>`;
  });

  let dots = "",
    labels = "";
  data.forEach((r, i) => {
    const gold = r === 1;
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(r).toFixed(1)}" r="${gold ? 5 : 3.5}" fill="${gold ? "#c9a227" : "#e8462f"}" stroke="#100f12" stroke-width="2"/>`;
    if (n <= 8 || i % 2 === 0 || i === n - 1)
      labels += `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" fill="#6b6862" font-family="Barlow" font-size="9" font-weight="600">W${startWk + i}</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block;">
    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8462f" stop-opacity=".28"/><stop offset="1" stop-color="#e8462f" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path d="${area}" fill="url(#ag)"/>
    <path d="${line}" fill="none" stroke="#e8462f" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${labels}
  </svg>`;
}
