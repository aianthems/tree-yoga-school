"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ChampionMap from "./champion-map";
import { championTrees, formatMeasurement, librarySpecies, sourceWarnings, townKey, stateNames, nhChampionSource, vtChampionSource, meChampionSource, riChampionSource, ctChampionSource, type ChampionState, type ChampionTree } from "../../lib/champion-trees";

const townOptions = [...new Map(championTrees.map(tree => [townKey(tree), { key: townKey(tree), town: tree.mapTown || tree.town, state: tree.state }])).values()].sort((a, b) => a.town.localeCompare(b.town) || a.state.localeCompare(b.state));
const genera = [...new Set(championTrees.map(t => t.scientificName.split(" ")[0]))].sort();

function RecordDetails({ tree }: { tree: ChampionTree }) {
  const warnings = sourceWarnings(tree);
  const library = tree.state === "MA" && tree.sourceRow === 132 ? undefined : librarySpecies[tree.scientificName];
  const measured = tree.measured && /^\d{4}$/.test(tree.measured) ? tree.measured : tree.measured ? new Date(`${tree.measured}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Not listed";
  return <article className="champion-detail" aria-labelledby="selected-tree-title">
    <p className="section-kicker">{tree.town}, {tree.state} · {tree.county} {tree.state === "CT" ? "Planning Region" : "County"}</p>
    <h2 id="selected-tree-title">{tree.commonName}</h2><p className="champion-latin"><i>{tree.scientificName}</i></p>
    <div className="champion-measurements">
      <div><strong>{formatMeasurement(tree.height)}</strong><span>height · feet</span></div>
      <div><strong>{formatMeasurement(tree.circumference)}</strong><span>{tree.state === "NH" ? "circumference · as published" : "circumference · inches"}</span></div>
      <div><strong>{formatMeasurement(tree.crown)}</strong><span>crown spread · feet</span></div>
      <div><strong>{formatMeasurement(tree.points)}</strong><span>published points</span></div>
    </div>
    {tree.state === "NH" ? <><p><strong>Register status:</strong> State champion · Tree ID {tree.sourceRow}</p><p><strong>Nominated:</strong> {tree.nominated} (not a measurement date)</p></> : <p><strong>{tree.state === "VT" ? "Data collected:" : tree.state === "ME" ? "Last measured (year):" : "Measured:"}</strong> {measured}</p>}
    {tree.state === "CT" && <p className="champion-access"><strong>{tree.status}</strong> · Public access is not classified in this snapshot. The planning region is matched from Census geography.</p>}
    {tree.state === "RI" && <p className="champion-access"><strong>Rhode Island register · March 24, 2026 · {tree.status}</strong> · Public access is not specified in this register. {tree.county} County is matched from Census geography.</p>}
    {tree.state === "ME" && <p className="champion-access"><strong>Maine register · 2020 edition</strong> · Public access is not specified in this register.</p>}
    {tree.state === "VT" && <><p><strong>Register status:</strong> Confirmed champion · Record {tree.sourceRow}{tree.yearListed ? ` · Listed ${tree.yearListed}` : ""}</p><p className="champion-access"><strong>{tree.publicAccess ? "Public access listed by Vermont" : "Private property · no public access"}</strong>{tree.visibleFromPublic === "yes" && <span> · Source says visible from a road or public property; this does not grant entry.</span>}</p><p>{tree.accessDetails}</p></>}
    <h3>{tree.state === "CT" ? "Location published by Connecticut’s Notable Trees" : tree.state === "RI" ? "Location published by RI Tree Council" : tree.state === "ME" ? "Place listed by Maine Forest Service" : tree.state === "VT" ? "Published location notes" : tree.state === "NH" ? "Place listed by NH Big Trees" : "Location published by DCR"}</h3><p>{tree.state === "ME" ? `${tree.town}. The register gives a town or township, without a street address or tree coordinates. ${tree.county} County is matched from official geography.` : tree.state === "VT" ? tree.location || "No additional location notes are published." : tree.state === "NH" ? `${tree.town}, ${tree.county} County. The register does not publish a street address or tree coordinates for this record.` : tree.location || "No location disclosed in this list. Only the town is provided."}</p>
    <p className="champion-location-note">The marker is an approximate municipality point, not the tree’s position. {(tree.location || tree.publicCoordinates) ? "Confirm current visiting guidance with the landowner or site before visiting." : "An exact location has not been inferred."}</p>
    {tree.notes && <p><strong>Source notes:</strong> {tree.notes}</p>}
    {warnings.length > 0 && <div className="champion-source-note"><h3>Source note</h3>{warnings.map(warning => <p key={warning}>{warning}</p>)}</div>}
    <div className="course-actions">
      {(tree.state === "MA" || tree.state === "RI" || tree.state === "CT") && tree.location && <a className="button secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tree.location}, ${tree.mapTown ? `${tree.town}, ${tree.mapTown}` : tree.town}, ${stateNames[tree.state]}`)}`} target="_blank" rel="noreferrer">Search the published location ↗</a>}
      {tree.state === "VT" && tree.publicAccess && tree.publicCoordinates && <a className="button secondary" href={`https://www.google.com/maps/search/?api=1&query=${tree.publicCoordinates.lat},${tree.publicCoordinates.lng}`} target="_blank" rel="noreferrer">Open Vermont’s published tree location ↗</a>}
      {library && <Link className="course-link" href={`/trees/${library.slug}`}>Explore {library.name} energy & practice</Link>}
    </div>
    {tree.state === "CT" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Connecticut’s Notable Trees · Tree ID {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Names, measurements, measurement dates, and champion designations are retained from the register. <a href={ctChampionSource.registerUrl} target="_blank" rel="noreferrer">Connecticut champion list ↗</a></p> : tree.state === "RI" ? <p className="champion-record-source"><a href={riChampionSource.registerUrl} target="_blank" rel="noreferrer">RI Tree Council champion register · March 24, 2026 · row {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Original names, measurements, locations, ranks, and scores are retained. The edition date is not a measurement date.</p> : tree.state === "ME" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Maine Register of Big Trees · 2020 · PDF page {tree.sourcePage} ↗</a> · retrieved October 6, 2026. Original names, symbols, measurements, and scores are retained. This dated register does not confirm current tree conditions. <a href={meChampionSource.programUrl} target="_blank" rel="noreferrer">Maine Forest Service program ↗</a></p> : tree.state === "VT" ? <p className="champion-record-source"><a href={vtChampionSource.registerUrl} target="_blank" rel="noreferrer">Vermont Big Tree List ↗</a> · <a href={tree.sourceUrl} target="_blank" rel="noreferrer">Source record {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Measurements and access labels are shown as published. Vermont reports the program is temporarily on hold following a staffing transition.</p> : tree.state === "NH" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">NH Big Trees register · Tree ID {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Circumference units are not specified in the table; values are retained as published. <a href={nhChampionSource.publicMapUrl} target="_blank" rel="noreferrer">UNH’s public visiting map ↗</a> lists a separate selection of trees open to visitors.</p> : <p className="champion-record-source">DCR Champion Trees · May 2026 workbook · row {tree.sourceRow}. Values shown as published.</p>}
  </article>;
}

export default function ChampionExplorer() {
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");
  const [genus, setGenus] = useState("");
  const [publicOnly, setPublicOnly] = useState(false);
  const [locationsOnly, setLocationsOnly] = useState(false);
  const [sort, setSort] = useState("name");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const detail = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return championTrees.filter(t => (!state || t.state === state) && (!county || t.county === county) && (!town || townKey(t) === town) && (!genus || t.scientificName.split(" ")[0] === genus) && (!locationsOnly || Boolean(t.location || t.publicCoordinates)) && (!publicOnly || t.publicAccess === true) && words.every(word => `${stateNames[t.state]} ${t.state} ${t.mapTown || ""} ${t.commonName} ${t.scientificName} ${t.town} ${t.county} ${t.location || ""} ${t.notes || ""}`.toLowerCase().includes(word))).sort((a, b) => {
      if (sort === "height") return (b.height ?? -1) - (a.height ?? -1) || a.sourceRow - b.sourceRow;
      if (sort === "points") return (b.points ?? -1) - (a.points ?? -1) || a.sourceRow - b.sourceRow;
      if (sort === "town") return a.town.localeCompare(b.town) || a.commonName.localeCompare(b.commonName);
      return a.commonName.localeCompare(b.commonName) || a.sourceRow - b.sourceRow;
    });
  }, [state, query, county, town, genus, locationsOnly, publicOnly, sort]);
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    results.forEach(t => counts.set(townKey(t), (counts.get(townKey(t)) || 0) + 1));
    return townOptions.filter(t => counts.has(t.key)).map(t => ({ ...t, count: counts.get(t.key)! }));
  }, [results]);
  const counties = [...new Set(championTrees.filter(t => !state || t.state === state).map(t => t.county))].sort();
  const selected = results.find(t => t.id === selectedId);
  const selectTown = useCallback((value: string) => {
    setTown(value); setSelectedId(null);
    resultsHeading.current?.focus({ preventScroll: true });
  }, []);
  function reset() {
    setState(""); setQuery(""); setCounty(""); setTown(""); setGenus(""); setLocationsOnly(false); setPublicOnly(false); setSort("name"); setSelectedId(null); setResetKey(key => key + 1);
  }
  function selectRecord(tree: ChampionTree) {
    setSelectedId(tree.id);
    requestAnimationFrame(() => { detail.current?.focus({ preventScroll: true }); detail.current?.scrollIntoView({ block: "nearest", behavior: "auto" }); });
  }
  return <section className="champion-explorer" aria-label="Explore champion trees">
    <div className="champion-toolbar">
      <label>State<select aria-label="State" value={state} onChange={e => { setState(e.target.value); setCounty(""); setTown(""); setSelectedId(null); }}><option value="">All states</option>{(Object.keys(stateNames) as ChampionState[]).map(code => <option key={code} value={code}>{stateNames[code]} · {championTrees.filter(t => t.state === code).length} records</option>)}</select></label>
      <label className="champion-search">Find a tree, town, or place<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try pine, Portland, or Smith College…" /></label>
      <label>County or planning region<select aria-label="County or planning region" value={county} onChange={e => { setCounty(e.target.value); setTown(""); }}><option value="">All counties & regions</option>{counties.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Town, city, or township<select aria-label="Town, city, or township" value={town} onChange={e => setTown(e.target.value)}><option value="">All towns & townships</option>{townOptions.filter(t => (!state || t.state === state) && (!county || championTrees.some(r => townKey(r) === t.key && r.county === county))).map(t => <option key={t.key} value={t.key}>{t.town}, {t.state}</option>)}</select></label>
      <label>Tree genus<select aria-label="Tree genus" value={genus} onChange={e => setGenus(e.target.value)}><option value="">All genera</option>{genera.map(g => <option key={g}>{g}</option>)}</select></label>
    </div>
    <div className="champion-filter-bar"><label className="champion-check"><input type="checkbox" checked={locationsOnly} onChange={e => setLocationsOnly(e.target.checked)} /> With a published location</label><label className="champion-check"><input type="checkbox" checked={publicOnly} onChange={e => setPublicOnly(e.target.checked)} /> Source confirms public access</label><button type="button" className="champion-text-button" onClick={reset}>Reset all filters & map</button><a className="champion-text-button" href="#champion-results">Skip to tree results ↓</a></div>
    {publicOnly && <p className="champion-location-note" role="status">Showing only records whose source explicitly confirms public access. Access information is currently available for Vermont; MA, NH, Maine, Rhode Island, and Connecticut records have not been classified.</p>}
    <p className="champion-map-note"><span aria-hidden="true">●</span> Numbers show matching tree records. Nearby towns group together when zoomed out; select a group to zoom in, then select a town to browse its trees. All markers are approximate municipality points.</p>
    <div className="champion-workspace">
      <div className="champion-map-column"><ChampionMap groups={groups} selectedTown={selected ? townKey(selected) : town || null} onTown={selectTown} resetKey={resetKey} />
        <div ref={detail} className="champion-detail-region" tabIndex={-1} aria-label="Selected tree details">
          {selected ? <RecordDetails tree={selected} /> : <div className="champion-detail-empty"><p className="section-kicker">A closer look</p><h2>Every champion has a place.</h2><p>Select a tree in the list to see its measurements, published location, and notes. The map helps you explore the region; the record tells you what the source program has shared.</p></div>}
        </div>
      </div>
      <div className="champion-results" id="champion-results">
        <div className="champion-results-header"><h2 ref={resultsHeading} tabIndex={-1}>Tree records</h2><p role="status" aria-live="polite">{results.length} {results.length === 1 ? "record" : "records"} in {groups.length} {groups.length === 1 ? "town" : "towns"}{town ? ` · ${townOptions.find(t => t.key === town)?.town}, ${town.split(":")[0]}` : ""}</p>
          {town && <button className="champion-text-button" type="button" onClick={() => setTown("")}>Show all towns</button>}
          <label>Sort by<select aria-label="Sort by" value={sort} onChange={e => setSort(e.target.value)}><option value="name">Tree name</option><option value="town">Town</option><option value="height">Tallest first</option><option value="points">Published points</option></select></label>
        </div>
        {results.length ? <ul className="champion-result-list">{results.map(tree => <li key={tree.id}><button type="button" className={`champion-result${selected?.id === tree.id ? " is-selected" : ""}`} aria-pressed={selected?.id === tree.id} onClick={() => selectRecord(tree)}>
          <span className="champion-result-town">{tree.town}, {tree.state} · {tree.county}</span><strong>{tree.commonName}</strong><i>{tree.scientificName}</i><span>{tree.location || (tree.publicCoordinates ? "Public tree coordinates published" : "Location not disclosed")}</span>{tree.state === "CT" && <span>{tree.status} · access unclassified</span>}{tree.state === "RI" && <span>2026 register · access not specified</span>}{tree.state === "ME" && <span>2020 register · access not specified</span>}{tree.state === "VT" && <span>{tree.publicAccess ? "Public access listed" : "Private · no public access"}</span>}<span className="champion-result-metrics">{formatMeasurement(tree.height)} ft tall · {formatMeasurement(tree.points)} points</span><span className="champion-result-open">Explore this record →</span>
        </button></li>)}</ul> : <div className="champion-no-results"><h3>No trees match these filters.</h3><p>Try a broader search or return to the full list.</p><button type="button" className="button secondary" onClick={reset}>Show all {championTrees.length} records</button></div>}
      </div>
    </div>
  </section>;
}
