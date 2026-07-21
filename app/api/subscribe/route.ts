import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }

  // Before the DB is wired up, accept the signup so the UI works end-to-end.
  if (!hasSupabase) {
    console.log(`[subscribe] (no DB configured) would store: ${email}`);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("subscribers")
      .upsert({ email, source: "homepage" }, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[subscribe] failed", e);
    return NextResponse.json({ error: "Couldn't save that. Try again." }, { status: 500 });
  }
}
