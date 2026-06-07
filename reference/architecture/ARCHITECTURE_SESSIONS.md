# The SeaTree Architecture Sessions

Date: 2026-05-10

This file turns the architecture review into separate, restartable sessions.
Use one candidate per session. Do not combine unrelated refactors.

## Session Order

1. **PWA Asset Cache Contract** — complete
   - Closed as a lightweight contract.
   - Current seam: `scripts/check_pwa_cache_contract.mjs` exposes `assertPwaCacheContract()`.
   - Developer checks: `npm run test:pwa-cache` for the fast assertion and `npx playwright test tests/pwa-cache-contract.spec.js` for CI-compatible coverage.
   - Scope deliberately excludes git-aware cache-version diff enforcement and runtime service-worker browser tests.

2. **Agent Context Module** — complete
   - Clean up repo navigation for future agents.
   - Goal: make `PROJECT_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, and `.agent/` roles explicit and non-contradictory.
   - Output: root harness files contain only practical The SeaTree project guidance.

3. **Contact/Booking Contact Surface Cleanup** — next recommended session
   - Resolve stale Formspree code versus current direct-contact UI.
   - Goal: decide direct-only vs form-based contact, then remove or revive the module.
   - Output: one clear contact interface and matching docs/tests.

4. **Gallery Manifest Module**
   - Bigger refactor with strong leverage.
   - Goal: remove duplicated gallery markup/data between mobile carousel, desktop grid, and lightbox.
   - Output: one gallery source of truth while preserving crawlable/static HTML behavior.

5. **Booking Calendar Core**
   - Highest behavioral risk; do after tests are stronger.
   - Goal: separate pricing/availability/range-selection logic from DOM rendering.
   - Output: pure calendar logic tests plus a thinner DOM adapter.

6. **Locale Compiler Contract**
   - Do after content and structure settle.
   - Goal: make locale generation validate missing keys and generated output.
   - Output: safer i18n build contract, ideally without overcomplicating dependencies.

## Session Starter Prompt

```text
Continue with sea-tree-paros.

Read first:
- /Users/neuralnode/Projects/sea-tree-paros/PROJECT_CONTEXT.md
- /Users/neuralnode/Projects/sea-tree-paros/AGENTS.md
- /Users/neuralnode/Projects/sea-tree-paros/.agent/AGENTS.md

Important:
- Repo has dirty agent/tooling artifacts. Do not reset/delete/clean them.
- Work on one architecture candidate only.
- Use $improve-codebase-architecture first if still in planning mode.
- If implementing, keep the patch narrow and run the relevant tests.

Candidate for this session:
<PASTE ONE CANDIDATE NAME>

Goal:
<PASTE THE GOAL FROM THE SESSION ORDER>

Before editing, summarize the intended seam/interface and test plan.
```

## Per-Session Rules

- Do not combine candidates unless one is a direct prerequisite.
- Prefer one deep module over many tiny pass-through files.
- Preserve static-site simplicity unless the refactor clearly improves locality.
- For generated locale pages, edit source files and regenerate; do not hand-edit generated HTML.
- For cached assets, update `sw.js` cache version when needed.
- End each session with changed files, tests run, dirty worktree status, and next recommended candidate.

## Assumptions

- The active product task remains `minimal logo`; the PWA/cache contract is now closed at the lightweight v1 level.
- Next architecture session should be `Contact/Booking Contact Surface Cleanup`.
- `PROJECT_CONTEXT.md` is the repo-local handoff anchor.
- No ADRs exist yet; durable rejected architecture choices can become ADRs later.
