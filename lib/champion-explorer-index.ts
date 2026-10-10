import { placeName, stateNames, townKey, type ChampionTree } from "./champion-trees";
import { sameChampionSpecies } from "./champion-species";
import type { ChampionSelection } from "./champion-links";

// Payload records keep their identity in the state cache. Compute searchable
// text and geographic keys once rather than on every keystroke or arrival.
const recordIndex = new WeakMap<ChampionTree, { text: string; place: string; genus: string }>();
function indexed(tree: ChampionTree) {
  let value = recordIndex.get(tree);
  if (!value) {
    value = {
      text: `${stateNames[tree.state]} ${tree.state} ${tree.mapTown || ""} ${tree.commonName} ${tree.scientificName} ${tree.town} ${tree.county} ${tree.location || ""} ${tree.notes || ""} ${tree.sourceVariety || ""} ${tree.status || ""}`.toLowerCase(),
      place: townKey(tree), genus: tree.scientificName.split(" ")[0],
    };
    recordIndex.set(tree, value);
  }
  return value;
}
export function filterChampionRecords(trees: ChampionTree[], selection: ChampionSelection) {
  const { state, species, county, town, genus, locationsOnly, publicOnly, query } = selection;
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return trees.filter(tree => {
    if ((state && tree.state !== state) || (county && tree.county !== county) ||
        (species && !sameChampionSpecies(tree.scientificName, species)) ||
        (locationsOnly && !tree.location && !tree.publicCoordinates) ||
        (publicOnly && tree.publicAccess !== true)) return false;
    const entry = indexed(tree);
    return (!town || entry.place === town) && (!genus || entry.genus === genus) && words.every(word => entry.text.includes(word));
  });
}
export function sortChampionRecords(trees: ChampionTree[], sort: string) {
  return [...trees].sort((a, b) => {
    if (sort === "height") return (b.height ?? -1) - (a.height ?? -1) || a.sourceRow - b.sourceRow;
    if (sort === "points") return (b.points ?? -1) - (a.points ?? -1) || a.sourceRow - b.sourceRow;
    if (sort === "town") return placeName(a).localeCompare(placeName(b)) || a.commonName.localeCompare(b.commonName);
    return a.commonName.localeCompare(b.commonName) || a.sourceRow - b.sourceRow;
  });
}
