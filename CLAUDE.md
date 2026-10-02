# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

aheadt1d.com — served as static files (it sits behind Cloudflare; pushing to `main` is how it gets updated). No framework, no package.json, no CI in this repo.

**History:** rebuilt 2026-09-18 as one page, then grew again (Sep 23-27) into a small multi-page site. Older pages are in git history.

## Files (as of 2026-09-27)

- `index.html`: home. Hero, downloads (with SHA-256 checker + download gate), setup, AheadBLE explainer, safety/privacy summary, permissions, FAQ.
- `resources.html` / `resources-science.html`: simple "start here" page + full deep dive (see "Resources pages" below). `learn.html` redirects to `resources.html`.
- `tutorial.html`: interactive alert simulator.
- `login.html`, `signup.html`, `portal.html`, `reset-password.html`, `verify-email.html`: the account pages. They talk to `ahead-backend`, whose address comes from **`api-config.js`** (one line; change it there, not in each page). `portal.html` shows the signed-in user's own live glucose; that is the only place the site fetches glucose, and only for the logged-in account.
- `report.html`: the doctor-facing CGM report (AGP percentiles, time in ranges vs consensus goals, low episodes, time-of-day patterns, logged events with +1h/+2h response, daily profiles). Built in the browser from `GET /api/readings/range` + `GET /api/events`; prints to PDF via the browser. Light theme on purpose (it's a printed document); range colors are a CVD-validated set and every range is labeled in text. Notes are owner-only (shared reports omit them).
- Portal "Your Event Log" card: lists/adds/deletes events via `/api/events`; they two-way sync with the phone (see `ahead-backend/routes/events.js`).
- `legal.html`: Privacy Policy, Terms of Use, software licenses. NOT lawyer-reviewed (the page says so). `privacy.html` is just a redirect to `legal.html#privacy`; don't grow it back into a second copy.
- `download.html`: redirect to `index.html#downloads`.
- `downloads/`: the three debug APKs. `media/`: real screenshots (see rules).

Many pages are now hand-edited directly in this repo. `index.html`/`legal.html` were originally generated from `website-drafts/claude-download/src` (`node build-v2.mjs`); if you edit them here, the generator source is out of date, so check with the owner before regenerating over these edits.

**The backend is self-hosted on the owner's PC** behind a Cloudflare tunnel (currently a `trycloudflare.com` quick tunnel that changes address on restart). The plan is a named tunnel at `https://api.aheadt1d.com`; the switchover checklist is in `ahead-backend/SERVICE-SETUP.md`. The privacy policy describes this setup; if hosting or vendors change (e.g. Resend for email), update `legal.html` in the same change.

The account pages ignore a `?api=` URL override except on localhost/file:// (it used to let a crafted link send credentials to another server). Keep it that way.

## Rules that must hold

- **Privacy history:** `reports/` once held real personal glucose exports, scrubbed from the entire git history via `git filter-repo`. It is gitignored specifically to stop that recurring — do not remove the entry, and treat anything appearing under `reports/` as suspect. Do not re-add a public "see your live glucose from any browser" link, and do not fetch live glucose on public pages (the old status-orb did; it's gone). The signed-in portal showing the user's own data is the exception.
- **Be honest on the page.** Claims come from the code, not vibes: "data never leaves your device" was false (family sharing uploads readings), so it isn't on the page. The three apps are beta debug builds and the page says so.
- Don't explain the trend-detection thresholds/formulas on the site — describe the concept only.
- AheadBLE is GPLv3 (builds on Juggluco). The page links to `github.com/NootedNoot/ahead-ble` for source; that repo needs a LICENSE and to be public for the link to resolve (owner is handling this).

## Spooky season theme

Both pages have a friendly Halloween mode: mouse trail of ghosts/bats/pumpkins, moon, cobwebs, cats, a skeleton, an owl, hanging bats, a pumpkin-patch footer. It turns on automatically Sep 1 - Nov 3 each year, can be forced with `?spooky=1` / `?spooky=0`, and has a pumpkin toggle in the nav (choice is remembered in localStorage `ahead-spooky`). Off = the normal purple sparkles.

Owner's rules for any theme/decoration work: **no candy, sweets or food imagery or wording** (this is a Type 1 diabetes app; pumpkins/jack-o'-lanterns are fine) and **no death jokes** (he vetoed tombstones/"R.I.P."). Keep it friendly. The art is generated from `gen-art.py` and `gen-spooky2-css.py` in the source folder (`website-drafts/claude-download`).

## Download gate (click-through terms)

Every APK download button on `index.html` opens an agree-to-continue popup (medical disclaimer, own-risk/release, Dexcom non-affiliation, minors, emergencies) with a required checkbox; the download only starts after "Accept & download". It asks every time; a note of which app/when is stored in the visitor's own browser only (`localStorage` `ahead-dl-accepted`, terms version stored with each note). The fuller Terms live in `legal.html` (assumption of risk + release, AS-IS disclaimer, $0 liability with a $100 fallback only if a court won't allow $0, "accept any and all risks" + covenant not to sue, indemnity, Colorado law/venue). Owner's stated goal (2026-09-19): he can't pay out anything, so zero liability and users accept all risks. These were drafted without a lawyer - the page says so - and the Colorado venue is a placeholder. Acceptance notes carry a terms version (currently `2026-09-19.2`); bump `TERMS_VERSION` in the source whenever the terms text changes.

Known limits: direct `/downloads/*.apk` URLs still work for anyone who has them (static hosting can't gate them), and there is no server-side record of acceptance. Any new page that lets people download or sign up must carry the same agreement. `signup.html` has a required agreement checkbox (added 2026-09-27).

## Where the FACTS about the apps come from (read this before editing claims)

**Do not take facts about the apps from GitHub `ahead-android` `main`.** That branch is a stale July 22 "first commit"; the real, current app is on branch `reliable-monitor-service` (and on the owner's PC). A cloud session once read `main`, concluded "alert math runs on Railway" and "Ahead has SMS/full-screen permissions", and pushed those false claims here (fixed 2026-09-20). Ground truth, verified 2026-09-20 from the published APKs and current source:

- **Alerts run on the phone.** `GlucoseStatusService` -> `toDisplayState()` -> on-device `SeverityEngine` (ahead-rate-math) -> `AlertCoordinator`. The backend POST in `GlucoseCheckRunner` happens AFTER the reading is saved and only feeds sync/sharing; an outage can't block alerts (it only needs the glucose source to keep writing to Health Connect).
- **AheadBLE is standalone.** Its own EC-JPAKE (code ported from Juggluco's open-source implementation) pairs with the G7 using the 4-digit applicator code. It does NOT need the Juggluco app.
- **Ahead's glucose sources** (per its setup wizard): official Dexcom app (Settings -> Connections -> Health Connect), Juggluco (menu -> Settings -> Health Connect), or AheadBLE - all via Health Connect.
- **Permissions:** run `aapt2 dump permissions` on the APKs in `downloads/`. Ahead has NO SEND_SMS and NO full-screen-intent (the SMS escalation and lock-screen takeover were removed 2026-08-20). AheadBLE declares INTERNET only because Google's ML Kit barcode scanner (datatransport) pulls it in; AheadBLE itself has no network code.

When in doubt, dump the APK or read the current local source; don't infer from GitHub `main` or from old docs.

## Resources pages (2026-09-27)

Two pages, on purpose:
- `resources.html` is the **simple "start here" page**, written for a stressed newly-diagnosed kid or parent. It has when to get help, five short basics cards, and "words you'll hear" cards that show pronunciation and a one-line meaning with a 🔊 button. Keep it short. Every card links into the deep page with a "Go deeper" or "More" link, and that's where detail belongs.
- `resources-science.html` is the **full deep dive** (the old long resources page). Glossary entries have `id="g-<slug>"` anchors that the simple page deep-links to. If you rename a glossary term, update the links in `resources.html`.

Both are hand-edited here (not generated from the website-drafts source).
