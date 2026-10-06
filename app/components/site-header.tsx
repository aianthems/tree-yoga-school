export default function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Tree Yoga School home">
          <span className="brand-mark" aria-hidden="true">⌁</span>
          <span>Tree Yoga School</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/begin-here">Begin Here</a>
          <a href="/trees">Tree Library</a>
          <a href="/champion-trees">Champion Map</a>
          <a href="/#practice">Practice</a>
          <a href="/book">The Book</a>
          <a href="/#principles">Principles</a>
        </nav>
      </header>
    </>
  );
}
