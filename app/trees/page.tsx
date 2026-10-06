import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { trees } from "../../lib/trees";

export const metadata: Metadata = {
  title: "Tree Library | Tree Yoga School",
  description: "Meet individual trees through observation, contemplative energies, practices, and connections to the original Tree Yoga School book.",
};

export default function TreeLibrary() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="explore-shell">
        <section className="library-intro">
          <p className="section-kicker">The Tree Library</p>
          <h1>Get to know<br />a living tree.</h1>
          <p className="lesson-lede">Each tree offers a new way into the practice. Begin with observation, explore its character, and bring one teaching into your day.</p>
          <div className="library-meta"><span>{trees.length === 1 ? "One tree to begin" : `${trees.length} trees to explore`}</span><span>Observation · Energy · Practice</span></div>
        </section>
        <aside className="champion-library-link"><p className="section-kicker">Out in the world · Massachusetts, New Hampshire, Vermont, Maine & Rhode Island</p><h2>Meet the champion trees.</h2><p>Explore champion tree records from Massachusetts, New Hampshire, Vermont, Maine, and Rhode Island. Find remarkable trees by town, discover their measurements, and follow your curiosity.</p><Link href="/champion-trees">Explore the interactive Champion Map →</Link></aside>
        <nav className="tree-picker" aria-label="Choose a tree">{trees.map((tree) => <a key={tree.slug} href={`#${tree.slug}`}>{tree.name}</a>)}</nav>
        <section aria-label="Trees to explore" className="tree-library-grid">
          {trees.map((tree, index) => (
            <article className="tree-feature" id={tree.slug} key={tree.slug}>
              <Link className="tree-feature-image" href={`/trees/${tree.slug}`} aria-label={`Meet ${tree.name}: ${tree.species}`}>
                <Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 760px) 100vw, 55vw" priority={index === 0} />
              </Link>
              <div className="tree-feature-copy">
                <p className="section-kicker">{tree.species} · <i>{tree.scientificName}</i></p>
                <h2><Link href={`/trees/${tree.slug}`}>{tree.name}</Link></h2>
                <ul className="theme-list" aria-label="Contemplative themes">{tree.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
                <p>{tree.invitation}</p>
                <Link className="button primary" href={`/trees/${tree.slug}`}>Meet {tree.name}</Link>
              </div>
            </article>
          ))}
        </section>
        <section className="library-note" aria-labelledby="energy-intro">
          <p className="section-kicker">The energies of different trees</p>
          <h2 id="energy-intro">Observe first. Let meaning grow.</h2>
          <p>Here, a tree’s “energy” is a contemplative way of exploring its character and your experience beside it. These new interpretations connect visible qualities with the book’s principles. They are invitations to reflect, rather than fixed meanings everyone must feel.</p>
          <div className="course-actions"><Link className="button secondary" href="/book/wisdom-and-wonder">Explore Wisdom and Wonder</Link><Link className="course-link" href="/begin-here">Begin with a five-minute practice</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
