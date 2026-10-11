export type ChampionMapView = "mainland" | "hawaii" | "alaska";
export const championMapViewNames: Record<ChampionMapView, string> = { mainland: "Contiguous US", hawaii: "Hawaiʻi", alaska: "Alaska" };
export function championMapViewForState(state: string): ChampionMapView {
  return state === "HI" ? "hawaii" : state === "AK" ? "alaska" : "mainland";
}
// Separate disconnected geographies while preserving every matching search result.
export function championMapViewport<T extends { state: string }>(groups: readonly T[], requested: ChampionMapView) {
  const availableViews = (["mainland", "alaska", "hawaii"] as const).filter(view => groups.some(group => championMapViewForState(group.state) === view));
  const view = availableViews.includes(requested) || !availableViews.length ? requested : availableViews[0];
  return { view, availableViews, canSwitch: availableViews.length > 1, groups: groups.filter(group => championMapViewForState(group.state) === view) };
}
