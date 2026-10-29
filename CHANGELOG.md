# Changelog

Newest first. One dated block per change, so another branch can add its own block.

## 2026-10-29

- W3C HTML validator: drop the invalid `X-Content-Type-Options` and `Permissions-Policy` http-equiv metas (browsers ignore them, and GitHub Pages cannot send those headers), give the lightbox image a non-empty 1×1 placeholder that `script.js` replaces when a photo opens, and add sha256 hashes of the trimmed JSON-LD blocks to `script-src` so the checker stops flagging those data blocks. No `'unsafe-inline'`. Why: validator.w3.org reported 3 errors and 2 infos on each homepage and 2 errors on each privacy page. PR: https://github.com/littlebitsrodos/sea-tree-paros/pull/10
