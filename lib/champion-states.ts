// Lightweight shared configuration. Register payloads stay in the server-only loader.
export type ChampionStateConfig = {
  name: string; sourceDate: string; recordFiles: readonly string[]; coordinateFile: string;
  recordPrecision: "county" | "preserve"; coordinatePrecision: "county" | "place";
  recordOrder: number; expectedRecords: number; expectedMapped: number;
  unmappedIds: readonly string[]; importer: string | null; auditFile: string | null;
  source: Readonly<Record<string, string | number>>;
};
export const championStates = {
  MN: { name: "Minnesota", sourceDate: "Minnesota DNR current champions · retrieved October 9, 2026", recordFiles: ["minnesota-champion-trees.json"], coordinateFile: "minnesota-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 0, expectedRecords: 62, expectedMapped: 62, unmappedIds: [], importer: "import-minnesota-champions.py", auditFile: "minnesota-import-audit.json", source: {
 registerUrl: "https://www.dnr.state.mn.us/trees/bigtree/big-tree-champions.html",
 programUrl: "https://www.dnr.state.mn.us/trees/bigtree/index.html",
 measuringUrl: "https://www.dnr.state.mn.us/trees/bigtree/measuring.html",
 retrieved: "October 9, 2026", count: 62,
} },
  WI: { name: "Wisconsin", sourceDate: "DNR champion map · retrieved October 9, 2026 · program on hold", recordFiles: ["wisconsin-champion-trees.json"], coordinateFile: "wisconsin-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 1, expectedRecords: 57, expectedMapped: 57, unmappedIds: [], importer: "import-wisconsin-champions.py", auditFile: "wisconsin-import-audit.json", source: {
 registerUrl: "https://experience.arcgis.com/experience/0f303a8067c1493aa62eb764375f64fe",
 mapUrl: "https://experience.arcgis.com/experience/3baffe32b8c246dc8848bde36e583d73",
 programUrl: "https://dnr.wisconsin.gov/topic/forests/championtrees",
 retrieved: "October 9, 2026", count: 57, countyCount: 21,
} },
  OH: { name: "Ohio", sourceDate: "Complete native and non-native lists · screenshots October 9, 2026", recordFiles: ["ohio-champion-trees.json"], coordinateFile: "ohio-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 2, expectedRecords: 253, expectedMapped: 252, unmappedIds: ["oh-bda3adb9d0a2"], importer: null, auditFile: "ohio-import-audit.json", source: {
  nativeUrl: "https://ohiodnr.gov/discover-and-learn/safety-conservation/about-odnr/forestry/champion-trees/native-champion-trees",
  nonNativeUrl: "https://ohiodnr.gov/wps/portal/gov/odnr/discover-and-learn/safety-conservation/about-ODNR/forestry/champion-trees/nonnative-champions",
  captured: "October 9, 2026",
  coverage: "Complete native and non-native lists",
  nativeCount: 127,
  nonNativeCount: 126,
  mappedCount: 252,
  countyCount: 67,
} },
  MI: { name: "Michigan", sourceDate: "MBS July 14, 2026 sheet · score-based leaders · retrieved October 9, 2026", recordFiles: ["michigan-champion-trees.json"], coordinateFile: "michigan-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 3, expectedRecords: 122, expectedMapped: 122, unmappedIds: [], importer: "import-michigan-champions.py", auditFile: "michigan-import-audit.json", source: {
  retrieved: "October 9, 2026", edition: "July 14, 2026 sheet",
  programUrl: "https://michiganbotanicalsociety.org/registry",
  registerUrl: "https://docs.google.com/spreadsheets/d/1x0l0BRXxdGzV6kxMLtvNBb88x0jqlTJfNLpQGZtjrB8/edit?usp=sharing",
  scoringUrl: "https://michiganbotanicalsociety.org/how-to-measure-a-tree",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  IL: { name: "Illinois", sourceDate: "Illinois Extension register · retrieved October 8, 2026", recordFiles: ["illinois-champion-trees.json"], coordinateFile: "illinois-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 4, expectedRecords: 124, expectedMapped: 124, unmappedIds: [], importer: "import-illinois-champions.py", auditFile: "illinois-import-audit.json", source: {
  retrieved: "October 8, 2026",
  programUrl: "https://extension.illinois.edu/forestry/big-tree-register",
  registerUrl: "https://experience.arcgis.com/experience/df5e7296d76a4c8ba133c9e8adf1f85a",
  dataUrl: "https://services.arcgis.com/GL0fWlNkwysZaKeV/arcgis/rest/services/IBTR_masterfile/FeatureServer/0",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  MA: { name: "Massachusetts", sourceDate: "May 2026 edition", recordFiles: ["champion-trees.json"], coordinateFile: "massachusetts-town-centroids.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 20, expectedRecords: 139, expectedMapped: 139, unmappedIds: [], importer: "import-champion-trees.py", auditFile: null, source: {
  edition: "May 2026",
  programUrl: "https://www.mass.gov/guides/massachusetts-legacy-tree-program",
  workbookUrl: "/data/massachusetts-champion-trees-may-2026.xlsx",
  geographyUrl: "https://www.mass.gov/info-details/massgis-data-municipalities",
} },
  NH: { name: "New Hampshire", sourceDate: "Retrieved October 6, 2026 · edition not stated", recordFiles: ["new-hampshire-champion-trees.json"], coordinateFile: "new-hampshire-town-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 21, expectedRecords: 93, expectedMapped: 93, unmappedIds: [], importer: null, auditFile: null, source: {
  retrieved: "October 6, 2026",
  programUrl: "https://www.nhbigtrees.org/",
  registerUrl: "https://www.nhbigtrees.org/trees",
  publicMapUrl: "https://extension.unh.edu/resource/new-hampshire-big-tree-map",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_33.txt",
} },
  VT: { name: "Vermont", sourceDate: "Retrieved October 6, 2026 · edition not stated", recordFiles: ["vermont-champion-trees.json"], coordinateFile: "vermont-town-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 22, expectedRecords: 91, expectedMapped: 91, unmappedIds: [], importer: "import-vermont-champions.py", auditFile: null, source: {
  retrieved: "October 6, 2026",
  programUrl: "https://vtcommunityforestry.org/projects/vermont-big-tree-program",
  registerUrl: "https://experience.arcgis.com/experience/7637f5256b65454aa123e0c631f1f46a/page/Map/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_50.txt",
} },
  ME: { name: "Maine", sourceDate: "2020 edition · retrieved October 6, 2026", recordFiles: ["maine-champion-trees.json"], coordinateFile: "maine-town-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 25, expectedRecords: 146, expectedMapped: 146, unmappedIds: [], importer: "import-maine-champions.py", auditFile: null, source: {
  edition: "2020",
  retrieved: "October 6, 2026",
  programUrl: "https://www.maine.gov/dacf/mfs/policy_management/project_canopy/programs/big_trees.html",
  registerUrl: "https://www.maine.gov/tools/whatsnew/attach.php?an=1&id=3332272",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_23.txt",
  townshipUrl: "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/arcgis/rest/services/Maine_Town_and_Townships_Boundary_Polygons/FeatureServer/0",
} },
  RI: { name: "Rhode Island", sourceDate: "March 24, 2026 edition", recordFiles: ["rhode-island-champion-trees.json"], coordinateFile: "rhode-island-town-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 24, expectedRecords: 155, expectedMapped: 155, unmappedIds: [], importer: "import-rhode-island-champions.py", auditFile: null, source: {
  edition: "March 24, 2026",
  retrieved: "October 6, 2026",
  registerUrl: "https://ritree.org/champion-tree/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_44.txt",
  cemeteryUrl: "https://swanpointcemetery.com/",
} },
  CT: { name: "Connecticut", sourceDate: "Retrieved October 6, 2026 · edition not stated", recordFiles: ["connecticut-champion-trees.json"], coordinateFile: "connecticut-town-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 23, expectedRecords: 504, expectedMapped: 504, unmappedIds: [], importer: "import-connecticut-champions.py", auditFile: null, source: {
  retrieved: "October 6, 2026",
  programUrl: "https://oak.conncoll.edu/notabletrees/",
  registerUrl: "https://oak.conncoll.edu/notabletrees/ChampsByCommonName.jsp",
  scientificUrl: "https://oak.conncoll.edu/notabletrees/ChampsByScientificName.jsp",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_09.txt",
  regionsUrl: "https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_county_ct.html",
} },
  NY: { name: "New York", sourceDate: "January 31, 2025 edition", recordFiles: ["new-york-champion-trees.json"], coordinateFile: "new-york-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 19, expectedRecords: 210, expectedMapped: 210, unmappedIds: [], importer: "import-new-york-champions.py", auditFile: null, source: {
  edition: "January 31, 2025", retrieved: "October 6, 2026",
  programUrl: "https://dec.ny.gov/nature/animals-fish-plants/plants/big-tree-register",
  registerUrl: "https://dec.ny.gov/sites/default/files/2025-01/champsscientificname.pdf",
  commonUrl: "https://dec.ny.gov/sites/default/files/2024-01/champscommonname.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  NJ: { name: "New Jersey", sourceDate: "Data edited March 19, 2026 · retrieved October 6, 2026", recordFiles: ["new-jersey-champion-trees.json"], coordinateFile: "new-jersey-place-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 18, expectedRecords: 206, expectedMapped: 206, unmappedIds: [], importer: "import-new-jersey-champions.py", auditFile: null, source: {
  retrieved: "October 6, 2026", dataEdited: "March 19, 2026",
  programUrl: "https://dep.nj.gov/parksandforests/conservation/big-heritage-trees/",
  registerUrl: "https://njdep.maps.arcgis.com/apps/webappviewer/index.html?id=f09501b4fb93432884bab9b923e64f73",
  dataUrl: "https://services1.arcgis.com/QWdNfRs7lkPq4g4Q/arcgis/rest/services/NJDEP_Big_and_Heritage_Trees_in_New_Jersey/FeatureServer/19",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_34.txt",
} },
  PA: { name: "Pennsylvania", sourceDate: "October 2026 extraction · score-based leaders", recordFiles: ["pennsylvania-champion-trees.json"], coordinateFile: "pennsylvania-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 17, expectedRecords: 445, expectedMapped: 445, unmappedIds: [], importer: "import-pennsylvania-champions.py", auditFile: null, source: {
  snapshot: "October 2026 extraction",
  programUrl: "https://paforestry.org/pa-big-trees",
  registerUrl: "https://pabigtrees.com/",
  scoringUrl: "https://pabigtrees.com/measuring",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  DE: { name: "Delaware", sourceDate: "October 6, 2026 GIS snapshot · five-point rule from 2019", recordFiles: ["delaware-champion-trees.json"], coordinateFile: "delaware-place-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: 16, expectedRecords: 91, expectedMapped: 91, unmappedIds: [], importer: "import-delaware-champions.py", auditFile: null, source: {
  retrieved: "October 6, 2026", latestRanking: "October 6, 2026",
  programUrl: "https://agriculture.delaware.gov/forest-service/",
  registerUrl: "https://experience.arcgis.com/experience/43ab90c14951412eaa751004b5cc4597/",
  dataUrl: "https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Biota/DE_Big_Tree_Champs/FeatureServer/0",
  bookUrl: "https://agriculture.delaware.gov/wp-content/uploads/sites/108/2025/03/Big-Trees-of-Delaware-5th-Edition.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_10.txt",
} },
  MD: { name: "Maryland", sourceDate: "Retrieved October 6, 2026 · live register snapshot", recordFiles: ["maryland-champion-trees.json"], coordinateFile: "maryland-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 15, expectedRecords: 274, expectedMapped: 274, unmappedIds: [], importer: "import-maryland-champions.py", auditFile: null, source: {
  retrieved: "October 6, 2026",
  programUrl: "https://dnr.maryland.gov/forests/Pages/trees/bigtree.aspx",
  registerUrl: "https://www.mdbigtrees.org/state-champion-trees",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  VA: { name: "Virginia", sourceDate: "Retrieved October 7, 2026 · live register snapshot", recordFiles: ["virginia-champion-trees.json"], coordinateFile: "virginia-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 14, expectedRecords: 369, expectedMapped: 369, unmappedIds: [], importer: "import-virginia-champions.py", auditFile: null, source: {
  retrieved: "October 7, 2026",
  programUrl: "https://bigtree.cnre.vt.edu/",
  registerUrl: "https://bigtree.cnre.vt.edu/results.cfm?browsetype=StateChamp",
  mapUrl: "https://experience.arcgis.com/experience/9e9aa643c2a44ae9886fb2bcdac92c9a?org=virginiatech",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  WV: { name: "West Virginia", sourceDate: "2025 workbooks · highest published scores · retrieved October 7, 2026", recordFiles: ["west-virginia-champion-trees.json"], coordinateFile: "west-virginia-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 13, expectedRecords: 159, expectedMapped: 159, unmappedIds: [], importer: "import-west-virginia-champions.py", auditFile: "west-virginia-import-audit.json", source: {
  edition: "2025", retrieved: "October 7, 2026",
  programUrl: "https://wvforestry.com/big-tree-program/",
  floweringUrl: "https://wvforestry.com/pdf/bigtree/2025-Flowering-Common.xlsx",
  conifersUrl: "https://wvforestry.com/pdf/bigtree/2025-Conifers-Common.xlsx",
  definitionsUrl: "https://wvforestry.com/pdf/bigtree/2021_BT_Descrption_Key.pdf",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  NC: { name: "North Carolina", sourceDate: "September 2026 edition · retrieved October 7, 2026", recordFiles: ["north-carolina-champion-trees.json", "north-carolina-co-champion-trees.json"], coordinateFile: "north-carolina-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 12, expectedRecords: 346, expectedMapped: 346, unmappedIds: [], importer: "import-north-carolina-champions.py", auditFile: "north-carolina-import-audit.json", source: {
  edition: "September 2026", retrieved: "October 7, 2026",
  programUrl: "https://www.ncagr.gov/divisions/nc-forest-service/urban/champion-trees",
  registerUrl: "https://www.ncagr.gov/divisions/nc-forest-service/nc-champion-tree-list",
  workbookUrl: "https://www.ncagr.gov/divisions/nc-forest-service/nc-champion-tree-list/open",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  SC: { name: "South Carolina", sourceDate: "Clemson database · retrieved October 7, 2026", recordFiles: ["south-carolina-champion-trees.json"], coordinateFile: "south-carolina-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 11, expectedRecords: 196, expectedMapped: 196, unmappedIds: [], importer: "import-south-carolina-champions.py", auditFile: null, source: {
  retrieved: "October 7, 2026", dataEdited: "November 25, 2025",
  programUrl: "https://www.clemson.edu/cafls/champtree/",
  registerUrl: "https://experience.arcgis.com/experience/25dbba11925a4bf8b22d6430581a02b2/page/Champion-Tree-Database/",
  dataUrl: "https://services1.arcgis.com/x5wCko8UnSi4h0CB/arcgis/rest/services/South_Carolina_Champion_Tree/FeatureServer/0",
  measuringUrl: "https://www.clemson.edu/cafls/champtree/how-to-measure-a-tree.html",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  TN: { name: "Tennessee", sourceDate: "UT current list · retrieved October 7, 2026 · edition not stated", recordFiles: ["tennessee-champion-trees.json"], coordinateFile: "tennessee-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 10, expectedRecords: 183, expectedMapped: 182, unmappedIds: ["tn-a46f90b67be4"], importer: "import-tennessee-champions.py", auditFile: null, source: {
  retrieved: "October 7, 2026",
  programUrl: "https://naturalresources.tennessee.edu/champion-tree/",
  registerUrl: "https://naturalresources.tennessee.edu/trees/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  GA: { name: "Georgia", sourceDate: "GFC register · retrieved October 7, 2026 · edition not stated", recordFiles: ["georgia-champion-trees.json"], coordinateFile: "georgia-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 9, expectedRecords: 403, expectedMapped: 398, unmappedIds: ["ga-4689", "ga-4879", "ga-3484", "ga-1762", "ga-4726"], importer: "import-georgia-champions.py", auditFile: "georgia-import-audit.json", source: {
  retrieved: "October 7, 2026",
  registerUrl: "https://gatrees.org/learn-explore/champion-trees/",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  KY: { name: "Kentucky", sourceDate: "Kentucky Forestry register · retrieved October 7, 2026 · edition not stated", recordFiles: ["kentucky-champion-trees.json"], coordinateFile: "kentucky-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 8, expectedRecords: 107, expectedMapped: 107, unmappedIds: [], importer: "import-kentucky-champions.py", auditFile: null, source: { registerUrl: "https://eec.ky.gov/Natural-Resources/Forestry/ky-champion-trees/Pages/default.aspx", retrieved: "October 7, 2026", geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip" } },
  IN: { name: "Indiana", sourceDate: "Indiana DNR current list · retrieved October 8, 2026 · edition not stated", recordFiles: ["indiana-champion-trees.json"], coordinateFile: "indiana-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 7, expectedRecords: 93, expectedMapped: 93, unmappedIds: [], importer: "import-indiana-champions.py", auditFile: "indiana-import-audit.json", source: {
  registerUrl: "https://www.in.gov/dnr/forestry/forestry-publications-and-presentations/indiana-big-tree-register/",
  retrieved: "October 8, 2026",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  AL: { name: "Alabama", sourceDate: "AFC 2025 edition · retrieved October 8, 2026", recordFiles: ["alabama-champion-trees.json"], coordinateFile: "alabama-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 6, expectedRecords: 145, expectedMapped: 145, unmappedIds: [], importer: "import-alabama-champions.py", auditFile: "alabama-import-audit.json", source: {
  registerUrl: "https://www.forestry.alabama.gov/Pages/Management/Forms/Champion_Trees_2025.pdf",
  programUrl: "https://www.forestry.alabama.gov/Pages/Management/Champion_Tree.aspx",
  retrieved: "October 8, 2026",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
  FL: { name: "Florida", sourceDate: "Florida Forest Service register · retrieved October 8, 2026", recordFiles: ["florida-champion-trees.json"], coordinateFile: "florida-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: 5, expectedRecords: 311, expectedMapped: 311, unmappedIds: [], importer: "import-florida-champions.py", auditFile: "florida-import-audit.json", source: {
  registerUrl: "https://ffs.fdacs.gov/ChampionTrees/home.mvc/Index",
  programUrl: "https://www.fdacs.gov/Forest-Wildfire/Our-Forests/Florida-Champion-Trees",
  retrieved: "October 8, 2026",
  geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
} },
} as const satisfies Record<string, ChampionStateConfig>;
export type ChampionState = keyof typeof championStates;
export const stateNames = Object.fromEntries(Object.entries(championStates).map(([state, config]) => [state, config.name])) as Record<ChampionState, string>;
export const sourceDates = Object.fromEntries(Object.entries(championStates).map(([state, config]) => [state, config.sourceDate])) as Record<ChampionState, string>;
export const championRegions = { midwest: { name: "Midwest", states: ["IN", "IL", "MI", "OH", "WI", "MN"] }, southeast: { name: "Southeast", states: ["NC", "SC", "TN", "GA", "KY", "AL", "FL"] }, "new-england": { name: "New England", states: ["MA", "NH", "VT", "ME", "RI", "CT"] }, northeast: { name: "Northeast", states: ["MA", "NH", "VT", "ME", "RI", "CT", "NY", "NJ", "PA"] }, "mid-atlantic": { name: "Mid-Atlantic", states: ["NY", "NJ", "PA", "DE", "MD", "VA", "WV"] } };
