"use client";

import { useState } from "react";
import Image from "next/image";

export type GraphicShape = {
  key: string;
  title: string;
  tab: string;
  note: string;
  query: string;
  width: number;
  height: number;
  variants: { key: "a" | "b"; label: string }[];
};

/**
 * Shape tabs, then that shape's variants stacked.
 *
 * The flat list this replaced rendered every graphic at once. Each preview is a
 * live ImageResponse render of a full-size PNG, so at eight entries the page was
 * firing eight server renders and pulling ~14MB before it settled. Tabbing keeps
 * it at two no matter how many shapes exist — adding a ninth costs a pill, not
 * another pair of renders.
 *
 * Variants stay stacked rather than side by side because the admin shell is a
 * 480px column; two landscape previews in one row would be too small to judge.
 */
export function GraphicsPicker({ shapes, ready }: { shapes: GraphicShape[]; ready: boolean }) {
  const [activeKey, setActiveKey] = useState(shapes[0]?.key ?? "");
  const shape = shapes.find((s) => s.key === activeKey) ?? shapes[0];
  if (!shape) return null;

  return (
    <div className="px-5 py-6">
      <div className="flex gap-2 flex-wrap">
        {shapes.map((s) => {
          const active = s.key === shape.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveKey(s.key)}
              className="rounded-full font-body font-bold text-[11px] uppercase cursor-pointer"
              style={{
                padding: "9px 14px",
                letterSpacing: ".06em",
                background: active ? "#e8462f" : "transparent",
                border: `1px solid ${active ? "#e8462f" : "rgba(255,255,255,.18)"}`,
                color: active ? "#fff" : "#c9c4bb",
              }}
            >
              {s.tab}
            </button>
          );
        })}
      </div>

      <p className="font-body text-[12px] mt-3" style={{ color: "#8a8578", lineHeight: 1.4 }}>
        {shape.note}
      </p>

      <div className="flex flex-col gap-5 mt-4">
        {shape.variants.map((v) => {
          const src = `/graphics/list?${shape.query}&variant=${v.key}`;
          return (
            <section
              key={v.key}
              className="rounded-[16px] overflow-hidden"
              style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.08)" }}
            >
              {ready && (
                <Image
                  // Keyed by src so switching tabs swaps the image instead of
                  // reusing a stale one from the previous shape.
                  key={src}
                  src={src}
                  alt={`${shape.title}, variant ${v.key.toUpperCase()}`}
                  width={shape.width}
                  height={shape.height}
                  unoptimized
                  className="block w-full h-auto"
                />
              )}
              <div
                className="flex items-center justify-between gap-3"
                style={{ padding: "14px 14px 16px" }}
              >
                <div className="min-w-0">
                  <h2 className="font-body font-bold text-[15px] text-white">
                    Variant {v.key.toUpperCase()}
                  </h2>
                  <p
                    className="font-body text-[12px] mt-[2px]"
                    style={{ color: "#8a8578", lineHeight: 1.35 }}
                  >
                    {v.label}
                  </p>
                </div>
                {ready && (
                  <a
                    href={`${src}&download=1`}
                    className="rounded-[10px] font-body font-bold text-[11px] uppercase text-white"
                    style={{
                      background: "#e8462f",
                      padding: "11px 13px",
                      letterSpacing: ".06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Download
                  </a>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
