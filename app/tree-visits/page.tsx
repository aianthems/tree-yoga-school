import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import { treeVisits } from "../../lib/tree-visits";
import { championHref } from "../../lib/champion-links";

export const metadata: Metadata = {
  title: "Trees to Visit | Tree Yoga School",
  description: "Eight New England tree visits with arrival and parking guidance, walking details, access information, champion records, and a quiet practice for each encounter.",
};

export default function TreeVisitsPage() {
  return <><SiteHeader /><main id="content" className="explore-shell tree-visits-page">
    <section className="library-intro">
      <Link className="lesson-back" href="/champion-trees">← The Champion Map</Link>
      <p className="section-kicker">Out in the world · Five New England states</p>
      <h1>{treeVisits.length} trees.<br />A place to begin.</h1>
      <p className="lesson-lede">Choose a tree, plan a visit, and bring a little attention. Choose a forest walk, a garden outing, or a town or campus encounter. Each guide pairs practical visiting information with a simple practice.</p>
      <p>Visitor sources checked October 7, 2026. These are online source checks, not field inspections. Check the linked site guidance before travelling. Champion Map markers show approximate towns or counties; use each guide’s published location information to find the tree.</p>
      <nav className="tree-picker" aria-label="Choose a visit">{treeVisits.map(visit => <a key={visit.slug} href={`#${visit.slug}`}>{visit.state} · {visit.name}</a>)}</nav>
    </section>
    <div className="tree-visit-list">{treeVisits.map((visit, index) => <article className="tree-visit-card" id={visit.slug} key={visit.slug}>
      <div className="tree-visit-heading"><p className="section-kicker">Visit {String(index + 1).padStart(2, "0")} · {visit.kind} · {visit.place}</p><h2>{visit.name}</h2><p><i>{visit.scientificName}</i></p></div>
      <div className="tree-visit-columns"><div><h3>Arrival & parking</h3><p>{visit.arrival}</p><h3>Walking & terrain</h3><p>{visit.walking}</p><h3>Access, fees & seasons</h3><p>{visit.access}</p><p className="champion-location-note">Sources checked <time dateTime={visit.checked}>{new Date(`${visit.checked}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></p><ul className="tree-visit-sources">{visit.sources.map(source => <li key={source.href}><a href={source.href}>{source.label} ↗</a></li>)}</ul></div>
      <aside className="tree-visit-practice"><h3>A place to pause</h3><p>{visit.pause}</p><p className="section-kicker">A moment beside the tree</p><h3>{visit.practice.title}</h3><p>{visit.practice.text}</p><Link className="course-link" href={visit.practice.href}>{visit.practice.label} →</Link></aside></div>
      <Link className="button primary" href={championHref({ state: visit.state, selectedId: visit.championId })}>Open champion record →</Link>
    </article>)}</div>
    <div className="course-actions"><Link className="button secondary" href="/champion-trees">Explore the full Champion Map</Link><Link className="course-link" href="/trees">Get to know a species in the Tree Library →</Link></div>
  </main><SiteFooter /></>;
}
