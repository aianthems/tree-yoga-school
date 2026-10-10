import { pageMetadata } from "../../../lib/site-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TreeComparisonLinks from "../../components/tree-comparison-links";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { getTree, trees } from "../../../lib/trees";
import { championHref } from "../../../lib/champion-links";
import { relatedLibraryTrees } from "../../../lib/tree-library-related";
import { bookUrl } from "../../../lib/intro-lessons";

export const dynamicParams = false;
export function generateStaticParams() { return trees.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tree = getTree(slug);
  if (!tree) notFound();
  return pageMetadata(`/trees/${slug}`, `${tree.name}: Energy & Practice | Tree Yoga School`, `Meet ${tree.species} and explore ${tree.themes.join(", ").toLowerCase()} through observation and a five-minute practice.`);
}

export default async function TreePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tree = getTree(slug);
  if (!tree) notFound();
  const suggestions = relatedLibraryTrees(tree, trees);
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
            <div className="course-actions"><a className="button primary" href="#practice">Practice with {tree.name}</a><a className="course-link" href="#energy">Explore its energy</a></div>
          </div>
          <figure className="tree-hero-image"><Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 760px) 100vw, 50vw" priority /><figcaption>{tree.credit.label} · Photo: {tree.credit.photographer} · <a href={tree.credit.licenseUrl} target="_blank" rel="noreferrer">{tree.credit.license}</a> · <a href={tree.credit.sourceUrl} target="_blank" rel="noreferrer">Source</a> · Converted to WebP</figcaption></figure>
        </section>
        <nav className="tree-section-nav" aria-label="On this tree page"><a href="#meet">Meet the tree</a><a href="#energy">Energy & character</a><a href="#practice">Practice</a><a href="#roots">Roots in the book</a><a href="#notice">Notice for yourself</a></nav>
        <section id="meet" className="tree-section">
          <p className="section-kicker">01 · Meet the tree</p>
          <h2>Meet {tree.species.toLowerCase()}.</h2>
          <p className="section-lede">{tree.introduction}</p>
          <div className="tree-facts">{tree.identity.map((fact) => <article key={fact.title}><h3>{fact.title}</h3><p>{fact.text}</p></article>)}</div>
          {tree.detailImages.length > 0 && <><h3>Look closer.</h3><p>Compare several features, and notice how age and season change their appearance. These photographs are starting points for observation; leave living leaves, needles, cones, and bark attached.</p><div className="tree-detail-grid">
            {tree.detailImages.map((detail) => <figure key={detail.image}><Image src={detail.image} alt={detail.imageAlt} width={detail.imageWidth} height={detail.imageHeight} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>{detail.credit.label} · {detail.credit.photographer} · <a href={detail.credit.licenseUrl} target="_blank" rel="noreferrer">{detail.credit.license}</a> · <a href={detail.credit.sourceUrl} target="_blank" rel="noreferrer">Source</a> · Converted to WebP</figcaption></figure>)}
          </div></>}
          <div className="course-actions"><Link className="button secondary" href={championHref({ species: tree.scientificName })}>Explore champion {tree.species.toLowerCase()} trees →</Link></div>
          <TreeComparisonLinks treeSlug={tree.slug} />
          <h3>Return across the seasons.</h3><p className="section-lede">{tree.seasons}</p>
          <p className="lesson-note">Botanical reference: <a href={tree.sourceUrl} target="_blank" rel="noreferrer">{tree.sourceLabel ?? `NC State Extension’s ${tree.species.toLowerCase()} profile`}</a>. This is a starting point for observation, not a complete identification key.</p>
          {tree.additionalSources?.map(source => <p className="lesson-note" key={source.url}>Explore the habitat: <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>.</p>)}
        </section>
        <section id="energy" className="tree-section energy-section">
          <p className="section-kicker">02 · Energy & character</p>
          <h2>The energy of {tree.name.toLowerCase()}.</h2>
          <p className="section-lede">Three qualities to contemplate beside the tree. Begin with what you can observe, then see what meaning emerges for you.</p>
          <p className="energy-context">These tree-specific associations are new contemplative interpretations for the digital school. “Energy” here describes felt experience and symbolism; it is not a measured healing field or a promise of a particular effect.</p>
          <div className="energy-grid">{tree.energies.map((energy) => <article key={energy.title}><h3>{energy.title}</h3><p className="energy-observation">{energy.observation}</p><p>{energy.meaning}</p><p className="energy-question">{energy.question}</p></article>)}</div>
        </section>
        <section id="practice" className="tree-section">
          <p className="section-kicker">03 · Practice with this tree · About 5 minutes</p>
          <h2>{tree.practiceTitle}</h2>
          <p className="section-lede">{tree.practiceIntroduction}</p>
          <Link className="button primary" href={`/practice/${tree.slug}`}>Open outdoor practice →</Link>
          <ol className="lesson-steps">{tree.practice.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
          <div className="tree-pause"><h3>Let the visit be enough.</h3><p>Spend about five minutes, or less if that suits you. Keep your device available when needed. No touching, collecting, controlled breathing, or tree-supported movement is required; leave the tree and its surroundings undisturbed.</p></div>
          <Link className="course-link" href="/lessons/meditation-with-a-tree">Continue with Meditation with a Tree</Link>
        </section>
        <section id="roots" className="tree-section tree-roots">
          <p className="section-kicker">04 · Roots in the book</p>
          <h2>Old roots. A new branch.</h2>
          <p className="section-lede">The book teaches attention and learning from trees. This page adds a species-specific encounter; it does not claim that the original book assigned these three energies to {tree.name.toLowerCase()}.</p>
          <div className="root-links">
            <article><h3>Choose a tree with care.</h3><p>Chapter 3 introduces three pathways and choosing an appropriate setting.</p><Link href="/book/who-and-how">Read the chapter companion</Link><a href={`${bookUrl}#page=18`} target="_blank" rel="noreferrer">Original: printed pp. 13–17</a></article>
            <article><h3>Begin small.</h3><p>Chapter 4 encourages a sustainable beginning with five or ten minutes.</p><Link href="/book/when-and-where">Read the chapter companion</Link><a href={`${bookUrl}#page=33`} target="_blank" rel="noreferrer">Original: printed p. 28</a></article>
            <article><h3>Return with attention.</h3><p>{tree.principles} connect this new practice with Chapter 6’s invitations to learn from trees.</p><Link href="/book/wisdom-and-wonder">Explore Wisdom and Wonder</Link><a href={`${bookUrl}#page=101`} target="_blank" rel="noreferrer">Original: Chapter 6, printed pp. 96–124</a></article>
          </div>
        </section>
        <section id="notice" className="tree-section tree-reflection">
          <p className="section-kicker">05 · Notice for yourself</p>
          <h2>{tree.reflection}</h2>
          <p>Reflect quietly or write a sentence in your own notebook. On another visit, look at the same detail again. Your experience may fit these themes, suggest something different, or simply be a few minutes of looking.</p>
          {suggestions.length > 0 && <nav className="tree-neighbors tree-related" aria-label="Related trees to explore"><p className="section-kicker">Keep exploring · Related trees</p>{suggestions.map(({ tree: other, reason }) => <Link key={other.slug} href={`/trees/${other.slug}`}><span>{other.name}</span><small>{reason}</small></Link>)}</nav>}
          <div className="course-actions"><Link className="button primary" href="/trees">Return to the Tree Library</Link><Link className="button secondary" href="/book">Explore the book</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
