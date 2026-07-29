/**
 * Standing copy for the social graphics.
 *
 * This is the only text on the graphics that isn't pulled from the published
 * ranking — names, ranks, teams, movement, dates and takes all still come from
 * the database. Everything here is a fixed line that repeats every week, which
 * is exactly the copy most likely to drift out of voice. Read VOICE.md before
 * changing any of it.
 *
 * Each slot ships two variants (A and B) so the weekly post can alternate, and
 * carries the rejected alternates in a comment so swapping one is a one-line
 * edit rather than a rewrite.
 */

export type Variant = "a" | "b";

export const TAGLINE = "your favorite rapper's favorite top 10 list";

/**
 * Landscape left rail, the big line under "THE LIST".
 *
 * Options considered:
 *   1. "Who I'd want playing QB for me on Sunday."   ← A
 *   2. "[ranks the entire quarterback position and logs off]"  ← B (bracket move)
 *   3. "Fantasy points not included."
 */
export const LANDSCAPE_LEAD: Record<Variant, string> = {
  a: "Who I'd want playing QB for me on Sunday.",
  b: "[ranks the entire quarterback position and logs off]",
};

/**
 * Landscape left rail, the smaller line under the lead.
 *
 * Options considered:
 *   1. the site tagline                              ← A
 *   2. "Nobody asked me to do this."                 ← B
 *   3. "No panel voted on this one."
 */
export const LANDSCAPE_SUB: Record<Variant, string> = {
  a: TAGLINE,
  b: "Nobody asked me to do this.",
};

/**
 * Portrait/square header, opposite "THE LIST".
 *
 * Options considered:
 *   1. the site tagline                              ← A
 *   2. "Ten guys. In order. That's the whole thing."  ← B
 *   3. "The whole league, sorted."
 */
export const LIST_HEADER: Record<Variant, string> = {
  a: TAGLINE,
  b: "Ten guys. In order. That's the whole thing.",
};

/**
 * Portrait/square footer, bottom left.
 *
 * Options considered:
 *   1. "Take it up with me."                         ← A
 *   2. "Screenshot it and yell."                     ← B
 *   3. "You're allowed to be wrong about this."
 */
export const LIST_FOOTER: Record<Variant, string> = {
  a: "Take it up with me.",
  b: "Screenshot it and yell.",
};

/**
 * QB1 footer, bottom left.
 *
 * Options considered:
 *   1. the site tagline                              ← A
 *   2. "Nobody gave me this job."                    ← B
 *   3. "I take this way more seriously than anyone asked me to."
 */
export const QB1_FOOTER: Record<Variant, string> = {
  a: TAGLINE,
  b: "Nobody gave me this job.",
};

/**
 * QB1 quote fallback — only renders when the No.1 has no take saved, which
 * should basically never happen. Kept short on purpose.
 *
 * Options considered:
 *   1. "If you've got someone else at 1, that's a heroically bad take."  ← A
 *   2. "This one isn't close."                                          ← B
 *   3. "Ask me again in January."
 */
export const QB1_FALLBACK_TAKE: Record<Variant, string> = {
  a: "If you've got someone else at 1, that's a heroically bad take.",
  b: "This one isn't close.",
};

/** Standing kicker over the No.1's name. Same both variants. */
export const QB1_KICKER = "The No.1 quarterback in football";

export const SITE_FOOTER = "top10qb.com · @top10qb";

export function parseVariant(raw: string | null): Variant {
  return raw === "b" ? "b" : "a";
}
