# Project Instructions (Codex) — The SeaTree

Static vacation-rental site for The SeaTree, Aliki Beach, Paros.

## Communication

- Speak to the human in Greek.
- Be direct and concise. State risks, blockers, and verification status clearly.
- Prefer doing the work end to end over stopping at a plan, unless the request is explicitly exploratory.

## Working Model

- Prefer a dedicated `git worktree` per task, branch, or parallel stream.
- Before editing, check `git status --short --branch` and `git worktree list`.
- Treat `origin/main` on GitHub as the source of truth. The human often works from mobile through Hermes agent on a different Mac mini profile, so local branches may be stale.
- Before starting or resuming work, fetch/prune and fast-forward the local base branch when possible.
- Do not mix unrelated changes from other branches, worktrees, or user edits.
- Keep changes scoped. Avoid broad refactors unless they are required for the task.
- Preserve user changes. Never reset, restore, or delete unrelated work unless explicitly asked.
- After a branch is merged, clean up its temporary worktree and stale refs.

## Stack

- Plain HTML, CSS, and vanilla ES modules. No build step.
- PWA shell with `sw.js`, `manifest.json`, and `offline.html`.
- Self-hosted fonts from `./fonts/` via `./fonts.css`.
- Direct contact for inquiries: WhatsApp, phone, email, plus Airbnb/Booking.com fallback links.
- Strict CSP: no inline scripts; keep external domains intentionally allow-listed.

## Key Files

| Path | Purpose |
|---|---|
| `index.html` | Default EN page and template for generated locale pages. |
| `styles.css` | Design system, responsive layout, component styling. |
| `script.js` | Language switcher routing, gallery carousel, calendar, form handling, service worker registration. |
| `translations.js` | Source of truth for EN / ES / EL / FR copy. |
| `{es,el,fr}/index.html` | Generated locale pages. Do not hand-edit. |
| `scripts/build_locales.py` | Regenerates locale pages and hreflang metadata. |
| `sw.js` | Service worker cache. Bump cache version when cached assets change. |
| `images/source/` | Raw/source photos and import batches. Do not link from HTML. |
| `images/optimized/` | Public images. Link these from HTML. |

## Site Conventions

- Every `<img>` needs explicit `width` and `height` to preserve CLS = 0.
- Non-critical images should use `loading="lazy"`.
- Public images should come from `images/optimized/`, with `.webp` preferred and `.jpg` fallback when useful.
- New photo drops and working source assets should go under `images/source/` (`imports/`, `real/`, `ai/`, `misc/`).
- Scripts should stay as `<script defer>` in `<head>`.
- New user-facing copy needs a `data-translate` key plus entries in all four languages.
- Keep generated locale pages synchronized, but do not hand-edit them.
- After changing `translations.js` or translated body copy in `index.html`, run:

```bash
python3 scripts/build_locales.py
```

- If a cached file changes, bump the cache version in `sw.js`.
- Keep The SeaTree as the brand. Do not remove historical references to Romantica when they describe the former disco/bar history.
- Keep the direct-contact booking flow consistent across visible copy, links, structured data, privacy pages, and tests.

## Local Work

Serve locally with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run tests with:

```bash
npm test
```

Browser tests live in `tests/` and cover layout overflow, contrast, carousel/calendar behavior, and locales.

Run the full agent preflight before handing off broad or release-facing changes:

```bash
npm run preflight
```

`preflight` rebuilds locale pages, runs the unit/contract checks, then runs the Playwright suite.
Use focused checks for narrower edits:

```bash
npm run test:unit
npm run test:mobile
npm run test:pwa-cache
npm run test:placeholders
npm run test:bookings-sync
npm run test:bookings-parity
npm run test:direct-contact
npm run test:price-parity
npm run test:schema
```

Choose the narrowest useful verification for small edits, but run `npm run preflight` before broad, release-facing, or cross-locale changes.

## Source Control And Handoff

- Use small branches with descriptive names, usually under `codex/`.
- Commit only the files that belong to the task.
- Before opening a PR, check the diff with `git diff --stat` and verify there are no accidental generated or local artifacts.
- For PRs, include a concise summary and the exact verification performed.
- Do not force-push to protected/shared branches.
- Prefer merge only after CI passes. If CI is pending, wait; if it fails, inspect the failure before retrying or merging.
- After merge, fetch/prune, fast-forward local `main`, and remove the task worktree when it is clean.

## Deployment Notes

- CI runs `scripts/build_locales.py` before deploy.
- Never force-push to `main`, `production`, or `staging`.
- Do not modify generated locale pages directly; regenerate them.

## Known Quirks

- The project directory was renamed from `romantica-blue/` to `sea-tree-paros`; the brand is now The SeaTree.
- `.DS_Store` files can reappear; they are gitignored.
