import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WeekBody } from "@/components/WeekBody";
import { FollowButton } from "@/components/FollowButton";
import { getWeek } from "@/lib/data";

export const revalidate = 3600;

export default async function WeekPage({
  params,
}: {
  params: Promise<{ season: string; week: string }>;
}) {
  const { season, week } = await params;
  const seasonNum = Number(season);
  const weekNum = Number(week);
  if (!Number.isFinite(seasonNum) || !Number.isFinite(weekNum)) notFound();

  const data = await getWeek(seasonNum, weekNum);
  if (!data) notFound();

  return (
    <div className="app-shell">
      <Nav active="archive" />

      <Link
        href="/archive"
        className="link-accent inline-flex items-center gap-2 font-body font-semibold text-[12px] uppercase"
        style={{ padding: "16px 20px 0", letterSpacing: ".06em", color: "#8a8578" }}
      >
        ← Back to the archive
      </Link>

      <WeekBody week={data} />
      <FollowButton />
      <Footer />
    </div>
  );
}
