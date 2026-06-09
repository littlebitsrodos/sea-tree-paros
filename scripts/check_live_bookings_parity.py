#!/usr/bin/env python3
"""
Verify that live seatree.gr availability matches the freshly generated
Airbnb + Booking.com union in bookings.json.

This is intended to run after GitHub Pages deploys. It waits for CDN/pages
propagation and then fails the workflow if the public site is stale or differs
from the deploy artifact.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any


DEFAULT_URL = "https://seatree.gr/bookings.json"


def parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def load_json_file(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def fetch_json(url: str, timeout: int = 20) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "User-Agent": "seatree-parity-check/1.0 (+https://seatree.gr)",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parity_errors(expected: dict[str, Any], live: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    expected_dates = expected.get("dates")
    live_dates = live.get("dates")
    if not isinstance(expected_dates, list):
        errors.append("expected bookings.json has no dates array")
        expected_dates = []
    if not isinstance(live_dates, list):
        errors.append("live bookings.json has no dates array")
        live_dates = []

    expected_set = set(expected_dates)
    live_set = set(live_dates)
    missing = sorted(expected_set - live_set)
    extra = sorted(live_set - expected_set)
    if missing or extra:
        errors.append(
            "date mismatch: "
            f"{len(missing)} missing from live, {len(extra)} extra on live; "
            f"missing sample={missing[:20]}, extra sample={extra[:20]}"
        )

    if live.get("sources") != expected.get("sources"):
        errors.append(
            "source status mismatch: "
            f"expected={expected.get('sources')}, live={live.get('sources')}"
        )

    try:
        expected_generated = parse_timestamp(str(expected["generated_at"]))
        live_generated = parse_timestamp(str(live["generated_at"]))
    except (KeyError, ValueError) as exc:
        errors.append(f"generated_at timestamp is invalid or missing: {exc}")
    else:
        if live_generated < expected_generated:
            errors.append(
                "live bookings.json is stale: "
                f"expected generated_at >= {expected['generated_at']}, "
                f"live generated_at={live['generated_at']}"
            )

    return errors


def summarize(payload: dict[str, Any]) -> str:
    dates = payload.get("dates") if isinstance(payload.get("dates"), list) else []
    return (
        f"generated_at={payload.get('generated_at')} "
        f"sources={payload.get('sources')} count={len(dates)} "
        f"first={dates[0] if dates else None} last={dates[-1] if dates else None}"
    )


def wait_for_parity(
    expected: dict[str, Any],
    url: str,
    timeout_seconds: int,
    interval_seconds: int,
) -> int:
    deadline = time.monotonic() + timeout_seconds
    last_errors: list[str] = []
    attempt = 1

    while True:
        try:
            live = fetch_json(url)
            last_errors = parity_errors(expected, live)
            if not last_errors:
                print(f"live availability parity verified: {summarize(live)}")
                return 0

            print(
                f"attempt {attempt}: live availability is not in parity yet; "
                f"{'; '.join(last_errors)}",
                file=sys.stderr,
            )
        except Exception as exc:  # noqa: BLE001 — CI log is the audit trail
            last_errors = [f"failed to fetch live bookings.json: {exc}"]
            print(f"attempt {attempt}: {last_errors[0]}", file=sys.stderr)

        if time.monotonic() >= deadline:
            print(
                "live availability parity check failed after retries: "
                + "; ".join(last_errors),
                file=sys.stderr,
            )
            return 1

        attempt += 1
        time.sleep(interval_seconds)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", default="bookings.json")
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--timeout", type=int, default=600)
    parser.add_argument("--interval", type=int, default=15)
    args = parser.parse_args()

    expected = load_json_file(Path(args.expected))
    print(f"expected availability: {summarize(expected)}")
    return wait_for_parity(expected, args.url, args.timeout, args.interval)


if __name__ == "__main__":
    sys.exit(main())
