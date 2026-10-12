# Mobile image delivery and 50-state map measurements

## Responsive photographs and logo

The founder-supplied logo, dancer photograph and tree-hug photograph retain their
full frame and existing CSS treatment. Their source URLs, SHA-256 hashes, source
sizes and generated variants are recorded in `lib/responsive-images.json`.

The shared header/footer and both photographic heroes use native responsive
images. Logo widths are 96, 192, 320, 480 and 640 pixels; photograph widths are
480, 800, 1200, 1600 and 2000 pixels. Browsers select a candidate using the display
width and pixel density. Hero/header images are eager with high fetch priority;
the homepage embrace and footer remain lazy. Dimensions reserve the image ratio.
No client-side image sizing, new production dependency, or image API is added.

These derivative assets are checked into the repository and served from the
website's own origin. The original R2 files remain the source material. The
reviewed R2 responses had no Cache-Control header and reported `DYNAMIC`; this
change does not alter the bucket or Cloudflare account settings. Only the new
`/images/responsive/` assets receive `public, max-age=31536000, immutable`.
Content hashes in filenames ensure future replacements use different URLs.

| Image | Previous single file | 800 px / header 192 px | 1200 px |
| --- | ---: | ---: | ---: |
| Shared logo | 318,250 bytes | 9,092 bytes | Not needed |
| Dancer photograph | 656,708 bytes | 132,910 bytes | 266,082 bytes |
| Tree-hug photograph | 452,980 bytes | 125,410 bytes | 223,194 bytes |

Browser QA used Chromium 153.0.8010.0, Pixel 5 emulation (393 × 851, DPR 2.75)
and a 1440 × 960 desktop viewport at DPR 1 against a local production build.
On a cold mobile homepage, the browser selected the 192-pixel logo and
1200-pixel dancer photograph: 275,174 image bytes versus 974,958 previously
(72% fewer bytes for those two images, not for the whole page).
Desktop selected the 96-pixel header logo and 1600-pixel dancer photograph.
The mobile footer selected 480 pixels; desktop selected 320 pixels. Browsers may
reuse a larger already-cached logo on subsequent pages instead of fetching a
smaller one. Both pages had no horizontal overflow. Screenshots confirmed the
pose and embrace retain their framing. A warm return transferred zero bytes for
the responsive images, and the local server returned the one-year cache header.

To regenerate, download the three source URLs into a temporary directory as
`logo.webp`, `dancer.webp` and `hug.webp`, then run
`node scripts/prepare-responsive-images.cjs SOURCE_DIRECTORY`. The helper uses
Sharp supplied by Next.js. Review the photographs and updated manifest before
committing. Regression checks verify decodable images, dimensions, framing,
content hashes and mobile transfer budgets.

## Full 50-state map: measured mobile browser runs

All six runs loaded **50 state responses**, **8,971 listed records**, **8,495
records with approximate map points**, and **2,005 mapped places**. Maximum state
request concurrency was four. No state request failed. Encoded state transfer
was 570,000 bytes, including response overhead. The viewport and document width
were both 393 CSS pixels.

Three cold-cache runs per profile use Pixel 5 emulation, 4× CPU slowdown,
Chromium 153.0.8010.0, and CDP network throttling. Tables show medians. The local
production build and existing Brotli-quality-4 adapter served actual built state
payloads. The map was scrolled into view as soon as its container appeared.

| Network profile | First result in DOM | First visible marker | All state data ready | Cached Colorado filter | Longest task |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1.6 Mbps / 150 ms | 1.97 s | 2.89 s | 7.98 s | 566 ms | 210 ms |
| 0.4 Mbps / 300 ms | 6.14 s | 10.01 s | 20.45 s | 582 ms | 219 ms |

**Limits:** these are local emulated-browser measurements, not a physical phone,
production CDN timings, INP, or Core Web Vitals. The isolated browser could not
load external OpenStreetMap tiles; all runs recorded zero successful tiles.
A direct production benchmark failed certificate validation in this environment;
certificate checks were not disabled. First-result timing is a DOM mutation, not
visibility. Cached filtering includes automation, selection, state updates and
result rendering. It does not measure typing or every filter combination.

The previous October 10 runs used fewer states and a different browser. These
numbers must not be presented as a controlled before/after comparison. This
change optimizes shared images; it does not change map computation or records.

**Finding:** incremental loading and bounded downloads work at 50 states.
Slow connections still require about 20 seconds for the complete dataset, and
cached filtering and 200 ms long tasks leave room for further rendering work.
First prioritize a physical-phone cellular check of basemap paint, touch
interaction, searching, filtering and returning to a cached map before claiming
production mobile performance improvements.

Raw data: [six browser runs](champion-mobile-measurements-2026-10-12.json).
The existing [loading guide](champion-map-loading.md) explains reproduction.
`measure-champion-mobile.cjs` now also records the loaded tile count and exact
result summary, so successful data loading cannot be mistaken for basemap paint.

Validation: 148 tests passed; production build passed; desktop/mobile image
selection and cache reuse checked in Chromium. No physical phone was available.
