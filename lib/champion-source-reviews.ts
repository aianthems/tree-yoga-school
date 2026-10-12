import { reviews } from "./champion-source-review-records.json";
import { championStates, type ChampionState } from "./champion-states";

export type SourceReview = {
  state: ChampionState; priority: "first" | "routine"; reason: string;
  nextReviewOn: string; reviewEveryDays: number; lastReviewedOn: string | null;
  outcome: "unchanged" | "updated" | "blocked" | "needs-follow-up" | null;
  evidenceUrl: string | null; notes: string | null;
};
export const sourceReviews = reviews as SourceReview[];
export function reviewQueue(asOf: string, limit = 5): SourceReview[] {
  return sourceReviews.filter(review => review.nextReviewOn <= asOf)
    .sort((a, b) => Number(b.priority === "first") - Number(a.priority === "first") || a.nextReviewOn.localeCompare(b.nextReviewOn) || championStates[a.state].name.localeCompare(championStates[b.state].name))
    .slice(0, limit);
}
export function snapshotEvidence(state: ChampionState) {
  const source = championStates[state].source as Readonly<Record<string, string | number>>;
  if (source.retrieved) return { label: "Retrieved", date: String(source.retrieved) };
  if (source.supplied) return { label: "Supplied", date: String(source.supplied) };
  if (source.captured) return { label: "Screenshot capture", date: String(source.captured) };
  return { label: "Retrieval date", date: "Not documented" };
}
export function registerLink(state: ChampionState): string {
  const source = championStates[state].source as Readonly<Record<string, string | number>>;
  return String(source.registerUrl || source.nativeUrl || source.programUrl);
}
