"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ChampionMap from "./champion-map";
import { championRegions, sourceDates, placeName, nyChampionSource, njChampionSource, paChampionSource, deChampionSource, type ChampionManifest, type ChampionPayload, formatMeasurement, librarySpecies, sourceWarnings, townKey, stateNames, nhChampionSource, vtChampionSource, meChampionSource, riChampionSource, ctChampionSource, type ChampionState, type ChampionTree } from "../../lib/champion-trees";

function RecordDetails({ tree, mapped }: { tree: ChampionTree; mapped: boolean }) {
  const warnings = sourceWarnings(tree);
  const library = tree.state === "MA" && tree.sourceRow === 132 ? undefined : librarySpecies[tree.scientificName];
  const measured = tree.measured && /^\d{4}$/.test(tree.measured) ? tree.measured : tree.measured ? new Date(`${tree.measured}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Not listed";
  return <article className="champion-detail" aria-labelledby="selected-tree-title">
    <p className="section-kicker">{placeName(tree)}, {tree.state}{tree.mapPrecision !== "county" && <> · {tree.county} {tree.state === "CT" ? "Planning Region" : "County"}</>}</p>
    <h2 id="selected-tree-title">{tree.commonName}</h2><p className="champion-latin"><i>{tree.scientificName}</i></p>
    <div className="champion-measurements">
      <div><strong>{formatMeasurement(tree.height)}</strong><span>height · feet</span></div>
      <div><strong>{formatMeasurement(tree.circumference)}</strong><span>{tree.state === "NH" ? "circumference · as published" : "circumference · inches"}</span></div>
      <div><strong>{formatMeasurement(tree.crownPoints ?? tree.crown)}</strong><span>{tree.crownUnitUncertain ? "crown average · source value" : tree.crownPoints !== undefined ? "crown points · ¼ spread" : "crown spread · feet"}</span></div>
      <div><strong>{formatMeasurement(tree.points)}</strong><span>published points</span></div>
    </div>
    {tree.state === "NH" ? <><p><strong>Register status:</strong> State champion · Tree ID {tree.sourceRow}</p><p><strong>Nominated:</strong> {tree.nominated} (not a measurement date)</p></> : <p><strong>{tree.state === "VT" ? "Data collected:" : tree.state === "ME" ? "Last measured (year):" : "Measured:"}</strong> {measured}</p>}
    {tree.state === "DE" && <><p className="champion-access"><strong>{tree.status}</strong> · Public visiting access is unclassified.</p><p><strong>Ranking date:</strong> {tree.rankingDate || "Not listed"} · not a measurement date</p></>}
    {tree.state === "PA" && <p className="champion-access"><strong>{tree.status}</strong> · Selected by highest published points within the source botanical category. This is a derived selection, not an explicit state-champion designation. Public visiting access is unclassified.</p>}
    {tree.state === "NJ" && <p className="champion-access"><strong>NJDEP designation: {tree.status}</strong> · Permission to list is recorded. Public visiting access is unclassified; listing permission does not grant entry.</p>}
    {tree.state === "NY" && <p className="champion-access"><strong>{tree.status}</strong> · Public access is not specified. Crown points are the published scoring contribution, one quarter of average crown spread in feet.</p>}
    {tree.state === "CT" && <p className="champion-access"><strong>{tree.status}</strong> · Public access is not classified in this snapshot. The planning region is matched from Census geography.</p>}
    {tree.state === "RI" && <p className="champion-access"><strong>Rhode Island register · March 24, 2026 · {tree.status}</strong> · Public access is not specified in this register. {tree.county} County is matched from Census geography.</p>}
    {tree.state === "ME" && <p className="champion-access"><strong>Maine register · 2020 edition</strong> · Public access is not specified in this register.</p>}
    {tree.state === "VT" && <><p><strong>Register status:</strong> Confirmed champion · Record {tree.sourceRow}{tree.yearListed ? ` · Listed ${tree.yearListed}` : ""}</p><p className="champion-access"><strong>{tree.publicAccess ? "Public access listed by Vermont" : "Private property · no public access"}</strong>{tree.visibleFromPublic === "yes" && <span> · Source says visible from a road or public property; this does not grant entry.</span>}</p><p>{tree.accessDetails}</p></>}
    <h3>{tree.state === "DE" ? "Location published by Delaware Forest Service" : tree.state === "PA" ? "Location published by PA Big Trees" : tree.state === "NJ" ? "Location published by NJDEP" : tree.state === "NY" ? "County published by NYS DEC" : tree.state === "CT" ? "Location published by Connecticut’s Notable Trees" : tree.state === "RI" ? "Location published by RI Tree Council" : tree.state === "ME" ? "Place listed by Maine Forest Service" : tree.state === "VT" ? "Published location notes" : tree.state === "NH" ? "Place listed by NH Big Trees" : "Location published by DCR"}</h3><p>{tree.state === "DE" ? `${tree.location || "Street address not listed"}. Published place: ${tree.town}, ${tree.county} County.` : tree.state === "NJ" ? `${tree.location || "Street address not listed"}. Published municipality: ${tree.town}, ${tree.county} County.` : tree.state === "NY" ? `${tree.county} County. This register provides no town, street address, exact tree coordinates, or visiting permission.` : tree.state === "ME" ? `${tree.town}. The register gives a town or township, without a street address or tree coordinates. ${tree.county} County is matched from official geography.` : tree.state === "VT" ? tree.location || "No additional location notes are published." : tree.state === "NH" ? `${tree.town}, ${tree.county} County. The register does not publish a street address or tree coordinates for this record.` : tree.location || "No location disclosed in this list. Only the town is provided."}</p>
    <p className="champion-location-note">{mapped ? (tree.mapPrecision === "county" ? "The marker represents the county only. It does not locate the tree or provide directions." : "The marker is an approximate town or Census place point, not the tree’s position.") : "This record has no map point. Its original place information is retained below."} {(tree.location || tree.publicCoordinates) ? "Confirm current visiting guidance with the landowner or site before visiting." : "An exact location has not been inferred."}</p>
    {tree.notes && <p><strong>Source notes:</strong> {tree.notes}</p>}
    {warnings.length > 0 && <div className="champion-source-note"><h3>Source note</h3>{warnings.map(warning => <p key={warning}>{warning}</p>)}</div>}
    {tree.state === "DE" && <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Delaware FirstMap source record {tree.sourceRow} ↗</a> · retrieved {deChampionSource.retrieved}. Ranking dates are preserved separately from measurements. <a href={deChampionSource.registerUrl} target="_blank" rel="noreferrer">Official Big Trees Playground ↗</a></p>}
    {tree.state === "PA" && <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Original PA Big Trees record ↗</a> · {paChampionSource.snapshot}. Dates are shown as published; January 1 dates may represent legacy year-only entries. <a href={paChampionSource.scoringUrl} target="_blank" rel="noreferrer">Program scoring rule ↗</a></p>}
    {tree.state === "NJ" && <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">NJDEP source record {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Dataset last edited March 19, 2026; this is not a tree measurement date. <a href={njChampionSource.registerUrl} target="_blank" rel="noreferrer">Official Big Tree Map &amp; Registry ↗</a></p>}
    {tree.state === "NY" && <p className="champion-source-credit"><a href={tree.sourceUrl || nyChampionSource.registerUrl} target="_blank" rel="noreferrer">NYS DEC Big Tree Register · January 31, 2025 · page {tree.sourcePage} ↗</a> · retrieved October 6, 2026.</p>}
    <div className="course-actions">
      {(tree.state === "MA" || tree.state === "RI" || tree.state === "CT") && tree.location && <a className="button secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tree.location}, ${tree.mapTown ? `${tree.town}, ${tree.mapTown}` : tree.town}, ${stateNames[tree.state]}`)}`} target="_blank" rel="noreferrer">Search the published location ↗</a>}
      {tree.state === "VT" && tree.publicAccess && tree.publicCoordinates && <a className="button secondary" href={`https://www.google.com/maps/search/?api=1&query=${tree.publicCoordinates.lat},${tree.publicCoordinates.lng}`} target="_blank" rel="noreferrer">Open Vermont’s published tree location ↗</a>}
      {library && <Link className="course-link" href={`/trees/${library.slug}`}>Explore {library.name} energy & practice</Link>}
    </div>
    {tree.state === "NY" || tree.state === "NJ" || tree.state === "PA" || tree.state === "DE" ? null : tree.state === "CT" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Connecticut’s Notable Trees · Tree ID {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Names, measurements, measurement dates, and champion designations are retained from the register. <a href={ctChampionSource.registerUrl} target="_blank" rel="noreferrer">Connecticut champion list ↗</a></p> : tree.state === "RI" ? <p className="champion-record-source"><a href={riChampionSource.registerUrl} target="_blank" rel="noreferrer">RI Tree Council champion register · March 24, 2026 · row {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Original names, measurements, locations, ranks, and scores are retained. The edition date is not a measurement date.</p> : tree.state === "ME" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">Maine Register of Big Trees · 2020 · PDF page {tree.sourcePage} ↗</a> · retrieved October 6, 2026. Original names, symbols, measurements, and scores are retained. This dated register does not confirm current tree conditions. <a href={meChampionSource.programUrl} target="_blank" rel="noreferrer">Maine Forest Service program ↗</a></p> : tree.state === "VT" ? <p className="champion-record-source"><a href={vtChampionSource.registerUrl} target="_blank" rel="noreferrer">Vermont Big Tree List ↗</a> · <a href={tree.sourceUrl} target="_blank" rel="noreferrer">Source record {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Measurements and access labels are shown as published. Vermont reports the program is temporarily on hold following a staffing transition.</p> : tree.state === "NH" ? <p className="champion-record-source"><a href={tree.sourceUrl} target="_blank" rel="noreferrer">NH Big Trees register · Tree ID {tree.sourceRow} ↗</a> · retrieved October 6, 2026. Circumference units are not specified in the table; values are retained as published. <a href={nhChampionSource.publicMapUrl} target="_blank" rel="noreferrer">UNH’s public visiting map ↗</a> lists a separate selection of trees open to visitors.</p> : <p className="champion-record-source">DCR Champion Trees · May 2026 workbook · row {tree.sourceRow}. Values shown as published.</p>}
  </article>;
}

export default function ChampionExplorer({ manifest }: { manifest: ChampionManifest }) {
  const [region, setRegion] = useState("");
  const [cache, setCache] = useState<Partial<Record<ChampionState, ChampionPayload>>>({});
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [page, setPage] = useState(1);
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
  const statesInRegion = manifest.filter(s => !region || championRegions[region as keyof typeof championRegions].states.includes(s.state));
  const requestedStates = statesInRegion.filter(s => !state || s.state === state).map(s => s.state);
  const requestKey = requestedStates.join(",");
  const cached = useRef<Partial<Record<ChampionState, ChampionPayload>>>({});
  useEffect(() => {
    let disposed = false;
    setLoadError(false);
    const codes = requestKey.split(",").filter(Boolean) as ChampionState[];
    const missing = codes.filter(code => !cached.current[code]);
    Promise.all(missing.map(async code => {
      const response = await fetch(`/api/champion-trees/${code}`);
      if (!response.ok) throw new Error("Could not load state register");
      const payload: ChampionPayload = await response.json();
      return [code, payload] as const;
    })).then(entries => {
      if (disposed) return;
      entries.forEach(([code, payload]) => { cached.current[code] = payload; });
      setCache({ ...cached.current });
    }).catch(() => { if (!disposed) setLoadError(true); });
    return () => { disposed = true; };
  }, [requestKey, retry]);
  const loading = requestedStates.some(code => !cache[code]);
  const championTrees = useMemo(() => requestKey.split(",").flatMap(code => cache[code as ChampionState]?.trees || []), [requestKey, cache]);
  const coordinates = useMemo(() => Object.assign({}, ...requestKey.split(",").map(code => cache[code as ChampionState]?.coordinates || {})) as ChampionPayload["coordinates"], [requestKey, cache]);
  const townOptions = useMemo(() => [...new Map(championTrees.filter(t => t.town || t.mapPrecision === "county").map(tree => [townKey(tree), { key: townKey(tree), town: placeName(tree), state: tree.state, precision: tree.mapPrecision || "municipality" }])).values()].sort((a, b) => a.town.localeCompare(b.town) || a.state.localeCompare(b.state)), [championTrees]);
  const genera = useMemo(() => [...new Set(championTrees.map(t => t.scientificName.split(" ")[0]))].sort(), [championTrees]);
  const detail = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return championTrees.filter(t => (!state || t.state === state) && (!county || t.county === county) && (!town || townKey(t) === town) && (!genus || t.scientificName.split(" ")[0] === genus) && (!locationsOnly || Boolean(t.location || t.publicCoordinates)) && (!publicOnly || t.publicAccess === true) && words.every(word => `${stateNames[t.state]} ${t.state} ${t.mapTown || ""} ${t.commonName} ${t.scientificName} ${t.town} ${t.county} ${t.location || ""} ${t.notes || ""}`.toLowerCase().includes(word))).sort((a, b) => {
      if (sort === "height") return (b.height ?? -1) - (a.height ?? -1) || a.sourceRow - b.sourceRow;
      if (sort === "points") return (b.points ?? -1) - (a.points ?? -1) || a.sourceRow - b.sourceRow;
      if (sort === "town") return placeName(a).localeCompare(placeName(b)) || a.commonName.localeCompare(b.commonName);
      return a.commonName.localeCompare(b.commonName) || a.sourceRow - b.sourceRow;
    });
  }, [championTrees, state, query, county, town, genus, locationsOnly, publicOnly, sort]);
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    results.forEach(t => counts.set(townKey(t), (counts.get(townKey(t)) || 0) + 1));
    return townOptions.filter(t => counts.has(t.key) && coordinates[t.key]).map(t => ({ ...t, count: counts.get(t.key)! }));
  }, [results, townOptions, coordinates]);
  const counties = [...new Set(championTrees.filter(t => !state || t.state === state).map(t => t.county))].sort();
  const selected = results.find(t => t.id === selectedId);
  const selectTown = useCallback((value: string) => {
    setTown(value); setSelectedId(null);
    resultsHeading.current?.focus({ preventScroll: true });
  }, []);
  function reset() {
    setRegion(""); setPage(1); setState(""); setQuery(""); setCounty(""); setTown(""); setGenus(""); setLocationsOnly(false); setPublicOnly(false); setSort("name"); setSelectedId(null); setResetKey(key => key + 1);
  }
  function selectRecord(tree: ChampionTree) {
    setSelectedId(tree.id);
    requestAnimationFrame(() => { detail.current?.focus({ preventScroll: true }); detail.current?.scrollIntoView({ block: "nearest", behavior: "auto" }); });
  }
  useEffect(() => { setPage(1); }, [requestKey, query, county, town, genus, locationsOnly, publicOnly, sort]);
  const mappedCount = results.filter(t => Boolean(coordinates[townKey(t)])).length;
  const visibleResults = results.slice(0, page * 50);
  return <section className="champion-explorer" aria-label="Explore champion trees">
    <div className="champion-region-bar" aria-label="Explore by region"><span>Explore a region</span>{[["", "All available states"], ["new-england", "New England"], ["northeast", "Northeast"], ["mid-atlantic", "Mid-Atlantic"]].map(([value, name]) => <button key={value} type="button" className="button secondary" aria-pressed={region === value} onClick={() => { setRegion(value); setState(""); setCounty(""); setTown(""); setSelectedId(null); }}>{name}</button>)}</div>
    {region === "northeast" && <p className="champion-location-note">Northeast covers Pennsylvania, New York, New Jersey, and all six New England states.</p>}
    {region === "mid-atlantic" && <p className="champion-location-note">Mid-Atlantic currently includes New York, New Jersey, Pennsylvania, and Delaware. Maryland is planned.</p>}
    <div className="champion-toolbar">
      <label>State<select aria-label="State" value={state} onChange={e => { setState(e.target.value); setCounty(""); setTown(""); setSelectedId(null); }}><option value="">All states</option>{statesInRegion.map(({ state: code, listed }) => <option key={code} value={code}>{stateNames[code]} · {listed} records</option>)}</select></label>
      <label className="champion-search">Find a tree, county, town, or place<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try pine, Portland, or Smith College…" /></label>
      <label>County or planning region<select aria-label="County or planning region" value={county} onChange={e => { setCounty(e.target.value); setTown(""); }}><option value="">All counties & regions</option>{counties.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Mapped place<select aria-label="Mapped place" value={town} onChange={e => setTown(e.target.value)}><option value="">All towns & counties</option>{townOptions.filter(t => (!state || t.state === state) && (!county || championTrees.some(r => townKey(r) === t.key && r.county === county))).map(t => <option key={t.key} value={t.key}>{t.town}, {t.state}</option>)}</select></label>
      <label>Tree genus<select aria-label="Tree genus" value={genus} onChange={e => setGenus(e.target.value)}><option value="">All genera</option>{genera.map(g => <option key={g}>{g}</option>)}</select></label>
    </div>
    <div className="champion-filter-bar"><label className="champion-check"><input type="checkbox" checked={locationsOnly} onChange={e => setLocationsOnly(e.target.checked)} /> With a published location</label><label className="champion-check"><input type="checkbox" checked={publicOnly} onChange={e => setPublicOnly(e.target.checked)} /> Source confirms public access</label><button type="button" className="champion-text-button" onClick={reset}>Reset all filters & map</button><a className="champion-text-button" href="#champion-results">Skip to tree results ↓</a></div>
    {state && <p className="champion-location-note"><strong>{stateNames[state as ChampionState]} source:</strong> {sourceDates[state as ChampionState]}</p>}
    {requestedStates.includes("DE") && <p className="champion-location-note"><strong>Delaware:</strong> 79 rank-one champions and 12 additional qualifiers under the published five-point co-champion rule. <a href="#source-DE">Read the selection and source notes.</a></p>}
    {requestedStates.includes("PA") && <p className="champion-location-note"><strong>Pennsylvania:</strong> 445 score-based leaders from PA Big Trees. Published-score ties and legacy national labels are retained with qualifications. <a href="#source-PA">Read the selection and review notes.</a></p>}
    {(loading || loadError) && <p role="status">{loadError ? "This selection could not finish loading. Retry to see its complete register." : "Loading tree registers…"} {loadError && <button type="button" className="champion-text-button" onClick={() => setRetry(n => n + 1)}>Retry loading</button>}</p>}
    {publicOnly && <p className="champion-location-note" role="status">Showing only records whose source explicitly confirms public access. Access information is currently available for Vermont; MA, NH, Maine, Rhode Island, Connecticut, New York, New Jersey, Pennsylvania, and Delaware records have not been classified.</p>}
    <p className="champion-map-note"><span aria-hidden="true">●</span> Numbers show matching tree records. Nearby places group together when zoomed out; select a group to zoom in, then select a place to browse its trees. New York, Pennsylvania, and some New Jersey and Delaware records use county points; other markers use approximate town or Census place points. These are approximate areas, not exact tree locations.</p>
    <div className="champion-workspace">
      <div className="champion-map-column"><ChampionMap coordinates={coordinates} groups={groups} selectedTown={selected ? townKey(selected) : town || null} onTown={selectTown} resetKey={resetKey} />
        <div ref={detail} className="champion-detail-region" tabIndex={-1} aria-label="Selected tree details">
          {selected ? <RecordDetails tree={selected} mapped={Boolean(coordinates[townKey(selected)])} /> : <div className="champion-detail-empty"><p className="section-kicker">A closer look</p><h2>Every champion has a place.</h2><p>Select a tree in the list to see its measurements, published location, and notes. The map helps you explore the region; the record tells you what the source program has shared.</p></div>}
        </div>
      </div>
      <div className="champion-results" id="champion-results">
        <div className="champion-results-header"><h2 ref={resultsHeading} tabIndex={-1}>Tree records</h2><p role="status" aria-live="polite">{results.length.toLocaleString("en-US")} listed · {mappedCount.toLocaleString("en-US")} mapped · {groups.length} {groups.length === 1 ? "mapped place" : "mapped places"}{town ? ` · ${townOptions.find(t => t.key === town)?.town}, ${town.split(":")[0]}` : ""}</p>
          {town && <button className="champion-text-button" type="button" onClick={() => setTown("")}>Show all places</button>}
          <label>Sort by<select aria-label="Sort by" value={sort} onChange={e => setSort(e.target.value)}><option value="name">Tree name</option><option value="town">Place</option><option value="height">Tallest first</option><option value="points">Published points</option></select></label>
        </div>
        {loading || loadError ? <p className="champion-location-note">The complete results will appear when this selection finishes loading.</p> : results.length ? <ul className="champion-result-list">{visibleResults.map(tree => <li key={tree.id}><button type="button" className={`champion-result${selected?.id === tree.id ? " is-selected" : ""}`} aria-pressed={selected?.id === tree.id} onClick={() => selectRecord(tree)}>
          <span className="champion-result-town">{placeName(tree)}, {tree.state}{tree.mapPrecision !== "county" && <> · {tree.county}</>}</span><strong>{tree.commonName}</strong><i>{tree.scientificName}</i><span>{tree.location || (tree.mapPrecision === "county" ? "County point · exact location not mapped" : tree.publicCoordinates ? "Public tree coordinates published" : "Location not disclosed")}</span>{tree.state === "DE" && <span>{tree.status} · {tree.mapPrecision === "county" ? "county point" : "Census place point"}</span>}{tree.state === "PA" && <span>{tree.status} · county point</span>}{tree.state === "NJ" && <span>NJDEP: {tree.status} · {tree.mapPrecision === "county" ? "county point" : "municipality point"}</span>}{tree.state === "NY" && <span>{tree.status} · county point</span>}{tree.state === "CT" && <span>{tree.status} · access unclassified</span>}{tree.state === "RI" && <span>2026 register · access not specified</span>}{tree.state === "ME" && <span>2020 register · access not specified</span>}{tree.state === "VT" && <span>{tree.publicAccess ? "Public access listed" : "Private · no public access"}</span>}<span className="champion-result-metrics">{formatMeasurement(tree.height)} ft tall · {formatMeasurement(tree.points)} points</span><span className="champion-result-open">Explore this record →</span>
        </button></li>)}</ul> : <div className="champion-no-results"><h3>No trees match these filters.</h3><p>Try a broader search or return to the full list.</p><button type="button" className="button secondary" onClick={reset}>Show all {championTrees.length} records</button></div>}
        {!loading && !loadError && visibleResults.length < results.length && <div className="champion-pagination"><p>Showing {visibleResults.length} of {results.length.toLocaleString("en-US")} listed trees. The map includes all {mappedCount.toLocaleString("en-US")} mapped matches.</p><button type="button" className="button secondary" onClick={() => setPage(n => n + 1)}>Show 50 more trees</button></div>}
      </div>
    </div>
  </section>;
}
