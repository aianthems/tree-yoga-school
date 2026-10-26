export const MY_TREE_KEY = "tys-my-tree-v1";
export const MY_TREE_EVENT = "tys-my-tree-change";
export type TreeNote = { id: string; slug: string; date: string; observation: string; reflection: string };
export type MyTree = { version: 1; slug: string; notes: TreeNote[] };
export function readMyTree(raw: string | null, slugs: readonly string[]): MyTree {
  const empty: MyTree = { version: 1, slug: "", notes: [] };
  if (!raw) return empty;
  const value = JSON.parse(raw);
  if (value?.version !== 1 || typeof value.slug !== "string" || !Array.isArray(value.notes)) throw new Error("Unrecognized saved journal");
  return { version: 1, slug: slugs.includes(value.slug) ? value.slug : "", notes: value.notes.filter((note: TreeNote) => note && typeof note.id === "string" && slugs.includes(note.slug) && typeof note.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(note.date) && typeof note.observation === "string" && typeof note.reflection === "string") };
}
