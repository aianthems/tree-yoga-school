import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import { treeComparisons, comparisonImage, additionalComparisonReferences } from "../../../lib/tree-comparisons";
import { getTree } from "../../../lib/trees";
import { pageMetadata } from "../../../lib/site-seo";

export const dynamicParams = false;
export function generateStaticParams() { return treeComparisons.map(({ slug }) => ({ slug })); }
function getPair(slug: string) { const pair = treeComparisons.find(pair => pair.slug === slug); if (!pair) notFound(); return pair; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const pair = getPair((await params).slug);
  return pageMetadata(`/compare-trees/${pair.slug}`, `${pair.title}: Compare Similar Trees | Tree Yoga School`, pair.lead);
}
export default async function CompareTrees({ params }: { params: Promise<{ slug: string }> }) {
  const pair = getPair((await params).slug);
  const species = pair.slugs.map(slug => getTree(slug)!);
  return <><SiteHeader /><main id="content" className="explore-shell comparison-page">
    <Link className="lesson-back" href="/trees#compare-trees">← Tree Library comparisons</Link>
    <header className="library-intro"><p className="section-kicker">Compare similar trees</p><h1>{pair.title}</h1><p className="lesson-lede">{pair.lead}</p><p>Observe from a permitted path. Use attached or naturally fallen material without picking or peeling. Photographs show individual examples, not every variation or a common scale.</p></header>
    <nav className="tree-section-nav" aria-label="Comparison features">{pair.features.map((feature, i) => <a key={feature.title} href={`#feature-${i}`}>{feature.title}</a>)}</nav>
    {pair.features.map((feature, i) => <section id={`feature-${i}`} className="comparison-feature" key={feature.title}>
      <h2>{feature.title}</h2><p>{feature.note}</p>
      <div className="comparison-grid">{species.map((tree, side) => {
        const photo = comparisonImage(feature.images[side]);
        return <article key={tree.slug}><h3>{tree.species}</h3><p className="comparison-scientific"><i>{tree.scientificName}</i></p><p className="comparison-clue">{feature.clues[side]}</p>
          <figure><Image src={photo.image} alt={photo.imageAlt} width={photo.imageWidth} height={photo.imageHeight} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>{photo.credit.label} · {photo.credit.photographer} · <a href={photo.credit.licenseUrl} target="_blank" rel="noreferrer">{photo.credit.license}</a> · <a href={photo.credit.sourceUrl} target="_blank" rel="noreferrer">Photo source ↗</a> · Resized where needed and converted to WebP</figcaption></figure>
        </article>;
      })}</div>
    </section>)}
    <section className="tree-section"><h2>Look again before you decide.</h2><p>These clues compare this pair; other species, hybrids, age, and growing conditions can complicate identification. If the features disagree, keep observing and consult a local field guide or knowledgeable person.</p>
      <p className="lesson-note">Botanical references checked October 10, 2026. NC State Extension: {species.map((tree, i) => <span key={tree.slug}>{i > 0 ? " · " : ""}<a href={tree.sourceUrl} target="_blank" rel="noreferrer">{tree.species}</a></span>)}.</p>
      {additionalComparisonReferences(pair.slug).length > 0 && <p className="lesson-note">Additional botanical references: {additionalComparisonReferences(pair.slug).map((reference, i) => <span key={reference.url}>{i > 0 ? " · " : ""}<a href={reference.url} target="_blank" rel="noreferrer">{reference.label}</a></span>)}.</p>}
      <div className="comparison-grid">{species.map(tree => <article key={tree.slug}><h3>{tree.species}</h3><div className="course-actions"><Link href={`/trees/${tree.slug}`} className="course-link">Meet the tree →</Link><Link href={`/practice/${tree.slug}`} className="course-link">Open outdoor practice →</Link></div></article>)}</div>
    </section>
    <nav className="comparison-other" aria-label="More tree comparisons">{treeComparisons.filter(other => other.slug !== pair.slug).map(other => <Link key={other.slug} href={`/compare-trees/${other.slug}`}>{other.title} →</Link>)}</nav>
  </main><SiteFooter /></>;
}
