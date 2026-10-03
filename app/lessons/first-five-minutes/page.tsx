import type { Metadata } from "next";
import SiteHeader from "../../components/site-header";

export const metadata: Metadata = {
  title: "Your First Five Minutes with a Tree | Tree Yoga School",
  description: "A simple introduction to observing a living tree, with seated and standing options and time to practice away from the screen.",
};

const book = "https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf";

export default function FirstLesson() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="lesson">
        <section className="lesson-intro">
          <a className="lesson-back" href="/">← Tree Yoga School</a>
          <p className="section-kicker">First lesson · Observation · About 5 minutes</p>
          <h1>Your first five minutes with a tree.</h1>
          <p className="lesson-lede">Begin by becoming acquainted with one living tree. There is nothing particular you need to feel or achieve.</p>
          <div className="lesson-welcome">
            <p className="section-kicker">A welcome from Alex Julian</p>
            <p>Welcome to Tree Yoga School. Start small. Give one tree a little of your attention, and let this first visit be enough. You can begin exactly where you are.</p>
          </div>
          <p className="lesson-note">This welcome and lesson were prepared for the renewed digital school. They adapt themes from Alex’s original book; they are not quotations.</p>
        </section>

        <section className="lesson-section" aria-labelledby="choose">
          <p className="section-kicker">01 · Before you begin</p>
          <h2 id="choose">Choose a place you can settle.</h2>
          <p>Find a tree in a permitted place with stable ground and enough room to sit or stand comfortably. Stay clear of damaged or hanging branches, traffic, and other hazards. Choose suitable weather and keep paths clear.</p>
          <p>You can observe from a bench, a wheelchair, or an accessible path. You do not need to touch the tree or sit beneath its canopy. Keep your usual supports and mobility aids with you.</p>
          <div className="lesson-options">
            <article><h3>Seated</h3><p>Use a stable chair, bench, or your usual seat. Let your feet rest on the ground or their usual support. Use back support if it helps you feel comfortable.</p></article>
            <article><h3>Standing</h3><p>Stand in a comfortable position on stable ground. Keep any support you normally use. If standing feels tiring or unsteady, choose a seated position instead.</p></article>
          </div>
        </section>

        <section className="lesson-section" aria-labelledby="notice">
          <p className="section-kicker">02 · Read once, then practice</p>
          <h2 id="notice">Let your attention arrive.</h2>
          <ol className="lesson-steps">
            <li><h3>Settle</h3><p>Notice the support beneath you and the space around you. Keep your eyes open and your breathing comfortable. There is no need to deepen or control it.</p></li>
            <li><h3>Observe</h3><p>Look at the tree. Notice one detail: a pattern in the bark, the shape of a branch, a leaf, or the way light falls across it. Let your gaze move naturally.</p></li>
            <li><h3>Listen</h3><p>Notice sounds nearby and farther away. Perhaps leaves move, a bird calls, or people pass. You do not need silence to practice.</p></li>
            <li><h3>Return</h3><p>When your attention wanders, gently return to one detail of the tree. Wandering is part of the practice. Begin again as often as you need.</p></li>
          </ol>
          <p>Let the visit last about 5 minutes, or less if that suits you today. Precise timing is unnecessary. Change position or finish whenever you need to.</p>
        </section>

        <section className="lesson-pause" aria-labelledby="pause">
          <p className="section-kicker">03 · Your practice begins here</p>
          <h2 id="pause">Put the screen away.<br />Spend a few minutes with the tree.</h2>
          <p>Keep your device available if you need it for access, navigation, or communication. You can return to the reflection afterward.</p>
        </section>

        <section className="lesson-section" aria-labelledby="reflect">
          <p className="section-kicker">04 · After your visit</p>
          <h2 id="reflect">What did you notice that you might otherwise have passed by?</h2>
          <p>Hold the answer quietly, or write a sentence in your own notebook. You do not need to submit or share anything. When you are ready, return to your day. Another short visit is a complete next step.</p>
        </section>

        <section className="lesson-section lesson-sources" aria-labelledby="sources">
          <p className="section-kicker">Roots of this lesson</p>
          <h2 id="sources">From the original book to a first practice.</h2>
          <p>This is a new introductory adaptation for the digital school, developed with AI assistance. It combines observation, accessible position choices, and a short practice period; the sequence and reflection question are new.</p>
          <ul>
            <li><a href={`${book}#page=18`} target="_blank" rel="noreferrer">Chapter 3, “Who and How,” printed pp. 13–17 ↗</a>: practice pathways and choosing a tree.</li>
            <li><a href={`${book}#page=33`} target="_blank" rel="noreferrer">Chapter 4, printed p. 28 ↗</a>: beginning with 5 or 10 minutes.</li>
            <li><a href={`${book}#page=97`} target="_blank" rel="noreferrer">Chapter 5, “Chair Meditation,” printed p. 92 ↗</a>: seated practice, adapted here for comfortable natural breathing and usual supports.</li>
          </ul>
          <p className="lesson-note">This observation lesson makes no medical or healing claims. Leave bark, roots, wildlife, and habitat undisturbed.</p>
          <div className="course-actions"><a className="button secondary" href="/begin-here">Explore the Begin Here course →</a><a className="button primary" href="/lessons/meditation-with-a-tree">Next: Meditation with a Tree →</a></div>
        </section>
      </main>
      <footer><p>Founded by Alex Julian · Rooted in the original Tree Yoga School.</p><p>© 2026 Tree Yoga School</p></footer>
    </>
  );
}
