#!/usr/bin/env python3
"""
Fetch Airbnb + Booking.com iCal availability feeds and emit /bookings.json.

Runs at deploy time (GitHub Action) so the browser reads a static,
same-origin JSON file — no CORS proxy, no runtime third-party dependency,
no CSP gymnastics.

If all feeds fail the existing bookings.json is preserved (better stale
than empty). In a clean deploy checkout, where no existing bookings.json is
available, the script fails rather than publishing the site without
availability data. If at least one succeeds we union the results.

Pure stdlib on purpose: the GitHub workflow does not pip-install anything.
"""
from __future__ import annotations

import json
import sys
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ICAL_FEEDS = [
    (
        "airbnb",
        "https://www.airbnb.co.uk/calendar/ical/1659626910469787873.ics"
        "?t=27432fdc07c54e9bb8e3ea8622b9fac0",
    ),
    (
        "booking",
        "https://ical.booking.com/v1/export"
        "?t=5cafb294-ac4f-4cff-be12-ab4f933ad203",
    ),
]

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "bookings.json"
TIMEOUT_SECONDS = 20


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "seatree-sync/1.0 (+https://seatree.gr)"},
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
        return resp.read().decode("utf-8", errors="replace")


def unfold(ical_text: str) -> list[str]:
    """RFC 5545 line unfolding — continuation lines start with space or tab."""
    lines: list[str] = []
    for raw in ical_text.splitlines():
        if raw.startswith((" ", "\t")) and lines:
            lines[-1] += raw[1:]
        else:
            lines.append(raw)
    return lines


def parse_ical_date(value: str) -> date:
    """iCal DATE (YYYYMMDD) or DATE-TIME (YYYYMMDDTHHMMSSZ) → python date."""
    value = value.strip()
    if "T" in value:
        value = value.split("T", 1)[0]
    return datetime.strptime(value, "%Y%m%d").date()


def extract_blocked_dates(ical_text: str) -> set[str]:
    blocked: set[str] = set()
    in_vevent = False
    dtstart: date | None = None
    dtend: date | None = None

    for line in unfold(ical_text):
        stripped = line.strip()
        if stripped == "BEGIN:VEVENT":
            in_vevent = True
            dtstart = dtend = None
            continue
        if stripped == "END:VEVENT":
            if in_vevent and dtstart and dtend:
                cur = dtstart
                # DTEND is exclusive per RFC 5545 §3.8.2.2
                while cur < dtend:
                    blocked.add(cur.isoformat())
                    cur += timedelta(days=1)
            in_vevent = False
            continue
        if not in_vevent:
            continue

        key, sep, val = stripped.partition(":")
        if not sep:
            continue
        name = key.split(";", 1)[0].upper()
        if name == "DTSTART":
            try:
                dtstart = parse_ical_date(val)
            except ValueError:
                dtstart = None
        elif name == "DTEND":
            try:
                dtend = parse_ical_date(val)
            except ValueError:
                dtend = None

    return blocked


def handle_all_feeds_failed() -> int:
    if OUT_PATH.exists():
        print(
            "all feeds failed; preserving existing bookings.json",
            file=sys.stderr,
        )
        return 0

    print(
        "all feeds failed and bookings.json does not exist; "
        "aborting deploy to keep the live calendar intact",
        file=sys.stderr,
    )
    return 1


def main() -> int:
    all_blocked: set[str] = set()
    source_status: dict[str, str] = {}
    successes = 0

    for name, url in ICAL_FEEDS:
        try:
            raw = fetch(url)
            dates = extract_blocked_dates(raw)
            all_blocked |= dates
            source_status[name] = f"ok ({len(dates)} dates)"
            successes += 1
            print(
                f"[{name}] fetched {len(raw)} bytes, {len(dates)} blocked dates",
                file=sys.stderr,
            )
        except Exception as e:  # noqa: BLE001 — CI log is the audit trail
            source_status[name] = f"error: {e}"
            print(f"[{name}] FAILED: {e}", file=sys.stderr)

    if successes == 0:
        # All feeds down — keep any prior bookings.json rather than
        # overwriting with an empty list. In CI's clean checkout, fail the
        # deploy instead of publishing an artifact that omits bookings.json.
        return handle_all_feeds_failed()

    today = date.today().isoformat()
    future_blocked = sorted(d for d in all_blocked if d >= today)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sources": source_status,
        "dates": future_blocked,
    }

    OUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(
        f"→ wrote {OUT_PATH.relative_to(ROOT)} "
        f"with {len(future_blocked)} future blocked dates",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
