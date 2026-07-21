/**
 * Fetches every rostered QB (starters + backups) for all 32 NFL teams from
 * ESPN's public API, with correct ESPN ids for headshots. Outputs a QBRef[]
 * array printed to stdout for pasting into lib/reference.ts.
 *
 * Run: npx tsx scripts/fetch-qbs.ts
 */

// ESPN team abbreviation -> our team code (only WSH differs).
const TEAM_FIX: Record<string, string> = { WSH: "WAS" };

const ESPN_ABBRS = [
  "ari", "atl", "bal", "buf", "car", "chi", "cin", "cle", "dal", "den",
  "det", "gb", "hou", "ind", "jax", "kc", "lac", "lar", "lv", "mia",
  "min", "ne", "no", "nyg", "nyj", "phi", "pit", "sf", "sea", "tb",
  "ten", "wsh",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.'']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type QB = { slug: string; fullName: string; espnId: number; defaultTeamCode: string };

type Athlete = { id?: string | number; fullName?: string; position?: { abbreviation?: string } };

async function rosterQBs(abbr: string): Promise<QB[]> {
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${abbr}/roster`,
  );
  const json = (await res.json()) as { athletes?: Array<{ items?: Athlete[] }> };
  const teamCode = TEAM_FIX[abbr.toUpperCase()] ?? abbr.toUpperCase();
  const found: QB[] = [];
  // Only read the team's actual roster groups → items, never the whole payload.
  for (const group of json.athletes ?? []) {
    for (const a of group.items ?? []) {
      if (a.id && a.position?.abbreviation === "QB" && typeof a.fullName === "string") {
        found.push({
          slug: slugify(a.fullName),
          fullName: a.fullName,
          espnId: Number(a.id),
          defaultTeamCode: teamCode,
        });
      }
    }
  }
  return found;
}

async function main() {
  const all: QB[] = [];
  for (const abbr of ESPN_ABBRS) {
    try {
      const qbs = await rosterQBs(abbr);
      all.push(...qbs);
      process.stderr.write(`${abbr}: ${qbs.length} QBs\n`);
    } catch (e) {
      process.stderr.write(`${abbr}: FAILED ${(e as Error).message}\n`);
    }
  }
  // Dedupe by slug (keep first).
  const bySlug = new Map<string, QB>();
  for (const q of all) if (!bySlug.has(q.slug)) bySlug.set(q.slug, q);
  const list = [...bySlug.values()].sort((a, b) => a.fullName.localeCompare(b.fullName));

  process.stderr.write(`\nTOTAL unique QBs: ${list.length}\n`);
  // Emit as a TS array body.
  const lines = list.map(
    (q) =>
      `  { slug: ${JSON.stringify(q.slug)}, fullName: ${JSON.stringify(q.fullName)}, espnId: ${q.espnId}, defaultTeamCode: ${JSON.stringify(q.defaultTeamCode)} },`,
  );
  console.log(lines.join("\n"));
}

main();
