import Link from "next/link";
import { bookPoses, poseGroups, poseHref } from "../../lib/book-poses";

export default function PoseDirectory() {
  return <section id="poses" className="lesson-section pose-directory" aria-labelledby="pose-directory-title">
    <p className="section-kicker">The original book · {bookPoses.length} poses and practices</p>
    <h2 id="pose-directory-title">Explore every pose.</h2>
    <p>Choose an entry to read its original instructions. The book lists these as a reference, rather than a sequence or an order of difficulty.</p>
    <nav className="pose-alphabet" aria-label="Browse poses by first letter">{poseGroups.map(group => <a key={group.letter} href={`#poses-${group.letter}`}>{group.letter}</a>)}</nav>
    {poseGroups.map(group => <section className="pose-letter-group" key={group.letter} aria-labelledby={`poses-${group.letter}`}>
      <h3 id={`poses-${group.letter}`}>{group.letter}</h3>
      <ul className="pose-directory-grid">{group.poses.map(pose => <li key={pose.slug}><Link href={poseHref(pose)}><span>{pose.title}</span><small>Printed p. {pose.printedPage}</small></Link></li>)}</ul>
    </section>)}
  </section>;
}
