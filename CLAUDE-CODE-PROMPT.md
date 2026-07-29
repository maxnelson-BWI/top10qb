# Prompt to paste into Claude Code

Two jobs below. The site copy is already done — job 1 is just verifying and shipping it. Job 2 is
the real work.

Paste everything between the lines.

---

Read `VOICE.md` in the repo root first. It's the voice guide for this project, built from real
posts. Every copy decision below has to pass it.

## Job 1 — verify and ship the copy changes already in the working tree

There are uncommitted copy edits in `app/about/page.tsx`, `app/wrong/page.tsx`,
`app/archive/page.tsx`, `app/layout.tsx`, and `components/SignupForm.tsx`. They rewrite the site
copy to match `VOICE.md`.

Do this:

1. `git diff` and show me the copy changes in a readable before/after form, grouped by page.
2. Run `npm run build` and confirm it passes. (It compiles clean under `tsc --noEmit`, but the full
   build hasn't been verified — it needs network access to Google Fonts.)
3. Flag any line that still sounds like generic sports-media writing rather than the voice in
   `VOICE.md`. Be picky. Two previous attempts at this copy failed by sounding like a brand.
4. Don't commit yet. Show me first.

## Job 2 — fix the social graphics

The graphics are rendered by `app/graphics/list/route.tsx` using `next/og` `ImageResponse`. They're
structurally good but have three problems. Fix them in order.

### 2a. The font is wrong (biggest issue)

`GraphicBackground` sets `fontFamily: "sans-serif"`, so every graphic renders in the default
system sans. The website uses **Big Shoulders** (condensed athletic display) via `next/font/google`
in `app/layout.tsx`, plus Barlow for body text.

The graphics should match the site. Load the font files and pass them to `ImageResponse` via its
`fonts` option — `next/og` needs actual font data, it can't use `next/font` CSS variables.

- Use Big Shoulders (or the closest condensed athletic face) for the wordmark, "THE LIST", rank
  numbers, and QB names
- Use Barlow or similar for body copy
- Fetch the font files at build time or commit them to `public/graphics/assets/` — do NOT fetch
  from Google on every request, that will make the route slow and fragile
- Verify by rendering all three formats and looking at the output

This one change will do more for how these look than everything else combined.

### 2b. Dead vertical space

Both graphics bottom out well short of the frame:

- **Landscape (1600×900):** the two columns of five rows end around 60% height, leaving a large
  empty black band across the bottom right. Either grow the rows to fill the height, or rebalance
  the layout so the list occupies the full right panel.
- **QB1 portrait (1080×1350):** worse. The quote block ends around 60% and roughly a third of the
  image below it is empty. Tighten the top spacing and let the quote and footer breathe into the
  space, or scale the whole composition up.

Don't just add padding — the goal is a composition that looks intentionally full.

### 2c. Standing copy that doesn't match the voice

These hardcoded lines are in the essayist register `VOICE.md` warns about. Replace them with
something that sounds like the guy who wrote "Fantasy top 3, real life top 15."

| Where | Current |
|---|---|
| Landscape left panel | "The 10 quarterbacks I trust most right now." |
| Landscape left panel | "No panel. No model. Just one guy making the list." |
| Portrait header | "Ten quarterbacks. Ranked by one guy." |
| Portrait footer | "Disagree responsibly." |
| QB1 footer | "The ranking is serious. The authority is self-appointed." |
| QB1 fallback take | "He is No.1 because that is where I put him." |

Give me **three options for each**, don't just pick one. I want to choose.

Note: the site tagline is "your favorite rapper's favorite top 10 list" (in `lib/site.ts`) and it's
the best line in the whole project. Consider whether it belongs on the graphics.

### Constraints

- `ImageResponse` supports a limited subset of CSS. Every element needs an explicit `display`.
  Flexbox works; grid does not. Test as you go rather than making all changes at once.
- Don't change the data flow. Names, ranks, teams, movement arrows, dates, and takes must keep
  coming from the published ranking data. The whole point of code-rendered graphics is that the
  text is always exactly right.
- Render all three formats after each change and actually look at them:
  - `/graphics/list?format=landscape`
  - `/graphics/list?format=portrait`
  - `/graphics/list?kind=qb1`
- Also verify the `square` format works — it's implemented but was never in the example output.

When done: show me the rendered images, confirm the build passes, and don't commit until I've
looked.

## Job 3 — make lists nameable ("Playoffs 2025", "Offseason 2026") instead of "Week 1"

**The problem.** I have exactly two published lists and both are week number 1 — Season 2025 Week 1
and Season 2026 Week 1. So the admin index shows "Week 1" twice and the archive shows a giant "1"
twice. I want them to read as **"Playoffs 2025"** and **"Offseason 2026"**.

**The root cause** (already diagnosed — verify, then fix):

There *is* a `label` field on each week. It's in the database, it's in the `Week` and
`EditableWeek` types, it's editable in `components/admin/WeekEditor.tsx`, and `saveWeek` persists
it. But it's treated as a decorative badge rather than as the list's actual name. Three specific
gaps:

1. **`lib/admin-data.ts` → `listWeeks()`** doesn't `select` the `label` column at all, and
   `WeekSummary` has no `label` property. So the admin index *cannot* display it.
2. **`app/admin/page.tsx`** hardcodes `Season {w.season} · Week {w.weekNumber}` as the row title
   and renders `{w.weekNumber}` as the big numeral.
3. **`app/archive/page.tsx`** (~lines 106–143) renders a large `{w.weekNumber}` with the caption
   "Week" underneath, and only shows `label` as a small gold pill next to the No.1 name.

**What to change:**

- Add `label` to `WeekSummary` and to the `select` in `listWeeks()`.
- **Make `label` the primary display name wherever a list is named**, falling back to
  `Week {weekNumber}` when it's empty. This applies to the admin index, the archive rows, and
  anywhere else a week is titled. Grep for `weekNumber` to find them all — check
  `app/week/[season]/[week]/page.tsx`, `components/WeekBody.tsx`, and `components/Hero.tsx` too.
- **In the archive, when a label exists, don't render the big "N / WEEK" numeral.** A list called
  "Offseason 2026" showing a giant "1" next to it is exactly what looks broken. Use the label as
  the row's headline. Keep the layout balanced — if removing the numeral leaves a hole, rework the
  row rather than leaving dead space.
- **Do not change the URL structure or the database keys.** `/week/[season]/[week]` and the
  season+week uniqueness constraint stay exactly as they are. This is a display-layer change only.
  Season and week remain the identity; the label is just what humans see.

**Then set my actual data.** Once the display works, help me set these in `/admin`:

| Week | List label | Display date |
|---|---|---|
| Season 2025 · Week 1 | `Playoffs 2025` | something like `Jan 2026` |
| Season 2026 · Week 1 | `Offseason 2026` | something like `Jul 2026` |

Confirm with me before you write anything to the database. Tell me whether I should do it through
the admin UI or whether you'll do it directly, and note that the graphics regenerate from this
data — so fixing the label also fixes the stale "OFFSEASON RANKINGS 1 · FEB 2026" text currently
burned into the social images.

**Also check** `archiveStats()` in `lib/data.ts`. It reports "Seasons: 2" for these two lists,
which is technically true but reads oddly for an account this new. Tell me what you think — don't
change it unilaterally.

**Sanity check when done:** the archive should show two rows reading "Playoffs 2025" and
"Offseason 2026", the admin index should show the same names, both weeks should still open
correctly at their `/week/2025/1` and `/week/2026/1` URLs, and the graphics should show the new
label and date.
