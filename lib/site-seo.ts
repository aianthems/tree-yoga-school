import { championMapDescription } from "./champion-states";
import type { Metadata } from "next";
import { treeComparisons } from "./tree-comparisons";
import { trees } from "./trees";
import { introLessons } from "./intro-lessons";
import { bookChapters } from "./book-chapters";
import { beginnerJourney } from "./beginner-journey";
import { treeVisits } from "./tree-visits";

export const siteOrigin = "https://treeyogaschool.com";
export const siteDescription = "Rooted in nature. Practiced in the real world. A living school for tree hugging, yoga, meditation, and learning with trees.";
export const discoveryPages = [
  { path: "/", title: "Tree Yoga School", description: siteDescription },
  { path: "/tree-hugging", title: "Tree Hugging: Practice & Benefits", description: "A gentle tree-hugging meditation, research on nature and wellbeing, and an invitation to care for trees." },
  { path: "/practice/tree-hugging", title: "Tree Hugging Outdoor Practice", description: "Five gentle steps for tree hugging, with seated and no-touch options, an optional timer, and printable guidance." },
  { path: "/trees", title: "Tree Library", description: "Meet trees through observation, contemplative themes, and outdoor practices." },
  { path: "/champion-trees", title: "Champion Tree Map", description: championMapDescription },
  { path: "/tree-visits", title: "Trees to Visit", description: "Plan a visit to a remarkable tree with arrival guidance, walking details, official sources, and a practice." },
  { path: "/begin-here", title: "Begin Here", description: "Begin Tree Yoga with a short lesson or a seven-day journey at your own pace." },
  { path: "/begin-here/seven-days", title: "Seven Days with a Tree", description: "Explore observation, meditation, gentle movement, and walking in seven short practices." },
  { path: "/book", title: "Explore the Book", description: "Explore the seven chapters of Alex Julian’s Tree Yoga School." },
  { path: "/lessons/first-five-minutes", title: "Your First Five Minutes with a Tree", description: "Begin with observation, natural breathing, and a few minutes beside a tree." },
  { path: "/practice/first-five-minutes", title: "Any Tree Outdoor Practice", description: "Readable observation steps, an optional timer, and a printable practice sheet." },
  ...treeComparisons.map(pair => ({ path: `/compare-trees/${pair.slug}`, title: `${pair.title}: Compare Similar Trees`, description: pair.lead })),
  ...trees.flatMap(tree => [
    { path: `/trees/${tree.slug}`, title: `${tree.name}: Energy & Practice`, description: `Meet ${tree.species} and explore ${tree.themes.join(", ").toLowerCase()} through observation and a five-minute practice.` },
    { path: `/practice/${tree.slug}`, title: `${tree.name} Outdoor Practice`, description: tree.practiceIntroduction },
  ]),
  ...introLessons.map(lesson => ({ path: `/lessons/${lesson.slug}`, title: lesson.title, description: lesson.purpose })),
  ...bookChapters.map(chapter => ({ path: `/book/${chapter.slug}`, title: chapter.title, description: chapter.description })),
  ...beginnerJourney.map(day => ({ path: `/begin-here/seven-days/${day.day}`, title: `Day ${day.day}: ${day.title}`, description: day.purpose })),
  ...treeVisits.map(visit => ({ path: `/tree-visits/${visit.slug}`, title: `${visit.name}: Visit Guide`, description: `Plan a visit to ${visit.place}. Arrival, parking, walking, access information, and a linked outdoor practice.` })),
];

// Local builds retain production SEO; Vercel previews/development/custom environments do not index.
export function isIndexableDeployment(environment = process.env.VERCEL_ENV): boolean {
  return !environment || environment === "production";
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const image = { url: `${siteOrigin}/social-preview?path=${encodeURIComponent(path)}`, width: 1200, height: 630, alt: `${title.replace(/ \| Tree Yoga School$/, "")} · Tree Yoga School` };
  return { title, description, robots: { index: isIndexableDeployment(), follow: isIndexableDeployment() }, alternates: { canonical: `${siteOrigin}${path}` },
    openGraph: { title, description, url: `${siteOrigin}${path}`, siteName: "Tree Yoga School", type: "website", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
