export type ProjectedPlace<T> = { x: number; y: number; value: T };
// Preserve the original greedy, first-anchor clustering, using nearby grid
// cells instead of scanning every prior cluster for every mapped place.
export function clusterChampionPlaces<T>(places: ProjectedPlace<T>[], spacing = 44) {
  const clusters: { x: number; y: number; places: T[] }[] = [];
  const cells = new Map<string, number[]>();
  const squared = spacing * spacing;
  for (const { x, y, value } of places) {
    const cx = Math.floor(x / spacing), cy = Math.floor(y / spacing);
    let match = Infinity;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const index of cells.get(`${cx + dx}:${cy + dy}`) || []) {
        const anchor = clusters[index];
        if (index < match && (anchor.x - x) ** 2 + (anchor.y - y) ** 2 < squared) match = index;
      }
    }
    if (match !== Infinity) clusters[match].places.push(value);
    else {
      const key = `${cx}:${cy}`, index = clusters.length;
      clusters.push({ x, y, places: [value] });
      const cell = cells.get(key);
      if (cell) cell.push(index); else cells.set(key, [index]);
    }
  }
  return clusters.map(cluster => cluster.places);
}
