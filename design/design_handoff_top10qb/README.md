# Handoff: Top10QB.com — Weekly NFL QB Ranking Site

## Overview
Top10QB.com is a mobile-first weekly NFL quarterback ranking site with a strong editorial
personality ("The Rankmaster"). The #1 QB **is** the homepage — no generic hero. Below it,
ranks 2–10 as tap-to-expand rows, a "Worst QB of the Week" callout, "Dropped Out," an email
signup, and a Follow button. Secondary pages: Archive, "Rankmaster Was Wrong," a per-player
Trend/Profile page, and an About page.

~90% of traffic is mobile (taps from X). **Design and build the phone experience first.**
The site's job is conversion: a stranger from a tweet should immediately think "this is a
real thing" and follow/subscribe.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the
intended look, layout, copy, and behavior. They are **not** production code to ship directly.
Recreate these designs in your target codebase using its established patterns and libraries
(React/Next, Vue, SwiftUI, etc.). If no environment exists yet, Next.js + Tailwind is a good
fit for this static, content-driven, SEO-relevant site.

> Note on `.dc.html`: these prototypes use a small internal render runtime (`support.js`) and
> a `<script type="text/x-dc">` logic block. That runtime is an authoring artifact — **ignore
> it**. All markup, styles, copy, and the rendering logic (rank data, chart math, expand/
> collapse) are plain and readable inside each file; lift the values, not the runtime.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions. Recreate
pixel-close using your component library. Exact tokens are listed below. The only placeholders
are QB portrait images (marked "QB CUTOUT PNG" / "HOODED FIGURE PHOTO") and the X handle
(`https://x.com/top10qb`).

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Canvas (page) | `#050506` | Body background (outside the 480px column) |
| Surface (app) | `#0b0a0c` | Main app column background |
| Surface raised | `#100f12` | Cards (Dropped Out, chart, week rows) |
| Surface hover-dark | `#161318` | About photo placeholder |
| Accent (primary) | `#e8462f` | The loud accent — numerals, arrows down, CTAs, kickers |
| Accent deep | `#a8281a` | Gradient end for red CTA |
| Gold | `#c9a227` | Secondary accent — team label text, #1 dots, kickers |
| Ravens purple | `#241773` | #1 hero gradient + signup gradient + photo bg |
| Purple deep | `#160d3f` / `#2a1a5c` | Gradient stops |
| Up / positive | `#3fb950` | Upward movement, "Highest" stat |
| Neutral text | `#f4f1ea` (quotes), `#c9c4bb` (body), `#e6ddd0` (serif body) | |
| Muted text | `#8a8578` | Labels, team names |
| Faint text | `#6b6862`, `#4a4842`, `#3a3630` | Section labels, hints, footer fine print |
| Hairline | `rgba(255,255,255,.07)` | Row/section dividers |

### Team accent bars (left spine on each rank/archive row)
Bills `#C60C30` · Chiefs `#E31837` · 49ers `#AA0000` · Bengals `#FB4F14` ·
Commanders `#5A1414` · Lions `#0076B6` · Eagles `#004C54` · Buccaneers `#D50A0A` ·
Vikings `#4F2683` · Ravens `#241773`

### Typography
- **Big Shoulders Display** (Google) — weights 500–900. All numerals, player/section
  display names, logo. Condensed, athletic. Used at 44–168px for the hero "1" and names,
  ~20–46px for section headers, ~26–34px for row numbers.
- **Barlow** (Google) — weights 400–700 + italic 500. All UI text, labels, body, buttons.
  Labels are uppercase with `letter-spacing` .06–.26em.
- **DM Serif Display** (Google) — italic. Pull-quotes ("the take"), taglines, one-liners.
  This serif italic is the personality voice — always italic, never for UI chrome.

### Spacing / radius / effects
- App column: `max-width: 480px`, centered. On ≥481px: `border-radius: 26px`, margin 24px,
  `box-shadow: 0 40px 90px -30px rgba(0,0,0,.8)`.
- Card radius: 14–20px. Pills: 100px. Row accent bar: 4–5px wide, radius 2–3px.
- Section padding: 20px horizontal standard.
- Sticky top nav: `rgba(11,10,12,.86)` + `backdrop-filter: blur(12px)`, bottom hairline.
- Hero background: `radial-gradient(135% 75% at 15% 0%, #2a1a5c 0%, #0b0a0c 56%)`.
- Diagonal "stripe" texture (jersey feel) on photo placeholders & signup:
  `repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 2px, transparent 2px 9px)`.
- Transitions: expand/collapse `max-height .28s ease, opacity .2s ease`; hover/tap .18s.

## Screens / Views

### 1. Homepage (`Top10QB Home.dc.html`)
- **Purpose:** Deliver the week's #1 QB with maximum impact; let users scan 2–10, read takes,
  and convert (subscribe/follow).
- **Layout (top→bottom):**
  1. **Sticky nav** — logo `TOP10QB` (the "10" in accent) left; links List / Archive / Wrong /
     About right (uppercase Barlow 11px, active = white, others muted, hover = accent).
  2. **Hero** — centered tagline *"your favorite rapper's favorite top 10 list"* (DM Serif
     italic, accent); gold kicker *"Week 14 · The No.1 Quarterback in Football"* (note: needs
     `margin-top:16px` breathing room below the tagline). Then a row: giant `1` (Big Shoulders
     800, 168px, accent) beside the QB portrait card (purple, stripe texture, gold bottom bar).
     Then name `LAMAR / JACKSON` (Big Shoulders 800, 60px, uppercase). Two pills: team
     (gold text + purple dot ringed gold) and movement (`▲ HOLDS #1 · 6 weeks`, green tint).
     Then the take pull-quote card (white-4% bg, 3px accent left border, DM Serif italic 23px)
     with `— The Rankmaster` attribution.
  3. **Ranks 2–10** — section label "The Rest of the List" + hint "Tap a name for the take".
     Each row: team-color spine, rank numeral (Big Shoulders 32px), name (Barlow 700 18px) +
     team (uppercase muted 11px), movement indicator (▲ green / ▼ accent / — muted / NEW gold),
     chevron. **Tap toggles** an expanding "take" (DM Serif italic 18px, team-color left border)
     plus a "View {firstName}'s trend →" link (gold, uppercase) → Player page.
  4. **Worst QB of the Week** — accent-tinted card, 🗑 label, big Big Shoulders name, italic
     roast, "— The Rankmaster, with love".
  5. **Dropped Out This Week** — raised card, list of name / "was #N" / "▼ OUT" (accent).
  6. **Email signup** — purple gradient card w/ stripe overlay, "Get the List / every Tuesday"
     (Big Shoulders uppercase), sub-copy, inline email input + accent "Get It" button.
     On submit: prevent default, reset, show gold confirmation "✓ You're in…".
  7. **Follow** — full-width white button, black X logo + "Follow @top10qb"; hover inverts to
     `#111`/white. Sub-line "Argue with the list. That's the whole point."
  8. **Footer** — logo, "The World Renowned List", link row, fine print.

### 2. Archive (`Top10QB Archive.dc.html`)
- **Purpose:** Prove the unbroken weekly streak; let users revisit any past week's #1.
- **Layout:** Header "The Archive" with three stat cards (14 Weeks Ranked / 0 Missed / 6
  Different No.1s). A green **streak ribbon** (14 filled segments, "● Unbroken streak"). Then
  one row per week (14→1): left = big week number + "WEEK"; team-color spine; **"NO.1 OVERALL"**
  gold micro-label above the QB name (this label was added so it's unmistakable the name is that
  week's #1) + one-line note (DM Serif italic); right = team + date "→". Current week is
  accent-tinted with a "Current" tag. Each row is a link (currently → home; wire to that week's
  archived list in production).

### 3. Rankmaster Was Wrong (`Top10QB Was Wrong.dc.html`)
- **Purpose:** Self-aware accountability page; screenshot/share bait.
- **Layout:** Dark-red-gradient header "RANKMASTER / WAS WRONG" + italic mission line + three
  stat cards (7 Bad Calls / 2 All-Timers / 89% Still Right). "The Hall of Shame" list: each
  entry is a card with a left **letter-grade block** (F/D/C, accent) + week, then "THE TAKE"
  (DM Serif italic), "WHAT ACTUALLY HAPPENED" (green label + body), and a dashed-top
  "Verdict:" line (gold label). Big accent share CTA "Screenshot it. Send it. Gloat." +
  black Follow button. Footer.

### 4. Player Profile / Trend (`Top10QB Player.dc.html`)
- **Purpose:** Per-QB history — where they've ranked over time. Reached by tapping a player.
- **Layout:** "← Back to the list"; "PLAYER PROFILE" kicker; header row (portrait card + name +
  team pill). Three stat cards: Current `#1` (white), Highest `#1` (green), Lowest `#4` (accent).
  **Ranking Trend** section with a segmented control **Last 3 / Season / All Time** (active =
  accent) and an inline **SVG line chart**: y-axis is rank (1 at top → 10 at bottom) with
  gridlines at #1/#4/#7/#10; accent line + area gradient; dots are accent, **gold when the rank
  was #1**; x-axis labeled by week. Legend below. **Week by Week** list (newest first): "Week N",
  rank numeral (gold if #1), optional italic note, and computed movement vs. prior week. Bottom
  "Agree? Disagree?" CTA + footer.
- **Chart implementation:** pure inline SVG, no chart library (keep it fast/light). See
  `drawChart()` in the file — viewBox 440×150, `x = padL + i*(W-padL-padR)/(n-1)`,
  `y = padT + (rank-1)*(H-padT-padB)/9`. Recreate with your charting approach or port the SVG.

### 5. About (`Top10QB About.dc.html`)
- **Purpose:** Establish the Rankmaster persona (deadpan, confident, self-aware — not cheesy).
  Client is undecided whether to keep this page.
- **Layout:** Purple-gradient hero with a giant faint "RM" watermark, "THE MAN BEHIND THE LIST"
  kicker, "THE / RANKMASTER" display, italic tagline. Bio (floated hooded-figure photo
  placeholder + two paragraphs, one linking to "I Was Wrong"). "CREDENTIALS" three cards
  (0 Years Played / A LOT Games Watched / 89% Hit Rate). "THE HOUSE RULES" numbered list
  (accent 0N numerals + rule text). Accent "Full Bias Disclosure" card (openly Ravens/49ers
  biased). White Follow button. Footer.

## Interactions & Behavior
- **Nav:** client-side routing between the five views. Active link white, others muted, hover
  accent (`.18s`).
- **Rank row expand (Home):** tap toggles the take open/closed (`max-height` 0 ↔ scrollHeight,
  opacity, chevron rotates 180°). The "View trend →" link inside stops propagation and navigates
  to the Player page.
- **Signup (Home):** `preventDefault`, clear field, show gold success message. Wire to a real
  list provider (e.g., ConvertKit/Beehiiv/Mailchimp) in production.
- **Trend range toggle (Player):** Last 3 / Season / All Time re-renders the chart with the
  sliced dataset; active segment gets accent bg + white text.
- **Movement indicators:** ▲ = `#3fb950`, ▼ = `#e8462f`, — = muted, NEW = gold. On the Player
  page, movement is computed from the rank delta vs. the previous week.
- **Responsive:** single 480px column, full-bleed on phones; on ≥481px it becomes a centered
  rounded card on the darker canvas. Everything is a vertical scroll — no horizontal scroll.
- **Hover (desktop):** links → accent; white Follow button → `#111` bg / white text.

## State Management
- `currentWeek` / selected week (drives Home + Archive).
- Per-row `expanded` boolean (Home rank rows).
- `trendRange` enum `last3 | season | allTime` (Player).
- Signup: `email`, `submitted`.
- **Data model:** a weekly ranking = ordered list of `{ rank, playerName, team, teamColor,
  movement, take }` + `worstQB` + `droppedOut[]`. A player = `{ name, team, teamColor,
  weeklyHistory[] }` where history is an array of ranks by NFL week (used for stats + chart).
  Archive = array of weeks, each with its `#1`, team, date, and one-line note. Content is
  authored weekly — back it with a CMS or flat files/MDX.

## Data / Content (as used in the mockups)
- **Week 14 ranks:** 1 Lamar Jackson (BAL), 2 Josh Allen (BUF), 3 Patrick Mahomes (KC),
  4 Brock Purdy (SF), 5 Joe Burrow (CIN), 6 Jayden Daniels (WAS), 7 Jared Goff (DET),
  8 Jalen Hurts (PHI), 9 Baker Mayfield (TB), 10 Sam Darnold (MIN). Exact takes/movement are
  in the Home file's `ranks` array.
- **Dropped Out:** Justin Herbert (#7), Kirk Cousins (#9), Dak Prescott (#10).
- **Archive weeks & Was-Wrong entries** are in their respective files' data arrays.
- **Lamar trend history (wk1→14):** `[3,2,2,4,2,2,2,2,1,2,1,2,1,1]`.
- These are plausible sample values — replace with real weekly data.

## Assets
- **Logo:** wordmark `TOP10QB` with the "10" in accent (`#e8462f`); condensed `T10QB` mark also
  exists. Restyle in Big Shoulders Display 900. No image asset required — it's type.
- **QB portraits:** transparent cutout PNGs on the purple card (placeholder now). Source per
  player.
- **About photo:** hooded-figure image (placeholder now).
- **X icon:** inline SVG (in the files). No icon library needed.
- **Fonts:** Google Fonts — Big Shoulders Display, Barlow, DM Serif Display.

## Files
- `Top10QB Home.dc.html` — homepage (hero + ranks + worst + dropped + signup + follow)
- `Top10QB Archive.dc.html` — weekly archive + streak stats
- `Top10QB Was Wrong.dc.html` — accountability page
- `Top10QB Player.dc.html` — player profile + ranking trend chart
- `Top10QB About.dc.html` — Rankmaster bio (client may cut)
- `support.js` — authoring runtime only; **do not port** (see note at top)
