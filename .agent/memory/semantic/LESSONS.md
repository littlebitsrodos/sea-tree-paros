# Lessons (auto-distilled + manually curated)

> Entries here outlive specific tasks. The dream cycle promotes recurring
> patterns from episodic into this file. Feel free to curate manually —
> delete bad lessons, tighten wording, reorganize sections.

## Seed lessons
- Always read `protocols/permissions.md` before any destructive tool call.
- Write the failing test before writing the fix.
- Log to episodic memory on every significant action, success or failure.
- When a skill has failed 3+ times in 14 days, propose a rewrite.
- Never force push to protected branches under any circumstance.

## Auto-promoted entries will be appended below

### 2026-04

- Always serialize timestamps in UTC to avoid cross-region comparison bugs  <!-- status=accepted confidence=0.46 evidence=1 id=lesson_422695ae5b2d -->
- Every <img> must have explicit width and height attributes to keep CLS=0  <!-- status=accepted confidence=0.46 evidence=1 id=lesson_66326601789c -->
- Before a structural HTML change (lifting heading levels, renaming elements, changing tag names), grep the stylesheet for selectors that target the old element — update both HTML and CSS in the same pass.  <!-- status=accepted confidence=0.6 evidence=1 id=lesson_9731920fd5ab -->
- Before trusting a commit's scope from its title, run 'git show --stat <sha>' — the title states intent, not actual changes. A small-sounding title with stats showing 1000+ line changes or touching files outside the title's scope signals a stealth refactor.  <!-- status=accepted confidence=0.6 evidence=1 id=lesson_e3ec78858cc3 -->
- When server-renders per-locale HTML, any DOMContentLoaded init that walks [data-translate] must seed from document.documentElement.lang — never hardcode a language string. Two writers to the same DOM state: the second one silently wins.  <!-- status=accepted confidence=0.6 evidence=1 id=lesson_e28c85b468ad -->
