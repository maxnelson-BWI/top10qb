// ============================================
// TOP10QB — WEEKLY RANKINGS DATA
// ============================================
// This is the ONLY file you need to edit each week.
// Update the rankings, commentary, and movement below,
// then save. Vercel will auto-deploy.
// ============================================

// Current week label and date (shown in the hero)
export const CURRENT_WEEK_LABEL = "Offseason · Feb 2026";
export const CURRENT_DATE = "February 3, 2026";

// ============================================
// YOUR TOP 10 RANKINGS
// ============================================
// For each QB:
//   rank: their number (1-10)
//   name: full name
//   team: team abbreviation (BAL, KC, BUF, CIN, PHI, HOU, WAS, SF, DAL, SEA, etc.)
//   commentary: your 1-2 sentence take
//   movement: { dir: "up" | "down" | "same", spots: number }
//   badge: (optional) "NEW" if they just entered the top 10
//   slug: lowercase-hyphenated version of their name (don't change once set)
//
export const RANKINGS = [
  {
    rank: 1,
    name: "Lamar Jackson",
    team: "BAL",
    commentary: "Still the one. Nobody in the league is doing what Lamar does on a weekly basis. The Rankmaster has spoken.",
    movement: { dir: "same", spots: 0 },
    slug: "lamar-jackson",
  },
  {
    rank: 2,
    name: "Patrick Mahomes",
    team: "KC",
    commentary: "Fine. He's good. The arm talent is stupid. I'm putting him at 2 and I don't want to talk about it.",
    movement: { dir: "same", spots: 0 },
    slug: "patrick-mahomes",
  },
  {
    rank: 3,
    name: "Josh Allen",
    team: "BUF",
    commentary: "The most fun player in football when he's cooking. Slight edge over Burrow because he does it all.",
    movement: { dir: "up", spots: 1 },
    slug: "josh-allen",
  },
  {
    rank: 4,
    name: "Joe Burrow",
    team: "CIN",
    commentary: "Great arm, great hair, but I'm not sure he's actually doing anything besides throwing screens that Ja'Marr takes 70 yards.",
    movement: { dir: "down", spots: 1 },
    slug: "joe-burrow",
  },
  {
    rank: 5,
    name: "Jalen Hurts",
    team: "PHI",
    commentary: "The dual-threat ability is real. The deep ball accuracy is a work in progress. Still top 5.",
    movement: { dir: "same", spots: 0 },
    slug: "jalen-hurts",
  },
  {
    rank: 6,
    name: "C.J. Stroud",
    team: "HOU",
    commentary: "Year two will tell us everything. Year one told us he's special.",
    movement: { dir: "up", spots: 2 },
    slug: "cj-stroud",
  },
  {
    rank: 7,
    name: "Jayden Daniels",
    team: "WAS",
    commentary: "Rookie magic is real but can he sustain it? I'm betting yes.",
    movement: { dir: "up", spots: 3 },
    badge: "NEW",
    slug: "jayden-daniels",
  },
  {
    rank: 8,
    name: "Brock Purdy",
    team: "SF",
    commentary: "Yes I'm a 49ers fan. Yes he's at 8. No, the bias isn't helping him — it might actually be hurting him.",
    movement: { dir: "down", spots: 1 },
    slug: "brock-purdy",
  },
  {
    rank: 9,
    name: "Dak Prescott",
    team: "DAL",
    commentary: "The most polarizing QB in football. I think he's good. Not great. Good. Come at me.",
    movement: { dir: "down", spots: 2 },
    slug: "dak-prescott",
  },
  {
    rank: 10,
    name: "Geno Smith",
    team: "SEA",
    commentary: "I have Geno Smith at 10 and I will not be elaborating further.",
    movement: { dir: "same", spots: 0 },
    slug: "geno-smith",
  },
];

// ============================================
// DROPPED OUT
// ============================================
// QBs who fell off the top 10 this week
export const DROPPED = [
  { name: "Tua Tagovailoa", prev: 9, slug: "tua-tagovailoa" },
  { name: "Justin Herbert", prev: 10, slug: "justin-herbert" },
];

// ============================================
// WORST QB OF THE WEEK
// ============================================
export const WORST = {
  name: "Bryce Young",
  team: "CAR",
  commentary: "I'm rooting for the kid. But the tape isn't rooting back.",
  slug: "bryce-young",
};

// ============================================
// RANKING HISTORY (for player page charts)
// ============================================
// Add a new entry for each QB each week.
// The "week" label shows on the chart X-axis.
// The "rank" is their position that week.
//
export const PLAYER_HISTORY = {
  "lamar-jackson": [
    { week: "Pre", rank: 1 },
    { week: "W1", rank: 1 },
    { week: "W2", rank: 1 },
    { week: "W3", rank: 2 },
    { week: "W4", rank: 1 },
    { week: "W5", rank: 1 },
    { week: "Off", rank: 1 },
  ],
  "patrick-mahomes": [
    { week: "Pre", rank: 2 },
    { week: "W1", rank: 2 },
    { week: "W2", rank: 1 },
    { week: "W3", rank: 1 },
    { week: "W4", rank: 2 },
    { week: "W5", rank: 2 },
    { week: "Off", rank: 2 },
  ],
  "josh-allen": [
    { week: "Pre", rank: 3 },
    { week: "W1", rank: 4 },
    { week: "W2", rank: 3 },
    { week: "W3", rank: 3 },
    { week: "W4", rank: 4 },
    { week: "W5", rank: 3 },
    { week: "Off", rank: 3 },
  ],
  "joe-burrow": [
    { week: "Pre", rank: 5 },
    { week: "W1", rank: 3 },
    { week: "W2", rank: 4 },
    { week: "W3", rank: 4 },
    { week: "W4", rank: 3 },
    { week: "W5", rank: 4 },
    { week: "Off", rank: 4 },
  ],
};

// ============================================
// ARCHIVE (past weeks)
// ============================================
// Each entry is one week's card in the Archive page.
// "top3" is just last names for the preview.
//
export const ARCHIVE_WEEKS = [
  { id: "offseason-feb-2026", label: "Offseason", date: "Feb 3, 2026", top3: ["Jackson", "Mahomes", "Allen"] },
  { id: "week-6", label: "Week 6", date: "Oct 15, 2026", top3: ["Jackson", "Mahomes", "Allen"] },
  { id: "week-5", label: "Week 5", date: "Oct 8, 2026", top3: ["Mahomes", "Allen", "Jackson"] },
  { id: "week-4", label: "Week 4", date: "Oct 1, 2026", top3: ["Allen", "Jackson", "Hurts"] },
  { id: "week-3", label: "Week 3", date: "Sep 24, 2026", top3: ["Mahomes", "Jackson", "Allen"] },
  { id: "week-2", label: "Week 2", date: "Sep 17, 2026", top3: ["Mahomes", "Hurts", "Allen"] },
  { id: "week-1", label: "Week 1", date: "Sep 10, 2026", top3: ["Mahomes", "Allen", "Hurts"] },
];
