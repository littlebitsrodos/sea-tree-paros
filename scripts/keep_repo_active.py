#!/usr/bin/env python3
"""Commit an empty activity stamp when main has been quiet for too long.

GitHub disables scheduled workflows on a public repository after 60 days
without a commit. The hourly calendar refresh does not count, because a
workflow run is not a commit. This script adds one empty commit so the
schedule stays enabled. It does not change the site and it does not send
messages.

The push uses the workflow's GITHUB_TOKEN. GitHub does not start a new
workflow from that push, so the stamp does not deploy the site.
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from datetime import datetime, timezone


QUIET_DAYS = 21
GITHUB_DISABLE_AFTER_DAYS = 60
BOT_NAME = "github-actions[bot]"
BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com"


def commit_age_days(committed_at: datetime, now: datetime) -> int:
    if committed_at.tzinfo is None or now.tzinfo is None:
        raise ValueError("timestamps must be timezone-aware")
    delta = now.astimezone(timezone.utc) - committed_at.astimezone(timezone.utc)
    if delta.total_seconds() < 0:
        return 0
    return delta.days


def should_stamp(quiet_days: int, threshold: int = QUIET_DAYS) -> bool:
    if threshold >= GITHUB_DISABLE_AFTER_DAYS:
        raise ValueError("threshold must stay below GitHub's 60-day disable")
    return quiet_days >= threshold


def git_text(args: list[str]) -> str:
    try:
        completed = subprocess.run(
            args,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or "").strip()
        if any(marker in detail for marker in ("AUTHORIZATION", "x-access-token", "gho_", "github_pat_")):
            detail = "credential output was hidden"
        print(f"git failed: {' '.join(args[:2])}: {detail}", file=sys.stderr)
        raise SystemExit(1) from None
    return completed.stdout


def last_commit_time() -> datetime:
    raw = git_text(["git", "log", "-1", "--format=%cI"]).strip()
    parsed = datetime.fromisoformat(raw)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def on_main_tip() -> bool:
    branch = git_text(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip()
    if branch == "main":
        return True
    head = git_text(["git", "rev-parse", "HEAD"]).strip()
    origin_main = git_text(["git", "rev-parse", "origin/main"]).strip()
    return head == origin_main


def working_tree_is_dirty() -> bool:
    return bool(git_text(["git", "status", "--porcelain"]).strip())


def commit_empty(age_days: int) -> None:
    message = (
        f"chore: keep scheduled workflows active after {age_days} quiet days\n\n"
        "GitHub disables scheduled workflows on a public repository after "
        "60 days without a commit. Workflow runs do not count. This empty "
        "commit is that activity and does not change the site.\n"
    )
    env = os.environ.copy()
    env["GIT_AUTHOR_NAME"] = BOT_NAME
    env["GIT_AUTHOR_EMAIL"] = BOT_EMAIL
    env["GIT_COMMITTER_NAME"] = BOT_NAME
    env["GIT_COMMITTER_EMAIL"] = BOT_EMAIL
    try:
        subprocess.run(
            ["git", "commit", "--allow-empty", "-m", message],
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
        )
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or "").strip()
        if any(marker in detail for marker in ("AUTHORIZATION", "x-access-token", "gho_", "github_pat_")):
            detail = "credential output was hidden"
        print("git failed: git commit: empty activity stamp was not created", file=sys.stderr)
        if detail:
            print(detail, file=sys.stderr)
        raise SystemExit(1) from None
    git_text(["git", "push", "origin", "HEAD:main"])


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    now = datetime.now(timezone.utc)
    committed_at = last_commit_time()
    age_days = commit_age_days(committed_at, now)
    print(f"last_commit_at={committed_at.isoformat(timespec='seconds')}")
    print(f"age_days={age_days}")
    print(f"threshold_days={QUIET_DAYS}")

    if not should_stamp(age_days):
        print("repository activity is recent; no stamp")
        return 0

    print(f"main has been quiet for {age_days} days; a stamp is due")
    if args.dry_run:
        print("dry-run: no commit was created")
        return 0

    if os.environ.get("GITHUB_ACTIONS") != "true":
        print("refusing to stamp outside GitHub Actions", file=sys.stderr)
        return 2
    if not on_main_tip():
        print("refusing to stamp because HEAD is not main", file=sys.stderr)
        return 2
    if working_tree_is_dirty():
        print("working tree is dirty; refusing to stamp", file=sys.stderr)
        return 2

    commit_empty(age_days)
    print("activity stamp pushed to main")
    return 0


if __name__ == "__main__":
    sys.exit(main())
