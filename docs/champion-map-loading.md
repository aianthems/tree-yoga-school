# Champion map initial loading

## October 10, 2026: measured mobile browser runs

Current coverage is 35 states, 7,137 listed records and 7,107 records with approximate map points. The following are browser measurements, distinct from the older network models below.

**Scope:** a local production Next.js build in headless Chromium 143.0.7499.0, Pixel 5 emulation (393 × 851 CSS pixels, DPR 2.75), cold browser cache, 4× CPU slowdown, and CDP-applied network throttling. Three fresh browser contexts per profile; tables show medians. Download rates are 1.6/0.4 Mbps, latency 150/300 ms, and upload 0.75 Mbps. A local adapter serves the actual built state bodies with Brotli quality 4. It is not a production CDN replica or a physical phone test. The live origin hit this environment's proxy certificate error; certificate checks were not disabled. External OpenStreetMap tile requests also failed in the isolated browser, so these runs measure marker rendering and list behavior, **not complete basemap paint or production Core Web Vitals**.

| Applied network | First result in DOM | First visible marker | All states ready | Cached Colorado filter | Longest task per run (median) |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1.6 Mbps / 150 ms latency | 2.02 s | 3.16 s | 10.99 s | 759 ms | 822 ms |
| 0.4 Mbps / 300 ms latency | 5.84 s | 9.12 s | 18.90 s | 714 ms | 772 ms |

All six runs completed 35 state responses with at most four simultaneous state requests. Encoded state transfer was 459,255 bytes including response overhead. The map was scrolled into view as soon as its container appeared; first visible marker checks a marker's viewport bounds. First result records a list mutation, not viewport visibility. “All states ready” records disappearance of the register loading message with markers present; it excludes external tile success. Cached Colorado filter timing includes the browser interaction, state update, and changed result list; it is not INP. Initial document width remained 393 px, matching the viewport, in all runs.

The uncompressed local-server pilot sent 4,372,341 state bytes and took 25.0–26.0 seconds for all states at 1.6 Mbps. This was discarded as a production-network comparison because production already uses Brotli. Compression is not a new website change here.

**Finding:** bounded downloads work and results arrive incrementally, but the 4× slowdown exposes substantial main-thread work: many tasks over 50 ms, with individual tasks reaching roughly 0.7–0.9 seconds. Cached filtering also takes roughly 0.7–0.8 seconds. Investigate repeated sorting/grouping and marker rebuilding as states publish before coverage reaches 40–50 states. These observations justify a focused rendering profile; they do not establish a production phone regression or a need to change record content or default coverage.

[Raw measurements](champion-mobile-measurements-2026-10-10.json) include all six runs, paint entries, long tasks, transfer counts, and failed tile requests.

### Reproduce the browser benchmark

Requires a development installation of Playwright and Chromium; neither is added to the production app. Run `npm run build`, then `npm start -- --hostname 127.0.0.1 --port 3072` and `node scripts/serve-champion-benchmark.cjs` in separate terminals. Set `CHROMIUM_PATH` if the executable is outside Playwright's cache. Run:

```sh
MAP_TEST_URL=http://127.0.0.1:3073/champion-trees MAP_TEST_OUTPUT=/tmp/champion-mobile-results.json node scripts/measure-champion-mobile.cjs
```

The default is three runs at each network profile. `MAP_TEST_RUNS` changes repeats. The script writes results after every successful run and exits on navigation or readiness failure. `MAP_TEST_PROXY` optionally supplies an environment proxy; credentials are not logged. To measure the live site in a browser environment with valid trust and network access, use `MAP_TEST_URL=https://treeyogaschool.com/champion-trees` without the local adapter. Follow with a real phone check for tile paint, scrolling and touch interaction.

## October 9, 2026: historical network model

The default view covers 32 states and 6,097 records. Built state API bodies total
3,409,671 decoded bytes. Brotli quality 4 estimates 392,889 bytes on the wire.
An HTTP check of the production Massachusetts API returned 200, `content-encoding:
br`, and `x-vercel-cache: PRERENDER`; compression/static delivery already work.
CDN compression parameters may differ from the local estimate.

Run `node scripts/measure-champion-loading.cjs` after `npm run build` to refresh
the measurements as coverage grows. The script reads the actual built payloads
in manifest order, measures desktop JSON parsing, and models a warm HTTP/2
connection with equal bandwidth sharing among responses. Each request waits one
RTT. It excludes page assets, packet loss, server variation, CPU throttling,
React rendering, map tiles and browser scheduling. These are **network estimates,
not measured mobile browser performance or Core Web Vitals**. Browser QA was
unavailable in this execution environment.

| Network model | Downloads in parallel | First completed state | All state data |
| --- | ---: | ---: | ---: |
| 1.6 Mbps, 150 ms RTT, previous loader | 32 | 939 ms | 2,114 ms |
| 1.6 Mbps, 150 ms RTT, updated loader | 4 | 318 ms | 2,550 ms |
| 0.4 Mbps, 300 ms RTT, previous loader | 32 | 3,456 ms | 8,158 ms |
| 0.4 Mbps, 300 ms RTT, updated loader | 4 | 974 ms | 8,660 ms |

Desktop parsing of all JSON bodies took about 10 ms (median of 21 runs). This
does not establish phone CPU performance. There is no evidence here for changing
record contents, introducing a combined endpoint or changing the default view.

The limited worker pool favors the first useful results and avoids starting an
unbounded number of requests as new states are added. All states still load in
the default view. Successful responses publish immediately; failures do not block
other states. Changing filters stops the previous pool's queued requests, while
already active responses can finish and populate the shared cache. A new filter
can temporarily overlap with up to four requests from the previous pool.

The tradeoff is a slightly later complete dataset in these models. Verify the
full page on a phone or with browser throttling before making further performance
changes, especially near 40–50 states. Measure first visible markers, completion,
long tasks and filter responsiveness alongside the network transfer.

## Species links

Case-insensitive Library lookup and species filtering were deployed with the
six-profile Library expansion. Regression coverage now checks every Library
mapping plus the source records `vt-42`, `me-2020-19`, `me-2020-29` and
`me-2020-120`. The original source names remain intact; botanical synonyms remain
separate. The first three were identified in the original review; the fourth now
links to the newly added Eastern Redcedar profile.
