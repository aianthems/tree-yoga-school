import data from "./tree-library-region-data.json";

// Generated from the same exact scientific-name matches used by profile record links.
// Only state membership is shipped to the Library, never the full register payloads.
export const libraryRegions = data.regions;
const membership: Record<string, Record<string, string[]>> = data.species;
export function libraryRegionStates(slug: string, region: string): readonly string[] {
  return membership[slug]?.[region] || [];
}
export function regionalRecordsHref(scientificName: string, region: string) {
  return `/champion-trees?${new URLSearchParams({ region, species: scientificName })}`;
}
