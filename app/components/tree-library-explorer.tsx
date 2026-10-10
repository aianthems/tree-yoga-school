"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LibraryTree } from "../../lib/tree-library-search";
import { discoverLibraryTrees, emptyLibrarySelection, hasLibraryFilters, libraryHref, librarySortOptions, practiceCategories, readLibrarySelection, treePracticeCategories, type LibrarySelection } from "../../lib/tree-library-discovery";
import { identificationOptions } from "../../lib/tree-identification";
import ShareLink from "../champion-trees/share-link";

// Keep the static HTML indexable, hydrate URL selections, and follow Back/Forward.
const selectionEvent = "tree-library-selection-change";
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(selectionEvent, onChange);
  return () => { window.removeEventListener("popstate", onChange); window.removeEventListener(selectionEvent, onChange); };
}
const browserSearch = () => window.location.search;
const serverSearch = () => "";

export default function TreeLibraryExplorer({ trees, comparisons }: { trees: readonly LibraryTree[]; comparisons: ReactNode }) {
  const search = useSyncExternalStore(subscribe, browserSearch, serverSearch);
  const selection = useMemo(() => readLibrarySelection(new URLSearchParams(search)), [search]);
  const { query, practice, view } = selection;
  const results = useMemo(() => discoverLibraryTrees(trees, selection), [trees, selection]);
  const categoryCounts = useMemo(() => practiceCategories.map(category => ({ ...category, count: trees.filter(tree => treePracticeCategories(tree).some(value => value.value === category.value)).length })), [trees]);
  const hasFilters = hasLibraryFilters(selection);
  const hasIdentification = Boolean(selection.foliage || selection.arrangement || selection.lobes || selection.bark);
  function update(patch: Partial<LibrarySelection>, replace = false) {
    const next = { ...readLibrarySelection(new URLSearchParams(window.location.search)), ...patch };
    if (patch.foliage && patch.foliage !== "broad") { next.arrangement = ""; next.lobes = ""; }
    const href = libraryHref(next);
    if (href !== window.location.pathname + window.location.search) {
      window.history[replace ? "replaceState" : "pushState"](null, "", href + window.location.hash);
      window.dispatchEvent(new Event(selectionEvent));
    }
  }
  function reset() { update({ ...emptyLibrarySelection, view: selection.view, sort: selection.sort }); }

  return (
    <>
      <section className="library-discovery" aria-labelledby="library-discovery-title">
        <h2 id="library-discovery-title">Find a tree for your practice.</h2>
        <p id="library-search-help">Search a common or scientific name, choose a practice, or begin with something you can see.</p>
        <form role="search" aria-label="Search the Tree Library" onSubmit={event => event.preventDefault()}>
          <div className="library-filter-fields">
            <div className="library-filter-field">
              <label htmlFor="library-search">Tree name</label>
              <input id="library-search" type="search" value={query} onChange={event => update({ query: event.target.value }, true)} placeholder="Try maple, musclewood, or Acer" aria-describedby="library-search-help" aria-controls="library-results" />
            </div>
            <div className="library-filter-field">
              <label htmlFor="library-practice">Practice category</label>
              <select id="library-practice" value={practice} onChange={event => update({ practice: event.target.value })} aria-controls="library-results">
                <option value="">All practices</option>
                {categoryCounts.map(category => <option key={category.value} value={category.value}>{category.label} ({category.count})</option>)}
              </select>
            </div>
            <div className="library-filter-field">
              <label htmlFor="library-sort">Sort trees</label>
              <select id="library-sort" value={selection.sort} onChange={event => update({ sort: event.target.value })} aria-controls="library-results">
                {librarySortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <details className="library-identification" open={hasIdentification ? true : undefined}>
            <summary>Look at the tree · identification filters{hasIdentification ? " · active" : ""}</summary>
            <p id="library-identification-help">Choose only features you can see. Leaf arrangement refers to whole broad leaves on the twig, including compound leaves—not their leaflets. Lobes are larger divisions in a leaf or leaflet’s outline; small teeth are not lobes. Bark changes with age. Some trees match more than one option.</p>
            <div className="library-identification-fields">
              {(["foliage", "arrangement", "lobes", "bark"] as const).map(key => <div className="library-filter-field" key={key}>
                <label htmlFor={`library-${key}`}>{{ foliage: "Foliage", arrangement: "Broad-leaf arrangement", lobes: "Leaf lobes", bark: "Bark" }[key]}</label>
                <select id={`library-${key}`} disabled={(key === "arrangement" || key === "lobes") && Boolean(selection.foliage && selection.foliage !== "broad")} value={selection[key]} onChange={event => update({ [key]: event.target.value })} aria-controls="library-results" aria-describedby="library-identification-help">
                  <option value="">Any / not sure</option>
                  {identificationOptions[key].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>)}
            </div>
            <p className="library-observation-note">These clues narrow the Library; they do not confirm an identification. Compare several features and open the profile for photographs and botanical references.</p>
          </details>
          <div className="library-discovery-actions">
            <button className="button secondary library-reset" type="button" onClick={reset} disabled={!hasFilters}>Reset filters</button>
          </div>
        </form>
        <ShareLink href={libraryHref(selection)} label="Copy Library selection link" />
        <div className="library-view-switch" role="group" aria-label="Library view">
          <span>Browse as</span>
          <button type="button" aria-pressed={view === "illustrated"} aria-controls="library-results" onClick={() => update({ view: "illustrated" })}>Illustrated</button>
          <button type="button" aria-pressed={view === "compact"} aria-controls="library-results" onClick={() => update({ view: "compact" })}>Compact</button>
        </div>
        <p className="library-result-count" role="status" aria-live="polite" aria-atomic="true">
          {results.length === trees.length ? `${trees.length} trees to explore` : `${results.length} of ${trees.length} trees match`}{practice ? ` · ${practiceCategories.find(category => category.value === practice)?.label}` : ""}
        </p>
      </section>
      <details id="compare-trees" className="library-comparison-discovery">
        <summary>Compare similar trees · photographic guides</summary>
        {comparisons}
      </details>
      {view === "illustrated" && results.length > 0 && <nav className="tree-picker" aria-label="Jump to a matching tree">{results.map(tree => <a key={tree.slug} href={`#${tree.slug}`}>{tree.name}</a>)}</nav>}
      <section id="library-results" aria-label="Trees to explore" className={view === "compact" ? "library-compact-grid" : "tree-library-grid"}>
        {results.length === 0 ? (
          <div className="library-empty">
            <h2>No trees match this combination.</h2>
            <p>Try a shorter name, choose another practice or visible feature, or reset the filters to see every tree.</p>
            <button className="button primary" type="button" onClick={reset}>Show all trees</button>
          </div>
        ) : view === "compact" ? results.map(tree => (
          <article className="library-compact-card" id={tree.slug} key={tree.slug}>
            <h2><Link href={`/trees/${tree.slug}`}>{tree.name}</Link></h2>
            <p>{tree.species} · <i>{tree.scientificName}</i></p>
            <ul className="theme-list" aria-label="Contemplative themes">{tree.themes.map(value => <li key={value}>{value}</li>)}</ul>
            <Link className="course-link" href={`/practice/${tree.slug}`}>Open outdoor practice →</Link>
          </article>
        )) : results.map(tree => (
          <article className="tree-feature" id={tree.slug} key={tree.slug}>
            <Link className="tree-feature-image" href={`/trees/${tree.slug}`} aria-label={`Meet ${tree.name}: ${tree.species}`}>
              <Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 760px) 100vw, 55vw" priority={tree.slug === results[0]?.slug} />
            </Link>
            <div className="tree-feature-copy">
              <p className="section-kicker">{tree.species} · <i>{tree.scientificName}</i></p>
              <h2><Link href={`/trees/${tree.slug}`}>{tree.name}</Link></h2>
              <ul className="theme-list" aria-label="Contemplative themes">{tree.themes.map(value => <li key={value}>{value}</li>)}</ul>
              <p>{tree.invitation}</p>
              <div className="course-actions">
                <Link className="button primary" href={`/trees/${tree.slug}`}>Meet {tree.name}</Link>
                <Link className="course-link" href={`/practice/${tree.slug}`}>Practice with {tree.name} →</Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
