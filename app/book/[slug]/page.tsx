import VideoLesson from "../../components/video-lesson";
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
  const chapter = bookChapters.find(item => item.slug === slug);
  if (!chapter) notFound();
  return pageMetadata(`/book/${slug}`, `${chapter.title} | Tree Yoga School`, chapter.description);
}
export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = bookChapters.findIndex(item => item.slug === slug);
  const chapter = bookChapters[index];
  if (!chapter) notFound();
  const videos = bookChapterVideos[chapter.slug] ?? [];
  const previous = bookChapters[index - 1];
  const next = bookChapters[index + 1];
  return <><SiteHeader /><main id="content" className="lesson book-companion">
    <section className="lesson-intro"><Link className="lesson-back" href="/book">← Explore the book</Link><p className="section-kicker">Chapter {chapter.number} · Read · Watch · Practice</p><h1>{chapter.title}</h1><p className="lesson-lede">{chapter.introduction}</p><p className="lesson-note">A new companion to the original chapter, developed with AI assistance. Summaries and practice connections are adaptations, rather than a transcription.</p>
      <nav className="chapter-steps" aria-label="This chapter: read, watch, practice"><a href="#chapter-read-title"><span>01</span> Read</a><a href="#chapter-video-title"><span>02</span> Watch{videos.length === 0 && <small>Not available</small>}</a><a href="#chapter-practice-title"><span>03</span> Practice</a></nav>
    </section>
    <section className="lesson-section chapter-reading" aria-labelledby="chapter-read-title">
      <p className="section-kicker">01 · Read</p><h2 id="chapter-read-title">Read the chapter.</h2><p>Open the original book, or begin with the reading companion below.</p><a className="button secondary" href={`${bookUrl}#page=${chapter.pdfPage}`} target="_blank" rel="noreferrer">Read the original · printed p. {chapter.printedPage} ↗</a>
      <div className="chapter-reading-notes">{chapter.sections.map(section => <div key={section.title}><h3>{section.title}</h3><p>{section.text}</p></div>)}</div>
      {chapter.slug === "wisdom-and-wonder" && <div className="chapter-principles"><p className="section-kicker">From chapter 6 · printed pp. 97–109</p><h3>Ten principles.</h3><ol className="principle-list">{bookPrinciples.map((principle, i) => <li key={principle}><span>{String(i + 1).padStart(2, "0")}</span>{principle}</li>)}</ol><p className="book-source-note"><a href={`${bookUrl}#page=102`} target="_blank" rel="noreferrer">Read the original reflections on these principles ↗</a></p></div>}
      <a className="course-link" href="#chapter-video-title">Continue to Watch →</a>
    </section>
    <section className="lesson-section chapter-video" aria-labelledby="chapter-video-title">
      <p className="section-kicker">02 · Watch · With Alex Julian</p><h2 id="chapter-video-title">{videos.length > 1 ? "Watch the chapter lessons." : "Watch the chapter lesson."}</h2>
      {videos.length > 0 ? <><p>Join Alex beside a tree for {videos.length === 1 ? "the original video lesson that accompanies" : "the original video lessons that accompany"} this chapter.</p>{videos.map((video, videoIndex) => <div key={video.youtubeId}>{videos.length > 1 && <h3>Video {videoIndex + 1}</h3>}<VideoLesson {...video} /></div>)}</> : <p>A video lesson is not currently available for this chapter. Explore the original reading, then continue with a gentle introductory practice.</p>}
      <a className="course-link" href="#chapter-practice-title">Continue to Practice →</a>
    </section>
    <section className="lesson-pause chapter-practice" aria-labelledby="chapter-practice-title"><p className="section-kicker">03 · Practice · Take the teaching outside</p><h2 id="chapter-practice-title">{chapter.question}</h2><p>Let this question accompany a short visit. Reflect quietly or keep a note for yourself. This is a new practice connection for the digital school.</p><Link className="button light" href={chapter.practiceHref}>{chapter.practiceLabel} →</Link>
      {chapter.slug === "what-is-tree-yoga" && <p className="chapter-practice-alternative"><Link href="/tree-hugging#practice">Explore Tree Hugging as a practice of attention →</Link></p>}
      {chapter.slug === "wisdom-and-wonder" && <p className="chapter-practice-alternative"><Link href="/trees">Choose another tree and practice in the Library →</Link></p>}
      {chapter.slug === "graduation" && <p className="chapter-practice-alternative"><Link href="/lessons/tree-yoga-hiking">Continue with Tree Yoga Hiking →</Link></p>}
    </section>
    <section className="lesson-section chapter-continue" aria-labelledby="chapter-continue-title"><p className="section-kicker">When you are ready</p><h2 id="chapter-continue-title">{next ? "Continue to the next chapter." : "Graduation is a beginning."}</h2>
      {next ? <><p className="chapter-next-title">Chapter {Number(next.number)} · {next.title}</p><p>{next.description}</p><Link className="button primary" href={`/book/${next.slug}`}>Next chapter: {next.title} →</Link></> : <><p>Keep learning through repeat visits, a small observation journal, and the trees around you.</p><Link className="button primary" href="/return-to-your-tree">Return to your tree →</Link></>}
      <nav className="chapter-navigation" aria-label="Chapter navigation">{previous && <Link href={`/book/${previous.slug}`}>← Previous: {previous.title}</Link>}<Link href="/book">All seven chapters →</Link></nav>
    </section>
  </main><SiteFooter /></>;
}
