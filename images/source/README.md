# Source Images

This folder holds non-public image assets and working material for The SeaTree.

Only `images/optimized/` should be linked from HTML, CSS, metadata, or scripts.

## Structure

- `imports/`: New incoming photo batches, usually grouped by date and subject.
- `real/`: Longer-lived library of real/source photography.
- `ai/`: AI-generated working images that are not part of the public site surface.
- `misc/`: One-off source assets that do not fit the other buckets cleanly.

## Naming

- New import folders should use: `YYYY-MM-DD-short-description`
- Keep helper files like `names.tsv` and `snippets.html` inside the same import folder they belong to.
- Prefer lowercase ASCII names with hyphens for folders created from now on.

## Workflow

- Put new raw assets in `images/source/` first.
- Export site-ready assets to `images/optimized/`.
- Do not treat anything in `images/source/` as stable public URLs.
