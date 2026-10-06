import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { bookChapters } from "../../lib/book-chapters";
import { bookUrl } from "../../lib/intro-lessons";

export const metadata: Metadata = { title: "Explore the Book | Tree Yoga School", description: "Explore the seven chapters of Alex Julian’s Tree Yoga School through reading companions, original book references, trees, and practices." };

export default function BookPage() {
  return <><SiteHeader /><main id="content" className="explore-shell">
    <section className="library-intro"><p className="section-kicker">Alex Julian · The original 2023 book</p><h1>The roots<br />of the school.</h1><p className="lesson-lede">Seven chapters, with new ways to bring their teachings into practice. Explore a chapter here, follow it into the Tree Library, or read the original text.</p><p>These reading companions summarize selected themes and connect them to the digital school. They are new adaptations; the full original book remains available as a PDF.</p><a className="button secondary" href={bookUrl} target="_blank" rel="noreferrer">Read the original book</a></section>
    <section className="book-index" aria-label="Seven chapter companions">{bookChapters.map((chapter) => <Link key={chapter.slug} href={`/book/${chapter.slug}`} className="book-chapter-link"><span className="chapter-number">{chapter.number}</span><div><h2>{chapter.title}</h2><p>{chapter.description}</p></div><span className="book-page-number">Printed p. {chapter.printedPage}</span></Link>)}</section>
    <section className="library-note"><p className="section-kicker">From reading to relationship</p><h2>Find a teaching.<br />Spend time with a tree.</h2><p>The Tree Library connects observation and the book’s principles with new species-specific practices. Begin with Pine, or choose a short introductory lesson.</p><div className="course-actions"><Link className="button primary" href="/trees/pine">Meet the pine</Link><Link className="button secondary" href="/begin-here">Begin Here</Link></div></section>
  </main><SiteFooter /></>;
}
