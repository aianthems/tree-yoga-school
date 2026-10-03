import SiteHeader from "./components/site-header";

const bookUrl =
  "https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf";

const pathways = [
  {
    number: "01",
    title: "Yoga with a tree",
    text: "Bring movement, balance, breath, and stillness into relationship with a living tree. The tree is not scenery; it becomes part of the practice.",
  },
  {
    number: "02",
    title: "Meditation with a tree",
    text: "Sit, stand, or rest nearby. Notice breath, bark, canopy, light, sound, weather, and the simple fact of being present.",
  },
  {
    number: "03",
    title: "Tree Yoga Hiking",
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

const chapters = [
  ["1", "What is Tree Yoga?", "Origins, contemplation, and the invitation to practice."],
  ["2", "Why Tree Yoga?", "Purpose, benefits, and relationship with nature."],
  ["3", "Who and How", "Three pathways, choosing a tree, equipment, and care."],
  ["4", "When and Where", "Habits, seasons, settings, and adapting to conditions."],
  ["5", "Poses, Flows, and Meditations", "Movement references, flows, and meditations."],
  ["6", "Wisdom and Wonder", "Ten guiding principles and reflections on trees."],
  ["7", "Graduation", "Bringing the practice into daily life and sharing what you learn."],
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
            Tree Yoga School brings together yoga, meditation, hiking, and
            sustained attention to the living world.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/lessons/first-five-minutes">Begin with a tree</a>
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

      <section className="curriculum section-shell" id="curriculum">
        <div className="section-heading">
          <p className="section-kicker">The original curriculum</p>
          <h2>Seven chapters. One practice: pay attention.</h2>
        </div>
        <div className="chapter-list">
          {chapters.map(([number, title, description]) => (
            <a
              key={number}
              href={`${bookUrl}#page=${number === "1" ? 6 : number === "2" ? 9 : number === "3" ? 18 : number === "4" ? 30 : number === "5" ? 39 : number === "6" ? 101 : 130}`}
              target="_blank"
              rel="noreferrer"
              className="chapter-row"
            >
              <span className="chapter-number">{number.padStart(2, "0")}</span>
              <span className="chapter-title">{title}</span>
              <span className="chapter-description">{description}</span>
              <span className="chapter-arrow">↗</span>
            </a>
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
