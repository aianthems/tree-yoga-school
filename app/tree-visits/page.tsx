import { pageMetadata } from "../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { treeVisits, treeVisitStateCount, treeVisitSummary } from "../../lib/tree-visits";
import TreeVisitCard from "../components/tree-visit-card";

const pageInfo: Metadata = {
  title: "Trees to Visit | Tree Yoga School",
  description: treeVisitSummary,
};
export const metadata: Metadata = pageMetadata("/tree-visits", String(pageInfo.title), String(pageInfo.description));

export default function TreeVisitsPage() {
  return <><SiteHeader /><main id="content" className="explore-shell tree-visits-page">
    <section className="library-intro">
      <Link className="lesson-back" href="/champion-trees">← The Champion Map</Link>
      <p className="section-kicker">Out in the world · {treeVisitStateCount} states to explore</p>
      <h1>{treeVisits.length} visits.<br />A place to begin.</h1>
      <p className="lesson-lede">Choose a tree, plan a visit, and bring a little attention. Choose a forest walk, a garden outing, or a town or campus encounter. Each guide pairs practical visiting information with a simple practice.</p>
      <p>Each guide lists when its visitor sources were checked. These are online source checks, not field inspections. Check the linked site guidance before travelling. Champion Map markers show approximate towns or counties; use each guide’s published location information to find the tree.</p>
      <nav className="tree-picker" aria-label="Choose a visit">{treeVisits.map(visit => <a key={visit.slug} href={`#${visit.slug}`}>{visit.state} · {visit.name}</a>)}</nav>
    </section>
    <div className="tree-visit-list">{treeVisits.map((visit, index) => <TreeVisitCard visit={visit} index={index} key={visit.slug} />)}</div>
    <div className="course-actions"><Link className="button secondary" href="/champion-trees">Explore the full Champion Map</Link><Link className="course-link" href="/trees">Get to know a species in the Tree Library →</Link></div>
  </main><SiteFooter /></>;
}
