import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../components/site-header";
import { bookPoses, poseDescription, poseHref } from "../../lib/book-poses";
import { bookUrl } from "../../lib/intro-lessons";
import { pageMetadata } from "../../lib/site-seo";

export const dynamicParams = false;
export function generateStaticParams() { return bookPoses.map(({ slug }) => ({ pose: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ pose: string }> }): Promise<Metadata> {
  const { pose: slug } = await params;
  const pose = bookPoses.find(item => item.slug === slug);
  if (!pose) notFound();
  return pageMetadata(poseHref(pose), `${pose.title} | Tree Yoga School`, poseDescription(pose));
}

export default async function PosePage({ params }: { params: Promise<{ pose: string }> }) {
  const { pose: slug } = await params;
  const index = bookPoses.findIndex(item => item.slug === slug);
  const pose = bookPoses[index];
  if (!pose) notFound();
  const previous = bookPoses[index - 1];
  const next = bookPoses[index + 1];
  const pages = pose.endPdfPage === pose.pdfPage ? `${pose.printedPage}` : `${pose.printedPage}–${pose.endPdfPage - 5}`;
  return <><SiteHeader /><main id="content" className="lesson pose-page">
    <section className="lesson-intro">
      <Link className="lesson-back" href="/book/poses-flows-and-meditations#poses">← All {bookPoses.length} poses</Link>
      <p className="section-kicker">Tree Yoga · The original pose reference</p>
      <h1>{pose.title}</h1>
      <p className="pose-source-byline">Alex Julian · <cite>Tree Yoga School</cite> · Printed {pose.endPdfPage === pose.pdfPage ? "page" : "pages"} {pages}</p>
      <a className="button secondary" href={`${bookUrl}#page=${pose.pdfPage}`} target="_blank" rel="noreferrer">See this pose in the original book ↗</a>
    </section>
    <section className="lesson-section pose-instructions" aria-labelledby="pose-instructions-title">
      <p className="section-kicker">From the original book</p><h2 id="pose-instructions-title">The practice.</h2>
      <div className="pose-original-text">{pose.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
      <p className="book-source-note">Original book text by Alex Julian. Line wrapping and page breaks have been normalized for reading on the web. Personal accounts and energetic interpretations remain part of the original text.</p>
    </section>
    <section className="lesson-section pose-care"><h2>Make the practice fit you.</h2><p>This is a reference entry, not a required step in a beginner course. Use a comfortable range, keep breathing naturally, and stop if a movement hurts. Inversions and suspended exercises need appropriate instruction and equipment; a tree is not a certified anchor.</p><Link className="course-link" href="/lessons/gentle-yoga-with-a-tree">Explore the gentle introductory lesson →</Link></section>
    <section className="lesson-section"><p className="section-kicker">Keep exploring</p><h2>Return to the reference.</h2>
      <Link className="button primary" href="/book/poses-flows-and-meditations#poses">Browse all {bookPoses.length} poses →</Link>
      <nav className="chapter-navigation" aria-label="Pose navigation">{previous && <Link href={poseHref(previous)}>← {previous.title}</Link>}{next && <Link href={poseHref(next)}>{next.title} →</Link>}</nav>
    </section>
  </main></>;
}
