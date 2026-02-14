// ============================================
// TOP10QB — GOOGLE SHEETS DATA FETCHER
// ============================================
// Fetches rankings from a published Google Sheet.
// Includes guardrails to handle typos/formatting.
//
// Sheet tabs:
//   Rankings     — Your top 10 (edited weekly)
//   Dropped Out  — QBs who fell off
//   Worst QB     — Your worst pick
//   Log          — Running history (10 rows per week)
//                   The site auto-builds player charts
//                   AND the archive page from this one tab.
// ============================================

// ⚠️ PASTE YOUR GOOGLE SHEET ID BELOW
const SHEET_ID = "YOUR_SHEET_ID_HERE";

const TABS = {
  rankings: "Rankings",
  dropped: "Dropped Out",
  worst: "Worst QB",
  log: "Log",
};

// ============================================
// CSV PARSER
// ============================================
function parseCSV(text) {
  const lines = [];
  let currentLine = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { currentLine.push(field.trim()); field = ""; }
      else if (c === "\n" || (c === "\r" && text[i + 1] === "\n")) {
        currentLine.push(field.trim());
        if (currentLine.some(f => f !== "")) lines.push(currentLine);
        currentLine = []; field = "";
        if (c === "\r") i++;
      } else field += c;
    }
  }
  currentLine.push(field.trim());
  if (currentLine.some(f => f !== "")) lines.push(currentLine);
  return lines;
}

// ============================================
// GUARDRAILS
// ============================================
const VALID_TEAMS = new Set([
  "BAL","KC","BUF","CIN","PHI","HOU","WAS","SF","DAL","SEA",
  "CAR","MIA","LAC","MIN","GB","DET","TB","ATL","NO","ARI",
  "LAR","CHI","NYJ","NYG","PIT","DEN","JAX","TEN","IND","NE","CLE","LV",
]);

function cleanTeam(raw) {
  if (!raw) return "—";
  const c = raw.trim().toUpperCase();
  return VALID_TEAMS.has(c) ? c : "—";
}

function cleanMovement(raw) {
  if (!raw) return "same";
  const l = raw.trim().toLowerCase();
  if (["up", "u", "▲"].includes(l)) return "up";
  if (["down", "dn", "d", "▼"].includes(l)) return "down";
  return "same";
}

function cleanSpots(raw) {
  if (!raw && raw !== 0) return 0;
  const n = parseInt(raw, 10);
  return (isNaN(n) || n < 0) ? 0 : Math.min(n, 15);
}

function cleanBadge(raw) {
  if (!raw) return undefined;
  return raw.trim().toUpperCase() === "NEW" ? "NEW" : undefined;
}

function cleanName(raw) {
  if (!raw) return "";
  return raw.trim().replace(/\s+/g, " ");
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function cleanRank(raw, fallback) {
  const n = parseInt(raw, 10);
  return (isNaN(n) || n < 1) ? fallback : n;
}

// ============================================
// TRANSFORMERS
// ============================================

function transformRankings(rows) {
  let dataStart = 0;
  let weekLabel = "Rankings";
  let currentDate = "";

  for (let i = 0; i < rows.length; i++) {
    const first = (rows[i][0] || "").trim().toLowerCase();
    if (first.includes("week label")) weekLabel = (rows[i][1] || "").trim();
    if (first === "date" || first === "date:") currentDate = (rows[i][1] || "").trim();
    // Look for the header row — column A contains "rank" (with or without extra text)
    if (first === "rank" || first === "rank:" || first === "#") { dataStart = i + 1; break; }
  }

  // If we didn't find a header row, try to find the first row where column A is a number 1-10
  if (dataStart === 0) {
    for (let i = 0; i < rows.length; i++) {
      const n = parseInt((rows[i][0] || "").trim(), 10);
      if (n >= 1 && n <= 10) { dataStart = i; break; }
    }
  }

  const rankings = [];
  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    const name = cleanName(row[1]);
    if (!name) continue;

    // Skip rows where rank isn't a valid number 1-10
    const rankRaw = parseInt((row[0] || "").trim(), 10);
    if (isNaN(rankRaw) || rankRaw < 1 || rankRaw > 10) continue;

    const rank = rankRaw;
    const dir = cleanMovement(row[4]);
    const spots = cleanSpots(row[5]);

    const qb = {
      rank, name,
      team: cleanTeam(row[2]),
      commentary: (row[3] || "").trim() || `${name} is ranked #${rank} this week.`,
      movement: { dir, spots: dir === "same" ? 0 : spots },
      slug: toSlug(name),
    };
    const badge = cleanBadge(row[6]);
    if (badge) qb.badge = badge;
    rankings.push(qb);
  }

  rankings.sort((a, b) => a.rank - b.rank);
  return { rankings, weekLabel, currentDate };
}

function transformDropped(rows) {
  const dropped = [];
  for (let i = 1; i < rows.length; i++) {
    const name = cleanName(rows[i]?.[0]);
    if (!name) continue;
    dropped.push({ name, prev: cleanRank(rows[i][1], 0), slug: toSlug(name) });
  }
  return dropped;
}

function transformWorst(rows) {
  for (let i = 1; i < rows.length; i++) {
    const name = cleanName(rows[i]?.[0]);
    if (!name) continue;
    return {
      name, team: cleanTeam(rows[i][1]),
      commentary: (rows[i][2] || "").trim() || `${name} is the worst QB of the week.`,
      slug: toSlug(name),
    };
  }
  return { name: "TBD", team: "—", commentary: "No worst QB selected.", slug: "tbd" };
}

// ============================================
// LOG → HISTORY + ARCHIVE (auto-derived)
// ============================================
// The Log tab has columns: Week Label, Date, Rank, Name
// Each week is 10 rows (one per QB).
// From this we auto-build:
//   1. PLAYER_HISTORY — for the charts on player profile pages
//   2. ARCHIVE_WEEKS  — for the Archive page cards
//
function transformLog(rows) {
  // Skip header row
  const entries = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 4) continue;
    const weekLabel = (row[0] || "").trim();
    const date = (row[1] || "").trim();
    const rank = cleanRank(row[2], null);
    const name = cleanName(row[3]);
    if (!weekLabel || !name || rank === null) continue;
    entries.push({ weekLabel, date, rank, name, slug: toSlug(name) });
  }

  // --- Build PLAYER_HISTORY ---
  // Group by player, ordered by appearance in log (newest first in sheet,
  // but we want oldest-first for the chart)
  const weekOrder = []; // ordered list of unique week labels
  const weekSeen = new Set();
  for (const e of entries) {
    if (!weekSeen.has(e.weekLabel)) {
      weekSeen.add(e.weekLabel);
      weekOrder.push(e.weekLabel);
    }
  }
  // Reverse so oldest week is first (chart reads left to right)
  weekOrder.reverse();

  // Build a lookup: slug → { weekLabel → rank }
  const playerWeeks = {};
  for (const e of entries) {
    if (!playerWeeks[e.slug]) playerWeeks[e.slug] = {};
    playerWeeks[e.slug][e.weekLabel] = e.rank;
  }

  // Convert to the array format the site expects
  const PLAYER_HISTORY = {};
  for (const slug of Object.keys(playerWeeks)) {
    PLAYER_HISTORY[slug] = weekOrder
      .filter(w => playerWeeks[slug][w] !== undefined)
      .map(w => ({
        week: shortenWeekLabel(w),
        rank: playerWeeks[slug][w],
      }));
  }

  // --- Build ARCHIVE_WEEKS ---
  // Group entries by week, preserving order (newest first)
  const weekGroups = [];
  const weekGroupSeen = new Set();
  for (const e of entries) {
    if (!weekGroupSeen.has(e.weekLabel)) {
      weekGroupSeen.add(e.weekLabel);
      weekGroups.push({
        weekLabel: e.weekLabel,
        date: e.date,
        entries: [],
      });
    }
    const group = weekGroups.find(g => g.weekLabel === e.weekLabel);
    group.entries.push(e);
  }

  const ARCHIVE_WEEKS = weekGroups.map(g => {
    // Sort entries by rank to get top 3
    const sorted = [...g.entries].sort((a, b) => a.rank - b.rank);
    const top3 = sorted.slice(0, 3).map(e => {
      // Extract last name for the archive card display
      const parts = e.name.split(" ");
      return parts[parts.length - 1];
    });

    return {
      id: toWeekId(g.weekLabel, g.date),
      label: g.weekLabel,
      date: g.date,
      top3,
    };
  });

  return { PLAYER_HISTORY, ARCHIVE_WEEKS };
}

// Helper: shorten week labels for chart X-axis
// "Week 1" → "W1", "Offseason" → "Off", "Preseason" → "Pre"
function shortenWeekLabel(label) {
  if (!label) return "?";
  const l = label.toLowerCase().trim();
  if (l.startsWith("week ")) return "W" + l.replace("week ", "").split("·")[0].trim();
  if (l.startsWith("offseason")) return "Off";
  if (l.startsWith("preseason") || l.startsWith("pre")) return "Pre";
  // Fallback: first 4 chars
  return label.slice(0, 4);
}

// Helper: generate a URL-safe week ID
function toWeekId(label, date) {
  const base = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (date) {
    const datePart = date.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return base + "-" + datePart;
  }
  return base;
}

// ============================================
// MAIN FETCH
// ============================================
let cachedData = null;
let cacheTime = 0;

function sheetUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

export async function fetchSheetData() {
  if (cachedData && Date.now() - cacheTime < 60000) return cachedData;

  try {
    const [r1, r2, r3, r4] = await Promise.all(
      [TABS.rankings, TABS.dropped, TABS.worst, TABS.log].map(t => fetch(sheetUrl(t)))
    );
    const [t1, t2, t3, t4] = await Promise.all([r1, r2, r3, r4].map(r => r.text()));

    const { rankings, weekLabel, currentDate } = transformRankings(parseCSV(t1));
    const { PLAYER_HISTORY, ARCHIVE_WEEKS } = transformLog(parseCSV(t4));

    const data = {
      CURRENT_WEEK_LABEL: weekLabel,
      CURRENT_DATE: currentDate,
      RANKINGS: rankings,
      DROPPED: transformDropped(parseCSV(t2)),
      WORST: transformWorst(parseCSV(t3)),
      PLAYER_HISTORY,
      ARCHIVE_WEEKS,
    };

    cachedData = data;
    cacheTime = Date.now();
    return data;
  } catch (err) {
    console.error("Sheet fetch failed:", err);
    if (cachedData) return cachedData;
    return {
      CURRENT_WEEK_LABEL: "Loading...", CURRENT_DATE: "",
      RANKINGS: [], DROPPED: [],
      WORST: { name: "TBD", team: "—", commentary: "Loading...", slug: "tbd" },
      PLAYER_HISTORY: {}, ARCHIVE_WEEKS: [],
    };
  }
}

export function isSheetConfigured() {
  return SHEET_ID !== "YOUR_SHEET_ID_HERE";
}
