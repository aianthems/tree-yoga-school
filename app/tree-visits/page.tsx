import { pageMetadata } from "../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import { treeVisits, treeVisitStateCount, treeVisitSummary } from "../../lib/tree-visits";
import TreeVisitExplorer from "../components/tree-visit-explorer";
import { visitPreviews } from "../../lib/tree-visit-discovery";
import { stateNames } from "../../lib/champion-states";

const pageInfo: Metadata = {
  title: "Trees to Visit | Tree Yoga School",
  description: treeVisitSummary,
};
export const metadata: Metadata = pageMetadata("/tree-visits", String(pageInfo.title), String(pageInfo.description));

export default function TreeVisitsPage() {
  const states = [...new Set(treeVisits.map(visit => visit.state))].map(state => ({ value: state, label: stateNames[state] })).sort((a, b) => a.label.localeCompare(b.label));
  return <><SiteHeader /><main id="content" className="explore-shell tree-visits-page">
    <section className="library-intro">
      <Link className="lesson-back" href="/champion-trees">← The Champion Map</Link>
      <p className="section-kicker">Out in the world · {treeVisitStateCount} states to explore</p>
      <h1>{treeVisits.length} visits.<br />A place to begin.</h1>
      <p className="lesson-lede">Choose a tree, plan a visit, and bring a little attention. Choose a forest walk, a garden outing, or a town or campus encounter. Each guide pairs practical visiting information with a simple practice.</p>
      <p>Each guide lists when its visitor sources were checked. These are online source checks, not field inspections. Check the linked site guidance before travelling. Champion Map markers show approximate towns or counties; use each guide’s published location information to find the tree.</p>
    </section>
    <TreeVisitExplorer visits={visitPreviews(treeVisits)} states={states} />
    <section className="return-invitation"><h2>One visit can become a relationship.</h2><p>Return to a tree you can visit with permission. Keep a small journal, or help improve a guide with a dated correction.</p><div className="course-actions"><Link className="course-link" href="/return-to-your-tree">Try the return practice →</Link><Link className="course-link" href="/contact#contribute">Report a guide correction →</Link></div></section>
    <div className="course-actions"><Link className="button secondary" href="/champion-trees">Explore the full Champion Map</Link><Link className="course-link" href="/trees">Get to know a species in the Tree Library →</Link></div>
  </main></>;
}
