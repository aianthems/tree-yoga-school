import type { ChampionState, ChampionPayload } from "./champion-trees";

// Publish each success as soon as it arrives; an unrelated failure must not
// discard downloaded registers. Callers retain cache across filter changes.
export async function loadChampionStates(
  states: ChampionState[],
  fetchState: (state: ChampionState) => Promise<ChampionPayload>,
  onSuccess: (state: ChampionState, payload: ChampionPayload) => void,
  onFailure: (state: ChampionState) => void,
) {
  await Promise.allSettled(states.map(async state => {
    try { onSuccess(state, await fetchState(state)); }
    catch { onFailure(state); }
  }));
}
