import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WeekBody } from "@/components/WeekBody";
import { FollowButton } from "@/components/FollowButton";
import { getWeek } from "@/lib/data";

export const revalidate = 3600;

type WeekPageProps = {
  params: Promise<{ season: string; week: string }>;
};

export async function generateMetadata({ params }: WeekPageProps): Promise<Metadata> {
  const { season, week } = await params;
  const seasonNum = Number(season);
  const weekNum = Number(week);
  if (!Number.isFinite(seasonNum) || !Number.isFinite(weekNum)) return {};

  const data = await getWeek(seasonNum, weekNum);
  if (!data) return {};

  const listName = data.label || `Week ${data.weekNumber}`;
  const no1 = data.ranked.find((qb) => qb.rank === 1);
  const description = no1
    ? `${no1.name} is No.1 on the ${listName} Top10QB ranking. See the full list and every take.`
    : `The full ${listName} Top10QB ranking.`;
  const image = `/graphics/list?format=landscape&season=${data.season}&week=${data.weekNumber}`;

  return {
    title: `${listName} QB Rankings`,
    description,
    alternates: { canonical: `/week/${data.season}/${data.weekNumber}` },
    openGraph: {
      title: `${listName} QB Rankings — Top10QB`,
      description,
      type: "article",
      images: [{ url: image, width: 1600, height: 900, alt: `${listName} Top10QB ranking` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listName} QB Rankings — Top10QB`,
      description,
      images: [image],
    },
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
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
