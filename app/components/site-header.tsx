export default function SiteHeader() {
  return <><a className="skip-link" href="#content">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Tree Yoga School home"><span className="brand-mark" aria-hidden="true">⌁</span><span>Tree Yoga School</span></a>
      <nav aria-label="Primary navigation">
        <a href="/begin-here">Begin Here</a><a href="/book">The Book</a><a href="/tree-hugging">Tree Hugging</a><a href="/trees">Tree Library</a><a href="/champion-trees">Champion Map</a><a href="/tree-visits">Trees to Visit</a><a href="/return-to-your-tree">Return to Your Tree</a>
        <details className="school-menu"><summary>The School</summary><div className="school-menu-links"><a href="/about">About</a><a href="/contact">Contact</a><a href="/big-tree-volunteers">Big Tree Volunteers</a><a href="/#practice">Practice</a><a href="/#principles">Principles</a></div></details>
      </nav>
    </header></>;
}
