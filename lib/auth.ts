import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { ADMIN_EMAIL, hasSupabase } from "./supabase/config";

export type AdminSession = { email: string; devMode: boolean };

/**
 * Returns the signed-in admin, or null. In dev (no Supabase configured) returns
 * a synthetic session so the admin UI is reachable locally.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!hasSupabase) return { email: "dev@localhost", devMode: true };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  if (ADMIN_EMAIL && user.email.toLowerCase() !== ADMIN_EMAIL) return null;
  return { email: user.email, devMode: false };
}

/** Guard for admin server components — redirects to login when signed out. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
