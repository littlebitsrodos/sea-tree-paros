# The SeaTree

Static vacation-rental site for The SeaTree, Aliki Beach, Paros.

## Runtime Surface

The live site is intentionally simple and root-based:

- `index.html`: English source page and template for locale generation.
- `styles.css`: Main styles.
- `script.js`: Frontend behavior.
- `translations.js`: Source of truth for EN / ES / EL / FR copy.
- `sw.js`, `manifest.json`, `offline.html`: PWA shell.
- `robots.txt`, `sitemap.xml`, `favicon.svg`, `fonts.css`, `analytics.js`: supporting public assets.

Locale routes are public and generated:

- `el/`
- `es/`
- `fr/`
- `privacy/`

Do not hand-edit generated locale pages. Rebuild them from source.

## Assets

- `images/optimized/`: Public site images. Link these from HTML and metadata.
- `images/source/`: Non-public source assets and working batches.

Source image buckets:

- `images/source/imports/`: New incoming photo batches.
- `images/source/real/`: Real/source photography library.
- `images/source/ai/`: AI-generated working images.
- `images/source/misc/`: One-off source assets.

## Repo Structure

- `scripts/`: Build and maintenance scripts.
- `tests/`: Playwright test suite.
- `reference/`: Tracked reference docs that belong in the repo.
- `archive/`: Historical non-runtime artifacts.

Archive buckets:

- `archive/reports/`: Audits, diagnostics, PSI, Lighthouse, logs.
- `archive/site-captures/`: Screenshots and exported site captures.
- `archive/operations/`: Operational exports.
- `archive/local-docs/`: Local-only notes and docs.
- `archive/local-tools/`: Local-only tooling and browser state.

Nothing inside `archive/` is part of the live site surface.

## Commands

Serve locally:

```bash
python3 -m http.server 8000
```

Run tests:

```bash
npm test
```

Run the full local preflight before handoff:

```bash
npm run preflight
```

Rebuild locale pages:

```bash
python3 scripts/build_locales.py
```

## Conventions

- Keep public images in `images/optimized/`.
- Keep source assets in `images/source/`.
- Keep local-only clutter out of the root; use `archive/local-*` when needed.
- Keep booking/inquiry CTAs direct-first: WhatsApp, phone, email, Airbnb, and Booking.com. Do not add placeholder payment links or stale form code.
- Bump `CACHE_NAME` in `sw.js` when cached public assets change.
