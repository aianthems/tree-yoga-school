import { pageMetadata } from "../../lib/site-seo";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import BookCover from "../components/book-cover";
import { bookChapters, bookChapterVideos } from "../../lib/book-chapters";
import { bookUrl } from "../../lib/intro-lessons";

export const metadata = pageMetadata("/book", "Explore the Book | Tree Yoga School", "Begin Alex Julian’s Tree Yoga School book: seven chapters, original video lessons, reading companions, and practices to take outside.");

export default function BookPage() {
  const videoCount = bookChapters.reduce((total, chapter) => total + (bookChapterVideos[chapter.slug]?.length ?? 0), 0);
  return <><SiteHeader /><main id="content" className="explore-shell book-hub">
    <section className="book-feature book-hub-intro" aria-labelledby="book-title">
      <BookCover priority />
      <div className="book-feature-copy">
        <p className="section-kicker">Alex Julian · The original 2023 book</p>
        <h1 id="book-title">Tree Yoga School.</h1>
        <p className="lesson-lede">The book at the roots of the school. Explore seven chapters that bring yoga, meditation, hiking, and the wisdom of trees into everyday life.</p>
        <p>Start with Chapter 1, or choose a topic below. Read the chapter companion, watch Alex’s available lessons beside remarkable trees, and take a practice outside.</p>
        <p className="book-availability">{bookChapters.length} chapters · {videoCount} original video lessons · Free book PDF</p>
        <div className="course-actions"><Link className="button primary" href={`/book/${bookChapters[0].slug}`}>Start Chapter 1</Link><a className="button secondary" href={bookUrl} target="_blank" rel="noreferrer">Read the book ↗</a></div>
        <a className="book-jump" href="#chapters">Explore all seven chapters ↓</a>
      </div>
    </section>
    <section id="chapters" className="book-hub-chapters" aria-labelledby="chapters-title">
      <p className="section-kicker">Read · Watch · Practice</p><h2 id="chapters-title">Explore the seven chapters.</h2>
      <p className="book-companion-note">The chapter pages offer new reading companions and practices. For Alex’s full original text, use the book PDF; the videos are his original lessons.</p>
      <div className="book-index">{bookChapters.map((chapter) => {
        const videos = bookChapterVideos[chapter.slug] ?? [];
        return <article key={chapter.slug} className="book-hub-chapter">
          <span className="chapter-number" aria-label={`Chapter ${Number(chapter.number)}`}>{chapter.number}</span>
          <div><h3><Link href={`/book/${chapter.slug}`}>{chapter.title}</Link></h3><p>{chapter.description}</p>
            <p className="book-chapter-availability">Printed p. {chapter.printedPage} · {videos.length ? `${videos.length} video lesson${videos.length > 1 ? "s" : ""}` : "Reading & practice"}</p>
            <div className="book-chapter-actions"><Link href={`/book/${chapter.slug}`}>Explore chapter →</Link>{videos.length > 0 && <Link href={`/book/${chapter.slug}#chapter-video-title`}>Watch {videos.length > 1 ? "lessons" : "lesson"} →</Link>}<a href={`${bookUrl}#page=${chapter.pdfPage}`} target="_blank" rel="noreferrer">Read original chapter ↗</a></div>
          </div>
        </article>;
      })}</div>
    </section>
    <section className="library-note"><p className="section-kicker">From reading to relationship</p><h2>Find a teaching.<br />Spend time with a tree.</h2><p>The Tree Library connects observation and the book’s principles with new species-specific practices. Begin with Pine, or choose a short introductory lesson.</p><div className="course-actions"><Link className="button primary" href="/trees/pine">Meet the pine</Link><Link className="button secondary" href="/begin-here">Begin Here</Link></div></section>
  </main><SiteFooter /></>;
}
