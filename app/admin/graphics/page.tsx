import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCurrentWeek } from "@/lib/data";
import { listName } from "@/lib/site";
import { GraphicsPicker, type GraphicShape } from "@/components/admin/GraphicsPicker";

export const dynamic = "force-dynamic";

/**
 * Every shape ships in two variants so the weekly post can alternate rather
 * than looking identical every time. A and B differ in layout *and* in the
 * standing copy (see lib/graphics-copy.ts) — they're two designs, not one
 * design with a colour swap.
 *
 * To add a shape later: add an entry here. The picker tabs it in on its own,
 * and the page still only renders two previews at a time.
 */
const SHAPES: GraphicShape[] = [
  {
    key: "landscape",
    title: "X / social landscape",
    tab: "Landscape",
    note: "1600×900. Best for an X post, link preview, or wide image.",
    query: "format=landscape",
    width: 1600,
    height: 900,
    variants: [
      { key: "a", label: "Left rail, cards." },
      { key: "b", label: "Banner header, editorial rules." },
    ],
  },
  {
    key: "portrait",
    title: "Portrait list",
    tab: "Portrait",
    note: "1080×1350. Best for Instagram or a taller X image.",
    query: "format=portrait",
    width: 1080,
    height: 1350,
    variants: [
      { key: "a", label: "Cards." },
      { key: "b", label: "Editorial rules." },
    ],
  },
  {
    key: "square",
    title: "Square list",
    tab: "Square",
    note: "1200×1200. Best for an Instagram grid post.",
    query: "format=square",
    width: 1200,
    height: 1200,
    variants: [
      { key: "a", label: "Cards, two columns." },
      { key: "b", label: "Editorial rules, two columns." },
    ],
  },
  {
    key: "qb1",
    title: "No.1 quarterback",
    tab: "No.1 QB",
    note: "1080×1350. A single-player card built from the current No.1 take.",
    query: "kind=qb1",
    width: 1080,
    height: 1350,
    variants: [
      { key: "a", label: "Name first, quote anchored low." },
      { key: "b", label: "Quote first, name as the payoff." },
    ],
  },
];

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

      <GraphicsPicker shapes={SHAPES} ready={Boolean(week)} />

    </div>
  );
}
