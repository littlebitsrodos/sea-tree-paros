#!/usr/bin/env python3
"""
Build per-locale HTML files for hreflang SEO.

Reads translations.js via `node -e` and the root index.html as a
template, then:

  1. Emits /es/index.html, /el/index.html, /fr/index.html with
     translated <head> (title, meta description, OG, Twitter),
     translated body copy via data-translate attributes, locale-aware
     <html lang>, absolute asset paths, and an hreflang cluster +
     canonical per locale.
  2. Patches the root index.html (EN) in place to add the same
     hreflang cluster + canonical pointing to "/".

Run it before commit/deploy:

    python3 scripts/build_locales.py

Re-runs are idempotent — it always regenerates the locale files
fresh from the current index.html + translations.js.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
LOCALES = ["en", "es", "el", "fr"]
NON_DEFAULT = [loc for loc in LOCALES if loc != "en"]
DOMAIN = "https://seatree.gr"


def load_translations():
    node_script = "console.log(JSON.stringify(require('./translations.js')))"
    out = subprocess.check_output(
        ["node", "-e", node_script], cwd=ROOT, stderr=subprocess.STDOUT
    ).decode()
    return json.loads(out)


def get_by_path(obj, dotted):
    for part in dotted.split("."):
        obj = obj[part]
    return obj


def href(locale):
    return DOMAIN + ("/" if locale == "en" else f"/{locale}/")


def hreflang_block(current_locale):
    lines = [f'  <link rel="canonical" href="{href(current_locale)}">']
    for loc in LOCALES:
        lines.append(f'  <link rel="alternate" hreflang="{loc}" href="{href(loc)}">')
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="{href("en")}">')
    return "\n".join(lines)


def set_html_lang(html, locale):
    return re.sub(r'<html lang="[a-z-]+">', f'<html lang="{locale}">', html, count=1)


def translate_meta(html, meta):
    html = re.sub(r"<title>[^<]*</title>", f'<title>{meta["title"]}</title>', html, count=1)
    html = re.sub(
        r'<meta\s+name="description"\s*\n?\s*content="[^"]*"\s*>',
        f'<meta name="description"\n    content="{meta["description"]}">',
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<meta\s+property="og:title"\s+content="[^"]*"\s*>',
        f'<meta property="og:title" content="{meta["ogTitle"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta\s+property="og:description"\s*\n?\s*content="[^"]*"\s*>',
        f'<meta property="og:description"\n    content="{meta["ogDescription"]}">',
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<meta\s+name="twitter:title"\s+content="[^"]*"\s*>',
        f'<meta name="twitter:title" content="{meta["twitterTitle"]}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta\s+name="twitter:description"\s*\n?\s*content="[^"]*"\s*>',
        f'<meta name="twitter:description"\n    content="{meta["twitterDescription"]}">',
        html,
        count=1,
        flags=re.DOTALL,
    )
    return html


def patch_og_url(html, locale):
    return re.sub(
        r'<meta property="og:url" content="https://seatree\.gr[^"]*">',
        f'<meta property="og:url" content="{href(locale)}">',
        html,
        count=1,
    )


def inject_hreflang(html, locale):
    block = hreflang_block(locale)
    # If a previous hreflang block is present, strip it first (idempotent rebuild).
    html = re.sub(
        r"\n\n  <link rel=\"canonical\"[^\n]*\n(  <link rel=\"alternate\"[^\n]*\n)+",
        "\n",
        html,
        count=1,
    )
    # Insert right after </title>.
    return re.sub(
        r"(<title>[^<]*</title>)\n",
        r"\1\n\n" + block + "\n",
        html,
        count=1,
    )


def translate_body(html, loc_translations):
    def replace(match):
        tag, attrs, key = match.group(1), match.group(2), match.group(3)
        try:
            text = get_by_path(loc_translations, key)
        except (KeyError, TypeError):
            return match.group(0)
        return f"<{tag}{attrs}>{text}</{tag}>"

    return re.sub(
        r'<(\w+)([^>]*\bdata-translate="([^"]+)"[^>]*)>.*?</\1>',
        replace,
        html,
        flags=re.DOTALL,
    )


def translate_placeholders(html, loc_translations):
    def replace(match):
        tag_open_prefix = match.group(1)
        key = match.group(2)
        tag_open_suffix = match.group(3)
        try:
            text = get_by_path(loc_translations, key)
        except (KeyError, TypeError):
            return match.group(0)
        # Replace placeholder="..." if already present, else insert one.
        new_open = tag_open_prefix + f'data-translate-placeholder="{key}"' + tag_open_suffix
        if re.search(r'\bplaceholder="[^"]*"', new_open):
            new_open = re.sub(
                r'\bplaceholder="[^"]*"', f'placeholder="{text}"', new_open, count=1
            )
        else:
            new_open = re.sub(r">$", f' placeholder="{text}">', new_open, count=1)
        return new_open

    return re.sub(
        r'(<[^>]*?)\bdata-translate-placeholder="([^"]+)"([^>]*>)',
        replace,
        html,
    )


def absolutize_paths(html):
    # href/src for asset-like extensions
    html = re.sub(
        r'\b(href|src)="(?!https?:|/|#|mailto:|tel:|data:)([^"]+?\.(?:css|js|webp|jpg|jpeg|png|svg|ico|woff2?|xml|json|txt))"',
        r'\1="/\2"',
        html,
    )
    # images/, fonts/ directories regardless of extension
    html = re.sub(
        r'\b(href|src)="(?!https?:|/|#)(images/[^"]+)"', r'\1="/\2"', html
    )
    html = re.sub(
        r'\b(href|src)="(?!https?:|/|#)(fonts/[^"]+)"', r'\1="/\2"', html
    )
    # srcset in <source> / <img> — may contain multiple comma-separated entries.
    def _absolutize_srcset(match):
        entries = []
        for entry in match.group(1).split(","):
            entry = entry.strip()
            if not entry:
                continue
            url, _, descriptor = entry.partition(" ")
            if not url.startswith(("http:", "https:", "/", "data:")):
                url = "/" + url
            entries.append(f"{url} {descriptor}".strip())
        return f'srcset="{", ".join(entries)}"'

    html = re.sub(r'\bsrcset="([^"]+)"', _absolutize_srcset, html)
    # manifest
    html = re.sub(
        r'\bhref="(?!https?:|/|#)(manifest\.json)"', r'href="/\1"', html
    )
    # data-translate links to internal anchors like href="#..." — these stay
    return html


def build_locale(src_html, locale, all_translations):
    t = all_translations[locale]
    html = src_html
    html = set_html_lang(html, locale)
    html = translate_meta(html, t["meta"])
    html = patch_og_url(html, locale)
    html = inject_hreflang(html, locale)
    html = translate_body(html, t)
    html = translate_placeholders(html, t)
    if locale != "en":
        html = absolutize_paths(html)
    return html


def main():
    try:
        all_translations = load_translations()
    except subprocess.CalledProcessError as e:
        print(f"failed to load translations via node: {e.output.decode()}", file=sys.stderr)
        sys.exit(1)

    src_html = SRC.read_text()

    # Non-default locales → subdirectories
    for locale in NON_DEFAULT:
        out_dir = ROOT / locale
        out_dir.mkdir(exist_ok=True)
        out_path = out_dir / "index.html"
        built = build_locale(src_html, locale, all_translations)
        out_path.write_text(built)
        print(f"wrote {out_path.relative_to(ROOT)}  ({len(built):,} bytes)")

    # Root (EN) → patch in place
    root_html = build_locale(src_html, "en", all_translations)
    SRC.write_text(root_html)
    print(f"updated {SRC.relative_to(ROOT)}  ({len(root_html):,} bytes)")


if __name__ == "__main__":
    main()
