/** Small site-wide flags/constants. */

export const X_HANDLE = "top10qb";
export const X_URL = "https://x.com/top10qb";

/** Toggle the About page in nav/footer (client was undecided about keeping it). */
export const SHOW_ABOUT = true;

/** The hero tagline — fixed site-wide, same every week. */
export const TAGLINE = "your favorite rapper's favorite top 10 list";

/**
 * What a list is called wherever it's named for a human: "Playoffs 2025",
 * "Offseason 2026", or "Week 7" when it has no label.
 *
 * `label` is the display name only. Identity is still (season, weekNumber) —
 * that's the URL and the DB uniqueness constraint — so this never touches
 * routing or keys.
 */
export function listName(list: { label?: string | null; weekNumber: number }): string {
  return list.label?.trim() || `Week ${list.weekNumber}`;
}
