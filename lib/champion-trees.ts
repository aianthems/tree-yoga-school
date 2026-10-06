import records from "./data/champion-trees.json";
import nhRecords from "./data/new-hampshire-champion-trees.json";
import nhCoordinates from "./data/new-hampshire-town-points.json";
import coordinates from "./data/massachusetts-town-centroids.json";

export type ChampionTree = {
  id: string; state: "MA" | "NH"; mapTown?: string; nominated?: string; status?: string; nationalFlag?: string; sourceUrl?: string; sourceRow: number; scientificName: string; commonName: string;
  location: string | null; town: string; county: string; measured: string | null;
  circumference: number | null; height: number | null; crown: number | null;
  points: number | null; notes: string | null;
};
export const stateNames = { MA: "Massachusetts", NH: "New Hampshire" };
export function townKey(tree: Pick<ChampionTree, "state" | "town" | "mapTown">) {
  return `${tree.state}:${tree.mapTown || tree.town}`;
}
export const championTrees: readonly ChampionTree[] = [
  ...records.map(tree => ({ ...tree, state: "MA" as const })),
  ...nhRecords.map(tree => ({ ...tree, state: "NH" as const })),
];
export const townCoordinates: Record<string, { lat: number; lng: number }> = Object.fromEntries([
  ...Object.entries(coordinates).map(([town, point]) => [`MA:${town}`, point]),
  ...Object.entries(nhCoordinates).map(([town, point]) => [`NH:${town}`, point]),
]);
export const nhChampionSource = {
  retrieved: "October 6, 2026",
  programUrl: "https://www.nhbigtrees.org/",
  registerUrl: "https://www.nhbigtrees.org/trees",
  publicMapUrl: "https://extension.unh.edu/resource/new-hampshire-big-tree-map",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_33.txt",
};
export const championSource = {
  edition: "May 2026",
  programUrl: "https://www.mass.gov/guides/massachusetts-legacy-tree-program",
  workbookUrl: "/data/massachusetts-champion-trees-may-2026.xlsx",
  geographyUrl: "https://www.mass.gov/info-details/massgis-data-municipalities",
};
export const librarySpecies: Record<string, { slug: string; name: string }> = {
  "Pinus strobus": { slug: "pine", name: "Pine" },
  "Quercus alba": { slug: "oak", name: "Oak" },
  "Betula papyrifera": { slug: "birch", name: "Birch" },
  "Acer saccharum": { slug: "maple", name: "Maple" },
  "Salix nigra": { slug: "willow", name: "Willow" },
  "Fagus grandifolia": { slug: "beech", name: "Beech" },
  "Tsuga canadensis": { slug: "hemlock", name: "Hemlock" },
  "Thuja occidentalis": { slug: "cedar", name: "Cedar" },
  "Populus tremuloides": { slug: "aspen", name: "Aspen" },
  "Picea rubens": { slug: "spruce", name: "Spruce" },
};
export function sourceWarnings(tree: ChampionTree): string[] {
  const warnings: string[] = [];
  if (tree.state === "NH") {
    if (tree.mapTown && tree.mapTown !== tree.town) warnings.push(`The register lists “${tree.town}”. Its marker uses the approximate ${tree.mapTown} municipality point; the original place name is retained. ${tree.town === "Boscowen" ? "Boscowen is interpreted as the source’s spelling of Boscawen in Merrimack County." : "It does not locate the village or individual tree."}`);
    return warnings;
  }
  if (tree.scientificName === "Salix nigra" && tree.commonName === "Walnut, Black") {
    warnings.push("The source calls this tree ‘Walnut, Black’ but gives Salix nigra, the scientific name for black willow. Both names are preserved here; identification needs confirmation from DCR.");
  }
  if (tree.circumference !== null && tree.height !== null && tree.crown !== null && tree.points !== null) {
    const calculated = tree.circumference + tree.height + tree.crown / 4;
    if (Math.abs(calculated - tree.points) > 1) warnings.push("The published points differ by more than one point from the total calculated using the listed measurements. The original score is shown unchanged.");
  }
  return warnings;
}
export function formatMeasurement(value: number | null) {
  return value === null ? "Not listed" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 5 }).format(value);
}
