import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import TreeVisitCard from "../../components/tree-visit-card";
import { treeVisits } from "../../../lib/tree-visits";
import { pageMetadata } from "../../../lib/site-seo";
export const dynamicParams = false;
export function generateStaticParams() { return treeVisits.map(({ slug }) => ({ slug })); }
function getVisit(slug: string) { const visit = treeVisits.find(visit => visit.slug === slug); if (!visit) notFound(); return visit; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const visit = getVisit((await params).slug);
  return pageMetadata(`/tree-visits/${visit.slug}`, `${visit.name}: Visit Guide | Tree Yoga School`, `Plan a visit to ${visit.place}. Arrival, parking, walking, access information, and a linked outdoor practice.`);
}
export default async function VisitGuide({ params }: { params: Promise<{ slug: string }> }) {
  const visit = getVisit((await params).slug);
  return <><SiteHeader /><main id="content" className="explore-shell tree-visits-page">
    <section className="library-intro"><Link className="lesson-back" href="/tree-visits">← All Trees to Visit</Link><p>Visitor sources were checked online, not through a field inspection. Check the linked site guidance before travelling.</p></section>
    <TreeVisitCard visit={visit} index={treeVisits.indexOf(visit)} standalone />
    <div className="course-actions"><Link className="button secondary" href="/tree-visits">Explore more visits</Link><Link className="course-link" href="/trees">Explore the Tree Library →</Link></div>
  </main><SiteFooter /></>;
}
