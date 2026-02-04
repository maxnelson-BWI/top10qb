import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  CURRENT_WEEK_LABEL, CURRENT_DATE, RANKINGS, DROPPED, WORST,
  PLAYER_HISTORY, ARCHIVE_WEEKS,
} from "./rankings-data.js";
import "./index.css";
import heroImage from "./assets/hero.png";

/* ============================================
   DESIGN TOKENS
   ============================================ */
const T = {
  accent: "#E85D3A",
  dark: "#1A1A1A",
  mid: "#999",
  light: "#F5F5F5",
  border: "#F0F0F0",
  up: "#22A666",
  down: "#E85D3A",
  heroBg: "#141414",
  white: "#FFFFFF",
  font: "'DM Sans', sans-serif",
};

/* ============================================
   PLAYER HEADSHOTS (ESPN CDN)
   ============================================
   These are publicly available headshot images.
   To add a new player, find their ESPN player page
   and grab the ID from the URL.                    */
const espnHead = (id) => `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${id}.png&w=96&h=70&cb=1`;
const HEADSHOTS = {
  // Current ranked / dropped / worst
  "lamar-jackson": espnHead(3916387),
  "patrick-mahomes": espnHead(3139477),
  "josh-allen": espnHead(3918298),
  "joe-burrow": espnHead(3915511),
  "jalen-hurts": espnHead(4040715),
  "cj-stroud": espnHead(4432577),
  "jayden-daniels": espnHead(4426348),
  "brock-purdy": espnHead(4361741),
  "dak-prescott": espnHead(2577417),
  "geno-smith": espnHead(15864),
  "bryce-young": espnHead(4685720),
  "tua-tagovailoa": espnHead(4241479),
  "justin-herbert": espnHead(4038941),
  // Expanded search pool (top 30 by 2025 passing yards)
  "matthew-stafford": espnHead(12483),
  "jared-goff": espnHead(3046779),
  "drake-maye": espnHead(4431452),
  "sam-darnold": espnHead(3912547),
  "trevor-lawrence": espnHead(4360310),
  "caleb-williams": espnHead(4431611),
  "bo-nix": espnHead(4426385),
  "baker-mayfield": espnHead(3052587),
  "jordan-love": espnHead(3916148),
  "jacoby-brissett": espnHead(2969939),
  "aaron-rodgers": espnHead(8439),
  "daniel-jones": espnHead(3917792),
  "cam-ward": espnHead(4686013),
  "kirk-cousins": espnHead(14880),
  "kyler-murray": espnHead(3917315),
  "russell-wilson": espnHead(14881),
  "anthony-richardson": espnHead(4567048),
};

/* ============================================
   RESPONSIVE HOOK
   ============================================ */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

/* ============================================
   CONTENT WIDTH WRAPPER
   ============================================ */
const ContentWrap = ({ children, style: s }) => (
  <div style={{
    maxWidth: 1060,
    margin: "0 auto",
    padding: "0 40px",
    ...s,
  }}>
    {children}
  </div>
);

/* ============================================
   SHARED COMPONENTS
   ============================================ */
const AccentLabel = ({ children, style: s }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase",
    color: T.accent, fontFamily: T.font, ...s,
  }}>
    {children}
  </div>
);

const Avatar = ({ name, slug, size = 48 }) => {
  const [imgError, setImgError] = useState(false);
  const src = HEADSHOTS[slug];
  const initials = name.split(" ").map(n => n[0]).join("");

  if (src && !imgError) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 8, flexShrink: 0,
        background: "#ECECEC", overflow: "hidden",
      }}>
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: "#ECECEC", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ color: "#BBB", fontSize: size * 0.32, fontWeight: 700, fontFamily: T.font, letterSpacing: -0.5 }}>
        {initials}
      </span>
    </div>
  );
};

const Movement = ({ dir, spots }) => {
  const c = {
    up: { symbol: "▲", color: T.up, label: `${spots}` },
    down: { symbol: "▼", color: T.down, label: `${spots}` },
    same: { symbol: "—", color: "#DDD", label: "" },
  }[dir];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, minWidth: 30, justifyContent: "flex-end" }}>
      <span style={{ fontSize: 10, color: c.color, fontWeight: 700 }}>{c.symbol}</span>
      {c.label && <span style={{ fontSize: 10, color: c.color, fontWeight: 700, fontFamily: T.font }}>{c.label}</span>}
    </div>
  );
};

const Nav = ({ page, setPage, isMobile }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: isMobile ? "14px 20px" : "14px 48px",
    borderBottom: `1px solid ${T.border}`, background: T.white,
    position: "sticky", top: 0, zIndex: 50,
  }}>
    <div onClick={() => setPage({ type: "home" })} style={{ cursor: "pointer" }}>
      <span style={{ fontSize: 17, fontWeight: 900, fontFamily: T.font, letterSpacing: -0.5, color: T.dark }}>
        TOP10<span style={{ color: T.accent }}>QB</span>
      </span>
    </div>
    <div style={{ display: "flex", gap: 24 }}>
      {[
        { label: "Rankings", pg: "home" },
        { label: "Archive", pg: "archive" },
        { label: "About", pg: "about" },
      ].map(l => (
        <span key={l.pg} onClick={() => setPage({ type: l.pg })}
          style={{
            fontSize: 12, fontFamily: T.font, cursor: "pointer", fontWeight: 600,
            color: (page.type === l.pg) ? T.dark : "#CCC",
            transition: "color 0.15s",
          }}>
          {l.label}
        </span>
      ))}
    </div>
  </div>
);

const Footer = () => (
  <div style={{
    marginTop: 48, paddingTop: 20, borderTop: `1px solid ${T.border}`,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 48px 32px",
  }}>
    <span style={{ fontSize: 11, color: "#DDD", fontFamily: T.font }}>© 2026 Top10QB</span>
    <div style={{ display: "flex", gap: 14 }}>
      <span style={{ fontSize: 12, color: "#CCC", cursor: "pointer", fontFamily: T.font }}>𝕏</span>
      <span style={{ fontSize: 12, color: "#CCC", cursor: "pointer", fontFamily: T.font }}>IG</span>
    </div>
  </div>
);

/* ============================================
   HERO BACKGROUND TEXTURES
   ============================================
   Subtle decorative elements to fill the gap
   between the text and player images.           */
const HeroTextures = ({ isMobile }) => (
  <>
    {/* Diagonal accent lines — stronger opacity, positioned in the visible gap */}
    {!isMobile && (
      <svg style={{
        position: "absolute", left: "25%", top: 0, width: "40%", height: "100%",
        zIndex: 3, opacity: 0.07,
      }} preserveAspectRatio="none">
        <defs>
          <pattern id="diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="40" stroke={T.accent} strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>
    )}

    {/* Large faded "10" watermark — more visible */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "26%", top: "50%", transform: "translateY(-55%)",
        zIndex: 3, opacity: 0.045, pointerEvents: "none",
      }}>
        <span style={{
          fontSize: 300, fontWeight: 900, fontFamily: T.font,
          color: T.white, letterSpacing: -20, lineHeight: 0.8,
        }}>
          10
        </span>
      </div>
    )}

    {/* Accent dot grid — more visible, in gap zone */}
    {!isMobile && (
      <svg style={{
        position: "absolute", left: "20%", top: 0, width: "45%", height: "100%",
        zIndex: 3, opacity: 0.06,
      }}>
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={T.accent} />
          </pattern>
        </defs>
        <rect x="10%" y="10%" width="80%" height="80%" fill="url(#dots)" />
      </svg>
    )}

    {/* Horizontal accent line — stronger */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "20%", right: "42%", top: "72%",
        height: 1, background: `linear-gradient(to right, transparent, rgba(232,93,58,0.2), transparent)`,
        zIndex: 3,
      }} />
    )}

    {/* Top horizontal accent line */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "25%", right: "50%", top: "28%",
        height: 1, background: `linear-gradient(to right, transparent, rgba(232,93,58,0.15), transparent)`,
        zIndex: 3,
      }} />
    )}

    {/* Bracket accent shape — stronger */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "34%", top: "20%", zIndex: 3, opacity: 0.1,
        width: 30, height: 50,
        borderLeft: `2px solid ${T.accent}`,
        borderTop: `2px solid ${T.accent}`,
        borderBottom: `2px solid ${T.accent}`,
      }} />
    )}

    {/* Small right bracket */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "42%", top: "60%", zIndex: 3, opacity: 0.08,
        width: 20, height: 35,
        borderRight: `2px solid ${T.accent}`,
        borderTop: `2px solid ${T.accent}`,
        borderBottom: `2px solid ${T.accent}`,
      }} />
    )}

    {/* Vertical accent line */}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "38%", top: "15%", bottom: "20%",
        width: 1, background: `linear-gradient(to bottom, transparent, rgba(232,93,58,0.12), transparent)`,
        zIndex: 3,
      }} />
    )}
  </>
);

/* ============================================
   PAGE: Homepage
   ============================================ */
const HomePage = ({ setPage, isMobile }) => (
  <div>
    {/* Hero — full-width on all screen sizes */}
    {isMobile ? (
      /* ---- MOBILE HERO ----
         Image as full background, shifted to show
         all 3 QBs, text at bottom with gradient.   */
      <div style={{
        position: "relative", minHeight: 340, background: T.heroBg,
        overflow: "hidden",
      }}>
        {/* Full-width background image — use 160% width to zoom out and show all players */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "150% auto",
          backgroundPosition: "75% 15%",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }} />
        <HeroTextures isMobile={true} />
        {/* Strong bottom gradient so text is always readable */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: `linear-gradient(to top, ${T.heroBg} 25%, rgba(20,20,20,0.5) 55%, rgba(20,20,20,0.1) 100%)`,
        }} />
        {/* Text pinned to bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          padding: "0 20px 36px",
        }}>
          <AccentLabel style={{ marginBottom: 12 }}>The World Renowned List</AccentLabel>
          <div style={{
            fontSize: 48, fontWeight: 900, fontFamily: T.font, letterSpacing: -3,
            lineHeight: 0.92, color: T.white,
          }}>
            TOP<span style={{ color: T.accent }}>10</span>QB
          </div>
          <div style={{ width: 36, height: 3, background: T.accent, marginTop: 16, borderRadius: 2 }} />
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase",
            color: "#555", fontFamily: T.font, marginTop: 12,
          }}>
            {CURRENT_WEEK_LABEL}
          </div>
          <div style={{
            fontSize: 13, color: T.accent, fontFamily: T.font, marginTop: 10,
            fontStyle: "italic", fontWeight: 600, letterSpacing: 0.3,
          }}>
            Your favorite rapper's favorite top 10 list
          </div>
        </div>
      </div>
    ) : (
      /* ---- DESKTOP HERO ----
         Split layout with textures in the gap      */
      <div style={{
        position: "relative", minHeight: 400, background: T.heroBg,
        display: "flex", alignItems: "flex-end", overflow: "hidden",
      }}>
        {/* Hero image — wider coverage, shows all players */}
        <div style={{
          position: "absolute", right: 0, top: 0, width: "68%", height: "100%",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "60% 5%",
          opacity: 0.9,
        }} />
        {/* Background textures */}
        <HeroTextures isMobile={false} />
        {/* Left fade — narrower to reveal textures in the gap */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: "42%", height: "100%",
          background: `linear-gradient(to right, ${T.heroBg} 50%, transparent 100%)`, zIndex: 2,
        }} />
        {/* Subtle right edge fade */}
        <div style={{
          position: "absolute", right: 0, top: 0, width: "10%", height: "100%",
          background: `linear-gradient(to left, rgba(20,20,20,0.4), transparent)`, zIndex: 2,
        }} />
        {/* Text */}
        <div style={{ position: "relative", zIndex: 3, padding: "52px 48px 48px", maxWidth: 500 }}>
          <AccentLabel style={{ marginBottom: 14 }}>The World Renowned List</AccentLabel>
          <div style={{
            fontSize: 56, fontWeight: 900, fontFamily: T.font, letterSpacing: -3,
            lineHeight: 0.92, color: T.white,
          }}>
            TOP<span style={{ color: T.accent }}>10</span>QB
          </div>
          <div style={{ width: 36, height: 3, background: T.accent, marginTop: 18, borderRadius: 2 }} />
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase",
            color: "#555", fontFamily: T.font, marginTop: 14,
          }}>
            {CURRENT_WEEK_LABEL}
          </div>
          <div style={{
            fontSize: 14, color: T.accent, fontFamily: T.font, marginTop: 12,
            fontStyle: "italic", fontWeight: 600, letterSpacing: 0.3,
          }}>
            Your favorite rapper's favorite top 10 list
          </div>
        </div>
      </div>
    )}

    {/* Rankings — centered content */}
    <ContentWrap>
      <AccentLabel style={{ paddingTop: isMobile ? 24 : 36, paddingBottom: isMobile ? 8 : 12 }}>This Week's Rankings</AccentLabel>
      {RANKINGS.map((qb, i) => (
        <div key={qb.slug} onClick={() => setPage({ type: "player", slug: qb.slug })}
          style={{
            display: "flex", gap: isMobile ? 14 : 20, padding: isMobile ? "14px 0" : "18px 0",
            borderBottom: `1px solid ${T.border}`, alignItems: "center", cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            fontSize: isMobile ? 36 : 42, fontWeight: 900, fontFamily: T.font,
            color: "#ECECEC", lineHeight: 1, minWidth: isMobile ? 48 : 60,
            letterSpacing: -3, textAlign: "right", paddingRight: 4,
          }}>
            {String(qb.rank).padStart(2, "0")}
          </div>
          <Avatar name={qb.name} slug={qb.slug} size={isMobile ? 42 : 50} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: T.font, letterSpacing: -0.3, color: T.dark }}>
                {qb.name}
              </span>
              <span style={{ fontSize: 11, color: "#CCC", fontFamily: T.font, fontWeight: 500 }}>{qb.team}</span>
              {qb.badge && (
                <span style={{
                  fontSize: 8, fontWeight: 700, fontFamily: T.font,
                  border: `1.5px solid ${T.dark}`, color: T.dark,
                  padding: "1px 5px", borderRadius: 3, letterSpacing: 1,
                }}>{qb.badge}</span>
              )}
            </div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: T.mid, fontFamily: T.font, marginTop: 4, lineHeight: 1.5 }}>
              {qb.commentary}
            </div>
          </div>
          <Movement {...qb.movement} />
        </div>
      ))}

      {/* Dropped */}
      <div style={{ padding: "18px 0" }}>
        <AccentLabel style={{ marginBottom: 10 }}>Dropped Out</AccentLabel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {DROPPED.map(d => (
            <div key={d.slug} onClick={() => setPage({ type: "player", slug: d.slug })}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", border: `1px solid ${T.border}`, borderRadius: 8,
                fontSize: 12, fontFamily: T.font, cursor: "pointer", transition: "border-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#CCC"}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <Avatar name={d.name} slug={d.slug} size={24} />
              <span style={{ fontWeight: 700, color: T.dark }}>{d.name}</span>
              <span style={{ color: "#CCC", fontSize: 11 }}>was #{d.prev}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Worst QB */}
      <div style={{ marginTop: 8, paddingTop: 20, borderTop: `2px solid ${T.dark}` }}>
        <AccentLabel style={{ marginBottom: 14 }}>Worst QB of the Week</AccentLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name={WORST.name} slug={WORST.slug} size={48} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: T.font, letterSpacing: -0.3, color: T.dark }}>{WORST.name}</span>
              <span style={{ fontSize: 11, color: "#CCC", fontFamily: T.font }}>{WORST.team}</span>
            </div>
            <div style={{ fontSize: 12, color: T.mid, fontFamily: T.font, marginTop: 3, lineHeight: 1.5 }}>
              {WORST.commentary}
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>
    <Footer />
  </div>
);

/* ============================================
   PAGE: Player
   ============================================ */
const PlayerPage = ({ slug, setPage, isMobile }) => {
  const [timeRange, setTimeRange] = useState("season");
  const qb = RANKINGS.find(q => q.slug === slug) || DROPPED.map(d => ({ ...d, rank: "—", team: "—", commentary: "", movement: { dir: "same", spots: 0 } })).find(d => d.slug === slug);

  if (!qb) return (
    <ContentWrap style={{ padding: "40px 24px", textAlign: "center", fontFamily: T.font }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.dark }}>Player not found</div>
      <div style={{ fontSize: 12, color: T.mid, marginTop: 8, cursor: "pointer" }} onClick={() => setPage({ type: "home" })}>← Back to rankings</div>
    </ContentWrap>
  );

  const history = PLAYER_HISTORY[slug] || [{ week: "Off", rank: qb.rank || "—" }];
  const ranks = history.filter(h => typeof h.rank === "number");
  const highest = ranks.length ? Math.min(...ranks.map(h => h.rank)) : "—";
  const lowest = ranks.length ? Math.max(...ranks.map(h => h.rank)) : "—";

  return (
    <ContentWrap style={{ paddingBottom: 40 }}>
      <div onClick={() => setPage({ type: "home" })} style={{ fontSize: 12, color: T.mid, fontFamily: T.font, cursor: "pointer", padding: "18px 0 0" }}>
        ← Back to rankings
      </div>
      <div style={{ padding: "24px 0 20px", borderBottom: `1px solid ${T.border}` }}>
        <AccentLabel style={{ marginBottom: 10 }}>Player Profile</AccentLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar name={qb.name} slug={slug} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: T.font, letterSpacing: -1, color: T.dark }}>{qb.name}</div>
            <div style={{ fontSize: 12, color: T.mid, fontFamily: T.font, marginTop: 2 }}>{qb.team}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {[
            { label: "Current", value: typeof qb.rank === "number" ? `#${qb.rank}` : "OUT", color: T.dark },
            { label: "Highest", value: `#${highest}`, color: T.up },
            { label: "Lowest", value: `#${lowest}`, color: T.down },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, padding: "14px 0", background: "#FAFAFA", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: T.font, color: s.color, letterSpacing: -1 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: T.mid, fontFamily: T.font, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 24, marginBottom: 8 }}>
        {[{ id: "3weeks", label: "Last 3 Weeks" }, { id: "season", label: "This Season" }, { id: "all", label: "All Time" }].map(t => (
          <button key={t.id} onClick={() => setTimeRange(t.id)} style={{
            padding: "7px 14px", fontSize: 11, fontWeight: timeRange === t.id ? 700 : 500,
            fontFamily: T.font, background: timeRange === t.id ? T.dark : "transparent",
            color: timeRange === t.id ? T.white : T.mid,
            border: `1px solid ${timeRange === t.id ? T.dark : T.border}`, borderRadius: 6, cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      {history.length > 1 ? (
        <div style={{ marginTop: 16, background: "#FAFAFA", borderRadius: 12, padding: "20px 12px 12px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: T.font, fill: T.mid }} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis reversed domain={[1, 12]} tick={{ fontSize: 11, fontFamily: T.font, fill: T.mid }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontFamily: T.font, fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} formatter={(v) => [`#${v}`, "Rank"]} />
              <Line type="monotone" dataKey="rank" stroke={T.accent} strokeWidth={2.5} dot={{ fill: T.accent, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: T.accent }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#DDD", fontFamily: T.font, fontSize: 13 }}>
          Chart data will populate as rankings are added weekly.
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <AccentLabel style={{ marginBottom: 14 }}>Week by Week</AccentLabel>
        {[...history].reverse().map((h, i) => (
          <div key={i} onClick={() => setPage({ type: "home" })} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 12px", borderBottom: `1px solid ${T.border}`, cursor: "pointer",
            borderRadius: 4, transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.font, color: T.dark }}>{h.week}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 900, fontFamily: T.font, color: T.dark, letterSpacing: -1 }}>#{h.rank}</span>
              {i < [...history].reverse().length - 1 && (() => {
                const prev = [...history].reverse()[i + 1];
                if (!prev) return null;
                const diff = prev.rank - h.rank;
                if (diff > 0) return <Movement dir="up" spots={diff} />;
                if (diff < 0) return <Movement dir="down" spots={Math.abs(diff)} />;
                return <Movement dir="same" spots={0} />;
              })()}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </ContentWrap>
  );
};

/* ============================================
   PAGE: Archive
   ============================================ */
const ArchivePage = ({ setPage, isMobile }) => {
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("2026");
  // Full searchable player database — top 30 QBs by 2025 passing yards
  const ALL_SEARCHABLE = [
    // From RANKINGS / DROPPED / WORST (already in data)
    ...RANKINGS.map(q => ({ name: q.name, slug: q.slug, team: q.team })),
    ...DROPPED.map(d => ({ name: d.name, slug: d.slug, team: "—" })),
    { name: WORST.name, slug: WORST.slug, team: WORST.team },
    // Additional QBs (2025 season passing leaders not already above)
    { name: "Matthew Stafford", slug: "matthew-stafford", team: "LAR" },
    { name: "Jared Goff", slug: "jared-goff", team: "DET" },
    { name: "Drake Maye", slug: "drake-maye", team: "NE" },
    { name: "Sam Darnold", slug: "sam-darnold", team: "SEA" },
    { name: "Trevor Lawrence", slug: "trevor-lawrence", team: "JAX" },
    { name: "Caleb Williams", slug: "caleb-williams", team: "CHI" },
    { name: "Bo Nix", slug: "bo-nix", team: "DEN" },
    { name: "Baker Mayfield", slug: "baker-mayfield", team: "TB" },
    { name: "Jordan Love", slug: "jordan-love", team: "GB" },
    { name: "Jacoby Brissett", slug: "jacoby-brissett", team: "ARI" },
    { name: "Aaron Rodgers", slug: "aaron-rodgers", team: "PIT" },
    { name: "Daniel Jones", slug: "daniel-jones", team: "IND" },
    { name: "Cam Ward", slug: "cam-ward", team: "TEN" },
    { name: "Kirk Cousins", slug: "kirk-cousins", team: "ATL" },
    { name: "Kyler Murray", slug: "kyler-murray", team: "ARI" },
    { name: "Russell Wilson", slug: "russell-wilson", team: "PIT" },
    { name: "Anthony Richardson", slug: "anthony-richardson", team: "IND" },
  ];
  // Deduplicate by slug
  const seen = new Set();
  const allPlayers = ALL_SEARCHABLE.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });
  const filtered = search.length > 1 ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [];

  // Map last names to slugs for archive card headshots
  const nameToSlug = {};
  RANKINGS.forEach(q => { const last = q.name.split(" ").pop(); nameToSlug[last] = q.slug; });
  DROPPED.forEach(d => { const last = d.name.split(" ").pop(); nameToSlug[last] = d.slug; });

  return (
    <div>
      {/* Archive hero banner */}
      <div style={{
        background: T.heroBg, position: "relative", overflow: "hidden",
        padding: isMobile ? "36px 20px 32px" : "48px 48px 40px",
      }}>
        {/* Subtle dot pattern */}
        <svg style={{ position: "absolute", inset: 0, opacity: 0.04, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="archDots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill={T.accent} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archDots)" />
        </svg>
        {/* Ghosted text */}
        <div style={{
          position: "absolute", right: isMobile ? -20 : 40, top: "50%", transform: "translateY(-50%)",
          opacity: 0.03, pointerEvents: "none",
        }}>
          <span style={{ fontSize: isMobile ? 120 : 180, fontWeight: 900, fontFamily: T.font, color: T.white, letterSpacing: -8 }}>
            VAULT
          </span>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto" }}>
          <AccentLabel style={{ marginBottom: 10 }}>The Vault</AccentLabel>
          <div style={{
            fontSize: isMobile ? 28 : 36, fontWeight: 900, fontFamily: T.font,
            letterSpacing: -1.5, color: T.white,
          }}>Archive</div>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, marginTop: 6 }}>
            Every list. Every bad opinion. Preserved forever.
          </div>
        </div>
      </div>

      <ContentWrap style={{ paddingBottom: 40 }}>
        {/* Search section with subtle background */}
        <div style={{
          background: "#FAFAFA", borderRadius: 12, padding: isMobile ? "20px 16px" : "24px 24px",
          marginTop: 28, marginBottom: 28,
        }}>
          <AccentLabel style={{ marginBottom: 10 }}>Find a Player</AccentLabel>
          <div style={{ position: "relative" }}>
            <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", fontSize: 13, fontFamily: T.font,
                border: `1px solid ${T.border}`, borderRadius: 8, outline: "none",
                background: T.white, boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#CCC"}
              onBlur={e => { if (!search) e.target.style.borderColor = T.border; }}
            />
            {filtered.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, background: T.white,
                border: `1px solid ${T.border}`, borderRadius: 8, marginTop: 4, zIndex: 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden",
              }}>
                {filtered.map(p => (
                  <div key={p.slug} onClick={() => { setSearch(""); setPage({ type: "player", slug: p.slug }); }}
                    style={{
                      padding: "10px 16px", fontSize: 13, fontFamily: T.font, cursor: "pointer",
                      borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <Avatar name={p.name} slug={p.slug} size={24} />
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    {p.team && p.team !== "—" && <span style={{ color: "#CCC", fontSize: 11 }}>{p.team}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {["2026"].map(s => (
            <button key={s} onClick={() => setSeason(s)} style={{
              padding: "7px 16px", fontSize: 11, fontWeight: 700, fontFamily: T.font,
              background: T.dark, color: T.white, border: `1px solid ${T.dark}`, borderRadius: 6, cursor: "pointer",
            }}>{s} Season</button>
          ))}
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        <AccentLabel style={{ marginBottom: 14 }}>Week Cards</AccentLabel>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: isMobile ? 12 : 16 }}>
          {ARCHIVE_WEEKS.map(w => (
            <div key={w.id} onClick={() => setPage({ type: "home" })} style={{
              border: `1px solid ${T.border}`, borderRadius: 10,
              padding: isMobile ? "16px 14px" : "20px 18px",
              cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
              background: T.white,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#DDD"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 900, fontFamily: T.font, letterSpacing: -0.5, color: T.dark }}>{w.label}</div>
                  <div style={{ fontSize: 11, color: "#CCC", fontFamily: T.font, marginTop: 2 }}>{w.date}</div>
                </div>
              </div>
              <div style={{
                marginTop: 14, display: "flex", flexDirection: "column", gap: 6,
                borderTop: `1px solid ${T.border}`, paddingTop: 12,
              }}>
                {w.top3.map((name, i) => {
                  const slug = nameToSlug[name];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 14, fontWeight: 900, fontFamily: T.font,
                        color: i === 0 ? T.accent : "#DDD", minWidth: 14, letterSpacing: -1,
                      }}>{i + 1}</span>
                      <Avatar name={name} slug={slug} size={22} />
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: T.font, color: T.dark }}>{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent bar */}
        <div style={{
          marginTop: 36, padding: "20px 24px", background: T.heroBg, borderRadius: 10,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#555", fontFamily: T.font, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>
              Total Weeks Ranked
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: T.font, color: T.white, letterSpacing: -1, marginTop: 2 }}>
              {ARCHIVE_WEEKS.length}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#555", fontFamily: T.font, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>
              Since
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: T.font, color: T.accent, marginTop: 4 }}>
              Feb 2026
            </div>
          </div>
        </div>

        <Footer />
      </ContentWrap>
    </div>
  );
};

/* ============================================
   PAGE: About
   ============================================ */
const AboutPage = ({ isMobile }) => (
  <div>
    {/* About hero banner — matches Archive style */}
    <div style={{
      background: T.heroBg, position: "relative", overflow: "hidden",
      padding: isMobile ? "36px 20px 32px" : "48px 48px 40px",
    }}>
      <svg style={{ position: "absolute", inset: 0, opacity: 0.04, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="aboutDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill={T.accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aboutDots)" />
      </svg>
      <div style={{
        position: "absolute", right: isMobile ? -30 : 40, top: "50%", transform: "translateY(-50%)",
        opacity: 0.03, pointerEvents: "none",
      }}>
        <span style={{ fontSize: isMobile ? 100 : 160, fontWeight: 900, fontFamily: T.font, color: T.white, letterSpacing: -8 }}>
          RM
        </span>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto" }}>
        <AccentLabel style={{ marginBottom: 10 }}>The Man Behind the List</AccentLabel>
        <div style={{
          fontSize: isMobile ? 28 : 36, fontWeight: 900, fontFamily: T.font,
          letterSpacing: -1.5, color: T.white,
        }}>The Rankmaster</div>
        <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, marginTop: 6, maxWidth: 480 }}>
          Every organization needs a Rankmaster. Somebody brave enough to put 10 names in order and defend them against the internet. That somebody is me.
        </div>
      </div>
    </div>

    <ContentWrap style={{ paddingBottom: 40 }}>

    <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{
          width: 110, height: 110, borderRadius: 12, background: T.heroBg, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
        }}>
          <span style={{ fontSize: 48, fontWeight: 900, fontFamily: T.font, color: "rgba(255,255,255,0.08)", letterSpacing: -3 }}>RM</span>
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#444", fontFamily: T.font }}>Photo TBD</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, lineHeight: 1.75 }}>
            I've never played football. I've never worked in football. I have no insider sources and no advanced metrics beyond what I can Google.
          </div>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, lineHeight: 1.75, marginTop: 14 }}>
            What I do have: opinions, a television, and a willingness to defend Lamar Jackson against anyone, anywhere, at any time.
          </div>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, lineHeight: 1.75, marginTop: 14 }}>
            I'm a Ravens fan. I'm a 49ers fan. (Yes, both. Don't ask.) These biases are baked in. I'm not going to pretend otherwise.
          </div>
        </div>
      </div>
    </div>

    <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.border}` }}>
      <AccentLabel style={{ marginBottom: 18 }}>Credentials</AccentLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { label: "Years Played", value: "0" },
          { label: "Weekly Football Watched", value: "More Than Most" },
          { label: "Track Record", value: "Immaculate" },
        ].map(c => (
          <div key={c.label} style={{ padding: "14px 8px", background: "#FAFAFA", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 900, fontFamily: T.font, color: T.dark, letterSpacing: -0.5 }}>{c.value}</div>
            <div style={{ fontSize: 9, color: T.mid, fontFamily: T.font, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "28px 0" }}>
      <AccentLabel style={{ marginBottom: 18 }}>The Rules</AccentLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          "Rankings drop every Tuesday during the season. Periodically during the offseason.",
          "The eye test matters.",
          "Gunslingers > Checkdowns.",
          "Not an advanced analytics guy.",
          "I'm allowed to change my mind on a QB, but it doesn't happen a lot.",
        ].map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, fontWeight: 900, fontFamily: T.font, color: "#ECECEC", lineHeight: 1, minWidth: 28, letterSpacing: -2 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: 13, fontFamily: T.font, color: "#555", lineHeight: 1.6 }}>{rule}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "28px 24px", background: T.heroBg, borderRadius: 12, textAlign: "center" }}>
      <AccentLabel style={{ marginBottom: 10 }}>Why Should You Care?</AccentLabel>
      <div style={{ fontSize: 13, color: "#777", fontFamily: T.font, marginTop: 8, lineHeight: 1.7 }}>
        You probably shouldn't. But if you're the type of person who argues about quarterbacks in group chats, you might enjoy having someone to agree or disagree with. That's all this is.
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 18 }}>
        <span style={{ fontSize: 12, color: T.accent, fontFamily: T.font, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5 }}>Follow on 𝕏</span>
        <span style={{ color: "#333" }}>·</span>
        <span style={{ fontSize: 12, color: T.accent, fontFamily: T.font, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5 }}>Follow on IG</span>
      </div>
    </div>
    <Footer />
  </ContentWrap>
  </div>
);

/* ============================================
   MAIN APP
   ============================================ */
export default function App() {
  const [page, setPage] = useState({ type: "home" });
  const isMobile = useIsMobile();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.white,
      fontFamily: T.font,
    }}>
      <Nav page={page} setPage={setPage} isMobile={isMobile} />
      {page.type === "home" && <HomePage setPage={setPage} isMobile={isMobile} />}
      {page.type === "player" && <PlayerPage slug={page.slug} setPage={setPage} isMobile={isMobile} />}
      {page.type === "archive" && <ArchivePage setPage={setPage} isMobile={isMobile} />}
      {page.type === "about" && <AboutPage isMobile={isMobile} />}
    </div>
  );
}
