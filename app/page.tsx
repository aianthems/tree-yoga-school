import { pageMetadata, siteDescription } from "../lib/site-seo";
export const metadata = pageMetadata("/", "Tree Yoga School", siteDescription);
import TreeEmbrace from "./components/tree-embrace";
import HomeChampions from "./components/home-champions";
import SiteHeader from "./components/site-header";
import Image from "next/image";
import Link from "next/link";
import { bookChapters } from "../lib/book-chapters";

const bookUrl =
  "https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf";

const pathways = [
  {
    number: "01",
    title: "Yoga with a tree",
    href: "/lessons/gentle-yoga-with-a-tree",
    text: "Bring movement, balance, breath, and stillness into relationship with a living tree. The tree is not scenery; it becomes part of the practice.",
  },
  {
    number: "02",
    title: "Meditation with a tree",
    href: "/lessons/meditation-with-a-tree",
    text: "Sit, stand, or rest nearby. Notice breath, bark, canopy, light, sound, weather, and the simple fact of being present.",
  },
  {
    number: "03",
    title: "Tree Yoga Hiking",
    href: "/lessons/tree-yoga-hiking",
    text: "Turn a walk into practice. Pause. Observe. Become acquainted with the place instead of passing through it.",
  },
];

const principles = [
  "Acceptance",
  "Adaptability",
  "Balance & Optimization",
  "One-Pointed Focus",
  "Perseverance",
  "Presence",
  "Release",
  "Strength",
  "Unconditional Forgiveness",
  "Unconditional Love",
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="content">
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A living school rooted in nature</p>
          <h1>Practice beneath<br />something older<br />than your plans.</h1>
          <p className="hero-lede">
            Tree Yoga School brings together tree hugging, yoga, meditation, hiking, and
            sustained attention to the living world.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/begin-here">Begin with a tree</a>
            <a className="button secondary" href={bookUrl} target="_blank" rel="noreferrer">
              Read the original book ↗
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="sun" />
          <div className="tree">
            <div className="crown crown-one" />
            <div className="crown crown-two" />
            <div className="crown crown-three" />
            <div className="trunk" />
          </div>
          <div className="ground" />
          <p className="hero-mantra">Nature is the teacher.</p>
        </div>
      </section>

      <section className="manifesto section-shell">
        <p className="section-kicker">The school in one sentence</p>
        <blockquote>
          “Nature is the teacher. Technology is the tool. Practice is the point.”
        </blockquote>
        <p>
          Tree Yoga School was founded by Alex Julian and is now being renewed
          as a public, AI-native school. The original 2023 book remains the root
          source; the digital school grows outward from it.
        </p>
      </section>

      <section className="home-hug" aria-labelledby="home-hug-title">
        <div className="home-hug-copy"><p className="section-kicker">Tree Hugging · A central practice</p><h2 id="home-hug-title">An embrace.<br /><em>A living connection.</em></h2><p>Slow down beside a tree. Rest your hands or arms gently against its trunk, or simply stay nearby. Explore a practice of presence, gratitude, and care.</p><Link className="button hug-button" href="/tree-hugging">Discover Tree Hugging →</Link><p className="home-hug-note">The practice · The benefits · The research</p></div><div className="home-hug-art"><TreeEmbrace compact /></div>
      </section>

      <section className="pathways section-shell" id="practice">
        <div className="section-heading">
          <p className="section-kicker">Three pathways</p>
          <h2>There is more than one way to practice with a tree.</h2>
        </div>
        <div className="card-grid">
          {pathways.map((pathway) => (
            <article className="practice-card" key={pathway.number}>
              <span>{pathway.number}</span>
              <h3>{pathway.title}</h3>
              <p>{pathway.text}</p>
              <a className="course-link" href={pathway.href}>Explore this practice →<span className="sr-only"> {pathway.title}</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="begin section-shell" id="begin">
        <div className="begin-panel">
          <div>
            <p className="section-kicker">Start now</p>
            <h2>Begin with a tree — not an account.</h2>
          </div>
          <div className="begin-copy">
            <p>
              Choose a safe, permitted place near a tree. Find a comfortable
              position. Put the screen aside. Let your breathing remain
              comfortable and notice what is actually there.
            </p>
            <p>
              Five quiet minutes count. You do not need special equipment,
              advanced poses, or a particular feeling to begin.
            </p>
            <a className="button light" href="/lessons/first-five-minutes">Your first five minutes →</a>
          </div>
        </div>
      </section>

      <section className="home-tree-section section-shell" aria-labelledby="tree-library-heading">
        <div className="section-heading"><p className="section-kicker">The Tree Library</p><h2 id="tree-library-heading">Every tree is a new doorway.</h2></div>
        <div className="home-tree-feature">
          <Link href="/trees/pine" aria-label="Meet Pine in the Tree Library"><Image src="/images/trees/pine.webp" alt="Eastern white pine with a broad crown of green needles" width={600} height={450} sizes="(max-width: 760px) 90vw, 45vw" /></Link>
          <div><p className="section-kicker">Begin with Eastern white pine</p><h3>Pine.</h3><p className="home-tree-themes">Constancy · Clarity · Perseverance</p><p>Meet the tree, explore its contemplative energy, and try a five-minute practice of returning to one clear point.</p><div className="course-actions"><Link className="button primary" href="/trees/pine">Meet the pine</Link><Link className="course-link" href="/trees">Explore the Tree Library</Link></div></div>
        </div>
      </section>

      <HomeChampions />

      <section className="curriculum section-shell" id="curriculum">
        <div className="section-heading">
          <p className="section-kicker">Explore the book</p>
          <h2>Seven chapters. One practice: pay attention.</h2>
          <p className="curriculum-intro">New reading companions connect the original book to trees and practices. Each chapter also links to its full original text.</p>
        </div>
        <div className="chapter-list">
          {bookChapters.map(({ number, slug, title, description }) => (
            <Link
              key={number}
              href={`/book/${slug}`}
              className="chapter-row"
            >
              <span className="chapter-number">{number.padStart(2, "0")}</span>
              <span className="chapter-title">{title}</span>
              <span className="chapter-description">{description}</span>
              <span className="chapter-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="principles section-shell" id="principles">
        <div className="principles-intro">
          <p className="section-kicker">Wisdom and Wonder</p>
          <h2>Ten principles for practice — and for building the school.</h2>
          <p>
            The book’s principles become a compass for both the yoga and the
            technology around it: patient growth, attention, adaptability, and
            care for the living world.
          </p>
        </div>
        <ol className="principle-list">
          {principles.map((principle, index) => (
            <li key={principle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {principle}
            </li>
          ))}
        </ol>
        <Link className="course-link" href="/book/wisdom-and-wonder">Explore the principles in Wisdom and Wonder</Link>
      </section>

      <section className="ai-native section-shell">
        <p className="section-kicker">AI-native, human-centered</p>
        <div className="ai-layout">
          <h2>Use technology to help people return to practice.</h2>
          <div>
            <p>
              AI can help organize teaching, improve explanations, build useful
              tools, and make the school easier to explore. It should not become
              the object of the practice.
            </p>
            <p>
              The measure is simple: does the technology help someone practice
              with greater attention, care, and independence — and then make it
              easier to close the device and go outside?
            </p>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing-inner">
          <p className="section-kicker">Tree Yoga School</p>
          <h2>Practice. Notice. Reflect. Return outside.</h2>
          <a className="button light" href={bookUrl} target="_blank" rel="noreferrer">
            Open the book ↗
          </a>
        </div>
      </section>

      </main>
      <footer>
        <p>Founded by Alex Julian · Rooted in the original Tree Yoga School.</p>
        <p>© 2026 Tree Yoga School</p>
      </footer>
    </>
  );
}
