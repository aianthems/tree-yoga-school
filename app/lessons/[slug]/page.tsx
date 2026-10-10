import BookConnections from "../../components/book-connections";
import SiteFooter from "../../components/site-footer";
import { pageMetadata } from "../../../lib/site-seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import { bookUrl, introLessons } from "../../../lib/intro-lessons";

export function generateStaticParams() {
  return introLessons.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = introLessons.find((item) => item.slug === slug);
  if (!lesson) notFound();
  return pageMetadata(`/lessons/${slug}`, `${lesson.title} | Tree Yoga School`, lesson.purpose);
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = introLessons.findIndex((item) => item.slug === slug);
  const lesson = introLessons[index];
  if (!lesson) notFound();
  const next = introLessons[index + 1];
  return (
    <>
      <SiteHeader />
      <main id="content" className="lesson">
        <section className="lesson-intro">
          <a className="lesson-back" href="/begin-here">← Begin Here course</a>
          <p className="section-kicker">Lesson {lesson.number} · {lesson.duration}</p>
          <h1>{lesson.title}</h1>
          <p className="lesson-lede">{lesson.purpose}</p>
          <p className="lesson-note">An introductory adaptation from the original Tree Yoga School book.</p>
        </section>
        <section className="lesson-section" aria-labelledby="prepare">
          <p className="section-kicker">Preparation</p><h2 id="prepare">Choose your way to practice.</h2>
          <p>{lesson.preparation}</p>
          <div className="lesson-options">{lesson.options.map((option) => <article key={option.title}><h3>{option.title}</h3><p>{option.text}</p></article>)}</div>
        </section>
        <section className="lesson-section" aria-labelledby="practice">
          <p className="section-kicker">Practice</p><h2 id="practice">Read once, then explore.</h2>
          <ol className="lesson-steps">{lesson.steps.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
          <p>These are invitations, not requirements. Shorten the practice, skip a step, or finish whenever you need to.</p>
        </section>
        <section className="lesson-pause" aria-labelledby="pause"><p className="section-kicker">Time away from the screen</p><h2 id="pause">{lesson.pause}</h2><p>Keep your device available whenever you need it for access, navigation, or communication.</p></section>
        <section className="lesson-section" aria-labelledby="reflection"><p className="section-kicker">Reflection</p><h2 id="reflection">{lesson.reflection}</h2><p>Reflect quietly or write a sentence in your own notebook. Nothing needs to be submitted or shared. Repeat this lesson as often as you like.</p></section>
        <section className="lesson-section lesson-sources" aria-labelledby="sources"><p className="section-kicker">Roots of this lesson</p><h2 id="sources">Sources and adaptations.</h2><p>{lesson.adaptation}</p><ul>{lesson.sources.map((source) => <li key={source.title}><a href={`${bookUrl}#page=${source.page}`} target="_blank" rel="noreferrer">{source.title} ↗</a>: {source.note}</li>)}</ul><p className="lesson-note">Developed with AI assistance for the renewed digital school. This lesson makes no medical or healing claims.</p>
          <BookConnections chapters={lesson.slug === "tree-yoga-hiking" ? ["who-and-how", "graduation"] : ["who-and-how", "poses-flows-and-meditations"]} description={lesson.slug === "tree-yoga-hiking" ? "Follow the book’s walking pathway in Chapter 3, then explore Chapter 7’s invitation to keep learning outside." : "Chapter 3 introduces the practice pathways; Chapter 5 offers the original movement and meditation reference. This lesson adapts those teachings into an introductory sequence."} />
          <div className="course-actions"><a className="button secondary" href="/begin-here">Return to the course</a>{next ? <a className="button primary" href={`/lessons/${next.slug}`}>Next: {next.title} →</a> : <a className="button primary" href="/lessons/first-five-minutes">Return to your first practice →</a>}</div>
          <p className="book-source-note">Explore a particular tree: <a href="/trees/pine">Pine in the Tree Library</a>, or <a href="/book">follow the teachings through the book</a>.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
