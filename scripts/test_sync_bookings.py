#!/usr/bin/env python3
from __future__ import annotations

import tempfile
import unittest
from contextlib import redirect_stderr
from io import StringIO
from pathlib import Path
from unittest.mock import patch

import sync_bookings


class AllFeedsFailedTests(unittest.TestCase):
    def test_missing_bookings_json_aborts_deploy(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            with patch.object(sync_bookings, "OUT_PATH", Path(tmp) / "bookings.json"):
                with redirect_stderr(StringIO()):
                    self.assertEqual(sync_bookings.handle_all_feeds_failed(), 1)

    def test_existing_bookings_json_is_preserved(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            bookings_path = Path(tmp) / "bookings.json"
            existing = '{"dates":["2026-06-14"]}\n'
            bookings_path.write_text(existing, encoding="utf-8")

            with patch.object(sync_bookings, "OUT_PATH", bookings_path):
                with redirect_stderr(StringIO()):
                    self.assertEqual(sync_bookings.handle_all_feeds_failed(), 0)

            self.assertEqual(bookings_path.read_text(encoding="utf-8"), existing)


if __name__ == "__main__":
    unittest.main()
