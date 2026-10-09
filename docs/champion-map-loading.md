# Champion map initial loading

## October 9, 2026 review

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
