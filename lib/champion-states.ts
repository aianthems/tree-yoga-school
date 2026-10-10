// Lightweight shared configuration. Register payloads stay in the server-only loader.
export type ChampionStateConfig = {
  name: string; sourceDate: string; recordFiles: readonly string[]; coordinateFile: string;
  recordPrecision: "county" | "preserve"; coordinatePrecision: "county" | "place";
  recordOrder: number; expectedRecords: number; expectedMapped: number;
  unmappedIds: readonly string[]; importer: string | null; auditFile: string | null;
  source: Readonly<Record<string, string | number>>;
};
export const championStates = {
  WA: { name: "Washington", sourceDate: "Washington registry · retrieved October 10, 2026 · edition not stated", recordFiles: ["washington-champion-trees.json"], coordinateFile: "washington-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -13, expectedRecords: 279, expectedMapped: 1, unmappedIds: ["wa-r1", "wa-r3", "wa-r4", "wa-r5", "wa-r6", "wa-r7", "wa-r8", "wa-r9", "wa-r10", "wa-r11", "wa-r12", "wa-r13", "wa-r14", "wa-r15", "wa-r17", "wa-r18", "wa-r19", "wa-r20", "wa-r21", "wa-r22", "wa-r23", "wa-r24", "wa-r25", "wa-r26", "wa-r27", "wa-r28", "wa-r29", "wa-r30", "wa-r31", "wa-r32", "wa-r33", "wa-r34", "wa-r35", "wa-r36", "wa-r37", "wa-r38", "wa-r39", "wa-r40", "wa-r41", "wa-r44", "wa-r45", "wa-r46", "wa-r47", "wa-r48", "wa-r49", "wa-r50", "wa-r51", "wa-r52", "wa-r53", "wa-r54", "wa-r55", "wa-r56", "wa-r57", "wa-r58", "wa-r59", "wa-r60", "wa-r61", "wa-r62", "wa-r63", "wa-r64", "wa-r65", "wa-r66", "wa-r67", "wa-r68", "wa-r69", "wa-r70", "wa-r71", "wa-r72", "wa-r73", "wa-r74", "wa-r75", "wa-r76", "wa-r77", "wa-r78", "wa-r79", "wa-r80", "wa-r81", "wa-r82", "wa-r85", "wa-r86", "wa-r87", "wa-r88", "wa-r89", "wa-r90", "wa-r91", "wa-r92", "wa-r93", "wa-r94", "wa-r95", "wa-r96", "wa-r97", "wa-r98", "wa-r99", "wa-r100", "wa-r101", "wa-r102", "wa-r103", "wa-r104", "wa-r105", "wa-r106", "wa-r107", "wa-r108", "wa-r109", "wa-r110", "wa-r111", "wa-r112", "wa-r113", "wa-r114", "wa-r116", "wa-r117", "wa-r118", "wa-r119", "wa-r121", "wa-r122", "wa-r123", "wa-r124", "wa-r125", "wa-r126", "wa-r127", "wa-r128", "wa-r129", "wa-r130", "wa-r131", "wa-r132", "wa-r133", "wa-r134", "wa-r135", "wa-r136", "wa-r137", "wa-r138", "wa-r139", "wa-r140", "wa-r141", "wa-r142", "wa-r143", "wa-r144", "wa-r145", "wa-r146", "wa-r147", "wa-r148", "wa-r149", "wa-r150", "wa-r151", "wa-r152", "wa-r153", "wa-r154", "wa-r155", "wa-r156", "wa-r157", "wa-r158", "wa-r159", "wa-r160", "wa-r161", "wa-r162", "wa-r163", "wa-r165", "wa-r166", "wa-r167", "wa-r168", "wa-r169", "wa-r170", "wa-r171", "wa-r173", "wa-r174", "wa-r175", "wa-r176", "wa-r177", "wa-r178", "wa-r179", "wa-r180", "wa-r181", "wa-r182", "wa-r183", "wa-r184", "wa-r185", "wa-r186", "wa-r187", "wa-r188", "wa-r189", "wa-r190", "wa-r191", "wa-r192", "wa-r193", "wa-r194", "wa-r195", "wa-r196", "wa-r197", "wa-r198", "wa-r199", "wa-r200", "wa-r201", "wa-r202", "wa-r203", "wa-r205", "wa-r206", "wa-r207", "wa-r208", "wa-r209", "wa-r210", "wa-r211", "wa-r212", "wa-r213", "wa-r214", "wa-r215", "wa-r216", "wa-r217", "wa-r218", "wa-r219", "wa-r220", "wa-r221", "wa-r222", "wa-r223", "wa-r224", "wa-r225", "wa-r226", "wa-r227", "wa-r228", "wa-r229", "wa-r230", "wa-r231", "wa-r232", "wa-r233", "wa-r234", "wa-r235", "wa-r236", "wa-r237", "wa-r238", "wa-r239", "wa-r240", "wa-r241", "wa-r242", "wa-r243", "wa-r244", "wa-r245", "wa-r246", "wa-r247", "wa-r248", "wa-r249", "wa-r250", "wa-r251", "wa-r252", "wa-r253", "wa-r255", "wa-r256", "wa-r257", "wa-r258", "wa-r260", "wa-r261", "wa-r262", "wa-r263", "wa-r264", "wa-r265", "wa-r266", "wa-r267", "wa-r268", "wa-r269", "wa-r270", "wa-r271", "wa-r272", "wa-r273", "wa-r274", "wa-r275", "wa-r276", "wa-r277", "wa-r278", "wa-r279", "wa-r280", "wa-r281", "wa-r282", "wa-r283", "wa-r284", "wa-r285", "wa-r286", "wa-r287", "wa-r289", "wa-r290", "wa-r291", "wa-r292"], importer: "import-washington-champions.py", auditFile: "washington-import-audit.json", source: {
    registerUrl: "https://www.championtreeregistry.com/washington-registry/",
    historicalCountyUrl: "https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/09/Finalized-American-Forests-2020-National-Register-of-Champion-Trees.pdf#page=1",
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
    retrieved: "October 10, 2026", count: 279,
  } },
  OR: { name: "Oregon", sourceDate: "Oregon registry · retrieved October 10, 2026 · edition not stated", recordFiles: ["oregon-champion-trees.json"], coordinateFile: "oregon-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -12, expectedRecords: 132, expectedMapped: 1, unmappedIds: ["or-r1", "or-r3", "or-r4", "or-r5", "or-r6", "or-r7", "or-r11", "or-r14", "or-r16", "or-r17", "or-r18", "or-r21", "or-r22", "or-r23", "or-r25", "or-r26", "or-r27", "or-r28", "or-r29", "or-r30", "or-r31", "or-r32", "or-r33", "or-r34", "or-r35", "or-r36", "or-r37", "or-r40", "or-r41", "or-r42", "or-r43", "or-r44", "or-r48", "or-r49", "or-r50", "or-r51", "or-r52", "or-r53", "or-r54", "or-r56", "or-r57", "or-r59", "or-r60", "or-r61", "or-r62", "or-r63", "or-r64", "or-r65", "or-r67", "or-r68", "or-r69", "or-r71", "or-r72", "or-r74", "or-r75", "or-r76", "or-r77", "or-r78", "or-r79", "or-r80", "or-r81", "or-r82", "or-r83", "or-r85", "or-r86", "or-r87", "or-r88", "or-r90", "or-r91", "or-r92", "or-r93", "or-r95", "or-r96", "or-r97", "or-r98", "or-r99", "or-r100", "or-r101", "or-r102", "or-r103", "or-r104", "or-r105", "or-r106", "or-r108", "or-r109", "or-r111", "or-r114", "or-r115", "or-r116", "or-r117", "or-r119", "or-r121", "or-r123", "or-r124", "or-r126", "or-r127", "or-r128", "or-r129", "or-r130", "or-r131", "or-r132", "or-r134", "or-r135", "or-r136", "or-r139", "or-r140", "or-r141", "or-r142", "or-r143", "or-r144", "or-r145", "or-r146", "or-r148", "or-r149", "or-r150", "or-r152", "or-r153", "or-r154", "or-r155", "or-r156", "or-r157", "or-r158", "or-r159", "or-r160", "or-r161", "or-r162", "or-r163", "or-r164", "or-r165", "or-r166", "or-r167"], importer: "import-oregon-champions.py", auditFile: "oregon-import-audit.json", source: {
    registerUrl: "https://www.championtreeregistry.com/oregon-registry/",
    historicalCountyUrl: "https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/09/National-Register-of-Big-Trees-2012.pdf#page=58",
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
    retrieved: "October 10, 2026", count: 132,
  } },
  NM: { name: "New Mexico", sourceDate: "Forestry Division April 14, 2020 database · retrieved October 10, 2026", recordFiles: ["new-mexico-champion-trees.json"], coordinateFile: "new-mexico-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -11, expectedRecords: 37, expectedMapped: 37, unmappedIds: [], importer: "import-new-mexico-champions.py", auditFile: "new-mexico-import-audit.json", source: {
    registerUrl: "https://www.emnrd.nm.gov/sfd/wp-content/uploads/sites/4/NMBigTreeDatabase_2020.pdf",
    programUrl: "https://www.emnrd.nm.gov/sfd/urban-forestry-program/find-or-register-a-big-tree/",
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
    retrieved: "October 10, 2026", count: 37,
  } },
  MT: { name: "Montana", sourceDate: "DNRC 2024 register · retrieved October 10, 2026", recordFiles: ["montana-champion-trees.json"], coordinateFile: "montana-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -10, expectedRecords: 174, expectedMapped: 174, unmappedIds: [], importer: "import-montana-champions.py", auditFile: "montana-import-audit.json", source: {
    registerUrl: "https://dnrc.mt.gov/Forestry/Forest-Management/_2024_Compiled-Final-Register-_-SPREAD-PRINTABLE.pdf",
    alternateUrl: "https://dnrc.mt.gov/Forestry/Forest-Management/2024-Big-Tree-Register-_-Compiled-_-Website.pdf",
    programUrl: "https://dnrc.mt.gov/Forestry/Forest-Management/montana-big-trees-program",
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
    retrieved: "October 10, 2026", count: 174,
  } },
  OK: { name: "Oklahoma", sourceDate: "Oklahoma Forestry Services map · data updated June 10, 2026 · retrieved October 10, 2026", recordFiles: ["oklahoma-champion-trees.json"], coordinateFile: "oklahoma-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -9, expectedRecords: 79, expectedMapped: 79, unmappedIds: [], importer: "import-oklahoma-champions.py", auditFile: "oklahoma-import-audit.json", source: {
    registerUrl: "https://storymaps.arcgis.com/stories/05009ef918c34590b5ba5d9fb4ec6334", programUrl: "https://ag.ok.gov/championtrees/",
    dataUrl: "https://services3.arcgis.com/yrIZ0Nv0mSGTWJsH/arcgis/rest/services/Champion_Tree_Map_View/FeatureServer/0", retrieved: "October 10, 2026", count: 79,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
  } },
  LA: { name: "Louisiana", sourceDate: "LFA older register · page labeled 2021 · retrieved October 10, 2026", recordFiles: ["louisiana-champion-trees.json"], coordinateFile: "louisiana-parish-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -8, expectedRecords: 115, expectedMapped: 115, unmappedIds: [], importer: "import-louisiana-champions.py", auditFile: "louisiana-import-audit.json", source: {
    registerUrl: "https://www.laforestry.com/champion-trees-in-louisiana", retrieved: "October 10, 2026", count: 115,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
  } },
  CO: { name: "Colorado", sourceDate: "CTC 2026 workbooks · retrieved October 10, 2026", recordFiles: ["colorado-champion-trees.json"], coordinateFile: "colorado-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -7, expectedRecords: 846, expectedMapped: 846, unmappedIds: [], importer: "import-colorado-champions.py", auditFile: "colorado-import-audit.json", source: {
    registerUrl: "https://www.coloradotrees.org/colorado-champion-trees",
    countyUrl: "https://www.coloradotrees.org/s/2026-Website-County-champ-list.xlsx",
    alphabeticalUrl: "https://www.coloradotrees.org/s/2026-Website-Champ-Trees.xlsx",
    measuringUrl: "https://www.coloradotrees.org/how-to-measure-a-tree",
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
    retrieved: "October 10, 2026", count: 846,
  } },
  TX: { name: "Texas", sourceDate: "Texas A&M Forest Service registry · retrieved October 9, 2026", recordFiles: ["texas-champion-trees.json"], coordinateFile: "texas-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -6, expectedRecords: 232, expectedMapped: 232, unmappedIds: [], importer: "import-texas-champions.py", auditFile: "texas-import-audit.json", source: {
    registerUrl: "https://texasforestinfo.tamu.edu/BigTreeRegistry/", apiUrl: "https://texasforestinfo.tamu.edu/BigTreeRegistry/Home/GetAllTrees",
    retrieved: "October 9, 2026", count: 232,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
  } },
  NE: { name: "Nebraska", sourceDate: "Nebraska Forest Service register · retrieved October 9, 2026 · edition not stated", recordFiles: ["nebraska-champion-trees.json"], coordinateFile: "nebraska-place-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: -5, expectedRecords: 90, expectedMapped: 83, unmappedIds: ["ne-8982e68aca53", "ne-83b3914dc66e", "ne-d06c3d2c17c2", "ne-e1846026a65d", "ne-b4312e442d1f", "ne-2b7649f998d4", "ne-941f46d0a7f4"], importer: "import-nebraska-champions.py", auditFile: "nebraska-import-audit.json", source: {
    registerUrl: "https://nfs.unl.edu/registry/", programUrl: "https://nfs.unl.edu/champions/",
    retrieved: "October 9, 2026", count: 90,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_31.txt",
  } },
  KS: { name: "Kansas", sourceDate: "Kansas Forest Service register · retrieved October 9, 2026 · edition not stated", recordFiles: ["kansas-champion-trees.json"], coordinateFile: "kansas-place-points.json", recordPrecision: "preserve", coordinatePrecision: "place", recordOrder: -4, expectedRecords: 148, expectedMapped: 134, unmappedIds: ["ks-6c2f2379fef8", "ks-18734471e94f", "ks-49375c98adb9", "ks-0882b5f58384", "ks-496087cb5923", "ks-87aadd949577", "ks-61dc25cbe176", "ks-1a8c76d79f1d", "ks-df548f4b9651", "ks-b3df858bdb60", "ks-7c1b206f86dd", "ks-220868376007", "ks-c05937288fb6", "ks-6bfa18cc8e4e"], importer: "import-kansas-champions.py", auditFile: "kansas-import-audit.json", source: {
    registerUrl: "https://www.kansasforests.org/programs/championtreelist.html",
    retrieved: "October 9, 2026", count: 148,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_20.txt",
  } },
  AR: { name: "Arkansas", sourceDate: "Arkansas Forestry register · retrieved October 9, 2026 · edition not stated", recordFiles: ["arkansas-champion-trees.json"], coordinateFile: "arkansas-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -3, expectedRecords: 125, expectedMapped: 124, unmappedIds: ["ar-43890"], importer: "import-arkansas-champions.py", auditFile: "arkansas-import-audit.json", source: {
    registerUrl: "https://agriculture.arkansas.gov/forests/urban-community-forestry/champion-trees/search-champion-trees/",
    programUrl: "https://agriculture.arkansas.gov/forests/urban-community-forestry/champion-trees/",
    retrieved: "October 9, 2026", count: 125,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
  } },
  MO: { name: "Missouri", sourceDate: "MDC register · retrieved October 9, 2026 · update year unconfirmed", recordFiles: ["missouri-champion-trees.json"], coordinateFile: "missouri-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -2, expectedRecords: 151, expectedMapped: 151, unmappedIds: [], importer: "import-missouri-champions.py", auditFile: "missouri-import-audit.json", source: {
    registerUrl: "https://gisblue.mdc.mo.gov/arcgis/rest/services/Land_Cover/Champion_Trees_List/MapServer/0",
    retrieved: "October 9, 2026", metadataCreated: "December 2, 2021", count: 151,
    geographyUrl: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
  } },
  IA: { name: "Iowa", sourceDate: "Iowa DNR current map · retrieved October 9, 2026", recordFiles: ["iowa-champion-trees.json"], coordinateFile: "iowa-county-points.json", recordPrecision: "county", coordinatePrecision: "county", recordOrder: -1, expectedRecords: 67, expectedMapped: 66, unmappedIds: ["ia-220"], importer: "import-iowa-champions.py", auditFile: "iowa-import-audit.json", source: {
    registerUrl: "https://experience.arcgis.com/experience/db8a533a6ca34fc89a3df0603b6b2cb4/",
    programUrl: "https://www.iowadnr.gov/news-release/2025-04-22/celebrate-iowas-big-trees-arbor-day",
    dataUrl: "https://services2.arcgis.com/r6iFVcMJeA4kB4GC/arcgis/rest/services/The_Big_Tree_Program/FeatureServer/0",
    retrieved: "October 9, 2026", count: 67,
  } },

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
export const championRegions = { west: { name: "West", states: ["CO", "MT", "NM", "OR", "WA"] }, "south-central": { name: "South Central", states: ["TX", "LA", "OK"] }, midwest: { name: "Midwest", states: ["IN", "IL", "MI", "OH", "WI", "MN", "IA", "MO", "KS", "NE"] }, southeast: { name: "Southeast", states: ["NC", "SC", "TN", "GA", "KY", "AL", "FL", "AR"] }, "new-england": { name: "New England", states: ["MA", "NH", "VT", "ME", "RI", "CT"] }, northeast: { name: "Northeast", states: ["MA", "NH", "VT", "ME", "RI", "CT", "NY", "NJ", "PA"] }, "mid-atlantic": { name: "Mid-Atlantic", states: ["NY", "NJ", "PA", "DE", "MD", "VA", "WV"] } };

// Coverage copy follows the same registry that drives imports and state filters.
export const championCoverage = {
  states: Object.keys(championStates).length,
  listed: Object.values(championStates).reduce((total, state) => total + state.expectedRecords, 0),
  mapped: Object.values(championStates).reduce((total, state) => total + state.expectedMapped, 0),
};
export const championMapDescription = `Explore ${championCoverage.listed.toLocaleString("en-US")} champion and score-based leader records across ${championCoverage.states} states. Browse approximate town, county, and parish markers, measurements, source records, and tree practices.`;
export function championRegionCoverage(region: keyof typeof championRegions) {
  const config = championRegions[region];
  const names = config.states.filter(state => state in championStates).map(state => stateNames[state as ChampionState]);
  return `${config.name} currently includes ${new Intl.ListFormat("en-US", { style: "long", type: "conjunction" }).format(names)}.`;
}
