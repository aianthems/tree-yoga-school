import { championStates, type ChampionState } from "./champion-states";
export { stateNames, sourceDates, championRegions, type ChampionState } from "./champion-states";
export type ChampionTree = {
  circumferenceFeet?: number | null; yearCrowned?: string; remeasureDue?: string; rankingDate?: string | null; sourcePage?: number; mapPrecision?: "county"; sourceCounty?: string; crownPoints?: number; crownUnitUncertain?: boolean; sourceReviewNotes?: string[];
  id: string; state: ChampionState; publicAccess?: boolean; visibleFromPublic?: string | null; accessDetails?: string | null; publicCoordinates?: { lat: number; lng: number } | null; yearListed?: string | null; mapTown?: string; nominated?: string; status?: string; nationalFlag?: string; sourceUrl?: string; sourceRow: number; sourceTreeId?: string | null; scientificName: string; commonName: string;
  location: string | null; town: string; county: string; measured: string | null;
  circumference: number | null; height: number | null; crown: number | null;
  points: number | null; notes: string | null;
};
export const flChampionSource = championStates.FL.source;
export const alChampionSource = championStates.AL.source;
export const inChampionSource = championStates.IN.source;
export const gaChampionSource = championStates.GA.source;
export const tnChampionSource = championStates.TN.source;
export const scChampionSource = championStates.SC.source;
export const ncChampionSource = championStates.NC.source;
export const wvChampionSource = championStates.WV.source;
export const vaChampionSource = championStates.VA.source;
export const mdChampionSource = championStates.MD.source;
export const deChampionSource = championStates.DE.source;
export const paChampionSource = championStates.PA.source;
export function townKey(tree: Pick<ChampionTree, "state" | "town" | "mapTown" | "county" | "mapPrecision">) {
  return `${tree.state}:${tree.mapPrecision === "county" ? `county:${tree.county}` : tree.mapTown || tree.town}`;
}
export function placeName(tree: Pick<ChampionTree, "mapPrecision" | "county" | "mapTown" | "town">) {
  return !tree.county && tree.mapPrecision === "county" ? "County not listed" : tree.mapPrecision === "county" ? (tree.county.endsWith(" City") ? tree.county : `${tree.county} County`) : tree.mapTown || tree.town;
}
export const njChampionSource = championStates.NJ.source;
export const nyChampionSource = championStates.NY.source;
export const ctChampionSource = championStates.CT.source;
export const riChampionSource = championStates.RI.source;
export const meChampionSource = championStates.ME.source;
export const vtChampionSource = championStates.VT.source;
export const nhChampionSource = championStates.NH.source;
export const championSource = championStates.MA.source;
export const librarySpecies: Record<string, { slug: string; name: string }> = {
  "Fraxinus pennsylvanica": { slug: "green-ash", name: "Green Ash" },
  "Quercus velutina": { slug: "black-oak", name: "Black Oak" },
  "Liquidambar styraciflua": { slug: "sweetgum", name: "Sweetgum" },
  "Quercus macrocarpa": { slug: "bur-oak", name: "Bur Oak" },
  "Ostrya virginiana": { slug: "american-hophornbeam", name: "American Hophornbeam" },
  "Betula nigra": { slug: "river-birch", name: "River Birch" },
  "Juglans nigra": { slug: "black-walnut", name: "Black Walnut" },
  "Tilia americana": { slug: "american-basswood", name: "American Basswood" },
  "Carpinus caroliniana": { slug: "american-hornbeam", name: "American Hornbeam" },
  "Carya ovata": { slug: "shagbark-hickory", name: "Shagbark Hickory" },
  "Acer saccharinum": { slug: "silver-maple", name: "Silver Maple" },
  "Prunus serotina": { slug: "black-cherry", name: "Black Cherry" },
  "Liriodendron tulipifera": { slug: "tulip-tree", name: "Tulip Tree" },
  "Sassafras albidum": { slug: "sassafras", name: "Sassafras" },
  "Nyssa sylvatica": { slug: "blackgum", name: "Blackgum" },
  "Metasequoia glyptostroboides": { slug: "dawn-redwood", name: "Dawn Redwood" },
  "Pinus strobus": { slug: "pine", name: "Pine" },
  "Quercus alba": { slug: "oak", name: "Oak" },
  "Ulmus americana": { slug: "american-elm", name: "American Elm" },
  "Fraxinus americana": { slug: "white-ash", name: "White Ash" },
  "Cercis canadensis": { slug: "eastern-redbud", name: "Eastern Redbud" },
  "Taxodium distichum": { slug: "bald-cypress", name: "Bald Cypress" },
  "Betula papyrifera": { slug: "birch", name: "Birch" },
  "Acer saccharum": { slug: "maple", name: "Maple" },
  "Salix nigra": { slug: "willow", name: "Willow" },
  "Fagus grandifolia": { slug: "beech", name: "Beech" },
  "Tsuga canadensis": { slug: "hemlock", name: "Hemlock" },
  "Thuja occidentalis": { slug: "cedar", name: "Cedar" },
  "Populus tremuloides": { slug: "aspen", name: "Aspen" },
  "Picea rubens": { slug: "spruce", name: "Spruce" },
  "Acer rubrum": { slug: "red-maple", name: "Red Maple" },
  "Quercus rubra": { slug: "red-oak", name: "Red Oak" },
  "Betula alleghaniensis": { slug: "yellow-birch", name: "Yellow Birch" },
  "Abies balsamea": { slug: "balsam-fir", name: "Balsam Fir" },
  "Larix laricina": { slug: "tamarack", name: "Tamarack" },
  "Platanus occidentalis": { slug: "sycamore", name: "Sycamore" },
};
export function sourceWarnings(tree: ChampionTree): string[] {
  const warnings: string[] = [...(tree.sourceReviewNotes || [])];
  if (tree.crownUnitUncertain) {
    warnings.push("NJDEP labels this field ‘Crown Average (in.)’, while its scoring guidance uses crown spread in feet. The original value is retained without a unit conversion or a recalculated score. Measurement dates are not supplied in this dataset.");
    return warnings;
  }
  if (tree.state === "RI" && tree.mapTown) warnings.push(`The source lists “${tree.town}” in its city/town column. Its marker uses the approximate ${tree.mapTown} municipality point, based on the cemetery’s published address. The original fields are retained.`);
  if (tree.state === "ME" && tree.mapTown && tree.mapTown !== tree.town) warnings.push(`The register lists “${tree.town}”. The marker uses the approximate ${tree.mapTown} town or township point; the original place name is retained. It does not locate the individual tree.`);
  if (tree.state === "NH") {
    if (tree.mapTown && tree.mapTown !== tree.town) warnings.push(`The register lists “${tree.town}”. Its marker uses the approximate ${tree.mapTown} municipality point; the original place name is retained. ${tree.town === "Boscowen" ? "Boscowen is interpreted as the source’s spelling of Boscawen in Merrimack County." : "It does not locate the village or individual tree."}`);
    return warnings;
  }
  if (tree.state === "VT" && tree.commonName === "Common name not listed") warnings.push("The Vermont source leaves the common name blank. Its scientific name is shown as published.");
  if (tree.state === "VT" && tree.commonName === "Table Mountain Pine") warnings.push("The Vermont source names this tree ‘Table Mountain Pine’ but lists Picea pungens as its scientific name. Both source names are retained; identification needs confirmation from the program.");
  if (tree.scientificName === "Salix nigra" && tree.commonName === "Walnut, Black") {
    warnings.push("The source calls this tree ‘Walnut, Black’ but gives Salix nigra, the scientific name for black willow. Both names are preserved here; identification needs confirmation from DCR.");
  }
  if (tree.circumference !== null && tree.height !== null && (tree.crown !== null || tree.crownPoints !== undefined) && tree.points !== null) {
    const calculated = tree.circumference + tree.height + (tree.crownPoints ?? (tree.crown! / 4));
    if (Math.abs(calculated - tree.points) > 1) warnings.push("The published points differ by more than one point from the total calculated using the listed measurements. The original score is shown unchanged.");
  }
  return warnings;
}
export function formatMeasurement(value: number | null) {
  return value === null ? "Not listed" : new Intl.NumberFormat("en-US", { maximumFractionDigits: 5 }).format(value);
}

export type ChampionManifest = { state: ChampionState; name: string; listed: number; mapped: number }[];
export type ChampionPayload = { trees: ChampionTree[]; coordinates: Record<string, { lat: number; lng: number }> };

export const kyChampionSource = championStates.KY.source;


export const ilChampionSource = championStates.IL.source;

export const miChampionSource = championStates.MI.source;

export const ohChampionSource = championStates.OH.source;

export const wiChampionSource = championStates.WI.source;

export const mnChampionSource = championStates.MN.source;
