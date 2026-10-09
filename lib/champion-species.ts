import type { ChampionTree } from "./champion-trees";

const familiarNames: Record<string, string> = {
  "Juniperus virginiana": "Eastern redcedar", "Catalpa speciosa": "Northern catalpa",
  "Magnolia acuminata": "Cucumber magnolia", "Populus deltoides": "Eastern cottonwood",
  "Carya cordiformis": "Bitternut hickory", "Cornus florida": "Flowering dogwood",
  "Quercus palustris": "Pin oak", "Quercus bicolor": "Swamp white oak",
  "Acer negundo": "Boxelder", "Celtis occidentalis": "Hackberry",
  "Fraxinus pennsylvanica": "Green ash",
  "Quercus velutina": "Black oak",
  "Liquidambar styraciflua": "Sweetgum",
  "Quercus macrocarpa": "Bur oak",
  "Carpinus caroliniana": "American hornbeam",
  "Carya ovata": "Shagbark hickory",
  "Acer saccharinum": "Silver maple",
  "Prunus serotina": "Black cherry",
  "Liriodendron tulipifera": "Tulip tree", "Sassafras albidum": "Sassafras",
  "Nyssa sylvatica": "Blackgum", "Metasequoia glyptostroboides": "Dawn redwood",
  "Acer saccharum": "Sugar maple", "Acer rubrum": "Red maple",
  "Quercus alba": "White oak", "Quercus rubra": "Northern red oak",
  "Betula papyrifera": "Paper birch", "Betula alleghaniensis": "Yellow birch",
  "Pinus strobus": "Eastern white pine", "Abies balsamea": "Balsam fir",
  "Larix laricina": "Tamarack", "Platanus occidentalis": "American sycamore",
};

export function familiarSpeciesName(scientificName: string, commonName = scientificName) {
  const key = Object.keys(familiarNames).find(name => name.toLowerCase() === scientificName.trim().toLowerCase());
  if (key) return familiarNames[key];
  const parts = commonName.replaceAll("_", " ").trim().split(/,\s*/);
  return parts.length === 2 ? `${parts[1]} ${parts[0].toLowerCase()}` : parts.join(", ");
}

export function championSpeciesOptions(trees: Pick<ChampionTree, "scientificName" | "commonName">[]) {
  const grouped = new Map<string, { scientificName: string; name: string; count: number }>();
  for (const tree of trees) {
    const name = familiarSpeciesName(tree.scientificName, tree.commonName || tree.scientificName);
    const existing = grouped.get(tree.scientificName.trim().toLowerCase());
    if (existing) {
      existing.count++;
      // Prefer a common name over a botanical fallback, with stable ordering across loads.
      const isBotanical = (value: string) => value.toLowerCase() === tree.scientificName.toLowerCase();
      if ((!isBotanical(name) && isBotanical(existing.name)) || (isBotanical(name) === isBotanical(existing.name) && name.localeCompare(existing.name, "en") < 0)) existing.name = name;
    } else grouped.set(tree.scientificName.trim().toLowerCase(), { scientificName: tree.scientificName, name, count: 1 });
  }
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name, "en") || a.scientificName.localeCompare(b.scientificName, "en"));
}

export function sameChampionSpecies(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
