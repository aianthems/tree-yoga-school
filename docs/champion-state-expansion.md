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
