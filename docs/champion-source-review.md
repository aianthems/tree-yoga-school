# Champion source review process

The live tracker is `/champion-trees/source-review`. `lib/champion-source-review-records.json` tracks all 50 states. Register URLs, source labels and retrieval/supply/capture evidence derive from `lib/champion-states.ts`, so the queue does not duplicate those facts. The queue was initialized October 12, 2026; all completed-review fields are null because initialization is not a fresh review of the registers.

## A manageable batch

Run `npm run review:sources` for up to five due sources, prioritized by coverage/age, then target date and state name. Supply an ISO date for an explicit cutoff: `npm run review:sources -- 2026-10-12`. This is an offline report. It does not call source websites, GitHub, Vercel, or start a scheduled job. No new GitHub workflow or automation is installed.

Start with Alaska, Arizona, Hawaiʻi, Idaho, Louisiana, Maine, Mississippi, Nevada and New Mexico: limited coverage, historical accounts, or dated 2019–2023 snapshots. These review targets start now even though several sources were retrieved recently. Routine reviews start January 12, 2027. Check a small batch when maintaining the project, rather than retrieving 50 states on every edit. A documented correction or official new-edition announcement can move one state's target forward. Program hiatus/on-hold status is a reason to check program availability, not a claim that a register is current or unusable.

## Record a review

1. Open the register and program links in the state registry. Check for a replacement edition, updated dataset, program status and changed source limitations. Follow actual official navigation if a link moved.
2. Compare source IDs, counts, dates, champion/co-champion labels and known discrepancies with the saved import audit and fixture. A changed page date alone does not prove changed measurements. Preserve restrictions and unknowns.
3. Record `lastReviewedOn` (ISO date of the actual check), `outcome` (`unchanged`, `updated`, `blocked`, or `needs-follow-up`), the relevant public `evidenceUrl`, and concise `notes`. Set `nextReviewOn` explicitly. Normally use the actual review date plus `reviewEveryDays` (90); use an earlier target for unresolved discrepancies or a known upcoming edition. For a blocked source, describe the limitation and choose a follow-up target rather than marking it updated. Completing a review must not clear an unresolved coverage warning.
4. If no dataset changed, retain its retrieval date and all tree dates. If a newer dataset is obtained, preserve the source snapshot/fixture, update its actual retrieval evidence and use the import workflow in `champion-state-expansion.md`. Review source-specific exceptions before changing counts. A page check is not automatically a dataset retrieval.
5. Validate only the work performed. For tracker-only edits, run `node --test scripts/test-source-reviews.cjs` and `npm run check:coverage`. For actual dataset refreshes, run that state's importer checks, `validate:champions` and relevant state tests; perform the required production build locally before publishing code changes. Group reviewed changes into one publication. No recurring CI job is required for this process.

## Dates have different meanings

- **Retrieved / supplied / screenshot capture:** when this project's source evidence was obtained. Mississippi was supplied; Ohio was captured as screenshots. Massachusetts has no documented retrieval date; Pennsylvania currently has only an extraction month. Do not invent exact days for either.
- **Edition / publication / dataset edit:** the source's date, preserved in the state's provenance label. A recent download can contain an old edition.
- **Measurement / inspection / nomination / ranking:** distinct source fields belonging to a particular tree. Keep the original field meaning and precision. Missing measurement dates remain missing; a nomination or ranking date must not become a measurement date. Never copy the retrieval or review date into tree measurement fields.
- **Last completed review / next target:** maintenance activity and a planned check. Neither verifies a tree's condition, title or public access.

## Email corrections

Keep the current record-level “Email a correction” links and contact contribution workflow. Acknowledge and investigate submissions only when authorized; this process does not send emails. In the tracker, record the state, record ID and a public supporting source or a concise unresolved note. Do not commit a contributor's personal email, address, private directions or other private correspondence. Verify the claim before changing the public data; retain conflicting published values in notes until resolved. A correction can trigger one state's review without refreshing the other 49.
