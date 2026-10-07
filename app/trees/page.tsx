import type { Metadata } from "next";
import Link from "next/link";
import TreeLibraryExplorer from "../components/tree-library-explorer";
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
        <TreeLibraryExplorer trees={trees.map(({ slug, name, species, scientificName, themes, invitation, image, imageAlt, imageWidth, imageHeight }) => ({ slug, name, species, scientificName, themes, invitation, image, imageAlt, imageWidth, imageHeight }))} />
        <aside className="champion-library-link"><p className="section-kicker">Out in the world · Eighteen states to explore</p><h2>Meet the champion trees.</h2><p>Explore champion and score-based leader records across New England, the Mid-Atlantic, the Carolinas, Tennessee, Georgia, and Kentucky. Find remarkable trees by town or county, discover their measurements, and follow your curiosity.</p><Link href="/champion-trees">Explore the interactive Champion Map →</Link></aside>
        <aside className="tree-visit-teaser"><h2>A place to begin outdoors.</h2><p>Three trees with published visiting guidance and a practice to bring along.</p><Link className="course-link" href="/tree-visits">Explore trees to visit →</Link></aside>
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
