import { trees } from "../../lib/trees";
import { visitsForTree } from "../../lib/tree-library-visits";
export const myTreeSpecies = trees.map(tree => ({ slug: tree.slug, name: tree.name, species: tree.species, visits: visitsForTree(tree).map(visit => ({slug:visit.slug,name:visit.name,place:visit.place})) })).sort((a,b)=>a.name.localeCompare(b.name));
