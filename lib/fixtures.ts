/**
 * Local fallback data used ONLY when Supabase env vars are absent (e.g. local
 * preview before the database is wired up). Values are lifted from the design
 * package so the site renders pixel-close out of the box. Once Supabase is
 * configured, the data-access layer in lib/data.ts reads the DB instead and
 * these fixtures are ignored.
 */
import { QB_BY_SLUG, TEAM_BY_CODE } from "./reference";
import type {
  ArchiveEntry,
  Movement,
  PlayerProfile,
  RankedQB,
  TrendPoint,
  Week,
  WrongEntry,
} from "./types";

function mk(
  rank: number,
  slug: string,
  take: string,
  movement: Movement,
  teamCode?: string,
): RankedQB {
  const qb = QB_BY_SLUG[slug];
  const code = teamCode ?? qb.defaultTeamCode;
  const team = TEAM_BY_CODE[code];
  return {
    rank,
    qbSlug: slug,
    name: qb.fullName,
    teamCode: code,
    teamName: team.name,
    teamColor: team.primaryColor,
    espnId: qb.espnId,
    take,
    movement,
  };
}

// ---- Week 14 (the design sample) --------------------------------------------
export const WEEK_14: Week = {
  id: "fixture-2024-14",
  season: 2024,
  weekNumber: 14,
  displayDate: "Dec 10, 2024",
  tagline: "your favorite rapper's favorite top 10 list",
  label: null,
  heroImageUrl: null,
  status: "published",
  publishedAt: "2024-12-10T14:00:00Z",
  ranked: [
    mk(
      1,
      "lamar-jackson",
      "The debate is over. He didn't just win the argument — he bought the courthouse and renamed it after himself.",
      { kind: "holds", weeks: 6 },
    ),
    mk(
      2,
      "josh-allen",
      "MVP frontrunner who plays like the game owes him money. If he'd stop trying to truck-stick linebackers on 3rd-and-2 he'd be pushing #1.",
      { kind: "up", delta: 1 },
    ),
    mk(
      3,
      "patrick-mahomes",
      "Still Mahomes. Still terrifying. But the highlight reel's been on airplane mode and the eye test doesn't lie. Slot three, no apologies.",
      { kind: "down", delta: 1 },
    ),
    mk(
      4,
      "brock-purdy",
      "Mr. Irrelevant is now dangerously relevant. Yes I'm biased. No I won't apologize. The tape is immaculate and so is my conscience.",
      { kind: "up", delta: 2 },
    ),
    mk(
      5,
      "joe-burrow",
      "Carrying that roster like a piano up five flights of stairs. Give this man a defense and we'll talk top two.",
      { kind: "same" },
    ),
    mk(
      6,
      "jayden-daniels",
      "The rookie who skipped the rookie part. Fearless, accurate, and already living rent-free in three division rivals' nightmares.",
      { kind: "up", delta: 3 },
    ),
    mk(
      7,
      "jared-goff",
      "Indoors he's a surgeon. Outdoors he's a coin flip. Detroit's ceiling is real — but so is the weather in January.",
      { kind: "down", delta: 2 },
    ),
    mk(
      8,
      "jalen-hurts",
      "The Tush Push is undefeated; the deep ball is playing hard to get. Wins games, loses arguments with the film.",
      { kind: "down", delta: 1 },
    ),
    mk(
      9,
      "baker-mayfield",
      "The redemption arc nobody ordered and everybody's enjoying. Chip on the shoulder, ball on a rope. Respect.",
      { kind: "up", delta: 1 },
    ),
    mk(
      10,
      "sam-darnold",
      "I know. I KNOW. But look at the numbers before you @ me. The seeing-ghosts era is officially over. Welcome back to the list.",
      { kind: "new" },
    ),
  ],
  worst: {
    name: "The QB Who Shall Not Be Named",
    take:
      "Threw it to the other team so much they sent him a thank-you card. Three picks, one of which the defense is still laughing about.",
  },
  droppedOut: [
    { name: "Justin Herbert", previousRank: 7 },
    { name: "Kirk Cousins", previousRank: 9 },
    { name: "Dak Prescott", previousRank: 10 },
  ],
};

// ---- Archive (14 weeks; #1 per week) ----------------------------------------
// Plausible sample per the design README ("6 different No.1s").
const ARCHIVE_NO1: Array<{ wk: number; slug: string; date: string; note: string }> = [
  { wk: 14, slug: "lamar-jackson", date: "Dec 10", note: "Bought the courthouse. Renamed it." },
  { wk: 13, slug: "lamar-jackson", date: "Dec 3", note: "Still no arguments left to win." },
  { wk: 12, slug: "josh-allen", date: "Nov 26", note: "One week on the throne, then gave it back." },
  { wk: 11, slug: "lamar-jackson", date: "Nov 19", note: "Business as usual in Baltimore." },
  { wk: 10, slug: "patrick-mahomes", date: "Nov 12", note: "Undefeated ugly is still undefeated." },
  { wk: 9, slug: "lamar-jackson", date: "Nov 5", note: "The MVP tour makes a stop." },
  { wk: 8, slug: "josh-allen", date: "Oct 29", note: "Bullied a division rival on Sunday night." },
  { wk: 7, slug: "joe-burrow", date: "Oct 22", note: "Cincinnati's one-man rescue mission." },
  { wk: 6, slug: "jared-goff", date: "Oct 15", note: "Perfect passer rating, imperfect defense." },
  { wk: 5, slug: "josh-allen", date: "Oct 8", note: "Truck-stick tour continues." },
  { wk: 4, slug: "brock-purdy", date: "Oct 1", note: "Mr. Irrelevant's brief reign." },
  { wk: 3, slug: "patrick-mahomes", date: "Sep 24", note: "Rust, wins, and a #1 anyway." },
  { wk: 2, slug: "josh-allen", date: "Sep 17", note: "Week 2 statement game." },
  { wk: 1, slug: "lamar-jackson", date: "Sep 10", note: "The list begins where it always does." },
];

export const ARCHIVE: ArchiveEntry[] = ARCHIVE_NO1.map((e) => {
  const qb = QB_BY_SLUG[e.slug];
  const team = TEAM_BY_CODE[qb.defaultTeamCode];
  return {
    season: 2024,
    weekNumber: e.wk,
    displayDate: `${e.date}, 2024`,
    no1Name: qb.fullName,
    no1TeamCode: qb.defaultTeamCode,
    no1TeamColor: team.primaryColor,
    note: e.note,
    isCurrent: e.wk === 14,
  };
});

// ---- "Rankmaster Was Wrong" -------------------------------------------------
export const WRONG_ENTRIES: WrongEntry[] = [
  {
    id: "w1",
    grade: "F",
    weekRef: "Week 4",
    take: "Sam Darnold is what he's always been. Do not fall for it. He will break your heart by Halloween.",
    whatHappened:
      "Threw for 300+ in three of the next four, made the list at #10, and I had to write a very public apology.",
    verdict: "The seeing-ghosts era ended and I was still holding the flashlight.",
  },
  {
    id: "w2",
    grade: "D",
    weekRef: "Week 2",
    take: "Jayden Daniels is a fun story but rookies hit the wall. Slotting him at #9 and that's generous.",
    whatHappened: "Never hit the wall. Climbed to #6 and looks like a franchise cornerstone.",
    verdict: "Underrated the rookie. Won't happen again. (It will happen again.)",
  },
  {
    id: "w3",
    grade: "C",
    weekRef: "Week 7",
    take: "Mahomes at #1 is the safe pick and the safe pick is the right pick. Lock it in.",
    whatHappened: "The eye test soured for a month while Lamar ran away with it.",
    verdict: "Loyalty is a hell of a drug. Diagnosis: too loyal.",
  },
];

// ---- Player histories (for trend charts) ------------------------------------
// Lamar's full history is given in the design README.
const HISTORY: Record<string, number[]> = {
  "lamar-jackson": [3, 2, 2, 4, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1],
  "josh-allen": [1, 1, 4, 3, 1, 4, 3, 1, 3, 4, 1, 3, 3, 2],
  "patrick-mahomes": [2, 3, 1, 2, 3, 5, 1, 4, 2, 1, 4, 4, 2, 3],
  "brock-purdy": [8, 7, 6, 1, 5, 6, 5, 6, 7, 6, 6, 5, 6, 4],
  "joe-burrow": [5, 4, 3, 5, 4, 1, 4, 5, 4, 3, 3, 6, 5, 5],
  "jayden-daniels": [10, 9, 8, 9, 8, 7, 6, 8, 6, 7, 8, 7, 9, 6],
  "jared-goff": [6, 6, 7, 6, 6, 1, 7, 3, 5, 5, 5, 2, 4, 7],
  "jalen-hurts": [4, 5, 5, 7, 7, 8, 8, 7, 8, 8, 7, 8, 7, 8],
  "baker-mayfield": [9, 10, 9, 8, 9, 9, 9, 9, 10, 9, 9, 9, 10, 9],
  "sam-darnold": [11, 12, 11, 10, 11, 10, 10, 11, 11, 10, 11, 11, 11, 10],
};

export function fixturePlayer(slug: string): PlayerProfile | null {
  const qb = QB_BY_SLUG[slug];
  if (!qb) return null;
  const ranks = HISTORY[slug];
  const team = TEAM_BY_CODE[qb.defaultTeamCode];
  const history: TrendPoint[] = (ranks ?? []).map((rank, i) => ({
    weekNumber: i + 1,
    rank,
  }));
  return {
    slug,
    name: qb.fullName,
    teamCode: qb.defaultTeamCode,
    teamName: team.name,
    teamColor: team.primaryColor,
    espnId: qb.espnId,
    history,
  };
}
