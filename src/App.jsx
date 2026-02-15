import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSheetData } from "./useSheetData";
import "./index.css";
import heroImage from "./assets/hero.png";
import rankmasterImage from "./assets/rankmaster.png";

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

const SOCIAL = {
  twitter: "https://twitter.com/top10qb",
  instagram: "https://instagram.com/top10qb",
};

/* ============================================
   TEAM COLORS (for ranking row accent bars)
   ============================================ */
const TEAM_COLORS = {
  BAL: "#241773", KC: "#E31837", BUF: "#00338D", CIN: "#FB4F14",
  PHI: "#004C54", HOU: "#03202F", WAS: "#773141", SF: "#AA0000",
  DAL: "#003594", SEA: "#002244", CAR: "#0085CA", MIA: "#008E97",
  LAC: "#0080C6", MIN: "#4F2683", GB: "#203731", DET: "#0076B6",
  TB: "#D50A0A", ATL: "#A71930", NO: "#D3BC8D", ARI: "#97233F",
  LAR: "#003594", CHI: "#0B162A", NYJ: "#125740", NYG: "#0B2265",
  PIT: "#FFB612", DEN: "#FB4F14", JAX: "#006778", TEN: "#4B92DB",
  IND: "#002C5F", NE: "#002244", CLE: "#311D00", LV: "#A5ACAF",
};

/* ============================================
   PLAYER HEADSHOTS (ESPN CDN)
   ============================================ */
const espnHead = (id) => `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${id}.png&w=96&h=70&cb=1`;
const HEADSHOTS = {
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

const SocialButton = ({ href, label, icon }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 22px", borderRadius: 8,
        border: `1.5px solid ${hovered ? T.accent : "rgba(255,255,255,0.15)"}`,
        background: hovered ? "rgba(232,93,58,0.1)" : "transparent",
        color: hovered ? T.accent : "#999",
        fontSize: 13, fontWeight: 700, fontFamily: T.font,
        textDecoration: "none", letterSpacing: 0.3,
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </a>
  );
};

const Footer = () => (
  <div style={{ marginTop: 48 }}>
    {/* Social CTA Strip */}
    <div style={{
      background: T.heroBg, borderRadius: 12, padding: "28px 32px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 800, fontFamily: T.font, color: T.white,
          letterSpacing: -0.3,
        }}>
          Agree? Disagree? Come argue.
        </div>
        <div style={{
          fontSize: 11, color: "#555", fontFamily: T.font, marginTop: 4,
          letterSpacing: 0.5,
        }}>
          New rankings every Tuesday
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <SocialButton
          href="https://twitter.com/top10qb"
          label="Follow on 𝕏"
          icon="𝕏"
        />
        <SocialButton
          href="https://instagram.com/top10qb"
          label="Follow on IG"
          icon="📷"
        />
      </div>
    </div>

    {/* Copyright line */}
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 4px 32px",
    }}>
      <span style={{ fontSize: 11, color: "#DDD", fontFamily: T.font }}>© 2026 Top10QB</span>
      <span style={{ fontSize: 11, color: "#DDD", fontFamily: T.font }}>My list. My biases. Your problem.</span>
    </div>
  </div>
);

/* ============================================
   PAGE BACKGROUND TEXTURES
   ============================================
   Subtle orange accent elements in the white
   space margins flanking the content area.
   Same visual language as the hero section.    */
const PageBackgroundTextures = ({ isMobile }) => {
  if (isMobile) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {/* Diagonal accent lines across full page */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="pageDiag" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1="0" y1="0" x2="0" y2="50" stroke={T.accent} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pageDiag)" />
      </svg>

      {/* Left vertical accent line */}
      <div style={{
        position: "absolute", left: "calc(50% - 540px)", top: 0, bottom: 0, width: 1,
        background: "linear-gradient(to bottom, transparent 20%, rgba(232,93,58,0.18) 50%, transparent 80%)",
      }} />
      {/* Right vertical accent line */}
      <div style={{
        position: "absolute", right: "calc(50% - 540px)", top: 0, bottom: 0, width: 1,
        background: "linear-gradient(to bottom, transparent 20%, rgba(232,93,58,0.18) 50%, transparent 80%)",
      }} />

      {/* Left bracket accents */}
      <div style={{
        position: "absolute", left: "calc(50% - 560px)", top: "45%", width: 24, height: 50,
        borderLeft: "2px solid rgba(232,93,58,0.18)",
        borderTop: "2px solid rgba(232,93,58,0.18)",
        borderBottom: "2px solid rgba(232,93,58,0.18)",
      }} />
      <div style={{
        position: "absolute", left: "calc(50% - 580px)", top: "65%", width: 16, height: 30,
        borderLeft: "2px solid rgba(232,93,58,0.12)",
        borderTop: "2px solid rgba(232,93,58,0.12)",
        borderBottom: "2px solid rgba(232,93,58,0.12)",
      }} />

      {/* Right bracket accents */}
      <div style={{
        position: "absolute", right: "calc(50% - 560px)", top: "55%", width: 24, height: 50,
        borderRight: "2px solid rgba(232,93,58,0.18)",
        borderTop: "2px solid rgba(232,93,58,0.18)",
        borderBottom: "2px solid rgba(232,93,58,0.18)",
      }} />
      <div style={{
        position: "absolute", right: "calc(50% - 580px)", top: "35%", width: 16, height: 30,
        borderRight: "2px solid rgba(232,93,58,0.12)",
        borderTop: "2px solid rgba(232,93,58,0.12)",
        borderBottom: "2px solid rgba(232,93,58,0.12)",
      }} />

      {/* Horizontal accent lines in margins */}
      <div style={{
        position: "absolute", left: "2%", right: "calc(50% + 520px)", top: "50%", height: 1,
        background: "linear-gradient(to right, transparent, rgba(232,93,58,0.15), transparent)",
      }} />
      <div style={{
        position: "absolute", right: "2%", left: "calc(50% + 520px)", top: "60%", height: 1,
        background: "linear-gradient(to left, transparent, rgba(232,93,58,0.15), transparent)",
      }} />

      {/* Dot grid in left margin */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: "calc(50% - 520px)", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="pageDotL" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill={T.accent} />
          </pattern>
        </defs>
        <rect x="40%" y="20%" width="50%" height="60%" fill="url(#pageDotL)" />
      </svg>

      {/* Dot grid in right margin */}
      <svg style={{ position: "absolute", right: 0, top: 0, width: "calc(50% - 520px)", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="pageDotR" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill={T.accent} />
          </pattern>
        </defs>
        <rect x="10%" y="20%" width="50%" height="60%" fill="url(#pageDotR)" />
      </svg>
    </div>
  );
};

/* ============================================
   HERO BACKGROUND TEXTURES
   ============================================ */
const HeroTextures = ({ isMobile }) => (
  <>
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
    {!isMobile && (
      <div style={{
        position: "absolute", left: "26%", top: "50%", transform: "translateY(-55%)",
        zIndex: 3, opacity: 0.045, pointerEvents: "none",
      }}>
        <span style={{
          fontSize: 300, fontWeight: 900, fontFamily: T.font,
          color: T.white, letterSpacing: -20, lineHeight: 0.8,
        }}>10</span>
      </div>
    )}
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
    {!isMobile && (
      <div style={{
        position: "absolute", left: "20%", right: "42%", top: "72%",
        height: 1, background: `linear-gradient(to right, transparent, rgba(232,93,58,0.2), transparent)`,
        zIndex: 3,
      }} />
    )}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "25%", right: "50%", top: "28%",
        height: 1, background: `linear-gradient(to right, transparent, rgba(232,93,58,0.15), transparent)`,
        zIndex: 3,
      }} />
    )}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "34%", top: "20%", zIndex: 3, opacity: 0.1,
        width: 30, height: 50,
        borderLeft: `2px solid ${T.accent}`,
        borderTop: `2px solid ${T.accent}`,
        borderBottom: `2px solid ${T.accent}`,
      }} />
    )}
    {!isMobile && (
      <div style={{
        position: "absolute", left: "42%", top: "60%", zIndex: 3, opacity: 0.08,
        width: 20, height: 35,
        borderRight: `2px solid ${T.accent}`,
        borderTop: `2px solid ${T.accent}`,
        borderBottom: `2px solid ${T.accent}`,
      }} />
    )}
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
const HomePage = ({ setPage, isMobile, CURRENT_WEEK_LABEL, RANKINGS, DROPPED, WORST }) => (
  <div>
    {/* Hero — full-width on all screen sizes */}
    {isMobile ? (
      <div style={{
        position: "relative", minHeight: 340, background: T.heroBg,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "150% auto",
          backgroundPosition: "75% 15%",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }} />
        <HeroTextures isMobile={true} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: `linear-gradient(to top, ${T.heroBg} 25%, rgba(20,20,20,0.5) 55%, rgba(20,20,20,0.1) 100%)`,
        }} />
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
      <div style={{
        position: "relative", minHeight: 400, background: T.heroBg,
        display: "flex", alignItems: "flex-end", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: 0, top: 0, width: "68%", height: "100%",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "60% 5%",
          opacity: 0.9,
        }} />
        <HeroTextures isMobile={false} />
        <div style={{
          position: "absolute", left: 0, top: 0, width: "42%", height: "100%",
          background: `linear-gradient(to right, ${T.heroBg} 50%, transparent 100%)`, zIndex: 2,
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, width: "10%", height: "100%",
          background: `linear-gradient(to left, rgba(20,20,20,0.4), transparent)`, zIndex: 2,
        }} />
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
    <ContentWrap style={{ position: "relative", zIndex: 1 }}>
      <AccentLabel style={{ paddingTop: isMobile ? 24 : 36, paddingBottom: isMobile ? 8 : 12 }}>This Week's Rankings</AccentLabel>
      {RANKINGS.map((qb, i) => {
        const teamColor = TEAM_COLORS[qb.team] || "#999";
        return (
          <div key={qb.slug} onClick={() => setPage({ type: "player", slug: qb.slug })}
            style={{
              display: "flex", gap: isMobile ? 14 : 20, padding: isMobile ? "14px 0" : "18px 0",
              borderBottom: `1px solid ${T.border}`, alignItems: "center", cursor: "pointer",
              transition: "background 0.15s", position: "relative",
              paddingLeft: isMobile ? 0 : 12,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Team color accent bar */}
            {!isMobile && (
              <div style={{
                position: "absolute", left: 0, top: 12, bottom: 12, width: 3,
                background: teamColor, borderRadius: 2, opacity: 0.6,
              }} />
            )}
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
              {/* Stat line */}
              {qb.stats && (
                <div style={{
                  fontSize: 10, color: "#CCC", fontFamily: T.font, marginTop: 6,
                  letterSpacing: 0.8, fontWeight: 600,
                }}>
                  {qb.stats}
                </div>
              )}
            </div>
            {/* Last week rank + movement */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {qb.prevRank && (
                <span style={{ fontSize: 9, color: "#CCC", fontFamily: T.font, fontWeight: 500, whiteSpace: "nowrap" }}>
                  LW: #{qb.prevRank}
                </span>
              )}
              <Movement {...qb.movement} />
            </div>
          </div>
        );
      })}

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
const PlayerPage = ({ slug, setPage, isMobile, RANKINGS, DROPPED, PLAYER_HISTORY }) => {
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
    <ContentWrap style={{ paddingBottom: 40, position: "relative", zIndex: 1 }}>
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
const ArchivePage = ({ setPage, isMobile, RANKINGS, DROPPED, WORST, ARCHIVE_WEEKS }) => {
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("2026");
  const ALL_SEARCHABLE = [
    ...RANKINGS.map(q => ({ name: q.name, slug: q.slug, team: q.team })),
    ...DROPPED.map(d => ({ name: d.name, slug: d.slug, team: "—" })),
    { name: WORST.name, slug: WORST.slug, team: WORST.team },
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
  const seen = new Set();
  const allPlayers = ALL_SEARCHABLE.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });
  const filtered = search.length > 1 ? allPlayers.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [];

  const nameToSlug = {};
  RANKINGS.forEach(q => { const last = q.name.split(" ").pop(); nameToSlug[last] = q.slug; });
  DROPPED.forEach(d => { const last = d.name.split(" ").pop(); nameToSlug[last] = d.slug; });

  return (
    <div>
      <div style={{
        background: T.heroBg, position: "relative", overflow: "hidden",
        padding: isMobile ? "36px 20px 32px" : "48px 48px 40px",
      }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.04, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="archDots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill={T.accent} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archDots)" />
        </svg>
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
            Every list. Preserved forever. No regrets.
          </div>
        </div>
      </div>

      <ContentWrap style={{ paddingBottom: 40, position: "relative", zIndex: 1 }}>
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
          It's not glamorous work, producing Top 10 lists. But somebody has to do it.
        </div>
      </div>
    </div>

    <ContentWrap style={{ paddingBottom: 40, position: "relative", zIndex: 1 }}>

    <div style={{ padding: "28px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* RANKMASTER PHOTO */}
        <div style={{
          width: 140, height: 180, borderRadius: 12, background: T.heroBg, flexShrink: 0,
          overflow: "hidden",
        }}>
          <img
            src={rankmasterImage}
            alt="The Rankmaster"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, lineHeight: 1.75 }}>
            I've never played football. I've never worked in football. I have no insider sources.
          </div>
          <div style={{ fontSize: 13, color: "#666", fontFamily: T.font, lineHeight: 1.75, marginTop: 14 }}>
            What I do have: opinions, a television, and an impeccable "eye test."
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
        <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.accent, fontFamily: T.font, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>Follow on 𝕏</a>
        <span style={{ color: "#333" }}>·</span>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.accent, fontFamily: T.font, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>Follow on IG</a>
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
  const { data, loading } = useSheetData();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // Loading screen while data fetches
  if (loading || !data) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: T.font,
      background: T.white,
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1.5, color: T.dark }}>
        TOP10<span style={{ color: T.accent }}>QB</span>
      </div>
      <div style={{
        marginTop: 16, width: 40, height: 3, background: T.accent, borderRadius: 2,
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  );

  // Pull all data out so the rest of the code can use it
  const CURRENT_WEEK_LABEL = data.CURRENT_WEEK_LABEL;
  const CURRENT_DATE = data.CURRENT_DATE;
  const RANKINGS = data.RANKINGS;
  const DROPPED = data.DROPPED;
  const WORST = data.WORST;
  const PLAYER_HISTORY = data.PLAYER_HISTORY;
  const ARCHIVE_WEEKS = data.ARCHIVE_WEEKS;

  return (
    <div style={{
      minHeight: "100vh",
      background: T.white,
      fontFamily: T.font,
    }}>
      <PageBackgroundTextures isMobile={isMobile} />
      <Nav page={page} setPage={setPage} isMobile={isMobile} />
      {page.type === "home" && <HomePage setPage={setPage} isMobile={isMobile} CURRENT_WEEK_LABEL={CURRENT_WEEK_LABEL} RANKINGS={RANKINGS} DROPPED={DROPPED} WORST={WORST} />}
      {page.type === "player" && <PlayerPage slug={page.slug} setPage={setPage} isMobile={isMobile} RANKINGS={RANKINGS} DROPPED={DROPPED} PLAYER_HISTORY={PLAYER_HISTORY} />}
      {page.type === "archive" && <ArchivePage setPage={setPage} isMobile={isMobile} RANKINGS={RANKINGS} DROPPED={DROPPED} WORST={WORST} ARCHIVE_WEEKS={ARCHIVE_WEEKS} />}
      {page.type === "about" && <AboutPage isMobile={isMobile} />}
    </div>
  );
}
