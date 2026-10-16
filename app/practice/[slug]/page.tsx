import PrintPractice from "../../components/print-practice";
import { pageMetadata, siteOrigin } from "../../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trees, getTree } from "../../../lib/trees";
import { treeHuggingPractice } from "../../../lib/tree-hugging";
import { getLessonPractice, lessonPractices } from "../../../lib/lesson-practices";
import BookConnections from "../../components/book-connections";
import PracticeControls from "../../components/practice-controls";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...trees.map(({ slug }) => ({ slug })), ...lessonPractices.map(({ slug }) => ({ slug })), { slug: "tree-hugging" }];
}
function getPractice(slug: string) {
  if (slug === "tree-hugging") return {
    title: treeHuggingPractice.title, label: "Tree Hugging", steps: treeHuggingPractice.steps,
    reflection: treeHuggingPractice.reflection, back: "/tree-hugging", backLabel: "Tree Hugging: practice & benefits",
  };
  const lesson = getLessonPractice(slug);
  if (lesson) return { ...lesson, back: lesson.lessonHref, backLabel: `Full lesson: ${lesson.label}` };
  const tree = getTree(slug);
  if (!tree) notFound();
  return { title: tree.practiceTitle, label: tree.name, steps: tree.practice,
    reflection: tree.reflection, back: `/trees/${tree.slug}#practice`, backLabel: `Back to ${tree.name}` };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);
  return pageMetadata(`/practice/${slug}`, `${practice.label} Outdoor Practice | Tree Yoga School`, `Practice beside a tree: ${practice.title} Readable steps and printable guidance${slug === "tree-yoga-hiking" ? ", with accessible and stationary options" : ", with an optional five-minute timer"}.`);
}
export default async function OutdoorPractice({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  const lesson = getLessonPractice(slug);
  return <main id="content" className="outdoor-practice">
    <nav className="outdoor-navigation" aria-label="Practice navigation"><Link href={practice.back}> {practice.backLabel}</Link><Link href="/trees">Tree Library</Link></nav>
    <header><p className="outdoor-eyebrow">Tree Yoga School · Practice beside a tree</p><p>{practice.label} · {lesson?.duration ?? "About five minutes"}</p><h1>{practice.title}</h1><p>Read once, then give your attention to the tree. Spend a few minutes, or less if that suits you.</p></header>
    <section className="outdoor-settle" aria-labelledby="settle"><h2 id="settle">Find a comfortable place.</h2><p>{lesson?.preparation ?? "Sit or stand on stable ground in a permitted place, keeping your usual supports. A bench, wheelchair, or accessible path is enough. Keep paths clear and let your breathing stay natural. There is no need to touch the tree."}</p>{lesson && lesson.options.length > 0 && <div className="outdoor-options">{lesson.options.map(option => <div key={option.title}><h3>{option.title}</h3><p>{option.text}</p></div>)}</div>}</section>
    <ol className="outdoor-steps">{practice.steps.map(step => <li key={step.title}><h2>{step.title}</h2><p>{step.text}</p></li>)}</ol>
    {slug === "tree-yoga-hiking" ? <PrintPractice /> : <PracticeControls key={slug} />}
    <section className="outdoor-reflection" aria-labelledby="reflection"><p className="outdoor-eyebrow">When you are ready</p><h2 id="reflection">{practice.reflection}</h2><p>Reflect quietly, or write a sentence in your own notebook. Let the visit be enough.</p></section>
    <footer><p>Leave the tree and its surroundings undisturbed.</p>
      <BookConnections compact chapters={lesson && slug !== "first-five-minutes" ? ["who-and-how", "poses-flows-and-meditations"] : slug === "tree-hugging" ? ["what-is-tree-yoga", "wisdom-and-wonder"] : slug === "first-five-minutes" ? ["who-and-how", "when-and-where"] : ["wisdom-and-wonder", "when-and-where"]} description={lesson && slug !== "first-five-minutes" ? "Return to the full lesson for its original book sources and the adaptations behind this outdoor sequence." : slug === "tree-hugging" ? "This new embrace practice connects the book’s attention to trees with presence, gratitude, and love." : slug === "first-five-minutes" ? "This new practice follows the book’s invitations to choose a tree and begin with a few minutes." : "This new species-specific practice grows from the book’s invitations to learn from trees and begin small."} /><Link href={lesson?.reflectionHref ?? practice.back}>{lesson ? "Return to the lesson and reflection" : practice.backLabel}</Link><p className="outdoor-print-source">Tree Yoga School · {new URL(siteOrigin).host}/practice/{slug}</p></footer>
  </main>;
}
