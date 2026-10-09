import Link from "next/link";
import type { TreeVisit } from "../../lib/tree-visits";
import { championHref } from "../../lib/champion-links";
import { stateNames } from "../../lib/champion-trees";
export default function TreeVisitCard({ visit, index, standalone = false }: { visit: TreeVisit; index: number; standalone?: boolean }) {
  return <article className="tree-visit-card" id={visit.slug} >
      <div className="tree-visit-heading"><p className="section-kicker">Visit {String(index + 1).padStart(2, "0")} · {visit.kind} · {visit.place}</p>{standalone ? <h1>{visit.name}</h1> : <h2><Link href={`/tree-visits/${visit.slug}`}>{visit.name}</Link></h2>}<p><i>{visit.scientificName}</i></p></div>
      <div className="tree-visit-columns"><div><h3>Arrival & parking</h3><p>{visit.arrival}</p><h3>Walking & terrain</h3><p>{visit.walking}</p><h3>Access, fees & seasons</h3><p>{visit.access}</p><p className="champion-location-note">Sources checked <time dateTime={visit.checked}>{new Date(`${visit.checked}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></p><ul className="tree-visit-sources">{visit.sources.map(source => <li key={source.href}><a href={source.href}>{source.label} ↗</a></li>)}</ul></div>
      <aside className="tree-visit-practice"><h3>A place to pause</h3><p>{visit.pause}</p><p className="section-kicker">A moment beside the tree</p><h3>{visit.practice.title}</h3><p>{visit.practice.text}</p><Link className="button secondary" href={visit.practice.href.startsWith("/trees/") ? `/practice/${visit.practice.href.split("/")[2].split("#")[0]}` : "/practice/first-five-minutes"}>Open outdoor practice →</Link><Link className="course-link" href={visit.practice.href}>{visit.practice.label} →</Link></aside></div>
      <Link className="button primary" href={visit.championId ? championHref({ state: visit.state, selectedId: visit.championId }) : championHref({ state: visit.state })}>{visit.championId ? "Open champion record →" : `Explore ${stateNames[visit.state]} champion trees →`}</Link>
    </article>;
}
