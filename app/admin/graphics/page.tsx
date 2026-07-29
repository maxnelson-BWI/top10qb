import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { getCurrentWeek } from "@/lib/data";
import { listName } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Every shape ships in two variants so the weekly post can alternate rather
 * than looking identical every time. A and B differ in layout *and* in the
 * standing copy (see lib/graphics-copy.ts) — they're two designs, not one
 * design with a colour swap.
 */
const SHAPES = [
  {
    title: "X / social landscape",
    query: "format=landscape",
    variants: { a: "Left rail, cards.", b: "Banner header, editorial rules." },
    width: 1600,
    height: 900,
  },
  {
    title: "Portrait list",
    query: "format=portrait",
    variants: { a: "Cards.", b: "Editorial rules." },
    width: 1080,
    height: 1350,
  },
  {
    title: "Square list",
    query: "format=square",
    variants: { a: "Cards, two columns.", b: "Editorial rules, two columns." },
    width: 1200,
    height: 1200,
  },
  {
    title: "No.1 quarterback",
    query: "kind=qb1",
    variants: { a: "Name first, quote anchored low.", b: "Quote first, name as the payoff." },
    width: 1080,
    height: 1350,
  },
] as const;

const GRAPHICS = SHAPES.flatMap((shape) =>
  (["a", "b"] as const).map((variant) => ({
    title: `${shape.title} — ${variant.toUpperCase()}`,
    note: shape.variants[variant],
    preview: `/graphics/list?${shape.query}&variant=${variant}`,
    download: `/graphics/list?${shape.query}&variant=${variant}&download=1`,
    width: shape.width,
    height: shape.height,
  })),
);

export default async function AdminGraphicsPage() {
  await requireAdmin();
  const week = await getCurrentWeek();

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
        style={{
          background: "rgba(11,10,12,.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <Link
          href="/admin"
          className="link-accent font-body font-semibold text-[12px] uppercase"
          style={{ color: "#8a8578", letterSpacing: ".06em" }}
        >
          ← Admin
        </Link>
        <div className="font-body font-bold text-[13px] text-white">Graphics</div>
        <div className="w-[60px]" />
      </div>

      <div className="px-5 pt-6">
        <div
          className="font-body font-bold text-[10px] uppercase"
          style={{ color: "#e8462f", letterSpacing: ".2em" }}
        >
          Built from the live list
        </div>
        <h1
          className="font-display font-extrabold text-[42px] uppercase text-white mt-1"
          style={{ lineHeight: 0.9 }}
        >
          Download the weekly graphics
        </h1>
        <p className="font-body text-[14px] mt-3" style={{ color: "#a9a39a", lineHeight: 1.45 }}>
          {week
            ? `${listName(week)} is loaded. Publish a new list and these update automatically.`
            : "Publish a list first, then the graphics will appear here."}
        </p>
      </div>

      <div className="flex flex-col gap-6 px-5 py-6">
        {GRAPHICS.map((graphic) => (
          <section
            key={graphic.title}
            className="rounded-[16px] overflow-hidden"
            style={{ background: "#100f12", border: "1px solid rgba(255,255,255,.08)" }}
          >
            {week && (
              <Image
                src={graphic.preview}
                alt={`Preview of ${graphic.title}`}
                width={graphic.width}
                height={graphic.height}
                unoptimized
                className="block w-full h-auto"
              />
            )}
            <div className="flex items-center justify-between gap-4" style={{ padding: "16px 16px 18px" }}>
              <div>
                <h2 className="font-body font-bold text-[16px] text-white">{graphic.title}</h2>
                <p className="font-body text-[12px] mt-1" style={{ color: "#8a8578", lineHeight: 1.35 }}>
                  {graphic.note}
                </p>
              </div>
              {week && (
                <a
                  href={graphic.download}
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
        ))}
      </div>
    </div>
  );
}
