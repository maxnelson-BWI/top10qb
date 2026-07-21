import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Refreshes the Supabase auth session cookie on every request and guards
 * /admin/* (except the login + auth-callback routes). When Supabase isn't
 * configured yet (local dev), the guard is a no-op so the UI stays reachable.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  const { pathname } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isPublicAdmin =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth");

  if (!hasSupabase || !isAdmin || isPublicAdmin) return res;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = user?.email && (!ADMIN_EMAIL || user.email.toLowerCase() === ADMIN_EMAIL);
  if (!allowed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
