# Decisions

Newest first. Each entry records an owner decision, the verbatim wording,
and the evidence that exists. A proof link is written only when a stable
URL exists. Do not invent one.

Earlier approvals for this pull request stay in `CHANGELOG.md` and are
listed again here so this file does not replace them.

## 2026-11-07 22:54 — Adapt PR 10 for review, no merge

- Sender: Yorgos
- Time: 7/11/2026 22:54 Europe/Athens
- Channel: direct SeaTree Lead chat
- Proof link: unavailable
- Context: prepare the adaptation of https://github.com/littlebitsrodos/sea-tree-paros/pull/10 onto current main, with new tests, before any new merge. The earlier «Merge» for this pull request does not authorize publishing this adaptation.
- Verbatim: «Go»
- Meaning: implement the adaptation for review only. Keep the HTML validity fix, recalculate JSON-LD CSP hashes for the current schema, and preserve the later schema, sitemap, and availability checks. This is not approval to merge or publish.

## 2026-11-07 20:58 — Merge PR 12, then clean up its branch

- Sender: Yorgos
- Time: 7/11/2026 20:58 Europe/Athens
- Channel: direct SeaTree Lead chat
- Proof link: unavailable
- Context: only https://github.com/littlebitsrodos/sea-tree-paros/pull/12
- Verbatim: «Merge»
- Meaning: merge that pull request by the repository's normal merge. No other pull request, including PR 10, is included. The 19:08 entry remains the review-only approval and is not rewritten.
- Follow-up, 7/11/2026 20:59 Europe/Athens, same channel, proof link unavailable. Verbatim: «And cleanup then». Meaning: after a successful merge and live verification, delete only `cursor/availability-parity-skew-b9cf` if it is fully merged. Do not delete other branches.
- Rollback, not authorized by this entry: if a later decision says so, revert the merge commit in a new pull request. Do not rewrite history. This change does not alter cached website assets.

## 2026-11-07 19:08 — Review a parity false-alarm fix, no merge

- Sender: Yorgos
- Time: 7/11/2026 19:08 Europe/Athens
- Channel: direct SeaTree Lead chat
- Proof link: unavailable
- Context: the live availability check in run https://github.com/littlebitsrodos/sea-tree-paros/actions/runs/42393328900
- Verbatim: «Ναι»
- Meaning: implement, for review only, the minimal correction that stops a timestamp-only false alarm when the public availability dates and source status match. Do not weaken detection of stale or different data. This is not approval to merge or publish.

## 2026-11-07 18:41 — Merge PR 11, then clean up its branch

- Sender: Yorgos
- Time: 7/11/2026 18:41 Europe/Athens
- Channel: direct SeaTree Lead chat, seen by SeaTree Lead
- Proof link: unavailable
- Context: only https://github.com/littlebitsrodos/sea-tree-paros/pull/11
- Verbatim: «Merge»
- Verbatim: «Then cleanup»
- Meaning: merge that pull request by the repository's normal merge, then remove only its temporary branch `cursor/vacation-rental-schema-warnings-b9cf` after the merge is live. No other pull request, including PR 10, is included.
- Rollback, not authorized by this entry: if a later decision says so, revert the merge commit in a new pull request. Do not rewrite history. A rollback that changes a cached asset must set a new `CACHE_NAME`. Do not reuse `sea-tree-v46` or `sea-tree-v47`.

## Earlier approvals for the same pull request

These were already recorded in `CHANGELOG.md`. Proof links were unavailable then and are still unavailable.

- 7/11/2026 17:57 Europe/Athens. Yorgos, direct SeaTree Lead chat. Verbatim: «Εγκρίνω την εργασία στον Cursor μόνο για τα τρία πεδία, χωρίς merge ή δημοσίευση.» That entry approved the three-field schema task only. It was not approval to publish. The 18:41 wording above is the later merge approval.
- 7/11/2026 18:32 Europe/Athens. Yorgos. Verbatim: «Ναι», for restoring the four Privacy sitemap `lastmod` dates only.
- 7/11/2026 18:35 Europe/Athens. Yorgos. Verbatim: «Παμε μονομη λυση», for the permanent sitemap `lastmod` fix so generation does not rewrite unchanged Privacy dates.
