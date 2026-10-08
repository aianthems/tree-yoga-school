export type ChampionState = "MA" | "NH" | "VT" | "ME" | "RI" | "CT" | "NY" | "NJ" | "PA" | "DE" | "MD" | "VA" | "WV" | "NC" | "SC" | "TN" | "GA" | "KY" | "IN" | "AL";
export type ChampionTree = {
  yearCrowned?: string; remeasureDue?: string; rankingDate?: string | null; sourcePage?: number; mapPrecision?: "county"; sourceCounty?: string; crownPoints?: number; crownUnitUncertain?: boolean; sourceReviewNotes?: string[];
  id: string; state: ChampionState; publicAccess?: boolean; visibleFromPublic?: string | null; accessDetails?: string | null; publicCoordinates?: { lat: number; lng: number } | null; yearListed?: string | null; mapTown?: string; nominated?: string; status?: string; nationalFlag?: string; sourceUrl?: string; sourceRow: number; sourceTreeId?: string | null; scientificName: string; commonName: string;
  location: string | null; town: string; county: string; measured: string | null;
  circumference: number | null; height: number | null; crown: number | null;
  points: number | null; notes: string | null;
};
export const stateNames = { MA: "Massachusetts", NH: "New Hampshire", VT: "Vermont", ME: "Maine", RI: "Rhode Island", CT: "Connecticut", NY: "New York", NJ: "New Jersey", PA: "Pennsylvania", DE: "Delaware", MD: "Maryland", VA: "Virginia", WV: "West Virginia", NC: "North Carolina", SC: "South Carolina", TN: "Tennessee", GA: "Georgia", KY: "Kentucky", IN: "Indiana", AL: "Alabama" };
export const alChampionSource = {
  registerUrl: "https://www.forestry.alabama.gov/Pages/Management/Forms/Champion_Trees_2025.pdf",
  programUrl: "https://www.forestry.alabama.gov/Pages/Management/Champion_Tree.aspx",
  retrieved: "October 8, 2026",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const inChampionSource = {
  registerUrl: "https://www.in.gov/dnr/forestry/forestry-publications-and-presentations/indiana-big-tree-register/",
  retrieved: "October 8, 2026",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const gaChampionSource = {
  retrieved: "October 7, 2026",
  registerUrl: "https://gatrees.org/learn-explore/champion-trees/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const tnChampionSource = {
  retrieved: "October 7, 2026",
  programUrl: "https://naturalresources.tennessee.edu/champion-tree/",
  registerUrl: "https://naturalresources.tennessee.edu/trees/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const scChampionSource = {
  retrieved: "October 7, 2026", dataEdited: "November 25, 2025",
  programUrl: "https://www.clemson.edu/cafls/champtree/",
  registerUrl: "https://experience.arcgis.com/experience/25dbba11925a4bf8b22d6430581a02b2/page/Champion-Tree-Database/",
  dataUrl: "https://services1.arcgis.com/x5wCko8UnSi4h0CB/arcgis/rest/services/South_Carolina_Champion_Tree/FeatureServer/0",
  measuringUrl: "https://www.clemson.edu/cafls/champtree/how-to-measure-a-tree.html",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const ncChampionSource = {
  edition: "September 2026", retrieved: "October 7, 2026",
  programUrl: "https://www.ncagr.gov/divisions/nc-forest-service/urban/champion-trees",
  registerUrl: "https://www.ncagr.gov/divisions/nc-forest-service/nc-champion-tree-list",
  workbookUrl: "https://www.ncagr.gov/divisions/nc-forest-service/nc-champion-tree-list/open",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const wvChampionSource = {
  edition: "2025", retrieved: "October 7, 2026",
  programUrl: "https://wvforestry.com/big-tree-program/",
  floweringUrl: "https://wvforestry.com/pdf/bigtree/2025-Flowering-Common.xlsx",
  conifersUrl: "https://wvforestry.com/pdf/bigtree/2025-Conifers-Common.xlsx",
  definitionsUrl: "https://wvforestry.com/pdf/bigtree/2021_BT_Descrption_Key.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const vaChampionSource = {
  retrieved: "October 7, 2026",
  programUrl: "https://bigtree.cnre.vt.edu/",
  registerUrl: "https://bigtree.cnre.vt.edu/results.cfm?browsetype=StateChamp",
  mapUrl: "https://experience.arcgis.com/experience/9e9aa643c2a44ae9886fb2bcdac92c9a?org=virginiatech",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const mdChampionSource = {
  retrieved: "October 6, 2026",
  programUrl: "https://dnr.maryland.gov/forests/Pages/trees/bigtree.aspx",
  registerUrl: "https://www.mdbigtrees.org/state-champion-trees",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const deChampionSource = {
  retrieved: "October 6, 2026", latestRanking: "October 6, 2026",
  programUrl: "https://agriculture.delaware.gov/forest-service/",
  registerUrl: "https://experience.arcgis.com/experience/43ab90c14951412eaa751004b5cc4597/",
  dataUrl: "https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Biota/DE_Big_Tree_Champs/FeatureServer/0",
  bookUrl: "https://agriculture.delaware.gov/wp-content/uploads/sites/108/2025/03/Big-Trees-of-Delaware-5th-Edition.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_10.txt",
};
export const paChampionSource = {
  snapshot: "October 2026 extraction",
  programUrl: "https://paforestry.org/pa-big-trees",
  registerUrl: "https://pabigtrees.com/",
  scoringUrl: "https://pabigtrees.com/measuring",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export function townKey(tree: Pick<ChampionTree, "state" | "town" | "mapTown" | "county" | "mapPrecision">) {
  return `${tree.state}:${tree.mapPrecision === "county" ? `county:${tree.county}` : tree.mapTown || tree.town}`;
}
export function placeName(tree: Pick<ChampionTree, "mapPrecision" | "county" | "mapTown" | "town">) {
  return !tree.county && tree.mapPrecision === "county" ? "County not listed" : tree.mapPrecision === "county" ? (tree.county.endsWith(" City") ? tree.county : `${tree.county} County`) : tree.mapTown || tree.town;
}
export const njChampionSource = {
  retrieved: "October 6, 2026", dataEdited: "March 19, 2026",
  programUrl: "https://dep.nj.gov/parksandforests/conservation/big-heritage-trees/",
  registerUrl: "https://njdep.maps.arcgis.com/apps/webappviewer/index.html?id=f09501b4fb93432884bab9b923e64f73",
  dataUrl: "https://services1.arcgis.com/QWdNfRs7lkPq4g4Q/arcgis/rest/services/NJDEP_Big_and_Heritage_Trees_in_New_Jersey/FeatureServer/19",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_34.txt",
};
export const nyChampionSource = {
  edition: "January 31, 2025", retrieved: "October 6, 2026",
  programUrl: "https://dec.ny.gov/nature/animals-fish-plants/plants/big-tree-register",
  registerUrl: "https://dec.ny.gov/sites/default/files/2025-01/champsscientificname.pdf",
  commonUrl: "https://dec.ny.gov/sites/default/files/2024-01/champscommonname.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
};
export const ctChampionSource = {
  retrieved: "October 6, 2026",
  programUrl: "https://oak.conncoll.edu/notabletrees/",
  registerUrl: "https://oak.conncoll.edu/notabletrees/ChampsByCommonName.jsp",
  scientificUrl: "https://oak.conncoll.edu/notabletrees/ChampsByScientificName.jsp",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_09.txt",
  regionsUrl: "https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_county_ct.html",
};
export const riChampionSource = {
  edition: "March 24, 2026",
  retrieved: "October 6, 2026",
  registerUrl: "https://ritree.org/champion-tree/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_44.txt",
  cemeteryUrl: "https://swanpointcemetery.com/",
};
export const meChampionSource = {
  edition: "2020",
  retrieved: "October 6, 2026",
  programUrl: "https://www.maine.gov/dacf/mfs/policy_management/project_canopy/programs/big_trees.html",
  registerUrl: "https://www.maine.gov/tools/whatsnew/attach.php?an=1&id=3332272",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_23.txt",
  townshipUrl: "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/arcgis/rest/services/Maine_Town_and_Townships_Boundary_Polygons/FeatureServer/0",
};
export const vtChampionSource = {
  retrieved: "October 6, 2026",
  programUrl: "https://vtcommunityforestry.org/projects/vermont-big-tree-program",
  registerUrl: "https://experience.arcgis.com/experience/7637f5256b65454aa123e0c631f1f46a/page/Map/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_50.txt",
};
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

export const sourceDates: Record<ChampionState, string> = { AL: "AFC 2025 edition · retrieved October 8, 2026", IN: "Indiana DNR current list · retrieved October 8, 2026 · edition not stated", KY: "Kentucky Forestry register · retrieved October 7, 2026 · edition not stated", GA: "GFC register · retrieved October 7, 2026 · edition not stated", TN: "UT current list · retrieved October 7, 2026 · edition not stated", SC: "Clemson database · retrieved October 7, 2026", NC: "September 2026 edition · retrieved October 7, 2026", WV: "2025 workbooks · highest published scores · retrieved October 7, 2026", VA: "Retrieved October 7, 2026 · live register snapshot", MD: "Retrieved October 6, 2026 · live register snapshot", MA: "May 2026 edition", NH: "Retrieved October 6, 2026 · edition not stated", VT: "Retrieved October 6, 2026 · edition not stated", ME: "2020 edition · retrieved October 6, 2026", RI: "March 24, 2026 edition", CT: "Retrieved October 6, 2026 · edition not stated", NY: "January 31, 2025 edition", NJ: "Data edited March 19, 2026 · retrieved October 6, 2026", PA: "October 2026 extraction · score-based leaders", DE: "October 6, 2026 GIS snapshot · five-point rule from 2019" };
export type ChampionManifest = { state: ChampionState; name: string; listed: number; mapped: number }[];
export type ChampionPayload = { trees: ChampionTree[]; coordinates: Record<string, { lat: number; lng: number }> };
export const championRegions = { midwest: { name: "Midwest", states: ["IN"] }, southeast: { name: "Southeast", states: ["NC", "SC", "TN", "GA", "KY", "AL"] }, "new-england": { name: "New England", states: ["MA", "NH", "VT", "ME", "RI", "CT"] }, northeast: { name: "Northeast", states: ["MA", "NH", "VT", "ME", "RI", "CT", "NY", "NJ", "PA"] }, "mid-atlantic": { name: "Mid-Atlantic", states: ["NY", "NJ", "PA", "DE", "MD", "VA", "WV"] } };

export const kyChampionSource = { registerUrl: "https://eec.ky.gov/Natural-Resources/Forestry/ky-champion-trees/Pages/default.aspx", retrieved: "October 7, 2026", geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip" };

