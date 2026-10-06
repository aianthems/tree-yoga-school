import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import ChampionExplorer from "./champion-explorer";
import { championTrees, championSource } from "../../lib/champion-trees";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Massachusetts Champion Tree Map | Tree Yoga School",
  description: "Explore 139 Massachusetts champion tree records from DCR’s May 2026 list. Browse an interactive town map, measurements, published locations, and tree practices.",
};

export default function ChampionTreesPage() {
  return <><SiteHeader /><main id="content" className="champion-page">
    <section className="champion-intro">
      <Link className="lesson-back" href="/trees">The Tree Library · Out in the world</Link>
      <p className="section-kicker">Massachusetts · DCR Champion Trees · May 2026</p>
      <h1>Meet the giants<br />among us.</h1>
      <p className="lesson-lede">Remarkable trees, rooted in real places. Explore Massachusetts’ champion trees, discover their scale, and let curiosity lead you into a deeper relationship with the trees around you.</p>
      <div className="champion-stats"><span><strong>{championTrees.length}</strong> tree records</span><span><strong>{new Set(championTrees.map(t => t.town)).size}</strong> towns & cities</span><span><strong>{championTrees.filter(t => t.location).length}</strong> published location descriptions</span></div>
    </section>
    <ChampionExplorer />
    <section className="champion-about" aria-labelledby="about-champions">
      <div><p className="section-kicker">Reading the register</p><h2 id="about-champions">What makes a champion?</h2><p>DCR’s champion score combines trunk circumference in inches, height in feet, and one quarter of average crown spread in feet. A champion’s distinction is its size within its species or category; the score does not measure age.</p><p className="champion-formula">Circumference + height + ¼ crown spread = points</p><p>Measurements and scores appear as published, including zeros and occasional discrepancies. Measurement dates vary. This map is a snapshot of the May 2026 workbook, not a live register or a confirmation of a tree’s current condition.</p></div>
      <div><p className="section-kicker">A thoughtful visit</p><h2>Let the tree be your teacher.</h2><p>The workbook contains no tree coordinates. Every marker represents an approximate town center, grouping all matching records in that town. A published address or site name does not establish public access. Check the landowner or site’s visiting guidance before setting out; request permission for private property.</p><p>You can practice with an ordinary tree nearby, too. Take a few minutes to notice its form, the life around it, and what changes when you give it your attention.</p><Link className="course-link" href="/lessons/first-five-minutes">Your First Five Minutes with a Tree</Link></div>
    </section>
    <section className="champion-sources" aria-label="Map sources"><h2>Sources & map notes</h2><p>Tree records: the supplied Massachusetts DCR Champion Trees workbook, May 2026. Original names, measurements, location descriptions, and notes are retained. Missing locations stay undisclosed.</p><p>Approximate town centers: MassGIS municipal polygon centroids, retrieved October 6, 2026. The source’s “Manchester” is mapped to Manchester-by-the-Sea. Map tiles: © OpenStreetMap contributors. Tree Yoga School created this independent exploration of the register.</p><div className="course-actions"><a className="course-link" href={championSource.workbookUrl} download>Download the original list (.xlsx)</a><a className="course-link" href={championSource.programUrl} target="_blank" rel="noreferrer">DCR Legacy Tree Program</a><a className="course-link" href={championSource.geographyUrl} target="_blank" rel="noreferrer">MassGIS geography</a></div></section>
  </main><SiteFooter /></>;
}
