import type { Tree } from "./trees";

// Keep full practices and identification galleries on the server.
export type LibraryTree = Pick<Tree, "slug" | "name" | "species" | "scientificName" | "themes" | "invitation" | "image" | "imageAlt" | "imageWidth" | "imageHeight">;

// Alternate names from the botanical references linked on the species pages.
export const treeAliases: Readonly<Record<string, readonly string[]>> = {
  "eastern-redcedar": ["eastern red cedar", "redcedar", "red cedar"],
  "northern-catalpa": ["cigar tree", "western catalpa"],
  "cucumber-magnolia": ["cucumber tree", "cucumbertree magnolia"],
  "eastern-cottonwood": ["cottonwood", "eastern poplar", "necklace poplar"],
  "bitternut-hickory": ["bitter hickory", "swamp hickory", "bitter pecan"],
  "flowering-dogwood": ["dogwood"],
  "green-ash": ["red ash", "water ash"],
  "black-oak": ["eastern black oak", "yellow oak"],
  sweetgum: ["sweet gum", "American sweet gum", "redgum", "red sweet gum"],
  "bur-oak": ["burr oak", "moss cap oak"],
  "american-hophornbeam": ["American hop hornbeam", "eastern hophornbeam", "eastern hop hornbeam", "ironwood", "leverwood"],
  "river-birch": ["red birch", "water birch"],
  "black-walnut": ["eastern black walnut"],
  "american-basswood": ["American linden", "basswood", "bee tree", "linden"],
  "american-elm": ["white elm", "water elm"],
  "white-ash": ["American ash"],
  "eastern-redbud": ["American redbud"],
  "bald-cypress": ["baldcypress", "swamp cypress"],
  "american-hornbeam": ["musclewood", "muscle wood", "blue beech", "water beech"],
  "tulip-tree": ["tulip poplar", "yellow poplar"],
  blackgum: ["black tupelo", "tupelo"],
  tamarack: ["eastern larch", "American larch"],
  cedar: ["American arborvitae", "eastern arborvitae"],
  aspen: ["trembling aspen"],
};

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function filterLibraryTrees(items: readonly LibraryTree[], query: string, theme: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return items.filter(tree => {
    if (theme && !tree.themes.includes(theme)) return false;
    const names = normalize([tree.name, tree.species, tree.scientificName, ...(treeAliases[tree.slug] ?? [])].join(" "));
    return terms.every(term => names.includes(term));
  });
}

export function libraryThemes(items: readonly LibraryTree[]) {
  return [...new Set(items.flatMap(tree => [...tree.themes]))].sort((a, b) => a.localeCompare(b, "en"));
}

