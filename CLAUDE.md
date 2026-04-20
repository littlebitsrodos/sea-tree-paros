# Project Instructions (Claude Code) — Sea Tree

Static vacation-rental site for Sea Tree, Aliki Beach, Paros. No build step —
HTML/CSS/vanilla JS with a PWA shell.

This project uses the **agentic-stack** portable brain. All memory, skills,
and protocols live in `.agent/`.

## Before doing anything
1. Read `.agent/AGENTS.md` — it's the map.
2. Read `.agent/memory/personal/PREFERENCES.md` — how the user works.
3. Read `.agent/memory/semantic/LESSONS.md` — what we've learned.
4. Read `.agent/protocols/permissions.md` — what you can and cannot do.

## Before every non-trivial task — recall first
For any task involving **deploy**, **ship**, **release**, **migration**,
**schema change**, **timestamp** / **timezone** / **date**, **failing test**,
**debug**, **investigate**, or **refactor**, run recall FIRST and present
the surfaced lessons to yourself before acting:

```bash
python3 .agent/tools/recall.py "<one-line description of what you're about to do>"
```

If the output contains a "Consulted lessons for intent:" block with one or
more results, show them to the user in a `Consulted lessons before acting:`
block and adjust your plan to respect them. If a surfaced lesson would be
violated by your intended action, stop and explain.

This is how graduated lessons actually change behavior across harnesses.
Skip it and the system is just files on disk.

## While working
- Consult `.agent/skills/_index.md` and load the full `SKILL.md` for any
  skill whose triggers match the task.
- Update `.agent/memory/working/WORKSPACE.md` as the task evolves.
- Log significant actions to `.agent/memory/episodic/AGENT_LEARNINGS.jsonl`
  via `.agent/tools/memory_reflect.py`.
- Quick state check any time: `python3 .agent/tools/show.py`.
- Teach the agent a new rule in one shot:
  `python3 .agent/tools/learn.py "<the rule>" --rationale "<why>"`.

## Rules that override defaults
- Never force push to `main`, `production`, or `staging`.
- Never delete episodic or semantic memory entries — archive them.
- Never modify `.agent/protocols/permissions.md`.

---

# Project context

## Stack

- Plain HTML / CSS / ES modules, served statically.
- Google Fonts loaded with `media=print` swap trick (non-blocking).
- Formspree for contact form. Stripe Payment Links for booking.
- Service Worker with cache-first strategy (`sw.js`); `offline.html` fallback.
- Schema.org `VacationRental` JSON-LD in `<head>`.
- Strict CSP: `default-src 'self'`, no inline scripts, Formspree + Google Maps iframe allow-listed.

## File map

| Path | Purpose |
|---|---|
| `index.html` | Single-page site. Hero, gallery, amenities, neighborhood, contact. |
| `styles.css` | Full design system. CSS custom properties, mobile-first breakpoints at 768 / 1024. |
| `script.js` | Language switcher, gallery carousel, calendar, form handling, SW registration. |
| `translations.js` | EN / ES / EL / FR copy. Keyed by `data-translate` attributes. |
| `sw.js` | Service worker, cache-first. Bump version string on asset changes. |
| `manifest.json` | PWA manifest. |
| `offline.html` | Offline fallback page. |
| `images/` | Raw / source photos. Do not link these from HTML. |
| `images/optimized/` | Public images, both `.jpg` and `.webp` per asset. Always link from here. |
| `lighthouse-*.json` | Historical audit reports (Jan 2026 optimization pass). |

## Image pipeline

1. New photos land in `images/<date> - description/`.
2. For each source image, produce two variants in `images/optimized/`:
   - `name.jpg` — strip EXIF, keep original JPEG compression (WhatsApp exports already at ~q80).
   - `name.webp` — `cwebp -q 82 -metadata none`.
3. Use `<img>` with `width` and `height` attributes matching intrinsic dimensions to reserve layout space (CLS = 0).
4. Point hero-critical images at the WebP; keep `.jpg` as graceful fallback.
5. Mobile uses `.gallery-carousel`, desktop uses `.gallery-grid` (auto-rows at 250px desktop / 200px tablet+mobile).

## Conventions

- **Layout stability:** Every `<img>` needs explicit `width` + `height`. Non-critical images use `loading="lazy"`.
- **Scripts:** `<script defer>` in `<head>`, not at end of `<body>`.
- **Fonts:** `<link rel="stylesheet" media="print" onload="this.media='all'">` pattern for Google Fonts.
- **Interactive polish:** Buttons get a consistent `transform: translateY(-2px)` on hover.
- **Palette:** Aegean blue, terracotta, sand, olive — grounded, hospitality-appropriate.
- **Translations:** New user-facing copy needs a `data-translate` key + entries in all 4 languages.
- **Service worker:** If you touch a cached asset, bump the cache version in `sw.js` — otherwise returning users see stale content.

## Working on the site

- Serve locally: `python3 -m http.server 8000` then open `http://localhost:8000`.
- The browse skill (`/browse`) is the preferred way to dogfood changes in a real browser.
- Lighthouse runs: `npx lighthouse <production-url> --output json` _(TODO: confirm current production URL after Sea Tree rebrand)_.

## Agent assets in this project

Three layered systems coexist — check each before assuming a capability lives in one place:

- `.agent/` — **agentic-stack** portable brain (memory, skills, protocols, tools). Primary.
- `.agent/workflows/compound.md` — Gemini CLI workflow (updates `GEMINI.md`, not this file).
- `.antigravity/skills/` — Skill Squad audit personas:
  - **Performance Engineer** — Web Vitals, PWA, SEO
  - **Boutique Architect** — Schema.org, semantic HTML, data structures
  - **Vibe Designer** — Aesthetics, animations, micro-interactions
  - **Local Guide** — Paros content, authentic recommendations

## Known quirks

- Project dir was renamed from `romantica-blue/` to `sea-tree-paros/`; the brand is being rebranded from Romantica Blue to Sea Tree. `index.html`, schema, OG tags, and the production domain may still contain old brand references — check before editing copy.
- Files in the repo are a mix of `yorgos:staff` and `littlebits:staff` ownership. If git complains about dubious ownership, add the path via `git config --global --add safe.directory`.
- `.DS_Store` files keep reappearing — `.gitignore` already excludes them.
