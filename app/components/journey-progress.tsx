"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { JOURNEY_PROGRESS_KEY, nextJourneyDay, readJourneyProgress, setJourneyDay, type JourneyProgress } from "../../lib/journey-progress";

const days = ["Meet one tree", "Look a little closer", "Return your attention", "Explore gentle movement", "Take a noticing walk", "Get to know your tree", "Make the practice your own"];

export default function JourneyProgressPanel({ day, compact = false }: { day?: number; compact?: boolean }) {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    function load() {
      try { setProgress(readJourneyProgress(window.localStorage.getItem(JOURNEY_PROGRESS_KEY))); }
      catch { setUnavailable(true); }
      setReady(true);
    }
    load();
    function onStorage(event: StorageEvent) { if (event.key === JOURNEY_PROGRESS_KEY || event.key === null) load(); }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function save(value: JourneyProgress | null, notice: string) {
    try {
      if (value) window.localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(value));
      else window.localStorage.removeItem(JOURNEY_PROGRESS_KEY);
      setProgress(value); setMessage(notice);
    } catch {
      setUnavailable(true);
      setMessage("This browser could not save your progress. You can still visit every day using the journey links.");
    }
  }
  if (compact && (!ready || !progress)) return null;
  if (!ready) return <p className="lesson-note">Checking progress saved on this device…</p>;
  const next = progress ? nextJourneyDay(progress) : 1;
  const completedToday = day !== undefined && progress?.completed.includes(day);
  return <aside className="journey-progress-panel" aria-label="Your journey progress">
    <p className="section-kicker">Your journey · Your own pace</p>
    <h2>{progress ? progress.completed.length === 7 ? "Seven days explored." : "Continue your journey." : "Pick up where you left off."}</h2>
    {!progress ? <>
      <p>Optionally remember completed days in this browser on this device. No account is needed, and your reflections are never saved.</p>
      <button className="button primary" type="button" disabled={unavailable} onClick={() => save({ version: 1, completed: [] }, "Progress remembering is on. Mark a day complete after your visit.")}>Remember my progress on this device</button>
    </> : <>
      <p>{progress.completed.length} of 7 days completed. Repeat or choose any day whenever you like.</p>
      <progress max={7} value={progress.completed.length} aria-label="Completed journey days" />
      {!compact && <ol className="journey-progress-days">{days.map((title, index) => <li key={title}><Link href={`/begin-here/seven-days/${index + 1}`} aria-current={day === index + 1 ? "page" : undefined}>Day {index + 1}: {title}<span>{progress.completed.includes(index + 1) ? "Completed" : "Not marked complete"}</span></Link></li>)}</ol>}
      <div className="course-actions">
        {day !== undefined && <button type="button" className="button primary" disabled={unavailable} onClick={() => save(setJourneyDay(progress, day, !completedToday), completedToday ? `Day ${day} marked incomplete.` : `Day ${day} marked complete.`)}>{completedToday ? `Mark Day ${day} incomplete` : `Mark Day ${day} complete`}</button>}
        {next !== null ? <Link className="button secondary" href={`/begin-here/seven-days/${next}`}>Continue with Day {next}</Link> : <Link className="button secondary" href="/begin-here/seven-days/1">Revisit Day 1</Link>}
      </div>
      {!compact && <div className="journey-progress-actions"><button type="button" disabled={unavailable || progress.completed.length === 0} onClick={() => save({ version: 1, completed: [] }, "Progress reset. All seven days are ready to revisit.")}>Reset progress</button><button type="button" disabled={unavailable} onClick={() => save(null, "Saved progress removed. Remembering is off.")}>Stop remembering and remove progress</button></div>}
      <p className="lesson-note">Saved only in this browser. Clearing browser data removes it; it does not sync to other devices.</p>
    </>}
    {unavailable && !message && <p role="status">Progress saving is unavailable in this browser. You can still follow every day without it.</p>}
    <p className="lesson-note"><Link className="course-link" href="/privacy#journey-privacy">Privacy and saved progress</Link></p>
    <p role="status">{message}</p>
  </aside>;
}
