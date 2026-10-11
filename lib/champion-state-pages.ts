import { championStates, type ChampionState } from "./champion-states";
import type { ChampionTree } from "./champion-trees";
import { sameChampionSpecies } from "./champion-species";
import type { Tree } from "./trees";

export const championStatePages = (Object.keys(championStates) as ChampionState[])
  .map(state => ({ state, name: championStates[state].name, slug: state === "HI" ? "hawaii" : championStates[state].name.toLowerCase().replace(/ /g, "-") }))
  .sort((a, b) => a.name.localeCompare(b.name, "en"));
export function championStateHref(state: string) {
  const page = championStatePages.find(page => page.state === state);
  return page ? `/champion-trees/${page.slug}` : "/champion-trees";
}
export function championStateFromSlug(slug: string) {
  return championStatePages.find(page => page.slug === slug)?.state;
}
export function stateLibrarySpecies(records: readonly ChampionTree[], library: readonly Tree[]) {
  return library.map(tree => ({ tree, count: records.filter(record => sameChampionSpecies(record.scientificName, tree.scientificName)).length }))
    .filter(entry => entry.count > 0).sort((a, b) => b.count - a.count || a.tree.name.localeCompare(b.tree.name, "en"));
}
// A reproducible preview of reported heights, not a new champion ranking.
export function stateNotableRecords(records: readonly ChampionTree[]) {
  return records.filter(record => record.height !== null && Number.isFinite(record.height) && record.height > 0)
    .toSorted((a, b) => (b.height ?? 0) - (a.height ?? 0) || a.id.localeCompare(b.id, "en")).slice(0, 4);
}
export function statePageDescription(state: ChampionState) {
  const config = championStates[state];
  return `Explore ${config.expectedRecords.toLocaleString("en-US")} listed tree records in ${config.name}, with register dates, coverage notes, Tree Library species, outdoor practices, and a link to the state map.`;
}
