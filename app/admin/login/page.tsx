"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabase } from "@/lib/supabase/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const supabase = createSupabaseBrowserClient();
      const next = new URLSearchParams(window.location.search).get("next") ?? "/admin";
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setMsg("✓ Check your email for a sign-in link.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not send the link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
      <div style={{ padding: "60px 24px" }}>
        <div className="font-display font-black text-[28px] text-white">
          TOP<span style={{ color: "#e8462f" }}>10</span>QB
        </div>
        <div className="font-body font-bold text-[11px] uppercase mt-1" style={{ letterSpacing: ".2em", color: "#8a8578" }}>
          Admin
        </div>

        {!hasSupabase ? (
          <div className="mt-8 rounded-[16px]" style={{ padding: 20, background: "#100f12", border: "1px solid rgba(255,255,255,.08)" }}>
            <div className="font-serif italic text-[18px]" style={{ color: "#e6ddd0" }}>
              Database not connected yet.
            </div>
            <div className="font-body text-[14px] mt-2" style={{ color: "#8a8578", lineHeight: 1.5 }}>
              Set up Supabase and the env vars (see SETUP.md), then log in here. For now, the admin
              is open in dev mode —{" "}
              <a href="/admin" className="link-accent" style={{ color: "#c9a227", fontWeight: 600 }}>
                go to the dashboard →
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8">
            <label className="font-body font-semibold text-[11px] uppercase" style={{ letterSpacing: ".1em", color: "#6b6862" }}>
              Your email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-[10px] font-body text-[15px] text-white outline-none mt-2"
              style={{ background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.18)", padding: "13px 14px" }}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[10px] font-body font-bold text-[13px] uppercase text-white cursor-pointer mt-3"
              style={{ background: "#e8462f", border: "none", padding: "14px", letterSpacing: ".06em", opacity: busy ? 0.7 : 1 }}
            >
              {busy ? "Sending…" : "Send sign-in link"}
            </button>
            {msg && (
              <div className="font-body font-semibold text-[13px] mt-3" style={{ color: "#c9a227" }}>
                {msg}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
