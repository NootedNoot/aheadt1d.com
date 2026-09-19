# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

aheadt1d.com — served as static files (it sits behind Cloudflare; pushing to `main` is how it gets updated). No framework, no package.json, no CI in this repo.

**Rebuilt 2026-09-18:** the old multi-page marketing site (showcase / tech / research / videos / founder / portal / support / contact, plus a shared `styles.css` + `app.js`) was retired in favour of ONE page. It is all in git history if anything needs recovering.

## Files

- `index.html` — the whole site: hero with real screenshots, downloads (with SHA-256 checker), how it fits together, account explainer, setup checklist, AheadBLE explainer, safety/privacy summary, permissions, FAQ. Self-contained (inline CSS + JS); only outside request is Google Fonts.
- `legal.html` — Privacy Policy, Terms of Use, software licenses. Written 2026-09-18 from what the backend/apps actually do (see `ahead-backend/schema.sql`). NOT lawyer-reviewed — the page says so. If the data model changes (new tables, new vendors, retention), update this page in the same change.
- `download.html` — a tiny redirect to `index.html#downloads` so old shared links keep working.
- `downloads/` — the APKs the page links to: `ahead-ble-latest.apk`, `ahead-latest.apk`, `ahead-lite-latest.apk`. All are debug builds. Each is listed on the page with its SHA-256 and size.
- `media/` — real screenshots from the developer's phone (status/nav bars cropped). They show a real glucose value on purpose; the owner approved that. Never add screenshots with names, emails, notification text or anything else personal.

## How the page is authored

`index.html` and `legal.html` are GENERATED, not hand-edited. The source lives outside this repo at `C:\Users\singe\Projects\website-drafts\claude-download\src\` (page.html, legal.html, v2.css, v2.js, faq/compare/perms blocks). Edit there, then run `node build-v2.mjs` and copy `site/*` here. After rebuilding any APK: copy it into `downloads/`, run `node update-hashes.mjs` there, then rebuild — otherwise the on-page checker will flag a genuine build as a mismatch.

## Rules that must hold

- **Privacy history:** `reports/` once held real personal glucose exports, scrubbed from the entire git history via `git filter-repo`. It is gitignored specifically to stop that recurring — do not remove the entry, and treat anything appearing under `reports/` as suspect. Do not re-add a "see your live glucose from any browser" link, and do not fetch live glucose from the page (the old status-orb did; it's gone).
- **Be honest on the page.** Claims come from the code, not vibes: "data never leaves your device" was false (family sharing uploads readings), so it isn't on the page. The three apps are beta debug builds and the page says so.
- Don't explain the trend-detection thresholds/formulas on the site — describe the concept only.
- AheadBLE is GPLv3 (builds on Juggluco). The page links to `github.com/NootedNoot/ahead-ble` for source; that repo needs a LICENSE and to be public for the link to resolve (owner is handling this).

## Spooky season theme

Both pages have a friendly Halloween mode: mouse trail of ghosts/bats/pumpkins, moon, cobwebs, cats, a skeleton, an owl, hanging bats, a pumpkin-patch footer. It turns on automatically Sep 1 - Nov 3 each year, can be forced with `?spooky=1` / `?spooky=0`, and has a pumpkin toggle in the nav (choice is remembered in localStorage `ahead-spooky`). Off = the normal purple sparkles.

Owner's rules for any theme/decoration work: **no candy, sweets or food imagery or wording** (this is a Type 1 diabetes app; pumpkins/jack-o'-lanterns are fine) and **no death jokes** (he vetoed tombstones/"R.I.P."). Keep it friendly. The art is generated from `gen-art.py` and `gen-spooky2-css.py` in the source folder (`website-drafts/claude-download`).

## Download gate (click-through terms)

Every APK download button on `index.html` opens an agree-to-continue popup (medical disclaimer, own-risk/release, Dexcom non-affiliation, minors, emergencies) with a required checkbox; the download only starts after "Accept & download". It asks every time; a note of which app/when is stored in the visitor's own browser only (`localStorage` `ahead-dl-accepted`, terms version `2026-09-19`). The fuller Terms live in `legal.html` (assumption of risk + release, AS-IS disclaimer, $100 liability cap, indemnity, Colorado law/venue). These were drafted without a lawyer - the page says so - and the $100 cap / Colorado venue are placeholders.

Known limits: direct `/downloads/*.apk` URLs still work for anyone who has them (static hosting can't gate them), and there is no server-side record of acceptance. Any new page that lets people download or sign up must carry the same agreement.
