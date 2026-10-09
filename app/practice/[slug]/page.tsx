import { pageMetadata, siteOrigin } from "../../../lib/site-seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trees, getTree } from "../../../lib/trees";
import { treeHuggingPractice } from "../../../lib/tree-hugging";
import { firstPractice } from "../../../lib/first-practice";
import PracticeControls from "../../components/practice-controls";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...trees.map(({ slug }) => ({ slug })), { slug: "first-five-minutes" }, { slug: "tree-hugging" }];
}
function getPractice(slug: string) {
  if (slug === "tree-hugging") return {
    title: treeHuggingPractice.title, label: "Tree Hugging", steps: treeHuggingPractice.steps,
    reflection: treeHuggingPractice.reflection, back: "/tree-hugging", backLabel: "Tree Hugging: practice & benefits",
  };
  if (slug === "first-five-minutes") return {
    title: firstPractice.title, label: "Any tree", steps: firstPractice.steps,
    reflection: firstPractice.reflection, back: "/lessons/first-five-minutes", backLabel: "Full first lesson",
  };
  const tree = getTree(slug);
  if (!tree) notFound();
  return { title: tree.practiceTitle, label: tree.name, steps: tree.practice,
    reflection: tree.reflection, back: `/trees/${tree.slug}#practice`, backLabel: `Back to ${tree.name}` };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);
  return pageMetadata(`/practice/${slug}`, `${practice.label} Outdoor Practice | Tree Yoga School`, `Practice beside a tree: ${practice.title} Readable steps, an optional five-minute timer, and a printable practice sheet.`);
}
export default async function OutdoorPractice({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  return <main id="content" className="outdoor-practice">
    <nav className="outdoor-navigation" aria-label="Practice navigation"><Link href={practice.back}>← {practice.backLabel}</Link><Link href="/trees">Tree Library</Link></nav>
    <header><p className="outdoor-eyebrow">Tree Yoga School · Practice beside a tree</p><p>{practice.label} · About five minutes</p><h1>{practice.title}</h1><p>Read once, then give your attention to the tree. Spend a few minutes, or less if that suits you.</p></header>
    <section className="outdoor-settle" aria-labelledby="settle"><h2 id="settle">Find a comfortable place.</h2><p>Sit or stand on stable ground in a permitted place, keeping your usual supports. A bench, wheelchair, or accessible path is enough. Keep paths clear and let your breathing stay natural. There is no need to touch the tree.</p></section>
    <ol className="outdoor-steps">{practice.steps.map(step => <li key={step.title}><h2>{step.title}</h2><p>{step.text}</p></li>)}</ol>
    <PracticeControls key={slug} />
    <section className="outdoor-reflection" aria-labelledby="reflection"><p className="outdoor-eyebrow">When you are ready</p><h2 id="reflection">{practice.reflection}</h2><p>Reflect quietly, or write a sentence in your own notebook. Let the visit be enough.</p></section>
    <footer><p>Leave the tree and its surroundings undisturbed.</p><Link href={practice.back}>{practice.backLabel} →</Link><p className="outdoor-print-source">Tree Yoga School · {new URL(siteOrigin).host}/practice/{slug}</p></footer>
  </main>;
}
