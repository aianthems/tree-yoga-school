import type { Tree } from "./trees";
import { treeVisits, type TreeVisit } from "./tree-visits";

// Keep the visit guide's explicit species connection as the source of truth.
// Genus-only woodland encounters must not imply a confirmed species sighting.
export function visitsForTree(tree: Pick<Tree, "slug" | "scientificName">, visits: readonly TreeVisit[] = treeVisits) {
  return visits.filter(visit => visit.librarySlug === tree.slug && visit.scientificName.trim().toLowerCase() === tree.scientificName.trim().toLowerCase());
}
