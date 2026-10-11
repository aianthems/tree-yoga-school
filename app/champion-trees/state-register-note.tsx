import notes from "../../lib/champion-register-notes.json";
import { championStates, type ChampionState, type ChampionStateConfig } from "../../lib/champion-states";

export function StateRegisterNote({ state, index }: { state: ChampionState; index: number }) {
  const source: ChampionStateConfig["source"] = championStates[state].source;
  const paragraph = notes[state][index];
  return <p>{paragraph.map(part => typeof part === "string" ? part : String(source[part.field] ?? "")).join("")}</p>;
}
export function StateRegisterNotes({ state }: { state: ChampionState }) {
  return <>{notes[state].map((_, index) => <StateRegisterNote key={index} state={state} index={index} />)}</>;
}
