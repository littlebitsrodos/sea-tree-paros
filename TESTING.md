# Testing — Sea Tree

Browser tests for the static site. Catches the bug class /qa is built to find:
broken layouts, contrast failures, carousel/calendar regressions on mobile.

## Stack

- **Playwright** (Chromium) — headless browser, runs locally and in CI.
- **@axe-core/playwright** — WCAG 2.1 AA scan on every locale.
- Local fixture: `python3 -m http.server` (already required for dev).

The tests live in `tests/`. The config is `playwright.config.js`.

## Run locally

First time only:

```bash
npm install
npx playwright install chromium
```

Run the suite:

```bash
npm test                  # all projects (mobile + desktop)
npm run test:mobile       # mobile project only
npm run test:ui           # interactive UI mode for debugging
```

Playwright's `webServer` starts `python3 -m http.server` on port 4173 automatically.
Override with `PORT=8080 npm test` if 4173 is in use.

## What the suite covers

`tests/mobile.spec.js` runs on the `mobile` project (390×844 viewport, mobile UA, touch):

- **Layout, per locale (EN/ES/EL/FR):**
  - No horizontal page overflow. Catches the calendar-grid 7th-column overflow we
    saw on 2026-04-27 (ISSUE-003), and any future element pushing wider than the viewport.
  - Calendar shows all 7 weekday columns within the viewport.
  - Gallery carousel slides are exactly the track width. Catches the
    `min-width: 100%` + intrinsic-image-width interaction (ISSUE-004) where slides
    grew to 400px and slide-2 onward rendered as two stitched halves.
- **Accessibility, per locale:**
  - axe-core scan against `wcag2a` + `wcag2aa`. Test fails on any **critical** or
    **serious** violation. Catches color-contrast bugs like the invisible
    `.beach-alternatives h3` (ISSUE-001).
- **Navigation:**
  - Hamburger opens the drawer; clicking a link scrolls to the right section and
    closes the drawer.
  - Language switcher navigates to the locale URL and updates `<html lang>`.

## What the suite *doesn't* cover

- **Visual regression baselines.** No pixel diffs. Adding `expect(page).toHaveScreenshot()`
  per scroll position is the obvious next layer; skipped until baselines stabilize.
- **Real Safari WebKit.** Tests run in Chromium with mobile UA, not WebKit. Most CSS
  bugs reproduce in either engine, but iOS-specific behavior (touch callouts,
  overflow scroll bounce) is not exercised. Swap the `mobile` project to
  `devices['iPhone 13']` and `npx playwright install webkit` if you need that.
- **Contact form submission.** We don't POST to Formspree from tests.
- **Stripe / Airbnb / Booking.com flows.** External; out of scope.

## Adding tests

When you fix a bug, add a regression assertion to `tests/mobile.spec.js`. Match
the existing style: each test describes the user-visible invariant, not the
internal state. Comments name the original issue ID so tests are findable
when the bug recurs.

When you add a new feature with a UI surface, add at least one mobile + desktop
assertion that the feature is reachable and visible.

## CI

`.github/workflows/test.yml` runs the suite on every push and pull request.
Failure uploads the Playwright HTML report as an artifact (`playwright-report`).

The deploy workflow (`.github/workflows/deploy.yml`) is independent — tests do
not block deploy today, so a red test run will not stop a push to main from
deploying. If you want to gate deploys on tests, add a `needs: playwright`
to the deploy job.
