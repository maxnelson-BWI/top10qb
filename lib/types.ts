/** Domain types shared by the public site and the admin tool. */

export type WeekStatus = "draft" | "published";

/** Movement of a QB vs. the previous published week. */
export type Movement =
  | { kind: "up"; delta: number }
  | { kind: "down"; delta: number }
  | { kind: "same" }
  | { kind: "new" }
  | { kind: "holds"; weeks: number }; // only used for the #1 hero ("HOLDS #1 · N weeks")

export type RankedQB = {
  rank: number; // 1–10
  qbSlug: string;
  name: string;
  teamCode: string;
  teamName: string;
  teamColor: string;
  espnId: number;
  take: string;
  movement: Movement;
};

export type DroppedQB = {
  name: string;
  previousRank: number;
};

export type WorstQB = {
  name: string;
  take: string;
};

export type Week = {
  id: string;
  season: number;
  weekNumber: number;
  displayDate: string; // e.g. "Dec 10, 2024"
  tagline: string; // hero italic tagline
  label: string | null; // optional custom list name, e.g. "Offseason Rankings 1"
  heroImageUrl: string | null; // optional action/tunnel shot for the #1 hero
  status: WeekStatus;
  publishedAt: string | null;
  ranked: RankedQB[]; // ordered 1..10
  worst: WorstQB | null;
  droppedOut: DroppedQB[];
};

/** A single archive list-item (one row per week). */
export type ArchiveEntry = {
  season: number;
  weekNumber: number;
  displayDate: string;
  label?: string | null; // custom list name (e.g. "Offseason Rankings 1")
  no1Name: string;
  no1TeamCode: string;
  no1TeamColor: string;
  note: string; // one-line DM Serif italic note
  isCurrent: boolean;
};

/** "Rankmaster Was Wrong" accountability entry. */
export type WrongEntry = {
  id: string;
  grade: string; // "F" | "D" | "C" ...
  weekRef: string; // e.g. "Week 6"
  take: string;
  whatHappened: string;
  verdict: string;
};

/** One point in a QB's ranking history. */
export type TrendPoint = {
  weekNumber: number;
  rank: number;
  note?: string;
};

export type PlayerProfile = {
  slug: string;
  name: string;
  teamCode: string;
  teamName: string;
  teamColor: string;
  espnId: number;
  history: TrendPoint[]; // ascending by weekNumber
};
