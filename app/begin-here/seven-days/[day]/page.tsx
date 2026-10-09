import { pageMetadata } from "../../../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";
import { beginnerJourney } from "../../../../lib/beginner-journey";
export const dynamicParams = false;
export function generateStaticParams() { return beginnerJourney.map(item => ({ day: String(item.day) })); }
function getDay(value: string) { const day = beginnerJourney.find(item => String(item.day) === value); if (!day) notFound(); return day; }
export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const day = getDay((await params).day);
  return pageMetadata(`/begin-here/seven-days/${day.day}`, `Day ${day.day}: ${day.title} | Tree Yoga School`, day.purpose);
}
export default async function JourneyDayPage({ params }: { params: Promise<{ day: string }> }) {
  const day = getDay((await params).day);
  const previous = beginnerJourney[day.day - 2]; const next = beginnerJourney[day.day];
  return <><SiteHeader /><main id="content" className="lesson">
    <section className="lesson-intro"><Link className="lesson-back" href="/begin-here/seven-days">← Seven-day journey</Link><p className="section-kicker">Day {day.day} of 7 · {day.duration}</p><h1>{day.title}.</h1><p className="lesson-lede">{day.purpose}</p><p>Take this at your own pace. Repeat a day, shorten the practice, or finish whenever you need to.</p></section>
    <nav className="journey-navigation" aria-label="Journey days">{beginnerJourney.map(item => <Link key={item.day} href={`/begin-here/seven-days/${item.day}`} aria-current={item.day === day.day ? "page" : undefined} aria-label={`Day ${item.day}: ${item.title}`}>{item.day}</Link>)}</nav>
    <section className="lesson-section" aria-labelledby="prepare"><p className="section-kicker">Before you begin</p><h2 id="prepare">Choose your way to practice.</h2><p>{day.preparation}</p><div className="lesson-options">{day.options.map(option => <article key={option.title}><h3>{option.title}</h3><p>{option.text}</p></article>)}</div></section>
    <section className="lesson-section" aria-labelledby="practice"><p className="section-kicker">Today’s practice</p><h2 id="practice">Read once, then give it a try.</h2><ol className="lesson-steps">{day.steps.map(step => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><div className="journey-resources"><h3>Practice and lesson links</h3><ul>{day.links.map(link => <li key={link.href}><Link className="course-link" href={link.href}>{link.title} →</Link></li>)}</ul></div></section>
    <section className="lesson-pause"><h2>Let this visit be enough.</h2><p>Set the screen aside when you can. Keep your device available for access, navigation, or communication.</p></section>
    <section className="lesson-section" aria-labelledby="reflection"><p className="section-kicker">After your visit</p><h2 id="reflection">{day.reflection}</h2><p>Reflect quietly or write a sentence in your own notebook. Nothing needs to be submitted.</p></section>
    {day.day === 7 && <section className="lesson-section"><p className="section-kicker">A beginning you can return to</p><h2>Choose your next encounter.</h2><p>Repeat a favorite day, explore another Library practice, or plan a visit to a remarkable tree. You can keep this as simple as your first five minutes.</p><div className="course-actions"><Link className="button primary" href="/trees">Explore the Tree Library</Link><Link className="button secondary" href="/tree-visits">Find a tree to visit</Link></div></section>}
    <nav className="course-actions journey-next" aria-label="Continue the journey">{previous && <Link className="button secondary" href={`/begin-here/seven-days/${previous.day}`}>← Day {previous.day}: {previous.title}</Link>}{next ? <Link className="button primary" href={`/begin-here/seven-days/${next.day}`}>When ready: Day {next.day} →</Link> : <Link className="button secondary" href="/begin-here/seven-days">Return to all seven days</Link>}</nav>
  </main><SiteFooter /></>;
}
