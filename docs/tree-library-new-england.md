# New England Tree Library expansion — October 26, 2026

Six profiles bring the Library from 69 to 75 species: Katsura (*Cercidiphyllum japonicum*), eastern red pine (*Pinus resinosa*), jack pine (*Pinus banksiana*), white spruce (*Picea glauca*), black spruce (*Picea mariana*), and bigtooth aspen (*Populus grandidentata*).

Each uses the existing species and outdoor-practice templates, with three identification sections, three explicitly contemplative themes, four practice steps, seasonal observation, original-book connections, a reflection, and licensed local photography. These are new digital-school adaptations, not claims that the book assigned species-specific energies.

## Sources and identification decisions

- Katsura: NC State Extension; native to China and Japan, planted in New England. Weeping cultivars belong within this species profile without identifying an unverified local specimen. Short-shoot leaves are opposite or nearly opposite; other shoots can be alternate. Both filter choices are retained. Leaf teeth are not lobes.
- Eastern red pine: University of Minnesota UFOR and Iowa State Extension. Paired long needles, mature bark plates, and unarmed cone scales. Norway pine is a searchable common name, not a claim of Norwegian origin.
- Jack pine: NC State Extension. Short paired needles, variable crown form, persistent cones. Closed cones are not treated as universal, and no cone heating or burning is suggested.
- White spruce: Native Plant Trust Go Botany supplies the primary botanical name and regional reference, *Picea glauca*, matching existing register records. NC State redirects its former glauca URL to *Picea laxa*; this discrepancy is explained and that name is searchable without rewriting source register names. NC State supplies the photo provenance and additional needle, cone, and bark descriptions.
- Black spruce: NC State Extension and Native Plant Trust. Single short needles, hairy branchlets, persistent cones, and wetland or mountain habitat are combined rather than treated as individually definitive. The practice stays on durable established routes. No mature-bark filter is inferred from a source that supplies only bark colors.
- Bigtooth aspen: Native Plant Trust. Alternate simple leaves with coarse teeth, age-dependent bark, and root-suckering growth. Smooth and furrowed bark can both apply; teeth do not make a leaf lobed.

Botanical and image source pages were retrieved October 26, 2026. Photographs are sourced from NC State or Wikimedia Commons; only licenses permitting adaptation and commercial reuse were selected. The 14 source records, photographer credits, dimensions and original URLs are in `scripts/fixtures/tree-library-new-england-photo-sources.json`; attribution is also rendered on the species pages and recorded in `public/images/trees/ATTRIBUTION.md`. Originals were oriented, resized to a maximum of 1200 pixels without upscaling, and converted to WebP. Share-alike photographs retain their original license. No generated identification images.

## Integration

The additions enter the shared species array, identification metadata, name aliases, champion-to-Library lookup, related-tree suggestions, generated species and outdoor routes, and sitemap. There are 350 sitemap URLs, including the twelve new species and practice URLs. Existing URLs, styles, visit guides, comparisons, register measurements and privacy rules are unchanged. Run `npm run sync:coverage` to update current README totals.
