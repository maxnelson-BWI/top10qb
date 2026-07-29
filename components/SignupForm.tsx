"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/** Purple gradient email-capture card. Posts to /api/subscribe. */
export function SignupForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        track("Email Signup", { location: "homepage" });
        setMsg("✓ You're in. I'll email you when there's actually an email.");
        setEmail("");
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg(body.error ?? "Something went sideways. Try again in a sec.");
      }
    } catch {
      setMsg("Something went sideways. Try again in a sec.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="mt-[26px] mx-5 rounded-[20px] relative overflow-hidden"
      style={{
        padding: "26px 22px",
        background: "linear-gradient(150deg,#241773 0%,#160d3f 70%)",
      }}
    >
      <div className="stripe absolute inset-0" style={{ opacity: 0.5 }} />
      <div className="relative">
        <div
          className="font-display font-extrabold text-[34px] uppercase text-white"
          style={{ lineHeight: 0.92 }}
        >
          Get the List
          <br />
          by email
        </div>
        <div
          className="font-body text-[14px] mt-2"
          style={{ color: "#c8c1e8", lineHeight: 1.4, maxWidth: 300 }}
        >
          Not built yet. Drop your email and you&apos;ll get the first one whenever I figure it out.
        </div>
        <form onSubmit={onSubmit} className="flex gap-2 mt-4">
          <label htmlFor="signup-email" className="sr-only">
            Email address
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-0 rounded-[10px] font-body font-medium text-[15px] text-white outline-none"
            style={{
              background: "rgba(0,0,0,.35)",
              border: "1px solid rgba(255,255,255,.18)",
              padding: "13px 14px",
            }}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-[10px] font-body font-bold text-[13px] uppercase text-white cursor-pointer"
            style={{
              background: "#e8462f",
              border: "none",
              padding: "0 18px",
              letterSpacing: ".06em",
              whiteSpace: "nowrap",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "…" : "Get It"}
          </button>
        </form>
        <div
          role="status"
          aria-live="polite"
          className="font-body font-semibold text-[12px] mt-[10px]"
          style={{ color: "#c9a227", minHeight: 14 }}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}
