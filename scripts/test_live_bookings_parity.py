#!/usr/bin/env python3
from __future__ import annotations

import unittest

import check_live_bookings_parity as parity


def payload(
    *,
    generated_at: str = "2026-06-09T09:34:45+00:00",
    dates: list[str] | None = None,
    sources: dict[str, str] | None = None,
) -> dict[str, object]:
    return {
        "generated_at": generated_at,
        "sources": sources
        if sources is not None
        else {"airbnb": "ok (146 dates)", "booking": "ok (215 dates)"},
        "dates": dates if dates is not None else ["2026-06-14", "2026-06-15"],
    }


class LiveBookingsParityTests(unittest.TestCase):
    def test_matching_live_payload_has_no_errors(self) -> None:
        expected = payload()
        live = payload(generated_at="2026-06-09T09:40:00+00:00")

        self.assertEqual(parity.parity_errors(expected, live), [])

    def test_stale_live_payload_is_an_error(self) -> None:
        expected = payload(generated_at="2026-06-09T09:40:00+00:00")
        live = payload(generated_at="2026-06-09T09:34:45+00:00")

        errors = parity.parity_errors(expected, live)

        self.assertTrue(any("stale" in error for error in errors))

    def test_date_mismatch_reports_missing_and_extra_counts(self) -> None:
        expected = payload(dates=["2026-06-14", "2026-06-15"])
        live = payload(dates=["2026-06-15", "2026-06-16"])

        errors = parity.parity_errors(expected, live)

        self.assertTrue(any("1 missing from live" in error for error in errors))
        self.assertTrue(any("1 extra on live" in error for error in errors))

    def test_source_status_mismatch_is_an_error(self) -> None:
        expected = payload()
        live = payload(sources={"airbnb": "ok (146 dates)", "booking": "error: timeout"})

        errors = parity.parity_errors(expected, live)

        self.assertTrue(any("source status mismatch" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
