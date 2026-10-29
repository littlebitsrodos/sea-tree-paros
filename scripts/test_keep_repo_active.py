#!/usr/bin/env python3
"""The hourly calendar schedule dies after 60 quiet days unless a commit lands."""
from __future__ import annotations

import re
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

import keep_repo_active as activity


ROOT = Path(__file__).resolve().parent.parent
WORKFLOW = ROOT / ".github" / "workflows" / "keepalive.yml"
CHECKOUT_SHA = "11d5960a326750d5838078e36cf38b85af677262"


class KeepRepoActiveTests(unittest.TestCase):
    def test_quiet_threshold_is_inside_the_60_day_window(self) -> None:
        self.assertLess(activity.QUIET_DAYS, activity.GITHUB_DISABLE_AFTER_DAYS)
        self.assertLessEqual(activity.QUIET_DAYS, 30)
        self.assertGreaterEqual(activity.QUIET_DAYS, 14)

    def test_twenty_quiet_days_does_not_stamp(self) -> None:
        self.assertFalse(activity.should_stamp(20))

    def test_twenty_one_quiet_days_stamps(self) -> None:
        self.assertTrue(activity.should_stamp(21))

    def test_the_2026_08_08_gap_would_have_stamped(self) -> None:
        # Last commit 2026-06-09, schedule disabled 2026-08-08: 60 days.
        last_commit = datetime(2026, 6, 9, 11, 21, tzinfo=timezone.utc)
        disabled_at = datetime(2026, 8, 8, 13, 13, tzinfo=timezone.utc)
        age_days = activity.commit_age_days(last_commit, disabled_at)

        self.assertGreaterEqual(age_days, 60)
        self.assertTrue(activity.should_stamp(age_days))

    def test_age_uses_whole_days(self) -> None:
        committed_at = datetime(2026, 10, 1, 12, 0, tzinfo=timezone.utc)
        now = committed_at + timedelta(days=21, hours=3)

        self.assertEqual(activity.commit_age_days(committed_at, now), 21)

    def test_workflow_is_a_contents_write_stamp_and_nothing_else(self) -> None:
        text = WORKFLOW.read_text(encoding="utf-8")
        permissions = re.search(
            r"^permissions:\n(?P<body>(?:  \S.*\n)*)",
            text,
            re.MULTILINE,
        )

        self.assertIsNotNone(permissions)
        self.assertEqual(permissions.group("body").strip(), "contents: write")
        self.assertNotIn("pull-requests:", text)
        self.assertNotIn("id-token:", text)
        self.assertNotIn("pages:", text)
        self.assertNotIn("secrets.", text)
        self.assertIn(f"actions/checkout@{CHECKOUT_SHA}", text)
        self.assertIn('cron: "17 3 * * 0"', text)
        self.assertIn("python3 scripts/keep_repo_active.py", text)
        self.assertIn("ref: main", text)


if __name__ == "__main__":
    unittest.main()
