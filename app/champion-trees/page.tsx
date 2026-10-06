import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import ChampionExplorer from "./champion-explorer";
import { championTrees, championSource, nhChampionSource, townKey } from "../../lib/champion-trees";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Massachusetts & New Hampshire Champion Tree Map | Tree Yoga School",
  description: "Explore 139 Massachusetts champion tree records and 93 New Hampshire state champions. Browse an interactive town map, measurements, source records, and tree practices.",
};

export default function ChampionTreesPage() {
  return <><SiteHeader /><main id="content" className="champion-page">
    <section className="champion-intro">
      <Link className="lesson-back" href="/trees">The Tree Library · Out in the world</Link>
      <p className="section-kicker">Massachusetts & New Hampshire · Champion Tree Map</p>
      <h1>Meet the giants<br />among us.</h1>
      <p className="lesson-lede">Remarkable trees, rooted in real places. Explore Massachusetts’ champion trees and New Hampshire’s state champions, discover their scale, and let curiosity lead you into a deeper relationship with the trees around you.</p>
      <div className="champion-stats"><span><strong>{championTrees.length}</strong> tree records</span><span><strong>{new Set(championTrees.map(townKey)).size}</strong> towns & cities</span><span><strong>2</strong> states to explore</span></div>
    </section>
    <ChampionExplorer />
    <section className="champion-about" aria-labelledby="about-champions">
      <div><p className="section-kicker">Reading the register</p><h2 id="about-champions">What makes a champion?</h2><p>A champion’s distinction is its size within its species or category; the score does not measure age. DCR’s champion score combines trunk circumference in inches, height in feet, and one quarter of average crown spread in feet.</p><p className="champion-formula">Circumference + height + ¼ crown spread = points</p><p>Measurements and scores appear as published, including zeros and occasional discrepancies. NH’s table labels height and crown spread in feet, but does not specify circumference units. NH detail cards retain those values without assigning units; nomination dates are not measurement dates.</p><p>This map combines Massachusetts’ May 2026 workbook with the NH register retrieved October 6, 2026. It is a snapshot, not a live register or confirmation of current tree conditions. Only NH entries marked “State” are included. Multiple state-designated records for a species are retained; county-only and historical-status entries are excluded.</p></div>
      <div><p className="section-kicker">A thoughtful visit</p><h2>Let the tree be your teacher.</h2><p>Every marker represents an approximate municipality point, grouping matching records in that town. These source records contain no individual-tree coordinates. Massachusetts sometimes publishes an address or site; NH’s register provides a town and county. A place name does not establish public access. Check visiting guidance and request permission for private property.</p><p>For NH outings, <a href={nhChampionSource.publicMapUrl} target="_blank" rel="noreferrer">UNH’s public Big Tree Map ↗</a> offers a separate selection of trees on public property or land open to visitors. Its selection includes different champion levels and is not the same as this state-only list.</p><p>You can practice with an ordinary tree nearby, too. Take a few minutes to notice its form, the life around it, and what changes when you give it your attention.</p><Link className="course-link" href="/lessons/first-five-minutes">Your First Five Minutes with a Tree</Link></div>
    </section>
    <section className="champion-sources" aria-label="Map sources"><h2>Sources & map notes</h2>
      <h3>Massachusetts · 139 records</h3><p>The supplied Massachusetts DCR Champion Trees workbook, May 2026. Original names, measurements, location descriptions, and notes are retained. Approximate town centers come from MassGIS municipal polygon centroids retrieved October 6, 2026. “Manchester” is mapped to Manchester-by-the-Sea.</p>
      <div className="course-actions"><a className="course-link" href={championSource.workbookUrl} download>Download the original MA list (.xlsx)</a><a className="course-link" href={championSource.programUrl} target="_blank" rel="noreferrer">DCR Legacy Tree Program ↗</a><a className="course-link" href={championSource.geographyUrl} target="_blank" rel="noreferrer">MassGIS geography ↗</a></div>
      <h3>New Hampshire · 93 state-designated records</h3><p>NH Big Trees’ public register, retrieved October 6, 2026. These records cover 77 scientific-name labels. Original names, measurements, nomination dates, tree IDs, and status designations are preserved. Each detail card links to its source table page; look for the listed Tree ID.</p><p>Approximate NH municipality points come from the U.S. Census Bureau’s 2025 County Subdivisions Gazetteer. East Swanzey uses Swanzey’s point, Rye Beach uses Rye’s, Sanbornville uses Wakefield’s, and “W. Franklin” uses Franklin’s. The source spelling “Boscowen” is interpreted as Boscawen in Merrimack County. Cards retain the original place names and explain these mappings. Points do not locate villages or individual trees.</p>
      <div className="course-actions"><a className="course-link" href={nhChampionSource.registerUrl} target="_blank" rel="noreferrer">NH Big Trees register ↗</a><a className="course-link" href={nhChampionSource.programUrl} target="_blank" rel="noreferrer">NH Big Tree Program ↗</a><a className="course-link" href={nhChampionSource.geographyUrl} target="_blank" rel="noreferrer">Census geography ↗</a></div>
      <p>Map tiles: © OpenStreetMap contributors. Tree Yoga School created this independent exploration of the two registers.</p>
    </section>
  </main><SiteFooter /></>;
}
