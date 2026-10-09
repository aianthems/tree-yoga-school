"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { filterLibraryTrees, libraryThemes, type LibraryTree } from "../../lib/tree-library-search";

export default function TreeLibraryExplorer({ trees }: { trees: readonly LibraryTree[] }) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("");
  const [view, setView] = useState<"illustrated" | "compact">("illustrated");
  const results = filterLibraryTrees(trees, query, theme);
  const themes = libraryThemes(trees);
  const hasFilters = query.length > 0 || theme.length > 0;
  function reset() { setQuery(""); setTheme(""); }

  return (
    <>
      <section className="library-discovery" aria-labelledby="library-discovery-title">
        <h2 id="library-discovery-title">Find a tree for your practice.</h2>
        <p id="library-search-help">Search a common or scientific name, or choose a theme that interests you.</p>
        <form role="search" aria-label="Search the Tree Library" onSubmit={event => event.preventDefault()}>
          <div className="library-filter-fields">
            <div className="library-filter-field">
              <label htmlFor="library-search">Tree name</label>
              <input id="library-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try maple, musclewood, or Acer" aria-describedby="library-search-help" aria-controls="library-results" />
            </div>
            <div className="library-filter-field">
              <label htmlFor="library-theme">Practice theme</label>
              <select id="library-theme" value={theme} onChange={event => setTheme(event.target.value)} aria-controls="library-results">
                <option value="">All themes</option>
                {themes.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <button className="button secondary library-reset" type="button" onClick={reset} disabled={!hasFilters}>Reset filters</button>
          </div>
        </form>
        <div className="library-view-switch" role="group" aria-label="Library view">
          <span>Browse as</span>
          <button type="button" aria-pressed={view === "illustrated"} aria-controls="library-results" onClick={() => setView("illustrated")}>Illustrated</button>
          <button type="button" aria-pressed={view === "compact"} aria-controls="library-results" onClick={() => setView("compact")}>Compact</button>
        </div>
        <p className="library-result-count" role="status" aria-live="polite" aria-atomic="true">
          {results.length === trees.length ? `${trees.length} trees to explore` : `${results.length} of ${trees.length} trees match`}{theme ? ` · ${theme}` : ""}
        </p>
      </section>
      {view === "illustrated" && results.length > 0 && <nav className="tree-picker" aria-label="Jump to a matching tree">{results.map(tree => <a key={tree.slug} href={`#${tree.slug}`}>{tree.name}</a>)}</nav>}
      <section id="library-results" aria-label="Trees to explore" className={view === "compact" ? "library-compact-grid" : "tree-library-grid"}>
        {results.length === 0 ? (
          <div className="library-empty">
            <h2>No trees match this combination.</h2>
            <p>Try a shorter name, choose another theme, or reset the filters to see every tree.</p>
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
              <Image src={tree.image} alt={tree.imageAlt} width={tree.imageWidth} height={tree.imageHeight} sizes="(max-width: 760px) 100vw, 55vw" priority={tree.slug === trees[0]?.slug} />
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
