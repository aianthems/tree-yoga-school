export const JOURNEY_PROGRESS_KEY = "tree-yoga-school:journey-progress:v1";
export type JourneyProgress = { version: 1; completed: number[] };
export function readJourneyProgress(raw: string | null): JourneyProgress | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !Array.isArray(value.completed)) return null;
    return { version: 1, completed: [...new Set<number>(value.completed.filter((day: unknown): day is number => typeof day === "number" && Number.isInteger(day) && day >= 1 && day <= 7))].sort((a, b) => a - b) };
  } catch { return null; }
}
export function setJourneyDay(progress: JourneyProgress, day: number, completed: boolean): JourneyProgress {
  if (!Number.isInteger(day) || day < 1 || day > 7) return progress;
  return { version: 1, completed: [...new Set(completed ? [...progress.completed, day] : progress.completed.filter(item => item !== day))].sort((a, b) => a - b) };
}
export function nextJourneyDay(progress: JourneyProgress): number | null {
  for (let day = 1; day <= 7; day++) if (!progress.completed.includes(day)) return day;
  return null;
}
