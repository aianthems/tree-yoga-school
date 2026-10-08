import type { Metadata } from "next";
import SiteHeader from "../components/site-header";
import { introLessons } from "../../lib/intro-lessons";

export const metadata: Metadata = { title: "Begin Here | Tree Yoga School", description: "Follow a seven-day beginner journey through observation, meditation, gentle movement, and walking, or choose an individual lesson." };

export default function BeginHere() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="lesson">
        <section className="lesson-intro"><p className="section-kicker">An introductory course</p><h1>Begin Here.</h1><p className="lesson-lede">A seven-day journey. Three ways to practice. Find a tree, give it your attention, and discover a way of practicing that fits your day.</p><p>Take these lessons at your own pace. You can repeat one, explore them in order, or choose the pathway that interests you. No account, equipment purchase, or completion streak is needed.</p></section>
        <section className="lesson-section course-start" aria-labelledby="journey"><p className="section-kicker">A guided beginning · 5–10 minutes a day</p><h2 id="journey">Seven days with a tree.</h2><p>A clear next step for each visit: observation, meditation, gentle movement, walking, and a practice to make your own. Follow the days at your pace, with room to repeat or rest.</p><a className="button primary" href="/begin-here/seven-days">Explore the seven-day journey →</a></section>
        <section className="lesson-section course-start" aria-labelledby="start"><p className="section-kicker">Start here · About 5 minutes</p><h2 id="start">Your First Five Minutes with a Tree</h2><p>A simple visit with seated and standing options. Begin by noticing what is already there.</p><a className="button primary" href="/lessons/first-five-minutes">Open your first practice →</a></section>
        <section className="lesson-section" aria-labelledby="continue"><p className="section-kicker">Three pathways</p><h2 id="continue">Choose your next practice.</h2><div className="course-list">{introLessons.map((lesson) => <article className="course-card" key={lesson.slug}><p className="section-kicker">{lesson.number} · {lesson.duration}</p><h3><a href={`/lessons/${lesson.slug}`}>{lesson.title}</a></h3><p>{lesson.purpose}</p><a className="course-link" href={`/lessons/${lesson.slug}`}>Open lesson →<span className="sr-only"> {lesson.title}</span></a></article>)}</div></section>
        <section className="lesson-section"><p className="section-kicker">A small beginning</p><h2>Return to the practice that serves you.</h2><p>There is no test at the end. Notice what you learn, adapt your next visit, and leave time to be outside. These lessons are new adaptations grounded in the original book, with source references on every lesson page.</p><a className="button secondary" href="/">Return to Tree Yoga School</a></section>
        <section className="lesson-section course-tree"><p className="section-kicker">Get to know your tree</p><h2>One pine. One clear point.</h2><p>The Tree Library connects individual trees to observation, contemplative energies, and the book’s teachings. Start with Pine: constancy, clarity, and perseverance.</p><div className="course-actions"><a className="button primary" href="/trees/pine#practice">Try the pine practice</a><a className="button secondary" href="/trees">Explore the Tree Library</a></div></section>
      </main>
      <footer><p>Founded by Alex Julian · Rooted in the original Tree Yoga School.</p><p>© 2026 Tree Yoga School</p></footer>
    </>
  );
}
