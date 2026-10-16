import ResponsiveImage from "./responsive-image";
import Link from "next/link";

import { siteNavigation } from "../../lib/site-navigation";

export default function SiteFooter() {
  return <footer className="school-footer" aria-label="Tree Yoga School footer">
    <div className="school-footer-inner">
      <div className="school-footer-invitation">
        <div><p className="section-kicker">A living world. An open invitation.</p><h2>Stay rooted.<br /><em>Keep growing.</em></h2></div>
        <div className="school-footer-start"><p>One tree. A little attention.<br />A place to begin again.</p><Link className="button" href="/begin-here">Begin with a tree <span aria-hidden="true">↗</span></Link></div>
      </div>
      <div className="school-footer-directory">
        <div className="school-footer-identity"><Link className="school-footer-logo" href="/" aria-label="Tree Yoga School home"><ResponsiveImage image="logo" alt="Tree Yoga School · pine tree logo" sizes="(max-width: 760px) 172px, (max-width: 1000px) 162px, 202px" /></Link><p>Nature is the teacher.</p></div>
        <nav className="school-footer-nav" aria-label="Footer navigation">{siteNavigation.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></div>)}</nav>
      </div>
      <div className="school-footer-bottom"><p>© 2026 Tree Yoga School</p><p>Founded by Alex Julian · Rooted in the original school.</p><p><Link href="/privacy">Privacy</Link></p><a href="#content">Return to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
