import type { Tree } from "./trees";

type RelatedTree = Pick<Tree, "slug" | "name" | "scientificName" | "themes">;

const pineFamilyGenera = new Set(["Pinus", "Picea", "Tsuga", "Larix"]);

// Botanical relatives first, then shared contemplative themes. Never suggest
// an unrelated tree merely to fill a slot, and never mutate the source list.
export function relatedLibraryTrees(current: RelatedTree, items: readonly RelatedTree[]) {
  const genus = current.scientificName.split(" ")[0];
  return items.filter(tree => tree.slug !== current.slug).map(tree => {
    const sameGenus = tree.scientificName.split(" ")[0] === genus;
    const samePineFamily = pineFamilyGenera.has(genus) && pineFamilyGenera.has(tree.scientificName.split(" ")[0]);
    const sharedThemes = tree.themes.filter(theme => current.themes.includes(theme));
    return { tree, score: (sameGenus ? 10 : samePineFamily ? 5 : 0) + sharedThemes.length,
      reason: sameGenus ? `Same genus · ${genus}` : samePineFamily ? "Same botanical family · Pinaceae" : `Shared theme · ${sharedThemes.join(", ")}` };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.tree.name.localeCompare(b.tree.name, "en"))
    .slice(0, 3);
}
