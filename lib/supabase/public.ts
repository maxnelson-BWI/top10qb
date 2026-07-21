import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cookieless anon client for PUBLIC reads (published data only, enforced by
 * RLS). Not tied to request cookies, so pages that use it can be statically
 * cached / revalidated (ISR) instead of forced dynamic — keeps the public site
 * fast and light. Never use this for auth or writes.
 */
export function createSupabasePublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
