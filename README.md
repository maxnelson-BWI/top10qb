# Top10QB — The World Renowned List

Your weekly NFL quarterback rankings site.

## How to Update Rankings Each Week

Every Tuesday, you only need to edit **one file**: `src/rankings-data.js`

### What to update:

1. **`CURRENT_WEEK_LABEL`** — Change to the current week (e.g., "Week 1 · Sep 2026")
2. **`CURRENT_DATE`** — Change to today's date
3. **`RANKINGS`** — Update the 10 QBs: reorder them, change commentary, update movement arrows
4. **`DROPPED`** — List any QBs who fell out of the top 10 this week
5. **`WORST`** — Pick your worst QB of the week
6. **`PLAYER_HISTORY`** — Add a new entry for each QB (this powers the charts on player pages)
7. **`ARCHIVE_WEEKS`** — Add a new entry at the top for this week

### Movement arrows:
- `{ dir: "up", spots: 2 }` — moved up 2 spots (green arrow)
- `{ dir: "down", spots: 1 }` — moved down 1 spot (red arrow)
- `{ dir: "same", spots: 0 }` — didn't move (dash)

### To add a "NEW" badge:
Add `badge: "NEW"` to any QB who just entered the top 10.

### After editing:
Save the file, commit to GitHub, and Vercel auto-deploys. Your site updates in about 60 seconds.

## Hero Image
The hero image lives at `src/assets/hero.png`. To update it (e.g., new season), replace this file with your new Canva export.
