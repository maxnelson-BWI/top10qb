import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getEditableWeek, getPreviousRanks, QB_OPTIONS } from "@/lib/admin-data";
import { WeekEditor } from "@/components/admin/WeekEditor";
import { listName } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function EditWeekPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const week = await getEditableWeek(id);
  if (!week) notFound();

  const prevMap = await getPreviousRanks(week.season, week.weekNumber);
  const prevRanks = Object.fromEntries(prevMap);

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(11,10,12,.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.07)" }}
      >
        <Link href="/admin" className="link-accent font-body font-semibold text-[12px] uppercase" style={{ color: "#8a8578", letterSpacing: ".06em" }}>
          ← Weeks
        </Link>
        <div className="font-body font-bold text-[13px] text-white">
          {listName(week)}{" "}
          <span className="font-medium" style={{ color: "#6b6862" }}>
            · S{week.season} W{week.weekNumber}
          </span>
        </div>
        <div className="w-[60px]" />
      </div>

      <WeekEditor initial={week} qbOptions={QB_OPTIONS} prevRanks={prevRanks} />
    </div>
  );
}
