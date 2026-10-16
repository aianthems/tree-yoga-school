import JourneyProgressPanel from "../components/journey-progress";
import { pageMetadata } from "../../lib/site-seo";
import type { Metadata } from "next";
import SiteHeader from "../components/site-header";
import { introLessons } from "../../lib/intro-lessons";

const pageInfo: Metadata = { title: "Begin Here | Tree Yoga School", description: "Start with your first five minutes beside a tree, then continue with a seven-day journey through observation, meditation, gentle movement, and walking." };
export const metadata: Metadata = pageMetadata("/begin-here", String(pageInfo.title), String(pageInfo.description));

export default function BeginHere() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="lesson">
        <section className="lesson-intro"><p className="section-kicker">Start here · About 5 minutes</p><h1>Begin Here.</h1><p className="lesson-lede">Begin with five quiet minutes beside a tree.</p><p>A simple visit, with seated and standing options. No account or special equipment is needed.</p><a className="button primary" href="/lessons/first-five-minutes">Start your first five minutes</a></section>
        <section className="lesson-section course-start" aria-labelledby="journey"><p className="section-kicker">After your first visit · 5–10 minutes a day</p><h2 id="journey">Keep going with seven days beside a tree.</h2><p>Take your next step through observation, meditation, gentle movement, and walking. Follow the journey at your own pace, with room to repeat a practice or rest.</p><a className="button secondary" href="/begin-here/seven-days">Continue with the seven-day journey</a><JourneyProgressPanel compact /></section>
        <section className="lesson-section course-start" aria-labelledby="hugging"><p className="section-kicker">A living connection</p><h2 id="hugging">Try Tree Hugging.</h2><p>A gentle embrace, a light palm, or a quiet moment nearby. Explore the practice, its connections to meditation, and what research suggests about time with trees.</p><a className="button primary" href="/tree-hugging">Explore Tree Hugging</a></section>
        <section className="lesson-section" aria-labelledby="continue"><p className="section-kicker">Three pathways</p><h2 id="continue">Choose your next practice.</h2><div className="course-list">{introLessons.map((lesson) => <article className="course-card" key={lesson.slug}><p className="section-kicker">{lesson.number} · {lesson.duration}</p><h3><a href={`/lessons/${lesson.slug}`}>{lesson.title}</a></h3><p>{lesson.purpose}</p><a className="course-link" href={`/lessons/${lesson.slug}`}>Open lesson<span className="sr-only"> {lesson.title}</span></a></article>)}</div></section>
        <section className="lesson-section"><p className="section-kicker">A small beginning</p><h2>Return to the practice that serves you.</h2><p>There is no test at the end. Notice what you learn, adapt your next visit, and leave time to be outside. These lessons are new adaptations grounded in the original book, with source references on every lesson page.</p><a className="button secondary" href="/">Return to Tree Yoga School</a></section>
        <section className="lesson-section course-start"><h2>Come back to the same tree.</h2><p>Let your next visit become a relationship. Notice changes across the seasons and keep a simple observation journal.</p><a className="course-link" href="/return-to-your-tree">Return to your tree</a></section><section className="lesson-section course-tree"><p className="section-kicker">Get to know your tree</p><h2>One pine. One clear point.</h2><p>The Tree Library connects individual trees to observation, contemplative energies, and the book’s teachings. Start with Pine: constancy, clarity, and perseverance.</p><div className="course-actions"><a className="button primary" href="/trees/pine#practice">Try the pine practice</a><a className="button secondary" href="/trees">Explore the Tree Library</a></div></section>
      </main>

    </>
  );
}
