import type { ChampionState, ChampionPayload } from "./champion-trees";

export const championDownloadConcurrency = 4;

// Leave bandwidth for the first useful registers instead of starting every
// state at once. Publish successes independently and retain the caller's cache.
export async function loadChampionStates(
  states: ChampionState[],
  fetchState: (state: ChampionState) => Promise<ChampionPayload>,
  onSuccess: (state: ChampionState, payload: ChampionPayload) => void,
  onFailure: (state: ChampionState) => void,
  shouldContinue: () => boolean = () => true,
) {
  let next = 0;
  const worker = async () => {
    while (next < states.length && shouldContinue()) {
      const state = states[next++];
      try { onSuccess(state, await fetchState(state)); }
      catch { onFailure(state); }
    }
  };
  await Promise.allSettled(Array.from({ length: Math.min(championDownloadConcurrency, states.length) }, worker));
}
