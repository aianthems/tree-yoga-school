import "server-only";
import wvRecords from "./data/west-virginia-champion-trees.json";
import wvCoordinates from "./data/west-virginia-county-points.json";
import vaRecords from "./data/virginia-champion-trees.json";
import vaCoordinates from "./data/virginia-county-points.json";
import mdRecords from "./data/maryland-champion-trees.json";
import mdCoordinates from "./data/maryland-county-points.json";
import deRecords from "./data/delaware-champion-trees.json";
import deCoordinates from "./data/delaware-place-points.json";
import paRecords from "./data/pennsylvania-champion-trees.json";
import paCoordinates from "./data/pennsylvania-county-points.json";
import njRecords from "./data/new-jersey-champion-trees.json";
import njCoordinates from "./data/new-jersey-place-points.json";
import nyRecords from "./data/new-york-champion-trees.json";
import nyCoordinates from "./data/new-york-county-points.json";
import ctRecords from "./data/connecticut-champion-trees.json";
import ctCoordinates from "./data/connecticut-town-points.json";
import riRecords from "./data/rhode-island-champion-trees.json";
import riCoordinates from "./data/rhode-island-town-points.json";
import meRecords from "./data/maine-champion-trees.json";
import meCoordinates from "./data/maine-town-points.json";
import vtRecords from "./data/vermont-champion-trees.json";
import vtCoordinates from "./data/vermont-town-points.json";
import records from "./data/champion-trees.json";
import nhRecords from "./data/new-hampshire-champion-trees.json";
import nhCoordinates from "./data/new-hampshire-town-points.json";
import coordinates from "./data/massachusetts-town-centroids.json";

import { townKey, stateNames, type ChampionState, type ChampionTree } from "./champion-trees";
export const championTrees: readonly ChampionTree[] = [
  ...wvRecords.map(tree => ({ ...tree, state: "WV" as const, mapPrecision: "county" as const })),
  ...vaRecords.map(tree => ({ ...tree, state: "VA" as const, mapPrecision: "county" as const })),
  ...mdRecords.map(tree => ({ ...tree, state: "MD" as const, mapPrecision: "county" as const })),
  ...deRecords.map(tree => ({ ...tree, state: "DE" as const, mapPrecision: tree.mapPrecision as "county" | undefined })),
  ...paRecords.map(tree => ({ ...tree, state: "PA" as const, mapPrecision: "county" as const })),
  ...njRecords.map(tree => ({ ...tree, state: "NJ" as const, mapPrecision: tree.mapPrecision as "county" | undefined })),
  ...nyRecords.map(tree => ({ ...tree, state: "NY" as const, mapPrecision: "county" as const })),
  ...records.map(tree => ({ ...tree, state: "MA" as const })),
  ...nhRecords.map(tree => ({ ...tree, state: "NH" as const })),
  ...vtRecords.map(tree => ({ ...tree, state: "VT" as const })),
  ...ctRecords.map(tree => ({ ...tree, state: "CT" as const })),
  ...riRecords.map(tree => ({ ...tree, state: "RI" as const })),
  ...meRecords.map(tree => ({ ...tree, state: "ME" as const })),
];
export const townCoordinates: Record<string, { lat: number; lng: number }> = Object.fromEntries([
  ...Object.entries(wvCoordinates).map(([county, point]) => [`WV:county:${county}`, point]),
  ...Object.entries(vaCoordinates).map(([county, point]) => [`VA:county:${county}`, point]),
  ...Object.entries(mdCoordinates).map(([county, point]) => [`MD:county:${county}`, point]),
  ...Object.entries(deCoordinates).map(([place, point]) => [`DE:${place}`, point]),
  ...Object.entries(paCoordinates).map(([county, point]) => [`PA:county:${county}`, point]),
  ...Object.entries(njCoordinates).map(([place, point]) => [`NJ:${place}`, point]),
  ...Object.entries(nyCoordinates).map(([county, point]) => [`NY:county:${county}`, point]),
  ...Object.entries(coordinates).map(([town, point]) => [`MA:${town}`, point]),
  ...Object.entries(nhCoordinates).map(([town, point]) => [`NH:${town}`, point]),
  ...Object.entries(vtCoordinates).map(([town, point]) => [`VT:${town}`, point]),
  ...Object.entries(ctCoordinates).map(([town, point]) => [`CT:${town}`, point]),
  ...Object.entries(riCoordinates).map(([town, point]) => [`RI:${town}`, point]),
  ...Object.entries(meCoordinates).map(([town, point]) => [`ME:${town}`, point]),
]);

export const championManifest = Object.entries(stateNames).map(([state, name]) => {
 const trees = championTrees.filter(t => t.state === state);
 return { state: state as ChampionState, name, listed: trees.length, mapped: trees.filter(t => Boolean(townCoordinates[townKey(t)])).length };
});
