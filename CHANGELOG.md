# Changelog

Newest first. Each entry records what changed, why, and a link to the pull
request or workflow run.

Future changes must add an entry here.

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
