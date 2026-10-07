"use client";

import { useEffect, useRef, useState } from "react";
import { PRACTICE_DURATION, remainingTime, startTimer, pauseTimer, type PracticeTimer } from "../../lib/practice-timer";

export default function PracticeControls() {
  const timer = useRef<PracticeTimer>({ remaining: PRACTICE_DURATION, deadline: null });
  const audio = useRef<AudioContext | null>(null);
  const sound = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [remaining, setRemaining] = useState(PRACTICE_DURATION);
  const [status, setStatus] = useState<"ready" | "running" | "paused" | "complete">("ready");
  const [audioNote, setAudioNote] = useState("");

  async function prepareSound() {
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      setAudioNote("");
    } catch {
      setAudioNote("Sound is unavailable in this browser. The timer still works silently.");
    }
  }
  useEffect(() => {
    function update() {
      if (timer.current.deadline === null) return;
      const left = remainingTime(timer.current, Date.now());
      setRemaining(left);
      if (left === 0) {
        timer.current = { remaining: 0, deadline: null };
        setStatus("complete");
        const context = audio.current;
        if (sound.current && context?.state === "running") {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.frequency.value = 528;
          gain.gain.setValueAtTime(0, context.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2);
          oscillator.connect(gain); gain.connect(context.destination);
          oscillator.start(); oscillator.stop(context.currentTime + 2);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        }
      }
    }
    const interval = window.setInterval(update, 250);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", update); };
  }, []);
  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);

  function start() {
    if (sound.current) void prepareSound();
    timer.current = startTimer(timer.current, Date.now());
    setRemaining(timer.current.remaining); setStatus("running");
  }
  function pause() {
    timer.current = pauseTimer(timer.current, Date.now());
    setRemaining(timer.current.remaining);
    setStatus(timer.current.remaining === 0 ? "complete" : "paused");
  }
  function reset() {
    timer.current = { remaining: PRACTICE_DURATION, deadline: null };
    setRemaining(PRACTICE_DURATION); setStatus("ready");
  }
  const seconds = Math.ceil(remaining / 1000);
  return <section className="practice-controls" aria-labelledby="timer-heading">
    <h2 id="timer-heading">An optional five minutes</h2>
    <p>You can practice without a timer. Start it when you are ready to turn your attention to the tree.</p>
    <p className="practice-clock" role="timer" aria-label="Time remaining" aria-live="off">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p>
    <div className="practice-buttons">
      {status === "running" ? <button type="button" onClick={pause}>Pause</button> : <button type="button" onClick={start}>{status === "paused" ? "Resume" : status === "complete" ? "Start again" : "Start five minutes"}</button>}
      <button type="button" onClick={reset}>Reset</button>
      <button type="button" onClick={() => window.print()}>Print / Save as PDF</button>
    </div>
    <label className="practice-sound"><input type="checkbox" checked={soundEnabled} onChange={event => { const enabled = event.target.checked; sound.current = enabled; setSoundEnabled(enabled); if (enabled) void prepareSound(); }} /> Gentle closing sound</label>
    <p className="practice-status" role="status">{status === "complete" ? "Your five minutes are complete. Take your time returning." : status === "paused" ? "Timer paused. Continue whenever you like." : status === "running" ? "Timer running. Let your attention rest with the tree." : "Silent by default. Begin whenever you like."}</p>
    {audioNote && <p role="status">{audioNote}</p>}
    <p className="practice-timer-note">Keep this page open for the closing sound. A locked screen or backgrounded browser may delay it; the time will catch up when you return.</p>
  </section>;
}
