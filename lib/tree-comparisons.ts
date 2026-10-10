import { getTree } from "./trees";
import extraImages from "./compare-tree-images.json";

export const treeComparisons = [
  {
    slug: "white-oak-bur-oak", title: "White Oak & Bur Oak", slugs: ["oak", "bur-oak"],
    lead: "Both have rounded leaf lobes. Start with the acorn cup, then compare the leaf outline.",
    features: [
      { title: "Leaves", clues: ["Rounded, fingerlike lobes without bristle tips; the blade is usually widest around its middle.", "Rounded lobes too, often with a deep narrowing near the middle and a broader upper portion. Leaf shapes vary."], images: ["oak-leaves.webp", "compare-bur-oak-leaves.webp"], note: "Compare several leaves rather than one outline; the depth of the lobes varies." },
      { title: "Bark", clues: ["Light ash-gray bark develops scaly blocks and plates.", "Mature bark has deeper furrows and rough ridges."], images: ["oak-bark.webp", "compare-bur-oak-bark.webp"], note: "Bark changes with age. Compare mature trunks, and use it as supporting evidence." },
      { title: "Acorns", clues: ["A lumpy, unfringed cap covers roughly a quarter to a third of the nut.", "A substantial cup has a conspicuous fringe around its rim—the strongest clue in this pair."], images: ["oak-acorn.webp", "bur-oak-detail-1.webp"], note: "Acorns mature in autumn; these photographs show different stages and are not to a common scale." },
    ],
  },
  {
    slug: "red-maple-sugar-maple", title: "Red Maple & Sugar Maple", slugs: ["red-maple", "maple"],
    lead: "Both have opposite leaves and paired winged fruits. Look at the leaf edges before autumn color.",
    features: [
      { title: "Leaves", clues: ["Usually three to five pointed lobes, with small teeth along the edges.", "Typically five lobes, with smooth edges between the major points."], images: ["red-maple-leaves.webp", "maple-leaves.webp"], note: "The red maple photograph shows emerging leaves. Check fully expanded leaves too; red autumn color occurs in both species." },
      { title: "Bark", clues: ["Young bark is smooth gray; older bark breaks into ridges and plates.", "Older bark develops long, irregular, thick ridges or plates."], images: ["red-maple-bark.webp", "maple-bark.webp"], note: "These bark patterns overlap. Bark alone is a weak way to separate the two." },
      { title: "Winged fruits", clues: ["Paired samaras commonly form a V. They mature earlier, in spring or early summer.", "Paired samaras commonly form a U. They develop later, into summer and autumn."], images: ["red-maple-samaras.webp", "maple-samaras.webp"], note: "Timing varies with climate. Wing angle and fruit color vary too; combine them with leaf margins." },
    ],
  },
  {
    slug: "eastern-redcedar-northern-white-cedar", title: "Eastern Redcedar & Northern White-Cedar", slugs: ["eastern-redcedar", "cedar"],
    lead: "The shared name ‘cedar’ hides two different genera. Compare branchlet shape and seed cones.",
    features: [
      { title: "Foliage", clues: ["Mature leaves overlap as scales on branchlets; juvenile shoots can have pointed, needle-like leaves.", "Scale-like leaves form distinctly flattened, fanlike sprays."], images: ["eastern-redcedar-detail.webp", "cedar-foliage.webp"], note: "The redcedar photograph includes needle-like foliage and cones. Garden cultivars and juvenile shoots can look different." },
      { title: "Bark", clues: ["Grayish to reddish-brown bark peels into narrow fibrous strips.", "Gray to reddish-brown bark also peels in long, narrow strips."], images: ["compare-redcedar-bark.webp", "cedar-bark.webp"], note: "Both can have stringy bark. The redcedar close-up includes exposed inner bark at a damaged area; do not peel bark to inspect it. Foliage and cones provide the clearer distinction." },
      { title: "Seed cones", clues: ["Female trees bear rounded, blue, frosted-looking cones that resemble berries. They are not true fruits.", "Small oblong cones have visible scales and turn light brown as they mature."], images: ["eastern-redcedar-detail.webp", "cedar-cones.webp"], note: "White-cedar cones are developing in the photograph. Not every redcedar bears blue cones; their absence does not settle identification." },
    ],
  },
] as const;

export function comparisonsForTree(slug: string) {
  return treeComparisons.filter(pair => pair.slugs.some(value => value === slug));
}
export function comparisonImage(filename: string) {
  for (const slug of ["oak", "bur-oak", "red-maple", "maple", "eastern-redcedar", "cedar"]) {
    const image = getTree(slug)?.detailImages.find(photo => photo.image.endsWith("/" + filename));
    if (image) return image;
  }
  const image = Object.values(extraImages).find(photo => photo.image.endsWith("/" + filename));
  if (!image) throw new Error(`Missing comparison photograph: ${filename}`);
  return image;
}
