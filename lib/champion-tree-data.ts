import "server-only";
import neRecords from "./data/nebraska-champion-trees.json";
import neCoordinates from "./data/nebraska-place-points.json";
import ksRecords from "./data/kansas-champion-trees.json";
import ksCoordinates from "./data/kansas-place-points.json";
import arRecords from "./data/arkansas-champion-trees.json";
import arCoordinates from "./data/arkansas-county-points.json";
import moRecords from "./data/missouri-champion-trees.json";
import moCoordinates from "./data/missouri-county-points.json";
import iaRecords from "./data/iowa-champion-trees.json";
import iaCoordinates from "./data/iowa-county-points.json";
import mnRecords from "./data/minnesota-champion-trees.json";
import mnCoordinates from "./data/minnesota-county-points.json";
import wiRecords from "./data/wisconsin-champion-trees.json";
import wiCoordinates from "./data/wisconsin-county-points.json";
import ohRecords from "./data/ohio-champion-trees.json";
import ohCoordinates from "./data/ohio-county-points.json";
import miRecords from "./data/michigan-champion-trees.json";
import miCoordinates from "./data/michigan-county-points.json";
import ilRecords from "./data/illinois-champion-trees.json";
import ilCoordinates from "./data/illinois-county-points.json";
import flRecords from "./data/florida-champion-trees.json";
import flCoordinates from "./data/florida-county-points.json";
import alRecords from "./data/alabama-champion-trees.json";
import alCoordinates from "./data/alabama-county-points.json";
import inRecords from "./data/indiana-champion-trees.json";
import inCoordinates from "./data/indiana-county-points.json";
import kyRecords from "./data/kentucky-champion-trees.json";
import kyCoordinates from "./data/kentucky-county-points.json";
import gaRecords from "./data/georgia-champion-trees.json";
import gaCoordinates from "./data/georgia-county-points.json";
import tnRecords from "./data/tennessee-champion-trees.json";
import tnCoordinates from "./data/tennessee-county-points.json";
import scRecords from "./data/south-carolina-champion-trees.json";
import scCoordinates from "./data/south-carolina-county-points.json";
import ncRecords from "./data/north-carolina-champion-trees.json";
import ncCoRecords from "./data/north-carolina-co-champion-trees.json";
import ncCoordinates from "./data/north-carolina-county-points.json";
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

import { townKey, type ChampionTree } from "./champion-trees";
import { championStates, type ChampionState } from "./champion-states";
import { buildChampionDataset } from "./champion-state-data";

const datasets = {
  NE: { records: neRecords, coordinates: neCoordinates },
  KS: { records: ksRecords, coordinates: ksCoordinates },
  AR: { records: arRecords, coordinates: arCoordinates },
  MO: { records: moRecords, coordinates: moCoordinates },
  IA: { records: iaRecords, coordinates: iaCoordinates },
  MN: { records: mnRecords, coordinates: mnCoordinates },
  WI: { records: wiRecords, coordinates: wiCoordinates },
  OH: { records: ohRecords, coordinates: ohCoordinates },
  MI: { records: miRecords, coordinates: miCoordinates },
  IL: { records: ilRecords, coordinates: ilCoordinates },
  MA: { records: records, coordinates: coordinates },
  NH: { records: nhRecords, coordinates: nhCoordinates },
  VT: { records: vtRecords, coordinates: vtCoordinates },
  ME: { records: meRecords, coordinates: meCoordinates },
  RI: { records: riRecords, coordinates: riCoordinates },
  CT: { records: ctRecords, coordinates: ctCoordinates },
  NY: { records: nyRecords, coordinates: nyCoordinates },
  NJ: { records: njRecords, coordinates: njCoordinates },
  PA: { records: paRecords, coordinates: paCoordinates },
  DE: { records: deRecords, coordinates: deCoordinates },
  MD: { records: mdRecords, coordinates: mdCoordinates },
  VA: { records: vaRecords, coordinates: vaCoordinates },
  WV: { records: wvRecords, coordinates: wvCoordinates },
  NC: { records: [...ncRecords,...ncCoRecords], coordinates: ncCoordinates },
  SC: { records: scRecords, coordinates: scCoordinates },
  TN: { records: tnRecords, coordinates: tnCoordinates },
  GA: { records: gaRecords, coordinates: gaCoordinates },
  KY: { records: kyRecords, coordinates: kyCoordinates },
  IN: { records: inRecords, coordinates: inCoordinates },
  AL: { records: alRecords, coordinates: alCoordinates },
  FL: { records: flRecords, coordinates: flCoordinates },
} satisfies Record<ChampionState, { records: readonly unknown[]; coordinates: Record<string, { lat: number; lng: number }> }>;
const dataset = buildChampionDataset(datasets);
export const championTrees: readonly ChampionTree[] = dataset.trees;
export const townCoordinates = dataset.coordinates;
export const championManifest = Object.entries(championStates).map(([state, config]) => {
  const trees = championTrees.filter(tree => tree.state === state);
  return { state: state as ChampionState, name: config.name, listed: trees.length, mapped: trees.filter(tree => Boolean(townCoordinates[townKey(tree)])).length };
});
