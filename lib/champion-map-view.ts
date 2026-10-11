export type ChampionMapView = "mainland" | "hawaii";

// Keep disconnected geographies legible without dropping any search results.
export function championMapViewport<T extends { state: string }>(groups: readonly T[], requested: ChampionMapView) {
  const hasHawaii = groups.some(group => group.state === "HI");
  const hasMainland = groups.some(group => group.state !== "HI");
  const view = hasHawaii && !hasMainland ? "hawaii" : hasMainland && !hasHawaii ? "mainland" : requested;
  return { view, canSwitch: hasHawaii && hasMainland, groups: groups.filter(group => view === "hawaii" ? group.state === "HI" : group.state !== "HI") };
}
