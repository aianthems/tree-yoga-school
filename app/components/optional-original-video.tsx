"use client";

import { useState } from "react";
import VideoLesson from "./video-lesson";

export default function OptionalOriginalVideo({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return loaded ? <VideoLesson youtubeId={youtubeId} title={title} /> : <div className="original-video-choice">
    <p>The video connects to YouTube only when you choose to load it.</p>
    <button type="button" className="button secondary" onClick={() => setLoaded(true)}>Load the original chapter video</button>
    <a className="course-link" href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noreferrer">Watch on YouTube<span className="sr-only"> {title}</span></a>
  </div>;
}
