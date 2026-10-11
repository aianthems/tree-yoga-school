# Adding and refreshing Champion Tree states

The lightweight registry in `lib/champion-states.ts` owns each state's display name, provenance, source-date label, record files, coordinate file, mapping policy, importer/audit paths, expected counts and explicit unmapped IDs. `ChampionState`, names and source dates derive from it. Existing named source exports in `champion-trees.ts` remain compatibility aliases for the detailed source notes.

`lib/champion-tree-data.ts` binds static JSON imports on the server. Add a dataset binding there when adding a state. The shared normalizer applies the registry's county or source-preserved precision, prefixes coordinate keys, and preserves source-record order. Register data is not imported into the client configuration.

## Import workflow

1. Save the official source snapshot and its retrieval date. Use the state's existing importer listed in the registry when available. Source formats differ; keep their parsing and selection rules explicit.
2. Preserve source names, IDs, row/page references, co-champions, units, uncertainties and null measurements. Do not deduplicate by species or assume ownership establishes public access. Never geocode private tree addresses.
3. Review the import audit and source-to-output counts. For Ohio's screenshot-derived lists, compare every page and row; there is no automated source parser. Legacy states without an importer require a reviewed source extraction.
4. Update the registry after reviewing real source changes: expected record/mapped counts, date, and any explicitly unmapped IDs. A missing county or unresolved place remains a visible record without a marker. Do not add invented coordinates to make validation pass.
5. Run `npm run validate:champions -- --state MN` (substitute the state), then `npm run validate:champions`, `npm test`, and `npm run build`. Builds automatically run the common validation first.
6. Review source-specific tests and the deployed state filter, count, records, warnings and map precision before release.

## Standard checks

The validator runs offline against saved JSON. It verifies configured source files and importer/audit references, provenance, unique IDs within and across registers, source row references, source-state consistency, required names, finite/null measurements, access-label types, coordinate ranges, exact reviewed counts and explicit unmapped exceptions. It never writes source data or recomputes champion rankings.

These checks complement source-specific tests. They do not prove that a source snapshot is complete or that a tree is currently alive, accessible or safe to visit; those require source review. Audit schemas differ and remain preserved rather than forced into a fabricated universal format.

## Arkansas browser extraction

Arkansas's register was readable in a browser after direct HTTP retrieval returned 403. The October 9, 2026 import covers all nine listing pages (15 records each on pages 1–8; five on page 9) and all 125 linked detail pages. Do not use the 133-option species filter or the vacancies table as a record count.

The reviewed, normalized extraction is saved in `scripts/fixtures/arkansas-champions-2026-10-09.tsv`. Its columns and access codes are documented in `scripts/import-arkansas-champions.py`; source unit punctuation exceptions are retained in the importer and audit. Regenerate JSON with that fixture and the 2025 Census national county Gazetteer ZIP. The normalized transfer was checked against the browser-extracted serialization before importing; its SHA-256 is in the audit.

For a refresh, navigate the register's actual pagination links and capture each tree card's published post ID, source URL, species names, county, score and property classification. Open every linked detail page for circumference, height, crown width and title designation. Compare names and scores to the cards; preserve repeated species and all explicit co/tri-champions. Do not capture personal owner names, addresses or private directions. Review missing county/access fields rather than inferring them. Eastern Cottonwood currently has no county and is explicitly unmapped.


### Arizona 2023 champion roster

All 143 numbered champion entries on PDF pages 34–37 of DFFM’s 2023 annual report are accounted for as 139 distinct published IDs. Four duplicate groups are audited. Cork oak AZ0098 uses row 76’s 2022 measurements over row 4’s 2004 values, with both versions documented. The other three repeats have identical retained values. Separate IDs and published co-champion designations are preserved without re-ranking. The separate Heritage/Witness appendix is excluded; dual designations in the champion appendix remain.

138 records map to 11 Census 2025 county points; AZ0142 has no county and remains searchable without a marker. Published scientific labels, decimal measurements, nomination/measurement years, statuses and scores remain unchanged. One score discrepancy is flagged. Nominators and exact positions are omitted; access is not inferred. This is a 2023 snapshot, not a current roster: the 2024 additions and inaccessible 2025 report are not merged. Reproduce with `python scripts/import-arizona-champions.py REPORT.pdf COUNTIES.zip`; requires Poppler. The importer verifies a reviewed 143-row fixture and writes a provenance/deduplication audit. Retrieved October 11, 2026.


### California public database snapshot

All 264 distinct IDs returned by Cal Poly California Big Trees’ public listing endpoint are retained: 263 state champion flags, 178 national champion flags and 36 co-champion flags (overlapping). Fremont cottonwood ID 229 has only a co-champion flag, confirmed on its detail endpoint; no state/national title is inferred. Records are approved and not marked dead in the listing, without independently confirming current condition. Homepage counter values (247 listings / 181 national champions) differ; actual listing records take precedence. No edition is stated; snapshot retrieved October 11, 2026.

258 records map to 46 Census 2025 county points. Six literal None county labels remain undisclosed and unmapped; two Toulumne labels match Tuolumne with source notes. Hidden-location flags do not change county-only mapping; no individual coordinates are imported for any record. Accepted scientific names are used for grouping, original scientific labels retained in notes, and common names, decimal measurements, scores and dates preserved. January 1 dates may be year-only legacy placeholders. Nominator/measurer/contact fields, addresses, photographs and access permissions are omitted. Run `python scripts/import-california-champions.py LISTINGS.json COUNTIES.zip`; standard library only. The importer compares redacted fields against a reviewed fixture and writes records, geography and a provenance audit.
