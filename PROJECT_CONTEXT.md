# sea-tree-paros Project Context

Date: 2026-06-09

This document captures project-specific working context for `sea-tree-paros`.
It is descriptive project memory, not a general development best-practices document.

## Repository

- Path on Mac mini: `/Users/neuralnode/Projects/sea-tree-paros`
- Git remote: `https://github.com/littlebitsrodos/sea-tree-paros.git`
- Branch: `main`
- Last observed commit: `8a8c111 Merge pull request #5 from littlebitsrodos/codex/recover-main-local-seo-facts-20260609`
- Status observed on 2026-06-09: `main...origin/main`, clean worktree.

## Historical Worktree Snapshot

Local-only artifacts observed on 2026-05-10 before later scaffold cleanup:

- `AGENTS.md`
- `archive/site-captures/seatree-gr-vacation-rental-2026-05-07/`
- `images/source/imports/2026-04-30-yoga-room-and-brass-turtles/`

Treat these as existing source-photo or audit artifacts unless the human
explicitly asks to clean or commit them. Do not reset or delete unrelated work.

## Project Shape

The SeaTree is a static vacation-rental website for Aliki Beach, Paros.

- Plain HTML, CSS, and vanilla JavaScript.
- No app build step for normal development.
- PWA shell with `manifest.json`, `sw.js`, and `offline.html`.
- Four crawlable locale URLs:
  - `/` English
  - `/es/` Spanish
  - `/el/` Greek
  - `/fr/` French
- Per-locale pages are generated from `index.html` and `translations.js`.
- Hosted/deployed through GitHub Pages CI.

## Main Files

| Path | Purpose |
|---|---|
| `index.html` | Primary English page, metadata, JSON-LD, and all page sections. |
| `styles.css` | Main design system and responsive layout. |
| `script.js` | Language switcher, nav behavior, gallery/lightbox, calendar, booking/contact behavior, service-worker registration. |
| `translations.js` | Source of truth for EN/ES/EL/FR text. |
| `scripts/build_locales.py` | Generates `es/`, `el/`, `fr/` pages and patches hreflang metadata. |
| `scripts/sync_bookings.py` | Refreshes availability from booking feeds into `bookings.json`. |
| `sw.js` | Service worker cache. Bump `CACHE_NAME` when cached assets change. |
| `tests/mobile.spec.js` | Playwright + axe checks for layout, mobile nav, locale navigation, and accessibility. |
| `playwright.config.js` | Starts `python3 -m http.server` on port 4173 for tests. |
| `.github/workflows/ci.yml` | Test and GitHub Pages deploy workflow. |

## Site Route And Section Map

Main page sections in `index.html`:

```text
#home
#story
#gallery
#amenities
#services
#practical
#beach
#location
#neighborhood
#availability
#contact
```

The header nav currently links to story, gallery, amenities, location,
availability, and contact.

## Assets

- Public image assets live in `images/optimized/`.
- Source/raw photos live under `images/source/`, grouped into `imports/`, `real/`, `ai/`, and `misc/`.
- Existing favicon is `favicon.svg`; it is a small circular sea-blue mark with wave lines.
- Current header/footer brand treatment is text-only: `The <span>SeaTree</span>`.
- `images/source/imports/2026-04-30-yoga-room-and-brass-turtles/` is currently source material and should be treated as incoming photography until reviewed.

## Current Active Task

No persistent active task is recorded here. Treat task-specific notes as
ephemeral unless the human explicitly asks to preserve them.

Architecture follow-up sessions are tracked in `reference/architecture/ARCHITECTURE_SESSIONS.md` when that file exists.

## Development Commands

Serve locally on the Mac mini:

```bash
cd /Users/neuralnode/Projects/sea-tree-paros
python3 -m http.server 8000
```

Run tests:

```bash
cd /Users/neuralnode/Projects/sea-tree-paros
npm test
```

Full local preflight:

```bash
npm run preflight
```

Mobile-only tests:

```bash
npm run test:mobile
```

Regenerate locale pages after body/copy/i18n changes:

```bash
python3 scripts/build_locales.py
```

## Project Context Placement

Recommended placement for project-specific context:

- `PROJECT_CONTEXT.md` at repo root: human-readable operational snapshot, like this file.
- `AGENTS.md` at repo root: concise Codex-facing project instructions.
- `CLAUDE.md` at repo root: concise Claude Code-facing project instructions.

Do not put repo context in `docs/` unless `.gitignore` changes first: this repo
currently ignores `docs/`, so a `docs/PROJECT_CONTEXT.md` would be local-only.

## Safe-To-Edit Assumption

Safe code surfaces for normal site work:

```text
index.html
styles.css
script.js
translations.js
sw.js
manifest.json
favicon.svg
scripts/
tests/
```

Generated or special surfaces:

- `es/index.html`, `el/index.html`, `fr/index.html`: generated; do not hand-edit.
- `bookings.json`: generated at deploy time by `scripts/sync_bookings.py` and ignored.
- Root-level `lighthouse-*.json`, `psi-*.json`, `lh-sweep.*`: historical/local audit artifacts.
- Archived audit snapshots may also live under `archive/reports/` and `archive/site-captures/`.

## Known Quirks

- Project was previously called Romantica Blue; historical references to Romantica are intentional when they describe the former disco-bar story.
- `.DS_Store` files recur but are ignored.
- `docs/` is ignored even though tracked docs already exist historically; verify intent before adding new docs there.
- `rg` was not available in the non-interactive SSH shell during the 2026-05-10 map; use `grep/find` if needed.
