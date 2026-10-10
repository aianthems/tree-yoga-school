import { filterLibraryTrees, type LibraryTree } from "./tree-library-search";
import { treeIdentification, identificationOptions } from "./tree-identification";

// Editorial practice groupings; detailed themes remain on each profile.
export const practiceCategories = [
  { value: "presence", label: "Presence & attention", themes: ["Presence", "Attention", "Attentiveness", "Listening", "Clarity", "Simplicity", "Sensitivity", "Responsiveness"] },
  { value: "steadiness", label: "Steadiness & resilience", themes: ["Strength", "Quiet Strength", "Quiet Endurance", "Steadiness", "Patience", "Resilience", "Endurance", "Resolve", "Perseverance", "Constancy", "Commitment", "Long-term Growth", "Growth"] },
  { value: "change", label: "Change & renewal", themes: ["Change", "Renewal", "Beginnings", "Transformation", "Release", "Return", "Flexibility", "Adaptability", "Flow", "Movement", "Ripening", "Rhythm"] },
  { value: "connection", label: "Connection & care", themes: ["Connection", "Care", "Belonging", "Generosity", "Reciprocity", "Stewardship", "Relationship", "Responsibility", "Support", "Appreciation"] },
  { value: "curiosity", label: "Curiosity & perspective", themes: ["Curiosity", "Discovery", "Wonder", "Perspective", "Possibility", "Openness", "Acceptance", "Individuality", "Discernment", "Complexity", "Aspiration"] },
  { value: "rest", label: "Rest & shelter", themes: ["Rest", "Shelter", "Stillness", "Gentleness", "Spaciousness", "Balance", "Boundaries", "Grounding", "Continuity", "Quiet confidence"] },
] as const;
export type LibrarySelection = { query: string; practice: string; foliage: string; arrangement: string; lobes: string; bark: string; sort: string; view: string };
export const emptyLibrarySelection: LibrarySelection = { query: "", practice: "", foliage: "", arrangement: "", lobes: "", bark: "", sort: "az", view: "illustrated" };
export const librarySortOptions = [{ value: "az", label: "Tree name · A–Z" }, { value: "za", label: "Tree name · Z–A" }, { value: "scientific", label: "Scientific name · A–Z" }] as const;
export function readLibrarySelection(params: URLSearchParams): LibrarySelection {
  const choice = (key: string, options: readonly { value: string }[]) => {
    const value = params.get(key) || "";
    return options.some(option => option.value === value) ? value : "";
  };
  const foliage = choice("foliage", identificationOptions.foliage);
  const broadFeatures = !foliage || foliage === "broad";
  return {
    query: params.get("q") || "", practice: choice("practice", practiceCategories),
    foliage, arrangement: broadFeatures ? choice("arrangement", identificationOptions.arrangement) : "",
    lobes: broadFeatures ? choice("lobes", identificationOptions.lobes) : "", bark: choice("bark", identificationOptions.bark),
    sort: choice("sort", librarySortOptions) || "az", view: params.get("view") === "compact" ? "compact" : "illustrated",
  };
}
export function libraryHref(selection: LibrarySelection) {
  const params = new URLSearchParams();
  if (selection.query) params.set("q", selection.query);
  for (const key of ["practice", "foliage", "arrangement", "lobes", "bark"] as const) if (selection[key]) params.set(key, selection[key]);
  if (selection.sort !== "az") params.set("sort", selection.sort);
  if (selection.view === "compact") params.set("view", "compact");
  const search = params.toString();
  return `/trees${search ? `?${search}` : ""}`;
}
export function hasLibraryFilters(selection: LibrarySelection) {
  return Boolean(selection.query || selection.practice || selection.foliage || selection.arrangement || selection.lobes || selection.bark);
}
export function treePracticeCategories(tree: Pick<LibraryTree, "themes">) {
  return practiceCategories.filter(category => category.themes.some(theme => tree.themes.includes(theme)));
}
export function discoverLibraryTrees(items: readonly LibraryTree[], selection: LibrarySelection) {
  const category = practiceCategories.find(category => category.value === selection.practice);
  return filterLibraryTrees(items, selection.query, "").filter(tree => {
    if (category && !category.themes.some(theme => tree.themes.includes(theme))) return false;
    const traits = treeIdentification[tree.slug];
    return (["foliage", "arrangement", "lobes", "bark"] as const).every(key => !selection[key] || traits?.[key].includes(selection[key]));
  }).sort((a, b) => {
    if (selection.sort === "scientific") return a.scientificName.localeCompare(b.scientificName, "en") || a.name.localeCompare(b.name, "en");
    const order = a.name.localeCompare(b.name, "en") || a.scientificName.localeCompare(b.scientificName, "en");
    return selection.sort === "za" ? -order : order;
  });
}
