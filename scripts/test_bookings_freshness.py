#!/usr/bin/env python3
"""Fail when availability data is older than the hourly refresh can explain."""
from __future__ import annotations

import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

import check_bookings_freshness as freshness


ROOT = Path(__file__).resolve().parent.parent
# Live seatree.gr/bookings.json on 2026-10-29, last written by run 31259041380.
STALE_GENERATED_AT = "2026-08-08T13:13:38+00:00"
INVESTIGATED_AT = datetime(2026, 10, 29, 7, 17, tzinfo=timezone.utc)


class BookingFreshnessTests(unittest.TestCase):
    def test_august_snapshot_is_stale_on_2026_10_29(self) -> None:
        errors = freshness.freshness_errors(
            {"generated_at": STALE_GENERATED_AT},
            INVESTIGATED_AT,
            max_age_days=2,
        )

        self.assertTrue(errors)
        self.assertTrue(any("stale" in error for error in errors))

    def test_timestamp_from_the_same_moment_is_fresh(self) -> None:
        generated_at = INVESTIGATED_AT.isoformat(timespec="seconds")

        errors = freshness.freshness_errors(
            {"generated_at": generated_at},
            INVESTIGATED_AT,
            max_age_days=2,
        )

        self.assertEqual(errors, [])

    def test_exactly_two_days_old_is_still_accepted(self) -> None:
        generated_at = (INVESTIGATED_AT - timedelta(days=2)).isoformat(
            timespec="seconds"
        )

        errors = freshness.freshness_errors(
            {"generated_at": generated_at},
            INVESTIGATED_AT,
            max_age_days=2,
        )

        self.assertEqual(errors, [])

    def test_just_over_two_days_is_rejected(self) -> None:
        generated_at = (
            INVESTIGATED_AT - timedelta(days=2, seconds=1)
        ).isoformat(timespec="seconds")

        errors = freshness.freshness_errors(
            {"generated_at": generated_at},
            INVESTIGATED_AT,
            max_age_days=2,
        )

        self.assertTrue(any("stale" in error for error in errors))

    def test_missing_or_invalid_timestamp_is_rejected(self) -> None:
        missing = freshness.freshness_errors({}, INVESTIGATED_AT)
        invalid = freshness.freshness_errors(
            {"generated_at": "not-a-timestamp"},
            INVESTIGATED_AT,
        )

        self.assertTrue(missing)
        self.assertTrue(invalid)

    def test_ci_rejects_a_stale_snapshot_and_a_stale_live_calendar(self) -> None:
        workflow = (ROOT / ".github" / "workflows" / "ci.yml").read_text(
            encoding="utf-8"
        )

        self.assertIn("scripts/check_bookings_freshness.py --file bookings.json", workflow)
        self.assertIn(
            "scripts/check_bookings_freshness.py --url https://seatree.gr/bookings.json",
            workflow,
        )
        self.assertIn("--max-age-days 2", workflow)
        self.assertIn("name: Live calendar freshness", workflow)
        deploy = workflow.split("\n  deploy:", 1)[1].split("\n  live-calendar:", 1)[0]
        self.assertNotIn("check_bookings_freshness.py --url", deploy)
        self.assertIn("needs: [test]", deploy)


if __name__ == "__main__":
    unittest.main()
