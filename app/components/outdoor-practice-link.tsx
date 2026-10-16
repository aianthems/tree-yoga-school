import Link from "next/link";
import { getLessonPractice } from "../../lib/lesson-practices";

export default function OutdoorPracticeLink({ slug }: { slug: string }) {
  const practice = getLessonPractice(slug);
  if (!practice) return null;
  return <aside className="lesson-outdoor-invitation" aria-label="Outdoor practice guide">
    <p className="section-kicker">Ready to practice · {practice.duration}</p>
    <p>Open the simple outdoor guide for this lesson. Keep the steps handy, or print them before you go. Return here afterward to reflect.</p>
    <Link className="button primary" href={`/practice/${practice.slug}`}>Take this practice outside</Link>
  </aside>;
}
