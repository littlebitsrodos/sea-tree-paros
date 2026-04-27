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
- Fonts self-hosted from `./fonts/` via `./fonts.css` (no Google Fonts runtime dependency, strict CSP).
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
| `{es,el,fr}/index.html` | Generated per-locale pages. Never hand-edit — regenerate via `scripts/build_locales.py`. |
| `scripts/build_locales.py` | Reads `translations.js` + `index.html`, emits per-locale HTML with translated head/body and hreflang cluster. Also rewrites `sitemap.xml` `<lastmod>` from the most recent commit on `index.html` / `translations.js`. |
| `.claude/skills/optimize-photos/` | Pipeline for importing new source photos → paired `.jpg`/`.webp` + snippet generator. |
| `lighthouse-*.json` | Historical audit reports (Jan 2026 optimization pass). Gitignored. |

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
- **Fonts:** Self-hosted woff2 files under `fonts/`, declarations in `fonts.css`. Preload the two critical latin variants (Cormorant regular + Outfit regular) in `<head>` for LCP. Latin-ext subsets load automatically via `unicode-range` when accented characters appear (ES/FR). Greek falls back to system — neither font ships a greek subset on Google Fonts.
- **Interactive polish:** Buttons get a consistent `transform: translateY(-2px)` on hover.
- **Palette:** Aegean blue, terracotta, sand, olive — grounded, hospitality-appropriate.
- **Translations:** New user-facing copy needs a `data-translate` key + entries in all 4 languages.
- **Service worker:** If you touch a cached asset, bump the cache version in `sw.js` — otherwise returning users see stale content.

## Working on the site

- Serve locally: `python3 -m http.server 8000` then open `http://localhost:8000`.
- The browse skill (`/browse`) is the preferred way to dogfood changes in a real browser.
- Lighthouse runs: `npx lighthouse https://seatree.gr/ --output json`.
- After any change to `translations.js` or the `index.html` body, rebuild per-locale pages:
  `python3 scripts/build_locales.py`.

## Testing

- Browser tests live in `tests/`. Stack: Playwright (Chromium) + axe-core. See `TESTING.md`.
- Run locally: `npm install && npx playwright install chromium`, then `npm test`.
- CI runs the suite on every push / PR via `.github/workflows/test.yml`.
- The suite catches the bug class /qa is built to find — layout overflow, contrast,
  carousel/calendar regressions across all four locales. When you fix a UI bug,
  add a regression assertion to `tests/mobile.spec.js` next to the existing ones.

## i18n architecture

- **Four locales, four URLs.** EN at `/`, others at `/es/`, `/el/`, `/fr/`. Each has its own `index.html` so
  crawlers (Google, ChatGPT browse, Perplexity) see real translated content without JS.
- `translations.js` is the single source of truth. Shape: `{ en: {...}, es: {...}, el: {...}, fr: {...} }`.
  UMD export at the bottom so `node` can `require()` it.
- `scripts/build_locales.py`:
  1. Reads `translations.js` via `node -e "console.log(JSON.stringify(require('./translations.js')))"`.
  2. Reads `index.html` as the template.
  3. For each non-default locale: sets `<html lang>`, rewrites meta tags (title, description, OG, Twitter, canonical),
     injects an `hreflang` cluster + `x-default`, walks every `data-translate="…"` element and replaces inner text
     with the translated string, and rewrites asset paths from relative to absolute (`styles.css` → `/styles.css`).
  4. Writes to `{locale}/index.html`.
  5. Patches the root `index.html` in place — same hreflang cluster in EN.
- The client-side `setLanguage()` in `script.js` still exists, but the language switcher now navigates between locale
  URLs (preserving the current `#anchor`) rather than swapping DOM in place. `currentLang` is read from
  `document.documentElement.lang` on init.
- CI (`.github/workflows/deploy.yml`) runs `build_locales.py` before every deploy so the locale HTMLs always match
  `translations.js` in production.

## Deliberate non-features

A running list of features considered and deliberately skipped — so a future Claude or contributor doesn't re-propose
them. If data changes, revisit.

- **No hero video.** The widely-cited "86% conversion lift" traces to vendor blog posts, not controlled studies.
  Mobile LCP tax is real (HTTP Archive 2025). WebP `<picture>` hero is the better trade.
- **No `llms.txt`.** 30-day bot-log audits (Longato, 2025) show GPTBot / ClaudeBot / PerplexityBot rarely fetch it.
  Invest in crawlable `#faq` and `FAQPage` JSON-LD instead — that's what AI search actually cites.
- **No AI-chat widget.** "71% more bookings with AI" is a Hostaway vendor survey with selection bias. For a single-
  listing rental, a Formspree form + WhatsApp tap is higher-signal than a chatbot.
- **No `Review` / `aggregateRating` JSON-LD.** Google's 2019 self-serving review rule still applies in 2025 —
  first-party `Review` on `LocalBusiness` / `VacationRental` is ignored (BrightLocal). Visible guest quotes on-page
  are fine for CRO; we don't claim stars in structured data.

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

- Project dir was renamed from `romantica-blue/` to `sea-tree-paros/`; brand is now **Sea Tree**. The *Romantica* name is preserved intentionally in historical copy ("the former Romantica disco bar", "soul of Romantica lives on"). Don't scrub it — the disco history is part of the story.
- Files in the repo are a mix of `yorgos:staff` and `littlebits:staff` ownership. If git complains about dubious ownership, add the path via `git config --global --add safe.directory`.
- `.DS_Store` files keep reappearing — `.gitignore` already excludes them.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health

## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.claude/skills/gstack/... for gstack file paths (the global path).
