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
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
LOCALES = ["en", "es", "el", "fr"]
NON_DEFAULT = [loc for loc in LOCALES if loc != "en"]
DOMAIN = "https://seatree.gr"


def load_translations():
    # Copy translations.js to a temp .cjs so Node always treats it as CommonJS,
    # even if some parent package.json declares "type": "module" (e.g. Playwright config).
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp) / "translations.cjs"
        shutil.copyfile(ROOT / "translations.js", tmp_path)
        node_script = f"console.log(JSON.stringify(require({json.dumps(str(tmp_path))})))"
        out = subprocess.check_output(
            ["node", "-e", node_script], cwd=ROOT, stderr=subprocess.STDOUT
        ).decode()
    return json.loads(out)


def get_by_path(obj, dotted):
    for part in dotted.split("."):
        if isinstance(obj, list):
            obj = obj[int(part)]
        else:
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
        if re.search(r'(?<!data-translate-)\bplaceholder="[^"]*"', new_open):
            new_open = re.sub(
                r'(?<!data-translate-)\bplaceholder="[^"]*"', f'placeholder="{text}"', new_open, count=1
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


# Home pages are regenerated from these inputs. Privacy pages are standalone
# HTML and are not rebuilt here, so each privacy URL is dated from its own file.
HOME_SITEMAP_SOURCES = {
    "https://seatree.gr/": ("index.html", "translations.js"),
    "https://seatree.gr/es/": ("index.html", "translations.js"),
    "https://seatree.gr/el/": ("index.html", "translations.js"),
    "https://seatree.gr/fr/": ("index.html", "translations.js"),
}
PRIVACY_SITEMAP_SOURCES = {
    "https://seatree.gr/privacy/": ("privacy/index.html",),
    "https://seatree.gr/es/privacy/": ("es/privacy/index.html",),
    "https://seatree.gr/el/privacy/": ("el/privacy/index.html",),
    "https://seatree.gr/fr/privacy/": ("fr/privacy/index.html",),
}
_URL_BLOCK = re.compile(r"<url>\s*.*?</url>", re.DOTALL)
_LASTMOD = re.compile(r"<lastmod>(\d{4}-\d{2}-\d{2})</lastmod>")


def _git_date(*args):
    try:
        return subprocess.check_output(
            ["git", "log", "-1", "--format=%cs", *args],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return ""


def sources_for_sitemap_loc(loc):
    return HOME_SITEMAP_SOURCES.get(loc) or PRIVACY_SITEMAP_SOURCES.get(loc)


def apply_sitemap_lastmods(sitemap, git_date):
    """Set each URL lastmod from that URL's source files.

    git_date(*paths) returns YYYY-MM-DD for the newest commit among those
    paths, or "" when that history is unavailable. An empty result keeps the
    date already in the sitemap instead of inventing one.
    """

    def replace_url(match):
        block = match.group(0)
        loc_match = re.search(r"<loc>([^<]+)</loc>", block)
        lastmod_match = _LASTMOD.search(block)
        if not loc_match or not lastmod_match:
            return block
        sources = sources_for_sitemap_loc(loc_match.group(1).strip())
        if not sources:
            return block
        dated = git_date(*sources)
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", dated or ""):
            return block
        return block[: lastmod_match.start(1)] + dated + block[lastmod_match.end(1) :]

    return _URL_BLOCK.sub(replace_url, sitemap)


def _git_date_for_paths(*paths):
    return _git_date("--", *paths)


def update_sitemap_lastmod():
    sitemap_path = ROOT / "sitemap.xml"
    sitemap = sitemap_path.read_text()
    new_sitemap = apply_sitemap_lastmods(sitemap, _git_date_for_paths)
    if new_sitemap != sitemap:
        sitemap_path.write_text(new_sitemap)
        print("updated sitemap.xml lastmod from each URL's source files")
    else:
        print("sitemap.xml lastmod already matches each URL's source files")


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

    update_sitemap_lastmod()


if __name__ == "__main__":
    main()
