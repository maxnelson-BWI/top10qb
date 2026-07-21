/** Central place to read Supabase env + know whether the DB is wired up yet. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once the public Supabase env vars are present. */
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Server-only service-role key (never exposed to the browser). */
export const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** The single admin allowed to sign in to /admin. */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
