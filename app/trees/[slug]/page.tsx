import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { getTree, trees } from "../../../lib/trees";
import { bookUrl } from "../../../lib/intro-lessons";

export const dynamicParams = false;
export function generateStaticParams() { return trees.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tree = getTree(slug);
  if (!tree) notFound();
  return { title: `${tree.name}: Energy & Practice | Tree Yoga School`, description: `Meet ${tree.species} and explore ${tree.themes.join(", ").toLowerCase()} through observation and a five-minute practice.` };
}

export default async function TreePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tree = getTree(slug);
  if (!tree) notFound();
  return (
    <>
      <SiteHeader />
      <main id="content" className="tree-page">
        <section className="tree-hero">
          <div className="tree-hero-copy">
            <Link className="lesson-back" href="/trees">Tree Library</Link>
            <p className="section-kicker">{tree.species} · <i>{tree.scientificName}</i></p>
            <h1>{tree.name}.</h1>
            <ul className="theme-list" aria-label="Contemplative themes">{tree.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>
            <p className="lesson-lede">{tree.invitation}</p>
            <div className="course-actions"><a className="button primary" href="#practice">Practice with a pine</a><a className="course-link" href="#energy">Explore its energy</a></div>
          </div>
          <figure className="tree-hero-image"><Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>Eastern white pine · Photo: F. D. Richards · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a> · <a href={tree.sourceUrl} target="_blank" rel="noreferrer">Source</a> · Resized and converted to WebP</figcaption></figure>
        </section>
        <nav className="tree-section-nav" aria-label="On this tree page"><a href="#meet">Meet the tree</a><a href="#energy">Energy & character</a><a href="#practice">Practice</a><a href="#roots">Roots in the book</a><a href="#notice">Notice for yourself</a></nav>
        <section id="meet" className="tree-section">
          <p className="section-kicker">01 · Meet the tree</p>
          <h2>A particular pine.<br />A particular place.</h2>
          <p className="section-lede">{tree.introduction}</p>
          <div className="tree-facts">{tree.identity.map((fact) => <article key={fact.title}><h3>{fact.title}</h3><p>{fact.text}</p></article>)}</div>
          <div className="tree-detail-grid">
            <figure><Image src="/images/trees/pine-needles.webp" alt="Close view of Eastern white pine needles growing in bundles along a twig" width={1024} height={768} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>Needle bundles · Tom Glasgow · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · <a href={tree.sourceUrl} target="_blank" rel="noreferrer">Source</a> · Converted to WebP</figcaption></figure>
            <figure><Image src="/images/trees/pine-bark.webp" alt="Textured bark on the trunk of an Eastern white pine" width={400} height={600} sizes="(max-width: 760px) 100vw, 35vw" /><figcaption>Bark · Nicholas A. Tonelli · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · <a href={tree.sourceUrl} target="_blank" rel="noreferrer">Source</a> · Converted to WebP</figcaption></figure>
          </div>
          <h3>Return across the seasons.</h3><p className="section-lede">{tree.seasons}</p>
          <p className="lesson-note">Botanical reference: <a href={tree.sourceUrl} target="_blank" rel="noreferrer">NC State Extension’s Eastern white pine profile</a>. This is a starting point for observation, not a complete identification key.</p>
        </section>
        <section id="energy" className="tree-section energy-section">
          <p className="section-kicker">02 · Energy & character</p>
          <h2>The energy of pine.</h2>
          <p className="section-lede">Three qualities to contemplate beside the tree. Begin with what you can observe, then see what meaning emerges for you.</p>
          <p className="energy-context">These pine-specific associations are new contemplative interpretations for the digital school. “Energy” here describes felt experience and symbolism; it is not a measured healing field or a promise of a particular effect.</p>
          <div className="energy-grid">{tree.energies.map((energy) => <article key={energy.title}><h3>{energy.title}</h3><p className="energy-observation">{energy.observation}</p><p>{energy.meaning}</p><p className="energy-question">{energy.question}</p></article>)}</div>
        </section>
        <section id="practice" className="tree-section">
          <p className="section-kicker">03 · Practice with this tree · About 5 minutes</p>
          <h2>One pine. One clear point.</h2>
          <p className="section-lede">A new observation meditation connecting the book’s one-pointed focus and perseverance to time beside a pine. Read once, then practice away from the screen.</p>
          <ol className="lesson-steps">{tree.practice.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
          <div className="tree-pause"><h3>Let the visit be enough.</h3><p>Spend about five minutes, or less if that suits you. Keep your device available when needed. No touching, collecting, controlled breathing, or tree-supported movement is required; leave the tree and its surroundings undisturbed.</p></div>
          <Link className="course-link" href="/lessons/meditation-with-a-tree">Continue with Meditation with a Tree</Link>
        </section>
        <section id="roots" className="tree-section tree-roots">
          <p className="section-kicker">04 · Roots in the book</p>
          <h2>Old roots. A new branch.</h2>
          <p className="section-lede">The book teaches attention and learning from trees. This page adds a species-specific encounter; it does not claim that the original book assigned these three energies to pine.</p>
          <div className="root-links">
            <article><h3>Choose a tree with care.</h3><p>Chapter 3 introduces three pathways and choosing an appropriate setting.</p><Link href="/book/who-and-how">Read the chapter companion</Link><a href={`${bookUrl}#page=18`} target="_blank" rel="noreferrer">Original: printed pp. 13–17</a></article>
            <article><h3>Begin small.</h3><p>Chapter 4 encourages a sustainable beginning with five or ten minutes.</p><Link href="/book/when-and-where">Read the chapter companion</Link><a href={`${bookUrl}#page=33`} target="_blank" rel="noreferrer">Original: printed p. 28</a></article>
            <article><h3>Return with attention.</h3><p>Chapter 6 explores one-pointed focus, perseverance, and presence. These principles inform the pine practice.</p><Link href="/book/wisdom-and-wonder">Explore Wisdom and Wonder</Link><a href={`${bookUrl}#page=105`} target="_blank" rel="noreferrer">Original: printed pp. 100–104</a></article>
          </div>
        </section>
        <section id="notice" className="tree-section tree-reflection">
          <p className="section-kicker">05 · Notice for yourself</p>
          <h2>{tree.reflection}</h2>
          <p>Reflect quietly or write a sentence in your own notebook. On another visit, look at the same detail again. Your experience may fit these themes, suggest something different, or simply be a few minutes of looking.</p>
          <div className="course-actions"><Link className="button primary" href="/trees">Return to the Tree Library</Link><Link className="button secondary" href="/book">Explore the book</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
