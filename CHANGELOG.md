# Changelog

Newest first. Each entry records what changed, why, and a link to the pull
request or workflow run.

Future changes must add an entry here.

## 2026-08-08

- What: GitHub set the CI workflow (`.github/workflows/ci.yml`) to `disabled_inactivity`. The hourly Airbnb and Booking.com calendar refresh stopped.
- Why / Γιατί: On a public repository, GitHub disables scheduled workflows after 60 days without a commit. The last commit was `f874204` on 2026-06-09. Scheduled runs do not count as activity, so the hourly job did not keep the repository active. Sixty days later, on 2026-08-08, GitHub disabled the schedule. The last successful run was [31259041380](https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/31259041380) at 2026-08-08 13:13 UTC (16:13 Athens). Live `bookings.json` stayed at `generated_at` `2026-08-08T13:13:38+00:00`.
- Link: https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/31259041380
