import Image from "next/image";
import Link from "next/link";
import { treeVisits } from "../../lib/tree-visits";

const slugs = ["gifford-old-growth", "bretzfelder-white-pine", "the-rocks-woodland", "arnold-hemlock-hill", "vaughan-hemlock-woods"];
const visits = slugs.map(slug => treeVisits.find(visit => visit.slug === slug)!);

export default function HomeTreeVisits() {
  const featured = visits[0];
  const photo = featured.destinationPhotos![0];
  return <section className="home-outings section-shell" aria-labelledby="home-outings-title">
    <div className="section-heading"><p className="section-kicker">Trees to Visit · New England</p><h2 id="home-outings-title">Find your next place to pause.</h2><p>Five woodland outings, with arrival details, walking routes, fees, and a practice to take outside.</p></div>
    <div className="home-outings-grid">
      <figure><Link href={`/tree-visits/${featured.slug}`} prefetch={false}><Image src={photo.image} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 760px) 90vw, 42vw" unoptimized /></Link><figcaption>Gifford Woods, Vermont · {photo.photographer} · <a href={photo.sourceUrl}>Photo source</a> · <a href={photo.licenseUrl}>{photo.license}</a></figcaption></figure>
      <nav className="home-outings-links" aria-label="New England tree outings">{visits.map(visit => <Link href={`/tree-visits/${visit.slug}`} prefetch={false} key={visit.slug}><strong>{visit.name}</strong><span>{visit.place}</span><small>{visit.outing!.distance}</small><span className="course-link">Plan your visit →</span></Link>)}</nav>
    </div>
    <Link className="button secondary" href="/tree-visits">Explore all Trees to Visit →</Link>
  </section>;
}
