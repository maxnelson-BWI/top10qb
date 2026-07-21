import { createClient } from "@supabase/supabase-js";
import { SERVICE_ROLE_KEY, SUPABASE_URL } from "./config";

/**
 * Service-role client — bypasses RLS. SERVER-ONLY. Never import this into a
 * Client Component. Used by admin route handlers to write drafts/publish and by
 * the seed script.
 */
export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
