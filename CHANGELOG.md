# Changelog

Newest first. Each entry records what changed, why, and a link to the pull
request or workflow run.

Future changes must add an entry here.

## 2026-11-12

- What: Added `llms.txt`, `llms-full.txt`, a useful `404.html`, and homepage `Organization` JSON-LD with the public enquiry contact and Aliki address. CSP hashes include the new block. Service worker cache is `sea-tree-v49`.
- Why / Γιατί: is-agentic score improvement, approved by Yorgos 12/11. The stored scan was 73/100 at 2026-10-29T09:48:35.386Z. GitHub Pages cannot answer `Accept: text/markdown`, so the Markdown negotiation check is unchanged.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 12/11/2026 14:01 Europe/Athens. Link unavailable. Verbatim: «α: draft PR μόνο με τις διορθώσεις στο repo του seatree, χωρίς αλλαγή φιλοξενίας» and «Go». Draft review only. This is not approval to merge or publish.
- Link: pending pull request

## 2026-11-07

- What: Recorded the decision to merge the adapted pull request 10 and then remove only its branch, in `DECISIONS.md`. The 22:54 review-only entry stays as it was.
- Why / Γιατί: Yorgos approved that merge and the following branch cleanup, and only for this pull request. Rollback was not approved.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 7/11/2026 23:00 Europe/Athens. Link unavailable. Verbatim: «Merge and then cleanup». Context: adapted PR 10 only.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/10

## 2026-11-07

- What: Adapted the W3C HTML validator fix onto current main. Invalid `http-equiv` metas stay removed, the lightbox keeps a non-empty placeholder, and `script-src` now hashes the JSON-LD blocks as they are after the VacationRental field move. Service worker cache is `sea-tree-v48`. No `'unsafe-inline'`.
- Why / Γιατί: The earlier hash matched the JSON-LD from before `numberOfBedrooms`, `numberOfBathroomsTotal`, and `occupancy` left the top-level `VacationRental`. The WebSite hash was already current.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 7/11/2026 22:54 Europe/Athens. Link unavailable. Verbatim: «Go». This approves the adaptation for review. It is not approval to merge or publish.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/10

## 2026-11-07

- What: Recorded the decision to merge pull request 12 and then remove only its branch, in `DECISIONS.md`. The 19:08 review-only entry stays as it was.
- Why / Γιατί: Yorgos approved that merge and the following branch cleanup, and only for this pull request. Rollback was not approved.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat. Link unavailable. 7/11/2026 20:58 Europe/Athens, verbatim: «Merge». 7/11/2026 20:59 Europe/Athens, verbatim: «And cleanup then». Context: PR 12 only.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/12

## 2026-11-07

- What: The live availability parity check accepts an identical snapshot up to 60 seconds older. Different dates, degraded source status, a bad timestamp, or a larger gap still fail.
- Why / Γιατί: Run 42393328900 synced successfully and matched the public dates and source status, but `generated_at` was 25 seconds older after two deploys of one commit. The 2-day freshness rule is unchanged and is not the tolerance. One minute stays below the existing fixture that already rejects a 5-minute-older identical payload.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 7/11/2026 19:08 Europe/Athens. Link unavailable. Verbatim: «Ναι». Review only. This is not approval to merge or publish.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/12

## 2026-11-07

- What: Recorded the decision to merge pull request 11 and then remove only its branch, in `DECISIONS.md`. Earlier approvals in this file stay as they were.
- Why / Γιατί: Yorgos approved that merge and the following branch cleanup, and only for this pull request. Rollback was not approved. If a later decision authorizes rollback, it is a revert of the merge commit in a new pull request, with a new cache version rather than reuse of `sea-tree-v46` or `sea-tree-v47`.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 7/11/2026 18:41 Europe/Athens. Link unavailable. Verbatim: «Merge» and «Then cleanup». Context: PR 11 only.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/11

## 2026-11-07

- What: Sitemap `<lastmod>` now follows each URL's own source files. The four home URLs use `index.html` and `translations.js`. Each Privacy URL uses only its own HTML file.
- Why / Γιατί: `build_locales.py` previously stamped every URL, including unchanged Privacy pages, with the home-page commit date. The next preflight or deploy would undo the Privacy date restoration.
- Approval / Έγκριση: Yorgos, 7/11/2026 18:35 Europe/Athens. Link unavailable. Verbatim: «Παμε μονομη λυση», for a permanent fix so generation does not rewrite unchanged Privacy lastmod dates.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/11

## 2026-11-07

- What: Restored `<lastmod>2026-06-09</lastmod>` on the four Privacy sitemap URLs (`/privacy/`, `/es/privacy/`, `/el/privacy/`, `/fr/privacy/`). The four language home URLs stay at `2026-11-07`.
- Why / Γιατί: Privacy content did not change. `build_locales.py` had rewritten every sitemap `<lastmod>` from the `index.html` commit date, including those four URLs.
- Approval / Έγκριση: Yorgos, 7/11/2026 18:32 Europe/Athens. Link unavailable. Verbatim: «Ναι», for this correction only: restore the four Privacy sitemap lastmod dates.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/11

## 2026-11-07

- What: Removed `numberOfBedrooms`, `numberOfBathroomsTotal`, and `occupancy` from the top-level `VacationRental` JSON-LD on `/`, `/es/`, `/el/`, and `/fr/`. The same bedroom, bathroom, and occupancy facts stay on each `containsPlace` `Accommodation`. Service worker cache is `sea-tree-v47`.
- Why / Γιατί: On 7/11/2026, validator.schema.org reported exactly those three properties as unrecognized on `VacationRental`. Schema.org defines them on `Accommodation`, not on `VacationRental`. `tourBookingPage` and `additionalType` were not warnings and were left unchanged.
- Approval / Έγκριση: Yorgos, direct SeaTree Lead chat, 7/11/2026 17:57 Europe/Athens. Link unavailable. Verbatim: «Εγκρίνω την εργασία στον Cursor μόνο για τα τρία πεδία, χωρίς merge ή δημοσίευση.» This is not approval to publish.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/11

## 2026-10-29

- What: Pinned the CI `test` job to `ubuntu-24.04` in `.github/workflows/ci.yml`.
- Why / Γιατί: `ubuntu-latest` is now Ubuntu 26.04. CI run 1035 on `main` (`f874204`) failed at `npx playwright install --with-deps chromium` with "Playwright does not support chromium on ubuntu26.04-x64". Deploy is skipped when that test job fails, so the calendar would not refresh. The deploy, live-calendar, and keepalive jobs do not install Playwright, so they stay on `ubuntu-latest`.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/40837818277 and https://github.com/littlebitsrodos/sea-tree-paros/pull/9

## 2026-10-29

- What: Added a check that fails when `bookings.json` is older than 2 days, and a weekly job that pushes one empty commit after 21 quiet days so GitHub does not disable the hourly calendar workflow again.
- Why / Γιατί: The public calendar had been frozen since 2026-08-08. Scheduled runs do not count as repository activity, so 60 days without a commit turned the schedule off. The site was still showing 30/10 and 31/10 as open while the feeds now block 29/10–29/12.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/9 — the refresh run is still the old one, [31259041380](https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/31259041380), until the CI workflow is enabled and run.

## 2026-08-08

- What: GitHub set the CI workflow (`.github/workflows/ci.yml`) to `disabled_inactivity`. The hourly Airbnb and Booking.com calendar refresh stopped.
- Why / Γιατί: On a public repository, GitHub disables scheduled workflows after 60 days without a commit. The last commit was `f874204` on 2026-06-09. Scheduled runs do not count as activity, so the hourly job did not keep the repository active. Sixty days later, on 2026-08-08, GitHub disabled the schedule. The last successful run was [31259041380](https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/31259041380) at 2026-08-08 13:13 UTC (16:13 Athens). Live `bookings.json` stayed at `generated_at` `2026-08-08T13:13:38+00:00`.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/31259041380

## 2026-10-29

- What: W3C HTML validator fix: drop the invalid `X-Content-Type-Options` and `Permissions-Policy` http-equiv metas, give the lightbox image a non-empty 1×1 placeholder that `script.js` replaces when a photo opens, and add sha256 hashes of the trimmed JSON-LD blocks to `script-src`. No `'unsafe-inline'`.
- Why / Γιατί: validator.w3.org reported 3 errors and 2 infos on each homepage and 2 errors on each privacy page. The 2026-11-07 entry above recalculates the VacationRental hash after the schema change.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/pull/10
