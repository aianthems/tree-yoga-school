import { championRegions, stateNames, type ChampionState } from "./champion-trees";

export type ChampionSelection = {
  region: string; state: string; query: string; county: string; town: string;
  genus: string; species: string; publicOnly: boolean; locationsOnly: boolean;
  sort: string; selectedId: string | null;
};

export const emptySelection: ChampionSelection = {
  region: "", state: "", query: "", county: "", town: "", genus: "", species: "",
  publicOnly: false, locationsOnly: false, sort: "name", selectedId: null,
};

export function readChampionSelection(params: URLSearchParams): ChampionSelection {
  const value = (key: string) => params.get(key) || "";
  const state = value("state").toUpperCase();
  const region = value("region");
  const validState = Object.hasOwn(stateNames, state) ? state : "";
  const validRegion = Object.hasOwn(championRegions, region) ? region : "";
  return {
    // An explicit state takes precedence over a conflicting region in an edited URL.
    region: validRegion && (!validState || championRegions[validRegion as keyof typeof championRegions].states.includes(validState as ChampionState)) ? validRegion : "",
    state: validState, query: value("q"), county: value("county"), town: value("place"),
    genus: value("genus"), species: value("species"),
    publicOnly: value("public") === "1", locationsOnly: value("location") === "1",
    sort: ["name", "town", "height", "points"].includes(value("sort")) ? value("sort") : "name",
    selectedId: value("tree") || null,
  };
}

export function championHref(selection: Partial<ChampionSelection> = {}): string {
  const s = { ...emptySelection, ...selection };
  const params = new URLSearchParams();
  for (const [key, value] of [
    ["region", s.region], ["state", s.state], ["q", s.query], ["county", s.county],
    ["place", s.town], ["genus", s.genus], ["species", s.species],
    ["public", s.publicOnly ? "1" : ""], ["location", s.locationsOnly ? "1" : ""],
    ["sort", s.sort === "name" ? "" : s.sort], ["tree", s.selectedId || ""],
  ]) if (value) params.set(key, value);
  return `/champion-trees${params.size ? `?${params}` : ""}`;
}
