# Tree Library discovery — October 10, 2026

The 63-profile Library defaults to tree display names A–Z; Z–A and scientific
name A–Z are also available. Discovery state lives in the URL: `q`, `practice`,
`foliage`, `arrangement`, `lobes`, `bark`, `sort`, and `view`. Defaults are omitted.
Search edits replace the current history entry; menu/view choices create history
entries. Back/Forward, incoming links and reloads restore selections. Reset
clears search and filters while preserving the chosen sort and view.

The statically rendered page still contains every profile link in alphabetical
order. The URL store hydrates filtered selections without a dynamic server route
or downloading full practices into the discovery component. Compact view and
copy-link behavior remain available, including a manual copy fallback.

Six editorial practice categories replace the detailed theme dropdown. Category
membership follows each profile's existing themes, and categories overlap.
Detailed themes remain on profiles and cards. The category mapping is a practice
proposal, not a botanical classification.

Identification metadata is curated for all profiles in
`lib/tree-identification-data.json`. Each entry links to its NC State Extension
profile, reviewed October 10, 2026. The source pages' structured leaf fields,
leaf descriptions and bark descriptions were checked together; broad field
labels alone sometimes omit variation or mix up compound leaves and leaflets.

- Foliage distinguishes broad leaves, needles and scales. Juvenile eastern
  redcedar can match needles as well as mature scale foliage.
- Arrangement applies to whole broad leaves. Northern catalpa matches opposite
  and whorled arrangements. Butternut matches alternate whole leaves.
- Lobes distinguish major divisions from marginal teeth. Sassafras, red mulberry,
  boxelder, swamp white oak, chinkapin oak and ginkgo retain variable outlines.
- Bark filters are observational groupings, with overlapping categories and age
  variation. An empty bark list means no selected category was assigned; it does
  not assert smoothness or the absence of a distinctive feature.

Broad-leaf arrangement and lobe controls are cleared and disabled when only
needles or scales are selected. Unknown URL choices safely revert to defaults.
These filters narrow Library candidates; they do not establish identification.

Three added comparisons bring the total to six: paper/yellow birch,
American hornbeam/hophornbeam, and white/green ash. Each compares leaves, bark,
and seed structures, with existing and seven additional credited photographs.
The new-photo source/license/dimension provenance is retained in
`scripts/fixtures/tree-comparison-expansion-photo-sources.json`. Photos are
converted to WebP, with resizing stated on the comparison page. The small green
ash seed photograph is retained at its native resolution rather than enlarged.

Supplementary references clarify yellow birch's upright seed-bearing structures
(UNH Extension) and the ash samara distinction (USDA white ash plant guide and
Oregon State University green ash profile). Comparison pages link these sources
alongside each species' NC State reference. They also link both profiles and
outdoor practices; profiles automatically link their relevant comparisons.

Regression checks cover ordering without source mutation, category coverage,
URL round-trips and invalid choices, filter intersections, variable foliage,
compound-leaf arrangement, no-results recovery, comparison reciprocity, image
credits and local files. README coverage and sitemap counts follow the six-guide
collection; filtered URL variants keep the Library canonical.
