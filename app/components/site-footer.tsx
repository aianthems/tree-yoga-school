import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  { title: "Practice", links: [
    ["Begin Here", "/begin-here"],
    ["Your First Five Minutes", "/practice/first-five-minutes"],
    ["The Seven-Day Journey", "/begin-here/seven-days"],
    ["Tree Hugging", "/tree-hugging"],
    ["Return to Your Tree", "/return-to-your-tree"],
  ] },
  { title: "Explore", links: [
    ["Tree Library", "/trees"],
    ["Champion Tree Map", "/champion-trees"],
    ["Trees to Visit", "/tree-visits"],
    ["Observation Journal", "/return-to-your-tree/journal"],
  ] },
  { title: "The School", links: [
    ["The Original Book", "/book"],
    ["About Alex & the School", "/about"],
    ["Big Tree Volunteers", "/big-tree-volunteers"],
    ["Contact", "/contact"],
  ] },
];

export default function SiteFooter() {
  return <footer className="school-footer" aria-label="Tree Yoga School footer">
    <div className="school-footer-inner">
      <div className="school-footer-invitation">
        <div><p className="section-kicker">A living world. An open invitation.</p><h2>Stay rooted.<br /><em>Keep growing.</em></h2></div>
        <div className="school-footer-start"><p>One tree. A little attention.<br />A place to begin again.</p><Link className="button" href="/begin-here">Begin with a tree <span aria-hidden="true">↗</span></Link></div>
      </div>
      <div className="school-footer-directory">
        <div className="school-footer-identity"><Link className="school-footer-logo" href="/" aria-label="Tree Yoga School home"><Image src="https://media.treeyogaschool.com/images/logos/tree-yoga-school-logo-v1.webp" alt="Tree Yoga School · pine tree logo" width={1254} height={1254} sizes="240px" unoptimized /></Link><p>Nature is the teacher.</p></div>
        <nav className="school-footer-nav" aria-label="Footer navigation">{footerGroups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></div>)}</nav>
      </div>
      <div className="school-footer-bottom"><p>© 2026 Tree Yoga School</p><p>Founded by Alex Julian · Rooted in the original school.</p><a href="#content">Return to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
