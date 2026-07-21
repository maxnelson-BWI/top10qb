import type { Movement } from "./types";

/**
 * Auto-calculate a QB's movement from its new rank and its rank in the previous
 * week (undefined = not ranked last week). Pure + client-safe.
 */
export function autoMovement(
  rank: number,
  prevRank: number | undefined,
  no1HoldWeeks?: number,
): Movement {
  if (rank === 1 && prevRank === 1 && no1HoldWeeks && no1HoldWeeks > 1) {
    return { kind: "holds", weeks: no1HoldWeeks };
  }
  if (prevRank === undefined) return { kind: "new" };
  const delta = prevRank - rank;
  if (delta > 0) return { kind: "up", delta };
  if (delta < 0) return { kind: "down", delta: -delta };
  return { kind: "same" };
}

const GREEN = "#3fb950";
const ACCENT = "#e8462f";
const MUTED = "#8a8578";
const GOLD = "#c9a227";

export type MovementDisplay = {
  /** Short label for a rank row, e.g. "▲ 1", "▼ 2", "— 0", "NEW". */
  label: string;
  color: string;
};

/** Rank-row movement indicator (ranks 2–10). */
export function movementLabel(m: Movement): MovementDisplay {
  switch (m.kind) {
    case "up":
      return { label: `▲ ${m.delta}`, color: GREEN };
    case "down":
      return { label: `▼ ${m.delta}`, color: ACCENT };
    case "same":
      return { label: "— 0", color: MUTED };
    case "new":
      return { label: "NEW", color: GOLD };
    case "holds":
      return { label: "▲ HOLDS", color: GREEN };
  }
}

/** The #1 hero movement pill, e.g. "▲ HOLDS #1 · 6 weeks" or "▲ NEW #1". */
export function heroMovement(m: Movement): { main: string; sub: string; color: string } {
  switch (m.kind) {
    case "holds":
      return { main: "▲ HOLDS #1", sub: `· ${m.weeks} weeks`, color: GREEN };
    case "up":
      return { main: "▲ NEW #1", sub: `· up ${m.delta}`, color: GREEN };
    case "new":
      return { main: "★ DEBUT #1", sub: "", color: GOLD };
    case "same":
      return { main: "— STILL #1", sub: "", color: MUTED };
    case "down":
      return { main: "▲ RECLAIMS #1", sub: "", color: GREEN };
  }
}
