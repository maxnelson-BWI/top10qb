# Top10QB — Review Packet

*Prepared July 27, 2026*

This document is the handoff for a second-opinion review. It explains what Top10QB is, what was
changed, why those decisions were made, where every important file lives, what was tested, and
what remains intentionally unresolved.

## 1. What Top10QB Is

Top10QB is a one-person NFL quarterback-ranking project.

The core idea is:

> One guy ranks the ten quarterbacks he trusts most right now. The opinions are real. The overly
> official presentation is the joke.

The weekly list is the product. X is where people discover and argue with it. The website is the
permanent record: the current ranking, the reasoning, old lists, player trends, and calls that aged
badly.

The goal is not to imitate a large sports-media company. The desired experience is closer to a
smart football conversation with a friend who has watched the games, has a point of view, and is
willing to keep the receipts.

## 2. What Codex Was Asked to Do

The work began with four review questions:

1. Does the redesigned website work, and what should be improved?
2. Does the existing strategy make sense, and what holes does it have?
3. Is the proposed AI-assisted content workflow realistic, and can Codex do work similar to
   Claude Cowork?
4. Does the current X voice work, especially given concern that too many posts may be negative?

The follow-up request was to:

- Implement the recommended website changes
- Build reusable social graphics
- Rewrite the strategy guide
- Preserve the work in the repository
- Deploy the finished changes to the production site

No social posts were published, no emails were sent, and no subscriber or ranking records were
manually changed as part of this work.

### Publishing status at handoff

The complete work is saved locally on the `main` branch in a commit named:

> Refine Top10QB voice, strategy, and weekly graphics

The production Vercel project and domains were identified and verified. Production is connected
to the GitHub repository `maxnelson-BWI/top10qb`, so pushing `main` will automatically start the
live deployment.

The push could not be completed from Codex because:

- The connected GitHub integration has permission to inspect the repository but not write to it.
- The terminal does not currently have a GitHub password/token available.
- The connected Vercel deployment action returned an invalid-argument error even after the local
  project was linked to the correct Vercel project.

No partial deployment was made. The existing live site was left untouched. To finish publishing,
open this repository in GitHub Desktop and click **Push origin**. GitHub Desktop is already
installed on this Mac. That single push should trigger the existing Vercel production deployment.

## 3. Main Strategic Conclusions

### Define what the ranking means

The revised strategy gives the list one consistent question:

> Which ten quarterbacks would I trust most to play a game this Sunday?

This is meant to prevent arguments from shifting between career résumé, MVP value, fantasy value,
future potential, and current quarterback play.

### Keep the confidence, reduce the costume

The voice should be confident enough to be worth debating and self-aware enough to be fun.

The previous site leaned too heavily on the fictional “Rankmaster” character. The recurring bits
still have value, but they now work as seasoning:

- “The World Renowned List”
- Excessively official-looking graphics
- Occasional Rankmaster language

Most explanatory copy now uses “I” and admits that this is one person making the list.

### Criticism is allowed; one-note negativity is not

The recommendation was not to make the account nicer or less opinionated. It was to make negative
takes more specific and to prevent them from becoming the entire identity.

The strategy uses a loose guardrail of roughly two constructive, positive, curious, or analytical
posts for every pure negative post.

A useful critical post should usually:

- Criticize the performance or decision rather than the person
- Explain what the quarterback should have done instead
- Avoid turning one bad game into a permanent judgment
- Give readers a real football point to debate

### Use replies for discovery without becoming a reply bot

The prior strategy’s suggested volume was too high for a three-to-five-hour weekly commitment.
The revised healthy range is:

- 4–7 original posts per week, including the Tuesday list
- 20–40 thoughtful replies per week
- One positive “case for” post
- One worthwhile disagreement or comparison

These are ranges, not daily quotas.

### AI removes production work; it does not manufacture the opinion

The recommended division of labor is:

**The owner decides:**

- The rankings
- The actual reason for controversial placements
- Which jokes sound natural
- What gets posted

**AI prepares:**

- Caption options
- Thread drafts
- Riser/faller ideas
- Positive “case for” ideas
- Head-to-head comparisons
- Sunday watch notes
- Candidates for the accountability page

**The website produces:**

- Exact graphics from published ranking data
- The archive
- Permanent links and social previews

Nothing should post automatically.

### Codex versus Claude

The recommendation was:

- Use Codex when the work touches this repository, the website, the admin tool, the database, or
  the graphics renderer.
- Use either Codex or Claude for writing and brainstorming. Choose the one whose drafts require
  less editing.
- Keep the published rankings and takes in the Top10QB admin/database rather than maintaining
  conflicting source material in multiple AI tools.

The new graphics system removes the highest-risk part of the tool decision. Neither model needs to
draw ten names, dates, ranks, and movement arrows correctly every Tuesday.

## 4. Website Changes

### About page

File: `app/about/page.tsx`

The About page was rewritten around the one-person premise.

Removed:

- The placeholder “hooded figure” photo box
- The invented 89% hit rate
- The claim that seven wrong calls were already documented
- The fake credentials/stat cards
- Excessive third-person Rankmaster language

Added:

- A plain explanation of who makes the list
- A clear definition of what the ranking means
- Four honest ranking rules
- A more believable bias disclosure
- A first-person voice

### Archive

Files:

- `app/archive/page.tsx`
- `lib/data.ts`

Removed claims that the site had never missed a week or maintained an unbroken streak. Those
claims were not supported by the number of published archive entries.

The Archive now shows facts derived from the database:

- Lists kept
- Seasons represented
- Different No.1 quarterbacks

The ribbon now says “The complete record.”

### I Was Wrong

File: `app/wrong/page.tsx`

Removed:

- The invented 89% “Still Right” statistic
- The invented “All-Timers” count
- The joke that an empty database proved the Rankmaster had never been wrong
- The hard-coded 2024 heading

The empty state now says that no entries have been added yet and explicitly acknowledges that this
is not proof of perfect judgment.

### Email signup

File: `components/SignupForm.tsx`

The previous form promised that the first list would arrive Tuesday at 9 a.m., but the application
currently stores addresses without sending an email.

The form now honestly describes itself as early access to a future email edition. The success
message confirms that the address was saved without promising a delivery date.

Accessibility improvements include:

- A real label for the email field
- Browser autocomplete support
- A live status message for screen readers

The form does not send the entered email address to analytics.

### Weekly negative feature

File: `components/WeekBody.tsx`

During the offseason, “Worst QB of the Week” is displayed as “QB I’m Worried About.” During the
season it becomes “Roughest QB Week.”

This keeps room for criticism while reducing the sense that the project exists mainly to call
players terrible.

The underlying admin/database field is unchanged, so no migration was required.

### Ranking-row accessibility

Files:

- `components/RankRow.tsx`
- `app/globals.css`

The expandable ranking rows were clickable `<div>` elements. They are now real buttons with:

- Keyboard support
- Visible focus styling
- `aria-expanded` state
- A connection to the expanded take
- Hidden, non-focusable links while a take is collapsed

### Page structure

Files:

- `components/Hero.tsx`
- `components/Nav.tsx`
- `components/Footer.tsx`
- `app/page.tsx`
- `app/player/[slug]/page.tsx`

Added or corrected semantic headings, navigation, footer structure, and empty-state headings.

### Social sharing

Files:

- `app/layout.tsx`
- `app/week/[season]/[week]/page.tsx`
- `app/player/[slug]/page.tsx`
- `app/about/page.tsx`
- `app/archive/page.tsx`
- `app/wrong/page.tsx`

Added:

- A real Open Graph image
- A real X/Twitter large-card image
- More natural site description
- Page-specific titles and descriptions
- Per-week social titles and images
- Canonical URLs
- Search-engine blocking for private admin pages

The homepage social preview uses the automatically generated current-list graphic.

### Analytics

Files:

- `app/layout.tsx`
- `components/FollowButton.tsx`
- `components/SignupForm.tsx`
- `package.json`
- `package-lock.json`

Added Vercel Analytics for:

- Page views
- Referral sources
- Successful email-signup events
- Clicks on the main X follow button

No email address or other personally identifying form data is sent to analytics.

Vercel Web Analytics may still need to be enabled in the Vercel dashboard if it is not already
active for the project.

## 5. Graphics System

### What was built

Public rendering route:

- `app/graphics/list/route.tsx`

Private admin page:

- `app/admin/graphics/page.tsx`

Admin navigation:

- `app/admin/page.tsx`

The private admin now offers three downloadable images generated directly from the current
published ranking:

1. 1600 × 900 landscape list for X and social previews
2. 1080 × 1350 portrait list
3. 1080 × 1350 No.1 quarterback card

The graphics automatically update after a new list is published. Names, ranks, team codes,
movement arrows, dates, and takes come from the same data used by the website.

### Generated example files

- `output/graphics/top10qb-list-landscape.png`
- `output/graphics/top10qb-list-portrait.png`
- `output/graphics/top10qb-qb1-portrait.png`

### Original background asset

- `public/graphics/assets/editorial-stadium-texture.png`
- `public/graphics/assets/README.md`

The texture was AI-generated from the supplied Canva screenshots as visual-direction references.
The prompt requested:

- A near-black editorial sports background
- Restrained burnt-orange and deep-violet light
- Fine diagonal pinstripes and paper grain
- Faint scoreboard-like geometry
- No text, numbers, logos, people, players, footballs, team marks, border, or watermark

AI does not generate any ranking text or player imagery.

### Why this approach was chosen

The supplied Canva work had strong ingredients:

- Dark editorial background
- Orange accent
- Large rank numbers
- Clear hierarchy

The recurring ranking graphics need exact text and must be fast to update. Code rendering preserves
the visual direction while eliminating manual weekly editing and AI spelling/ranking errors.

Canva remains available for special one-off work but is no longer required for weekly publishing.

## 6. Strategy Document

File:

- `Top10QB-Strategy-Reset-2026.md`

The strategy was rewritten rather than lightly edited.

Major changes include:

- A clear definition of the ranking
- A simpler description of the brand
- First-person voice rules
- A constructive-versus-negative content guardrail
- A realistic weekly publishing rhythm
- More targeted reply guidance
- X Premium treated as an experiment rather than a requirement
- An honest email-launch threshold
- A model-agnostic AI workflow
- A clear Codex-versus-Claude recommendation
- A four-week measurement system
- A staged plan from the offseason through Week 1
- Monetization intentionally deprioritized

The previous fixed claims about X’s algorithm, reply-impression percentages, engagement timing,
and permanent penalties were removed because they were too certain and can become outdated.

## 7. Other Documents Updated

### `README.md`

Updated to explain:

- The one-person premise
- Vercel Analytics
- The honest Archive
- The revised About and accountability pages
- The automatic graphics route and admin page

### `SETUP.md`

Updated with plain-English instructions for:

- The current email behavior
- Weekly graphic downloads
- Vercel Analytics

### `public/graphics/assets/README.md`

Documents the AI-generated texture, its prompt direction, and the boundary between generated
background art and exact code-rendered content.

### `CLAUDE-REVIEW-PACKET.md`

This file. It is intended to make a second-opinion review possible without reconstructing the full
conversation.

## 8. Verification Performed

### Production build

Command:

```bash
npm run build
```

Result:

- Next.js production build passed
- TypeScript checks passed
- All application routes compiled

The restricted local sandbox could not always reach Supabase during a build, so the project’s
existing safe fixture fallback was used for those static-generation requests. The live local
server later loaded the actual published current list successfully.

### Browser verification

Verified at phone and desktop widths:

- Homepage loads with meaningful content
- About page loads with revised copy
- Archive shows honest counts
- I Was Wrong shows the honest empty state
- No Next.js error overlay
- No fresh browser console errors
- Desktop app column remains centered at 480 pixels
- Mobile navigation remains usable
- Ranking rows open and close correctly
- Collapsed ranking links are not keyboard-focusable
- Email field has an accessible label

### Graphic verification

All three PNGs were rendered and visually inspected.

The download response was checked for:

- HTTP 200
- `image/png`
- Correct download filename
- One-hour shared cache plus stale fallback

### Social metadata

Verified that the homepage includes:

- Canonical `https://top10qb.com`
- The revised description
- An absolute Open Graph image URL
- An absolute X/Twitter image URL

## 9. Files Added

- `CLAUDE-REVIEW-PACKET.md`
- `Top10QB-Strategy-Reset-2026.md`
- `app/admin/graphics/page.tsx`
- `app/admin/layout.tsx`
- `app/graphics/list/route.tsx`
- `public/graphics/assets/editorial-stadium-texture.png`
- `public/graphics/assets/README.md`

The following generated examples are also saved locally in `output/graphics/`:

- `top10qb-list-landscape.png`
- `top10qb-list-portrait.png`
- `top10qb-qb1-portrait.png`

They are intentionally ignored by Git because they can be regenerated from `/admin/graphics` and
are not required by the live site.

## 10. Files Modified

- `.gitignore`
- `README.md`
- `SETUP.md`
- `app/about/page.tsx`
- `app/admin/page.tsx`
- `app/archive/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/player/[slug]/page.tsx`
- `app/week/[season]/[week]/page.tsx`
- `app/wrong/page.tsx`
- `components/FollowButton.tsx`
- `components/Footer.tsx`
- `components/Hero.tsx`
- `components/Nav.tsx`
- `components/RankRow.tsx`
- `components/SignupForm.tsx`
- `components/WeekBody.tsx`
- `lib/data.ts`
- `package.json`
- `package-lock.json`

## 11. Intentional Open Questions

These were not silently decided:

1. **Email provider:** Addresses are stored, but an actual email provider is not connected.
2. **About voice:** The new version is more natural, but the owner should still decide whether it
   feels recognizably like him.
3. **Rankmaster balance:** The current recommendation is to keep it as a recurring bit rather than
   the primary narrator.
4. **Player photography:** The site already contains a Lamar Jackson action image. Rights and
   sourcing for future action photos should be reviewed before expanding that library.
5. **Accountability entries:** No fake examples were added. The first entry should be based on a
   real saved take with enough evidence to revisit.
6. **X Premium:** Recommended only as a measured 30-day experiment.
7. **Posting workflow:** AI can prepare weekly material, but no recurring automation or automatic
   posting has been enabled.
8. **Dependency audit:** npm reported three high-severity advisories when Analytics was installed.
   The environment blocked the detailed online audit because it would transmit dependency
   metadata. An offline audit found no cached advisories, which is not conclusive. Run `npm audit`
   in an authorized local terminal and review the exact packages before applying an automatic fix.

## 12. Suggested Questions for Claude

Claude should review the repository and answer:

1. Does the revised About page sound human and appropriately self-aware, or has it become too
   restrained?
2. Is “Which ten quarterbacks would I trust most to play a game this Sunday?” the best ranking
   definition?
3. Does the revised strategy realistically fit a three-to-five-hour weekly commitment?
4. Is the two-constructive-to-one-negative guardrail useful, or too formulaic?
5. Does the graphics system preserve the best parts of the Canva direction?
6. Are there any accessibility, security, caching, metadata, or Next.js implementation problems?
7. Is there any claim in the strategy that is still too certain or insufficiently supported?
8. What should be simplified further before Week 1?
9. What is the smallest reliable way to launch the actual email edition?
10. Which parts of the Rankmaster character should remain, and which still feel forced?

Claude should distinguish:

- A real bug
- A strategic disagreement
- A subjective voice preference
- An optional future enhancement

## 13. How to Inspect the Work

From the repository root:

```bash
npm install
npm run build
npm run dev
```

Important public routes:

- `/`
- `/about`
- `/archive`
- `/wrong`
- `/player/lamar-jackson`
- `/graphics/list?format=landscape`
- `/graphics/list?format=portrait`
- `/graphics/list?kind=qb1`

Private routes:

- `/admin`
- `/admin/graphics`

The private routes require the existing Supabase magic-link admin login when the database
environment is configured.

## 14. Bottom Line

The work was guided by one principle:

> Make Top10QB feel more like a specific person with a good football argument and less like a
> fictional media organization trying to look large.

The site still has confidence, color, recurring jokes, and room for strong negative opinions. It
now makes fewer unsupported claims, has a clearer definition, is more accessible, produces its own
weekly graphics, and has a strategy that is more likely to survive an entire season.
