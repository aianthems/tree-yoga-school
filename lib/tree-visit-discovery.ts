import type { TreeVisit } from "./tree-visits";

export const visitTypes = [
  { value: "garden", label: "Garden & arboretum" },
  { value: "park", label: "Park & boardwalk" },
  { value: "forest", label: "Forest & preserve" },
  { value: "campus", label: "Campus" },
  { value: "sidewalk", label: "Sidewalk" },
] as const;
const kindTypes: Record<string, string> = {
  "Public garden visit": "garden", "Arboretum collection visit": "garden", "Garden visit": "garden",
  "Public woodland and wetland visit": "forest", "Public preserve hike": "forest", "Forest walk": "forest",
  "Public park visit": "park", "Public park and boardwalk visit": "park", "Park visit": "park", "Park grounds": "park",
  "Campus visit": "campus", "Campus arboretum": "campus", "Sidewalk viewing": "sidewalk",
};
const speciesNames: Record<string, string> = {
  "Populus deltoides": "Eastern cottonwood", "Taxodium distichum": "Bald cypress",
  "Quercus stellata": "Post oak", "Quercus virginiana": "Southern live oak",
  "Quercus macrocarpa": "Bur oak", "Platanus occidentalis": "American sycamore",
  "Metasequoia glyptostroboides": "Dawn redwood", "Kalopanax septemlobus": "Castor aralia",
  "Pinus strobus": "Eastern white pine", "Ulmus americana": "American elm",
  "Sequoiadendron giganteum": "Giant sequoia", "Cladrastis kentukea": "Yellowwood",
};
export type VisitPreview = Pick<TreeVisit, "slug" | "state" | "name" | "scientificName" | "place" | "kind" | "checked"> & { species: string; type: string; practiceTitle: string; practiceHref: string };
export function visitPreviews(visits: readonly TreeVisit[]): VisitPreview[] {
  return visits.map(visit => ({ slug: visit.slug, state: visit.state, name: visit.name, scientificName: visit.scientificName, place: visit.place, kind: visit.kind, checked: visit.checked,
    species: speciesNames[visit.scientificName] || visit.scientificName, type: kindTypes[visit.kind] || "",
    practiceTitle: visit.practice.title, practiceHref: visit.practice.href.startsWith("/trees/") ? `/practice/${visit.practice.href.split("/")[2].split("#")[0]}` : "/practice/first-five-minutes" }));
}
export type VisitSelection = { state: string; species: string; type: string };
export const emptyVisitSelection: VisitSelection = { state: "", species: "", type: "" };
export function readVisitSelection(params: URLSearchParams, visits: readonly VisitPreview[]): VisitSelection {
  const state = params.get("state") || "", species = params.get("species") || "", type = params.get("type") || "";
  return { state: visits.some(v => v.state === state) ? state : "", species: visits.some(v => v.scientificName === species) ? species : "", type: visitTypes.some(v => v.value === type) ? type : "" };
}
export function filterVisits(visits: readonly VisitPreview[], selection: VisitSelection) {
  return visits.filter(v => (!selection.state || v.state === selection.state) && (!selection.species || v.scientificName === selection.species) && (!selection.type || v.type === selection.type));
}
export function visitHref(selection: VisitSelection) {
  const params = new URLSearchParams();
  for (const key of ["state", "species", "type"] as const) if (selection[key]) params.set(key, selection[key]);
  return `/tree-visits${params.size ? `?${params}` : ""}`;
}
