# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site for Ahead, aheadt1d.com. Single static `index.html` — no build step, no framework, no package.json. Just edit the file and push; there's no CI/deploy pipeline configured in this repo (unlike `ahead-dashboard`, which has a GitHub Pages Actions workflow).

## Commands

None — open `index.html` directly in a browser to preview, or serve it with any static file server. No lint/test/build tooling exists here.

## Architecture

Everything is in one file: inline `<style>` for the whole design, inline `<script>` at the bottom for the two bits of interactivity —

- **Status orb** — a small dot near the "Ahead" wordmark in the nav that pings green/amber/red based on a live fetch of the *user's own* real glucose reading (`GET {nightscout}/api/v1/entries.json?count=1`, no API key — this Nightscout instance is intentionally public). It's a deliberate easter egg, not a real product feature — fails silently (`.catch(() => {})`) if the fetch fails, so it degrades to just not pinging rather than breaking the page.
- **Scroll-reveal** — `IntersectionObserver`-driven fade-in on scroll for sections.

The site deliberately does **not** explain Ahead's specific trend-detection/plateau logic or safety-guardrail thresholds — the copy describes the concept (proactive trend detection, safety guardrails) without exposing implementation details that could become proprietary. Keep that framing if editing the "what Ahead does" copy.

There is no live dashboard/portal link from this site — that was intentionally removed (previously linked out to a personal glucose report; see Privacy history below). Don't re-add a "see your glucose from any browser" style link back to a live personal feed.

## Privacy history — read before touching `reports/`

`reports/sample-report/` previously held real, ~30 days of the user's actual personal glucose data embedded in an HTML report (`REPORT = {"startMillis":...}`), committed under three different historical filenames. This was discovered, removed from the working tree, and scrubbed from the **entire git history** via `git filter-repo --invert-paths` (not `filter-branch`, which is blocked by this environment's safety tooling) followed by a force-push the user ran themselves.

`reports/` is now gitignored specifically to stop this recurring — **do not remove that `.gitignore` entry**, and treat any new file appearing under `reports/` as suspect until confirmed it doesn't contain real personal data before it's ever staged.
