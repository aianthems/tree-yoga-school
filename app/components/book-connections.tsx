import Link from "next/link";
import { bookChapters, bookChapterVideos } from "../../lib/book-chapters";

type ChapterSlug = (typeof bookChapters)[number]["slug"];

export default function BookConnections({ chapters, description, compact = false }: {
  chapters: readonly ChapterSlug[];
  description: string;
  compact?: boolean;
}) {
  return <aside className={`book-connections${compact ? " book-connections-compact" : ""}`} aria-label="Connections to the book">
    <p className="section-kicker">Roots in the book</p>
    <p>{description}</p>
    <ul>{chapters.map(slug => {
      const chapter = bookChapters.find(item => item.slug === slug);
      if (!chapter) return null;
      const videos = bookChapterVideos[slug] ?? [];
      return <li key={slug}><Link href={`/book/${slug}`}>Chapter {Number(chapter.number)} · {chapter.title} →</Link>{!compact && videos.length > 0 && <Link className="book-connection-watch" href={`/book/${slug}#chapter-video-title`}>Watch {videos.length > 1 ? "the lessons" : "the lesson"} →<span className="sr-only"> {chapter.title}</span></Link>}</li>;
    })}</ul>
  </aside>;
}
