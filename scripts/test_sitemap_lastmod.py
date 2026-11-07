#!/usr/bin/env python3
"""Sitemap lastmod follows each URL's own source files."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

import build_locales


ROOT = Path(__file__).resolve().parent.parent

FIXTURE = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seatree.gr/</loc>
    <lastmod>2020-01-01</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/es/</loc>
    <lastmod>2020-01-01</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/el/</loc>
    <lastmod>2020-01-01</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/fr/</loc>
    <lastmod>2020-01-01</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/privacy/</loc>
    <lastmod>2026-11-07</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://seatree.gr/privacy/"/>
  </url>
  <url>
    <loc>https://seatree.gr/es/privacy/</loc>
    <lastmod>2026-11-07</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/el/privacy/</loc>
    <lastmod>2026-11-07</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/fr/privacy/</loc>
    <lastmod>2026-11-07</lastmod>
  </url>
  <url>
    <loc>https://seatree.gr/other/</loc>
    <lastmod>2019-05-05</lastmod>
  </url>
</urlset>
"""


def lastmods(sitemap: str) -> dict[str, str]:
    return dict(re.findall(r"<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>", sitemap))


def git_date_from(dates: dict[str, str]):
    def git_date(*paths: str) -> str:
        found = [dates[path] for path in paths if dates.get(path)]
        return max(found) if found else ""

    return git_date


class SitemapLastmodTests(unittest.TestCase):
    def test_home_source_change_does_not_move_unchanged_privacy_pages(self) -> None:
        dates = {
            "index.html": "2026-11-07",
            "translations.js": "2026-06-09",
            "privacy/index.html": "2026-06-09",
            "es/privacy/index.html": "2026-06-09",
            "el/privacy/index.html": "2026-06-09",
            "fr/privacy/index.html": "2026-06-09",
        }
        updated = build_locales.apply_sitemap_lastmods(FIXTURE, git_date_from(dates))
        found = lastmods(updated)

        for loc in build_locales.HOME_SITEMAP_SOURCES:
            self.assertEqual(found[loc], "2026-11-07", loc)
        for loc in build_locales.PRIVACY_SITEMAP_SOURCES:
            self.assertEqual(found[loc], "2026-06-09", loc)
        self.assertEqual(found["https://seatree.gr/other/"], "2019-05-05")

    def test_privacy_file_change_dates_only_that_privacy_url(self) -> None:
        dates = {
            "index.html": "2026-11-07",
            "translations.js": "2026-06-09",
            "privacy/index.html": "2026-06-09",
            "es/privacy/index.html": "2026-06-09",
            "el/privacy/index.html": "2026-08-01",
            "fr/privacy/index.html": "2026-06-09",
        }
        updated = build_locales.apply_sitemap_lastmods(FIXTURE, git_date_from(dates))
        found = lastmods(updated)

        self.assertEqual(found["https://seatree.gr/el/privacy/"], "2026-08-01")
        for loc, path in build_locales.PRIVACY_SITEMAP_SOURCES.items():
            if loc == "https://seatree.gr/el/privacy/":
                continue
            self.assertEqual(found[loc], dates[path[0]], loc)
        for loc in build_locales.HOME_SITEMAP_SOURCES:
            self.assertEqual(found[loc], "2026-11-07", loc)

    def test_repeat_run_is_stable(self) -> None:
        dates = {
            "index.html": "2026-11-07",
            "translations.js": "2026-06-09",
            "privacy/index.html": "2026-06-09",
            "es/privacy/index.html": "2026-06-09",
            "el/privacy/index.html": "2026-08-01",
            "fr/privacy/index.html": "2026-06-09",
        }
        git_date = git_date_from(dates)
        once = build_locales.apply_sitemap_lastmods(FIXTURE, git_date)
        twice = build_locales.apply_sitemap_lastmods(once, git_date)
        self.assertEqual(twice, once)

    def test_missing_history_keeps_the_existing_date(self) -> None:
        def git_date(*paths: str) -> str:
            if paths == ("index.html", "translations.js"):
                return "2026-11-07"
            return ""

        sitemap = FIXTURE.replace(
            "<loc>https://seatree.gr/privacy/</loc>\n    <lastmod>2026-11-07</lastmod>",
            "<loc>https://seatree.gr/privacy/</loc>\n    <lastmod>2026-06-09</lastmod>",
        )
        updated = build_locales.apply_sitemap_lastmods(sitemap, git_date)
        found = lastmods(updated)
        self.assertEqual(found["https://seatree.gr/"], "2026-11-07")
        self.assertEqual(found["https://seatree.gr/privacy/"], "2026-06-09")

    def test_tracked_sitemap_matches_real_source_commits(self) -> None:
        sitemap = (ROOT / "sitemap.xml").read_text()
        updated = build_locales.apply_sitemap_lastmods(sitemap, build_locales._git_date_for_paths)
        self.assertEqual(updated, sitemap)
        again = build_locales.apply_sitemap_lastmods(updated, build_locales._git_date_for_paths)
        self.assertEqual(again, updated)

        found = lastmods(updated)
        home = build_locales._git_date_for_paths("index.html", "translations.js")
        self.assertRegex(home, r"\d{4}-\d{2}-\d{2}")
        for loc in build_locales.HOME_SITEMAP_SOURCES:
            self.assertEqual(found[loc], home, loc)
        for loc, paths in build_locales.PRIVACY_SITEMAP_SOURCES.items():
            self.assertEqual(found[loc], build_locales._git_date_for_paths(*paths), loc)


if __name__ == "__main__":
    unittest.main()
