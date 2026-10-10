import { pageMetadata } from "../../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { bookChapters, bookPrinciples, bookChapterVideos } from "../../../lib/book-chapters";
import { bookUrl } from "../../../lib/intro-lessons";

export const dynamicParams = false;
export function generateStaticParams() { return bookChapters.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = bookChapters.find((item) => item.slug === slug);
  if (!chapter) notFound();
  return pageMetadata(`/book/${slug}`, `${chapter.title} | Tree Yoga School`, chapter.description);
}
export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = bookChapters.findIndex((item) => item.slug === slug);
  const chapter = bookChapters[index];
  if (!chapter) notFound();
  const video = bookChapterVideos[chapter.slug];
  const previous = bookChapters[index - 1];
  const next = bookChapters[index + 1];
  return <><SiteHeader /><main id="content" className="lesson book-companion">
    <section className="lesson-intro"><Link className="lesson-back" href="/book">Explore the book</Link><p className="section-kicker">Chapter {chapter.number} · Reading companion</p><h1>{chapter.title}</h1><p className="lesson-lede">{chapter.introduction}</p><p className="lesson-note">A new companion to the original chapter, developed with AI assistance. Summaries and practice connections are adaptations, rather than a transcription.</p><a className="button secondary" href={`${bookUrl}#page=${chapter.pdfPage}`} target="_blank" rel="noreferrer">Read the original · printed p. {chapter.printedPage}</a></section>
    {video && <section className="lesson-section chapter-video" aria-labelledby="chapter-video-title"><p className="section-kicker">The original school · With Alex Julian</p><h2 id="chapter-video-title">Watch the chapter lesson.</h2><p>Join Alex beside a tree for the video lesson that accompanies this chapter.</p><div className="chapter-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`} title={video.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen /></div><a className="course-link" href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></section>}
    {chapter.sections.map((section) => <section className="lesson-section" key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
    {chapter.slug === "wisdom-and-wonder" && <section className="lesson-section"><p className="section-kicker">From chapter 6 · printed pp. 97–109</p><h2>Ten principles.</h2><ol className="principle-list">{bookPrinciples.map((principle, i) => <li key={principle}><span>{String(i + 1).padStart(2, "0")}</span>{principle}</li>)}</ol><p className="book-source-note"><a href={`${bookUrl}#page=102`} target="_blank" rel="noreferrer">Read the original reflections on these principles</a></p></section>}
    <section className="lesson-pause"><p className="section-kicker">Bring it into practice</p><h2>{chapter.question}</h2><p>Let this question accompany a short visit. Reflect quietly or keep a note for yourself.</p><Link className="button light" href={chapter.practiceHref}>{chapter.practiceLabel}</Link></section>
    <section className="lesson-section"><p className="section-kicker">Keep exploring</p><h2>The book continues outside.</h2><p>Meet a pine, explore its contemplative character, and try returning your attention to one clear point.</p><Link className="course-link" href="/trees/pine">Explore Pine in the Tree Library</Link><nav className="chapter-navigation" aria-label="Chapter navigation">{previous ? <Link href={`/book/${previous.slug}`}>Previous chapter: {previous.title}</Link> : <Link href="/book">All chapters</Link>}{next ? <Link href={`/book/${next.slug}`}>Next chapter: {next.title}</Link> : <Link href="/book">Return to all chapters</Link>}</nav></section>
  </main><SiteFooter /></>;
}
