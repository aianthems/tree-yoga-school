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
          <a href="/lessons/first-five-minutes">First lesson</a>
          <a href="/#practice">Practice</a>
          <a href="/#curriculum">Curriculum</a>
          <a href="/#principles">Principles</a>
          <a href="https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf" target="_blank" rel="noreferrer">Book ↗</a>
        </nav>
      </header>
    </>
  );
}
