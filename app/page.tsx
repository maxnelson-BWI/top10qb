import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WeekBody } from "@/components/WeekBody";
import { SignupForm } from "@/components/SignupForm";
import { FollowButton } from "@/components/FollowButton";
import { getCurrentWeek } from "@/lib/data";

// Home reflects the latest published week; revalidate hourly (publishing also
// triggers an on-demand revalidate — see the admin publish route).
export const revalidate = 3600;

export default async function HomePage() {
  const week = await getCurrentWeek();

  if (!week) {
    return (
      <div className="app-shell">
        <Nav active="list" />
        <h1
          className="px-5 py-20 text-center font-serif italic text-[20px]"
          style={{ color: "#8a8578" }}
        >
          Still arguing with myself about it. First list drops soon.
        </h1>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Nav active="list" />
      <WeekBody week={week} />
      <SignupForm />
      <FollowButton />
      <Footer />
    </div>
  );
}
