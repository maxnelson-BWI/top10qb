import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { getCurrentWeek } from "@/lib/data";

export const dynamic = "force-dynamic";

const GRAPHICS = [
  {
    title: "X / social landscape",
    note: "Best for an X post, link preview, or wide image.",
    preview: "/graphics/list?format=landscape",
    download: "/graphics/list?format=landscape&download=1",
    width: 1600,
    height: 900,
  },
  {
    title: "Portrait list",
    note: "Best for Instagram or a taller X image.",
    preview: "/graphics/list?format=portrait",
    download: "/graphics/list?format=portrait&download=1",
    width: 1080,
    height: 1350,
  },
  {
    title: "No.1 quarterback",
    note: "A single-player card built from the current No.1 take.",
    preview: "/graphics/list?kind=qb1",
    download: "/graphics/list?kind=qb1&download=1",
    width: 1080,
    height: 1350,
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
            ? `${week.label || `Week ${week.weekNumber}`} is loaded. Publish a new list and these update automatically.`
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
