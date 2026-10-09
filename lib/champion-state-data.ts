import { championStates, type ChampionState, type ChampionStateConfig } from "./champion-states";
import type { ChampionTree } from "./champion-trees";
type Point = { lat: number; lng: number };
type Dataset = { records: readonly unknown[]; coordinates: Record<string, Point> };

// Shared by the server loader and offline import validator; source rows are never mutated.
export function normalizeChampionRecords(state: ChampionState, records: readonly unknown[]): ChampionTree[] {
  const config: ChampionStateConfig = championStates[state];
  return records.map(record => ({ ...(record as ChampionTree), state,
    ...(config.recordPrecision === "county" ? { mapPrecision: "county" as const } : {}),
  }));
}
export function normalizeChampionCoordinates(state: ChampionState, points: Record<string, Point>) {
  const config: ChampionStateConfig = championStates[state];
  return Object.fromEntries(Object.entries(points).map(([place, point]) => [`${state}:${config.coordinatePrecision === "county" ? "county:" : ""}${place}`, point]));
}
export function buildChampionDataset(datasets: Record<ChampionState, Dataset>) {
  const states = (Object.keys(championStates) as ChampionState[]).sort((a, b) => championStates[a].recordOrder - championStates[b].recordOrder);
  return {
    trees: states.flatMap(state => normalizeChampionRecords(state, datasets[state].records)),
    coordinates: Object.assign({}, ...states.map(state => normalizeChampionCoordinates(state, datasets[state].coordinates))) as Record<string, Point>,
  };
}
