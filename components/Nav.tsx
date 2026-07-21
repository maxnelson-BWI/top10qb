import Link from "next/link";
import { SHOW_ABOUT } from "@/lib/site";

const links: Array<{ href: string; label: string; key: string }> = [
  { href: "/", label: "List", key: "list" },
  { href: "/archive", label: "Archive", key: "archive" },
  { href: "/wrong", label: "Wrong", key: "wrong" },
  { href: "/about", label: "About", key: "about" },
];

/** Sticky top nav. `active` is one of the link keys. */
export function Nav({ active }: { active?: string }) {
  const shown = links.filter((l) => l.key !== "about" || SHOW_ABOUT);
  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-[14px]"
      style={{
        background: "rgba(11,10,12,.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,.07)",
      }}
    >
      <Link
        href="/"
        className="font-display font-black text-[22px] text-white"
        style={{ letterSpacing: ".01em" }}
      >
        TOP<span style={{ color: "#e8462f" }}>10</span>QB
      </Link>
      <div
        className="flex items-center gap-[15px] font-body font-semibold text-[11px] uppercase"
        style={{ letterSpacing: ".06em" }}
      >
        {shown.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            className="link-accent"
            style={{ color: active === l.key ? "#fff" : "#8a8578" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
