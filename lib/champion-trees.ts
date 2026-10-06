import records from "./data/champion-trees.json";
import coordinates from "./data/massachusetts-town-centroids.json";

export type ChampionTree = {
  id: string; sourceRow: number; scientificName: string; commonName: string;
  location: string | null; town: string; county: string; measured: string | null;
  circumference: number | null; height: number | null; crown: number | null;
  points: number | null; notes: string | null;
};
export const championTrees: readonly ChampionTree[] = records;
export const townCoordinates: Record<string, { lat: number; lng: number }> = coordinates;
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
