import Link from "next/link";
import { comparisonsForTree, treeComparisons } from "../../lib/tree-comparisons";

export default function TreeComparisonLinks({ treeSlug }: { treeSlug?: string }) {
  const pairs = treeSlug ? comparisonsForTree(treeSlug) : treeComparisons;
  if (!pairs.length) return null;
  return <aside className="tree-comparison-links" aria-label="Compare similar trees">
    <p className="section-kicker">Look closer · Tree identification</p>
    <h2>Compare similar trees.</h2>
    <p>Notice the differences in foliage, bark, and fruits or cones. Match several features before naming a tree.</p>
    <div>{pairs.map(pair => <Link key={pair.slug} href={`/compare-trees/${pair.slug}`} prefetch={false}>{pair.title}<span>Compare photographs and clues →</span></Link>)}</div>
  </aside>;
}
