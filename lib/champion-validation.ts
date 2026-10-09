import { championStates, type ChampionState, type ChampionStateConfig } from "./champion-states";
import { normalizeChampionRecords, normalizeChampionCoordinates } from "./champion-state-data";
import { townKey } from "./champion-trees";

export function validateChampionState(state: ChampionState, raw: readonly unknown[], points: Record<string, { lat: number; lng: number }>) {
  const config: ChampionStateConfig = championStates[state];
  const errors: string[] = [];
  const fail = (message: string) => errors.push(`${state}: ${message}`);
  const trees = normalizeChampionRecords(state, raw);
  const coordinates = normalizeChampionCoordinates(state, points);
  if (trees.length !== config.expectedRecords) fail(`expected ${config.expectedRecords} records, found ${trees.length}; review source coverage before updating the baseline`);
  const ids = new Set<string>();
  for (const [index, rawRecord] of raw.entries()) {
    if (!rawRecord || typeof rawRecord !== "object" || Array.isArray(rawRecord)) { fail(`row ${index + 1} is not a record`); continue; }
    const original = rawRecord as Record<string, unknown>;
    const tree = trees[index];
    if (original.state !== undefined && original.state !== state) fail(`${tree.id}: wrong source state`);
    if (typeof tree.id !== "string" || !tree.id.trim() || ids.has(tree.id)) fail(`row ${index + 1}: missing or duplicate ID ${tree.id}`);
    ids.add(tree.id);
    if (!Number.isInteger(tree.sourceRow) || tree.sourceRow < 1) fail(`${tree.id}: invalid source row`);
    for (const field of ["scientificName", "commonName", "town", "county"] as const) if (typeof tree[field] !== "string") fail(`${tree.id}: ${field} must be a string`);
    if (!tree.scientificName?.trim() || !tree.commonName?.trim()) fail(`${tree.id}: missing species name`);
    for (const field of ["circumference", "height", "crown", "points"] as const) if (tree[field] !== null && (typeof tree[field] !== "number" || !Number.isFinite(tree[field]))) fail(`${tree.id}: ${field} must be a finite number or null`);
    for (const field of ["publicAccess"] as const) if (tree[field] !== undefined && typeof tree[field] !== "boolean") fail(`${tree.id}: invalid ${field}`);
    if (tree.publicCoordinates && (!Number.isFinite(tree.publicCoordinates.lat) || !Number.isFinite(tree.publicCoordinates.lng) || Math.abs(tree.publicCoordinates.lat) > 90 || Math.abs(tree.publicCoordinates.lng) > 180)) fail(`${tree.id}: invalid public coordinates`);
    if (tree.publicAccess === false && tree.publicCoordinates) fail(`${tree.id}: private record includes public tree coordinates`);
  }
  for (const [place, point] of Object.entries(points)) if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng) || Math.abs(point.lat) > 90 || Math.abs(point.lng) > 180) fail(`${place}: invalid map coordinates`);
  const unmapped = trees.filter(tree => !coordinates[townKey(tree)]).map(tree => tree.id).sort();
  if (JSON.stringify(unmapped) !== JSON.stringify([...config.unmappedIds].sort())) fail(`unmapped records changed: ${unmapped.join(", ") || "none"}; review geography and explicit exceptions`);
  const mapped = trees.length - unmapped.length;
  if (mapped !== config.expectedMapped) fail(`expected ${config.expectedMapped} mapped records, found ${mapped}`);
  return { state, listed: trees.length, mapped, errors };
}
