export const PRACTICE_DURATION = 5 * 60 * 1000;
export type PracticeTimer = { remaining: number; deadline: number | null };
export function remainingTime(timer: PracticeTimer, now: number): number {
  return Math.max(0, timer.deadline === null ? timer.remaining : timer.deadline - now);
}
export function startTimer(timer: PracticeTimer, now: number): PracticeTimer {
  const remaining = remainingTime(timer, now) || PRACTICE_DURATION;
  return { remaining, deadline: now + remaining };
}
export function pauseTimer(timer: PracticeTimer, now: number): PracticeTimer {
  return { remaining: remainingTime(timer, now), deadline: null };
}
