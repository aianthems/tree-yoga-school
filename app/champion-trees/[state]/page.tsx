import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import { StateRegisterNotes } from "../state-register-note";
import { championStates, type ChampionStateConfig } from "../../../lib/champion-states";
import { championTrees, championManifest } from "../../../lib/champion-tree-data";
import { championHref } from "../../../lib/champion-links";
import { placeName, formatChampionDate } from "../../../lib/champion-trees";
import { championStatePages, championStateFromSlug, championStateHref, statePageDescription, stateLibrarySpecies, stateNotableRecords } from "../../../lib/champion-state-pages";
import { trees } from "../../../lib/trees";
import { treeVisits } from "../../../lib/tree-visits";
import { pageMetadata } from "../../../lib/site-seo";

type Props = { params: Promise<{ state: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return championStatePages.map(page => ({ state: page.slug })); }
export async function generateMetadata({ params }: Props) {
  const code = championStateFromSlug((await params).state);
  if (!code) notFound();
  return pageMetadata(championStateHref(code), `${championStates[code].name} Champion Trees`, statePageDescription(code));
}
const sourceLabels: Record<string, string> = {
  registerUrl: "Published register", olderRegisterUrl: "Older register", announcementUrl: "Latest additions announcement", pdfUrl: "Register PDF", programUrl: "Tree program", workbookUrl: "Register workbook",
  nativeUrl: "Native tree register", nonNativeUrl: "Non-native tree register", floweringUrl: "Flowering tree register", conifersUrl: "Conifer register",
  scientificUrl: "Register by scientific name", commonUrl: "Register by common name", alphabeticalUrl: "Alphabetical register", countyUrl: "County register",
};
const number = (value: number | null, unit: string) => value === null ? "Not listed" : `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}${unit}`;

export default async function ChampionStatePage({ params }: Props) {
  const code = championStateFromSlug((await params).state);
  if (!code) notFound();
  const config: ChampionStateConfig = championStates[code];
  const records = championTrees.filter(tree => tree.state === code);
  const coverage = championManifest.find(state => state.state === code)!;
  const library = stateLibrarySpecies(records, trees);
  const visits = treeVisits.filter(visit => visit.state === code);
  const notable = stateNotableRecords(records);
  const sources = Object.entries(config.source).filter(([key, url]) => sourceLabels[key] && typeof url === "string");
  const mapHref = `${championHref({ state: code })}#explorer`;
  return <><SiteHeader /><main id="content" className="champion-state-page">
    <section className="champion-state-hero">
      <Link className="lesson-back" href="/champion-trees#registers">← All state registers</Link>
      <p className="section-kicker">Out in the world · {config.name}</p>
      <h1>{config.name}<br /><em>champion trees.</em></h1>
      <p className="lesson-lede">{code === "MS" ? "One documented tree from the 2024 national register. This is limited coverage, not a complete Mississippi state champion list." : "Remarkable trees, a place to begin. Explore the register, get to know the species, and bring a little attention outdoors."}</p>
      <div className="champion-stats"><span><strong>{coverage.listed.toLocaleString("en-US")}</strong> listed records</span><span><strong>{coverage.mapped.toLocaleString("en-US")}</strong> records with map points</span><span><strong>{library.length}</strong> Library species represented</span></div>
      <div className="course-actions"><Link className="button primary" href={mapHref} prefetch={false}>Explore the {config.name} map →</Link><a className="course-link" href="#register">Register & coverage ↓</a></div>
      <nav className="champion-state-jumps" aria-label="On this state page"><a href="#notable">Notable records</a><a href="#species">Library & practices</a><a href="#visits">Places to visit</a></nav>
    </section>
    <section className="champion-state-section" id="register" aria-labelledby="register-title">
      <p className="section-kicker">The register behind the map</p><h2 id="register-title">Dates, sources & coverage.</h2>
      <p className="champion-state-date">{config.sourceDate}</p>
      <div className="course-actions">{sources.map(([key, url]) => <a className="course-link" href={String(url)} key={key} target={String(url).startsWith("https:") ? "_blank" : undefined} rel="noreferrer">{sourceLabels[key]} ↗</a>)}</div>
      <p>{coverage.listed.toLocaleString("en-US")} records are included in this imported selection. {coverage.mapped.toLocaleString("en-US")} have approximate map points; {(coverage.listed - coverage.mapped).toLocaleString("en-US")} remain searchable without a marker. Multiple trees can share one town or county point.</p>
      <p>Register editions, retrieval dates, and individual measurement dates describe different things. This snapshot does not confirm current tree condition. Approximate map points do not locate individual trees or establish permission to visit.</p>
      <details className="champion-state-source-notes"><summary>How this register was selected and mapped</summary><StateRegisterNotes state={code} /><Link className="course-link" href={`/champion-trees#source-${code}`}>Full source links on the shared map →</Link></details>
    </section>
    <section className="champion-state-section" id="notable" aria-labelledby="notable-title">
      <p className="section-kicker">A glimpse of the register</p><h2 id="notable-title">Look up. Look closer.</h2>
      <p>These are up to four of the highest published heights in this imported selection, when available. Measurements come from different dates; this preview creates no new champion or national titles. Open a record for its status, measurement context, and source notes.</p>
      <div className="champion-state-records">{notable.map(record => <article key={record.id} className="champion-state-record">
        <p className="section-kicker">{placeName(record)}</p><h3>{record.commonName}</h3><p><i>{record.scientificName}</i></p>
        <dl><div><dt>Published height</dt><dd>{number(record.height, " ft")}</dd></div><div><dt>Published points</dt><dd>{number(record.points, "")}</dd></div></dl>
        <p className="champion-state-record-date">Date in record: {formatChampionDate(record.measured)}</p>
        <Link className="course-link" href={championHref({ state: code, selectedId: record.id })} prefetch={false}>Explore this record →</Link>
      </article>)}</div>
      {notable.length === 0 ? <p>No positive published heights are available for a height preview. The complete selection remains available in the map.</p> : null}
    </section>
    <section className="champion-state-section" id="species" aria-labelledby="species-title">
      <p className="section-kicker">From a record to a relationship</p><h2 id="species-title">Get to know the trees.</h2>
      <p>These Library species appear in {config.name}’s imported register. Explore identification, seasonal observations, and a practice beside a tree. Photographs are species references taken elsewhere. Matches use scientific names without regard to capitalization; botanical synonyms remain separate.</p>
      <div className="champion-state-species">{library.map(({ tree, count }) => <article key={tree.slug}>
        <Link href={`/trees/${tree.slug}`}><Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 600px) 85vw, (max-width: 1000px) 40vw, 22vw" /></Link>
        <div><p className="section-kicker">{count} {count === 1 ? "register record" : "register records"}</p><h3><Link href={`/trees/${tree.slug}`}>{tree.name}</Link></h3><p>{tree.invitation}</p><Link className="course-link" href={`/practice/${tree.slug}`}>Practice with {tree.name} →</Link><Link className="course-link" href={championHref({ state: code, species: tree.scientificName })} prefetch={false}>Find this species in {config.name} →</Link></div>
        <p className="champion-state-photo-credit">{tree.credit.photographer} · <a href={tree.credit.licenseUrl}>{tree.credit.license}</a> · <a href={tree.credit.sourceUrl}>Photo source ↗</a> · Converted to WebP</p>
      </article>)}</div>
      {library.length === 0 ? <p>No matching Library profiles are available yet. You can still <Link href="/practice/first-five-minutes">practice beside an ordinary tree nearby</Link>.</p> : null}
    </section>
    <section className="champion-state-section" id="visits" aria-labelledby="visits-title">
      <p className="section-kicker">A place to begin outdoors</p><h2 id="visits-title">Plan a thoughtful visit.</h2>
      {visits.length ? <><p>Our available {config.name} guides pair arrival and access information with a practice. A guide may feature an ordinary tree, a forest, or a champion; its inclusion here does not give it a champion title. Check current site guidance before travelling.</p><div className="champion-state-visits">{visits.map(visit => <article key={visit.slug}><p className="section-kicker">{visit.kind} · {visit.place}</p><h3><Link href={`/tree-visits/${visit.slug}`}>{visit.name}</Link></h3><p>{visit.pause}</p><Link className="course-link" href={`/tree-visits/${visit.slug}`}>Arrival, access & practice →</Link></article>)}</div></> : <><p>We have not published a {config.name} visit guide yet. Start with a tree you can visit with permission nearby, or explore our guides in other states.</p><div className="course-actions"><Link className="course-link" href="/practice/first-five-minutes">A five-minute practice with any tree →</Link><Link className="course-link" href="/tree-visits">Explore available visit guides →</Link></div></>}
      <div className="course-actions"><Link className="button primary" href={mapHref} prefetch={false}>Open the {config.name} map →</Link><Link className="course-link" href="/return-to-your-tree">Return to a familiar tree →</Link></div>
    </section>
    <nav className="champion-state-section champion-state-directory" aria-label="Explore another state"><p className="section-kicker">Keep exploring</p><h2>Another place. More wonder.</h2><div>{championStatePages.map(page => <Link href={championStateHref(page.state)} key={page.state} aria-current={page.state === code ? "page" : undefined} prefetch={false}>{page.name}</Link>)}</div></nav>
  </main></>;
}
