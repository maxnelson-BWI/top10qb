# Top10QB — Running Game Plan

*Updated July 27, 2026. This is the live doc. `Top10QB-Strategy-Reset-2026.md` is background;
where they disagree, this wins.*

**Scope: right now through Week 1.** This is an offseason plan. There is no weekly list in it,
because there is nothing to re-rank. The in-season plan gets written after Week 1, when there's
actual football to react to.

---

## The goal, stated honestly

Grow the account, build the habit of using X, and have a place to talk NFL with real people.
If it gets big, great. It's not a business. **If it stops being fun it isn't worth doing** — that's
a real constraint, not a disclaimer.

---

## Where things actually stand

The account was created in February but **posting started around July 21**. So:

| | |
|---|---|
| Age, in practice | ~1 week |
| Posts | 26 in five days (3 original, ~23 replies) |
| Followers | 8 |
| Typical reach | 7–312 impressions, driven mostly by the parent post's size |

**Corrected read:** ~5 posts a day in week one is a good pace, not a slow one. You don't have a
consistency problem — you have no baseline yet. Nobody can tell you what's working from five days
of data, including me. The job for the next few weeks is to **generate enough signal to have an
opinion later**, not to optimize anything now.

That reframes everything below. This is a data-collection phase disguised as posting.

**One thing to fix now:** your bio says "10 QBs. Ranked. Every Tuesday." There are no lists on the
account yet and there won't be weekly ones until September. Either soften the bio for the
offseason or publish an offseason list to back it up. Recommend the second — see the checklist.

---

## What changed from the Codex strategy

**Dropped: the 2-constructive-to-1-negative ratio.** I read every post looking for the meanness.
It isn't there. The spiciest thing you've written is calling a *ranking* a heroically bad take. A
ratio rule would make you hesitate before the fast reactions, which are your best material.
Replaced with one rule:

> If a post is only "this guy sucks," it needs a real football point or a better joke.

**Dropped: "add a specific football observation" as a default.** Your most analytical post is your
weakest one. Say what you'd say out loud watching the game, not what you'd write after.

**Dropped: the weekly volume targets.** 4–7 originals + 20–40 replies was written for the season.
In the offseason it's the wrong shape entirely.

**Changed: the voice direction.** Codex correctly spotted the Rankmaster costume was too heavy,
then over-corrected into a thoughtful-essayist voice that also isn't yours. See `VOICE.md`.

**Kept:** removing the invented stats, code-rendered graphics, honest email copy, accessibility
work. All correct.

---

## The offseason rhythm

No Tuesday list. The list updates **when something happens** — a trade, a holdout, a major injury,
a camp report that changes your mind. That's maybe 3–5 times between now and Week 1.

### The daily floor — 10 minutes, on your phone

Reply to 3–5 posts from big NFL accounts. That's it. That's the whole daily requirement.

This is the single highest-value habit available right now, because in the offseason **replies are
your entire distribution**. Nobody is finding your profile any other way at 8 followers.

Do it while you're already scrolling. If it feels like a task, it's too big.

### The weekly move — 20 minutes

One original post. Best formats for you, based on what you've already written:

- **The cross-sport question.** "Who is Jared Goff's NBA equivalent? I'll start: Zach LaVine" is a
  genuinely good format — low effort, invites replies, sounds like you. Run one a week.
- **The compressed verdict.** "Fantasy top 3, real life top 15." Your sharpest device. Offseason
  version: apply it to a guy everyone's arguing about.
- **A ranking reaction.** Someone posts a QB list every week in the offseason. React to theirs.
  It's free content and it's on-brand by definition.

### The event-driven list update

When real news hits, update the list and post the graphic. Between now and Week 1 that's a handful
of times. Each one is a rehearsal for the in-season workflow, which is the actual point.

---

## What to do less of

**Non-QB content.** The Madden create-a-jersey post is funny but it doesn't teach a stranger what
this account is. At 8 followers every post is a first impression. Save the general-NFL jokes for
when people already know why they follow you.

---

## Follower expectations, so you're not measuring against a fantasy

Daily replies plus a weekly original puts you in front of mid-to-large NFL audiences 25–35 times
a week. Realistic conversion at your size is a few followers a week, very lumpy, with zero weeks
and occasional spikes.

Between now and Week 1 that might be 50–150 followers. **That's a good offseason.** The real win
is arriving at Week 1 with a built habit, a tested pipeline, and a voice file with 200 real posts
in it instead of 26.

---

## The checklist — now through Week 1

Ordered. Nothing takes more than 30 minutes.

- [ ] **Fix the stale graphic label.** It says "Offseason Rankings 1 · Feb 2026." Both fields are
      already editable — `/admin` → the week → **Display date** and **List label** near the top.
      Change them, republish, graphics regenerate. (You thought this was missing. It isn't.)
- [ ] **Publish a fresh offseason list.** Closes the bio gap and rehearses the pipeline.
- [ ] **Time the pipeline.** Enter → publish → download graphic → caption → post. Tell me which
      step dragged and I'll cut it.
- [ ] **Fix the graphics font.** See the graphics notes — the renderer is falling back to default
      sans-serif instead of the site's condensed display face. Biggest single visual upgrade.
- [ ] **Check the X card.** Paste top10qb.com into a draft post and confirm the preview renders.
      Never tested against X's live crawler.
- [ ] **Run `npm audit`** in your terminal. Codex flagged three high-severity advisories it
      couldn't verify. Read it before running any `--force` fix.
- [ ] **Review the new site copy** (already written — see below) and push it.
- [ ] **Let the voice task run** a few Mondays and see if the file improves.

## Explicitly not doing yet

- Redesigning anything
- Connecting an email provider (wait for 50+ signups)
- X Premium (revisit with four weeks of data)
- Player action photos (rights unresolved, nothing is blocked on it)
- Writing the in-season plan (write it after Week 1, with real data)
- Money

---

## Review

Come back to this in four weeks. Three questions:

1. Did the daily floor hold?
2. Which posts actually earned profile visits?
3. Is it still fun?

If #3 is no, cut scope. Don't outsource the voice.
