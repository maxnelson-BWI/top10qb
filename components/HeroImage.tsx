"use client";

import { useState } from "react";
import { QBHeadshot } from "./QBHeadshot";

/**
 * The #1 hero image. Tries each candidate URL in order (a per-week override,
 * then the per-QB action shot at /actions/{slug}.jpg); if none load, falls back
 * to the standard numeral + headshot card. So dropping /actions/{slug}.jpg into
 * public/ is all it takes to give a new #1 their action shot.
 */
export function HeroImage({
  candidates,
  espnId,
  name,
  accent,
}: {
  candidates: string[];
  espnId: number;
  name: string;
  accent: string;
}) {
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];

  if (!src) {
    return (
      <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
        <div
          className="font-display font-extrabold text-[168px]"
          style={{ lineHeight: 0.62, color: "#e8462f", letterSpacing: "-.05em" }}
        >
          1
        </div>
        <div className="flex-1">
          <QBHeadshot espnId={espnId} name={name} height={150} bg={accent} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="stripe relative w-full overflow-hidden rounded-[16px]"
      style={{ marginTop: 8, height: 300, background: accent, boxShadow: `0 26px 60px -24px ${accent}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        onError={() => setIdx((i) => i + 1)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(11,10,12,0) 40%, rgba(11,10,12,.85) 100%)" }}
      />
      <div
        className="absolute font-display font-black"
        style={{
          left: 6,
          bottom: -18,
          fontSize: 150,
          lineHeight: 0.7,
          color: "#e8462f",
          letterSpacing: "-.05em",
          textShadow: "0 6px 24px rgba(0,0,0,.6)",
        }}
      >
        1
      </div>
      <div className="absolute left-0 bottom-0 w-full" style={{ height: 5, background: "#c9a227" }} />
    </div>
  );
}
