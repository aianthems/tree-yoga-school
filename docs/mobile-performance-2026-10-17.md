# Focused mobile delivery pass — October 17, 2026

Reviewed production source baseline `7697b3f` (including the latest homepage and
70% heading changes). This pass preserves those changes and the 5%/3% bark wash.

## Bark delivery

The previous R2 background response returned 1,073,488 bytes, `CF-Cache-Status:
DYNAMIC`, and no explicit Cache-Control lifetime. The same file was used on all
viewport sizes.

| Viewport | New file | Bytes | Reduction from original |
| --- | --- | ---: | ---: |
| Up to 760 CSS pixels | 800 × 1067 WebP | 102,566 | 90.4% |
| Wider screens | 1280 × 1707 WebP | 250,334 | 76.7% |

The source image is resized without cropping and gently softened for the faint
background use. Natural colors, the cream overlay and full-width coverage stay
in place. A side-by-side local composite at 5% image visibility was inspected.
These are background derivatives, not replacement source photographs.

Both files use SHA-based filenames under `/images/responsive/`, covered by the
existing `public, max-age=31536000, immutable` header. A changed image gets a new
URL; the original R2 object is untouched. A mobile media query changes only the
shared image variable, so all bark sections use the same selected asset.

`lib/bark-background.json` retains source hash, dimensions, variant hashes,
settings and byte counts. Regenerate with:

```
node scripts/prepare-bark-background.cjs /absolute/path/to/source.webp
```

Then update the two CSS URLs to match the manifest. Sharp is already provided
by the development installation; no production dependency was added. Regression
checks verify format, framing, hashes, CSS references and 120 KB / 280 KB budgets.

## Map findings

The current explorer already derives its requested state list from the URL's
validated state and region filters. `/champion-trees?state=MA` requests only MA;
it does not first queue all 50 states. Four bounded workers are used for the
national view. Filter changes stop old queued work, retain completed payloads,
and deduplicate in-flight requests. This behavior is retained.

Production HTTP check: MA JSON returned 200, `x-vercel-cache: HIT`, an ETag,
`cache-control: public, max-age=0, must-revalidate`, and Age 34,925 seconds.
A separate compressed GET transferred 8,893 bytes in 4.740 seconds from this
remote environment. This is one HTTP sample, not mobile UX or cellular timing.
The static API cache policy is retained to avoid stale browser payloads after a
new deployment.

An unthrottled remote-browser functional check of the Massachusetts view showed
139 listed / 139 mapped records, 61 mapped places, and 12 successfully loaded map
tiles. The content did not overflow the available desktop page width. Browser
performance timing and device emulation were not exposed by the available UI
control interface, so no new mobile timing claims are made.

The built 50-state payloads contain 8,971 records, 5,943,310 decoded bytes, and
559,885 bytes at local Brotli quality 4. This size estimate excludes headers,
page code, images and map tiles; production compression can differ. Reproduce
with `node scripts/measure-champion-loading.cjs` after building. Its modeled
concurrency comparisons describe the existing loader, not a change in this pass.

## Verification and remaining phone work

160 tests passed and the production build passed before release. Production
asset headers, desktop asset selection and the live map flow are checked after
release; the native deployment result determines publication status.

A physical phone and cellular network are unavailable in this environment.
Still needed: first map paint on a phone over cellular, search while loading,
state changes, cluster touch interaction, a cached return, and checking the
mobile bark crop. Record device, browser and network; do not substitute the
historical emulated runs for a fresh real-phone result. See the October 12
measurement document for historical throttled-browser baselines and limitations.
