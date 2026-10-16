"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { emptyVisitSelection, filterVisits, readVisitSelection, visitHref, visitTypes, type VisitPreview, type VisitSelection } from "../../lib/tree-visit-discovery";

const selectionEvent = "tree-visit-selection-change";
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(selectionEvent, onChange);
  return () => { window.removeEventListener("popstate", onChange); window.removeEventListener(selectionEvent, onChange); };
}
const browserSearch = () => window.location.search;
const serverSearch = () => "";

export default function TreeVisitExplorer({ visits, states }: { visits: VisitPreview[]; states: { value: string; label: string }[] }) {
  const search = useSyncExternalStore(subscribe, browserSearch, serverSearch);
  const selection = readVisitSelection(new URLSearchParams(search), visits);
  const results = filterVisits(visits, selection);
  const species = [...new Map(visits.map(v => [v.scientificName, v.species])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const filtered = Object.values(selection).some(Boolean);
  function update(patch: Partial<VisitSelection>) {
    const next = { ...readVisitSelection(new URLSearchParams(window.location.search), visits), ...patch };
    const href = visitHref(next);
    if (href !== window.location.pathname + window.location.search) {
      window.history.pushState(null, "", href + window.location.hash);
      window.dispatchEvent(new Event(selectionEvent));
    }
  }
  return <section aria-labelledby="visit-browse-title">
    <h2 id="visit-browse-title">Find your next tree.</h2>
    <form className="visit-filters" role="search" aria-label="Filter tree visits" onSubmit={event => event.preventDefault()}>
      <label>State<select value={selection.state} onChange={event => update({ state: event.target.value })}><option value="">All states</option>{states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}</select></label>
      <label>Species<select value={selection.species} onChange={event => update({ species: event.target.value })}><option value="">All species</option>{species.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Visit type<select value={selection.type} onChange={event => update({ type: event.target.value })}><option value="">All visit types</option>{visitTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
      <button className="button secondary" type="button" disabled={!filtered} onClick={() => update(emptyVisitSelection)}>Clear filters</button>
    </form>
    <p className="visit-result-count" role="status" aria-live="polite">{results.length} of {visits.length} visits{filtered ? " match your filters" : " to explore"}. Full guides include arrival, walking, access, sources, and a practice.</p>
    {results.length ? <div className="visit-preview-grid">{results.map(visit => <article className="visit-preview" key={visit.slug}>
      <p className="section-kicker">{states.find(state => state.value === visit.state)?.label} · {visit.kind}</p>
      <h3><Link href={`/tree-visits/${visit.slug}`}>{visit.name}</Link></h3>
      <p className="visit-preview-species">{visit.species} · <em>{visit.scientificName}</em></p>
      <p className="visit-preview-place">{visit.place}</p>
      <p className="visit-preview-practice">A practice to bring: {visit.practiceTitle}</p>
      <p className="visit-preview-date">Visitor sources checked <time dateTime={visit.checked}>{visit.checked}</time></p>
      <Link className="course-link" href={`/tree-visits/${visit.slug}`}>Plan this visit<span className="sr-only"> {visit.name}</span></Link>
      <Link className="course-link" href={visit.practiceHref}>Open the outdoor practice<span className="sr-only"> for {visit.name}</span></Link>
    </article>)}</div> : <div className="visit-empty"><h3>No visits match this combination yet.</h3><p>Try another state, species, or visit type to find a starting point.</p><button className="button secondary" type="button" onClick={() => update(emptyVisitSelection)}>Show all visits</button></div>}
  </section>;
}
