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
  {
    slug: "paper-birch-yellow-birch", title: "Paper Birch & Yellow Birch", slugs: ["birch", "yellow-birch"],
    lead: "Start with naturally exposed bark, then compare leaves and seed-bearing structures. A young birch may not yet show its familiar bark.",
    features: [
      { title: "Bark", clues: ["Mature trunks typically have white bark peeling in papery sheets, with dark horizontal markings.", "Younger trunks often show shiny bronze or yellow-silver bark curling in thin strips; old bark becomes darker and scaly."], images: ["birch-bark.webp", "yellow-birch-bark.webp"], note: "Bark is the clearest starting clue in this pair, but age changes its appearance. Leave every layer attached." },
      { title: "Leaves", clues: ["Alternate, pointed leaves have toothed edges and are often broadly ovate.", "Alternate leaves also have pointed tips and doubly toothed edges, often with a more elongated outline."], images: ["birch-leaves.webp", "yellow-birch-leaves.webp"], note: "Leaf shape overlaps. Compare several mature leaves, then return to bark and seed structures." },
      { title: "Seed-bearing structures", clues: ["The cylindrical seed-bearing catkins commonly hang downward as they mature.", "Compact seed-bearing catkins are upright on short shoots."], images: ["birch-seeds.webp", "compare-yellow-birch-fruit.webp"], note: "These are seed-bearing structures, not the slender male flower catkins. Their seasonal stage matters; combine them with bark." },
    ],
  },
  {
    slug: "american-hornbeam-hophornbeam", title: "American Hornbeam & Hophornbeam", slugs: ["american-hornbeam", "american-hophornbeam"],
    lead: "Both are called ironwood. Smooth, muscular bark versus loose scales—and leafy bracts versus papery sacs—give better clues than the shared name.",
    features: [
      { title: "Bark", clues: ["Smooth gray bark follows fluted, sinewy-looking trunks and branches, inspiring the name musclewood.", "Mature gray-brown bark breaks into narrow, loose scales, giving the trunk a shaggy texture."], images: ["american-hornbeam.webp", "compare-hophornbeam-bark.webp"], note: "Compare mature bark without peeling it. Young hophornbeam can have smoother bark." },
      { title: "Leaves", clues: ["Simple, alternate leaves have double teeth and conspicuous side veins.", "Simple, alternate leaves also have double teeth and strong veins; the fruit photograph includes this foliage."], images: ["american-hornbeam-detail-1.webp", "american-hophornbeam-detail-1.webp"], note: "The leaves resemble each other closely. Bark and fruit offer stronger distinctions." },
      { title: "Fruit", clues: ["Small nutlets are accompanied by open, leafy, three-lobed bracts.", "Nutlets sit inside inflated, papery sacs grouped into hop-like clusters."], images: ["compare-hornbeam-fruit.webp", "american-hophornbeam-detail-1.webp"], note: "Look for leafy bracts versus enclosing sacs. Fruit may be absent outside its season." },
    ],
  },
  {
    slug: "white-ash-green-ash", title: "White Ash & Green Ash", slugs: ["white-ash", "green-ash"],
    lead: "Both have opposite, compound leaves and overlapping bark patterns. Mature samaras offer a stronger distinction when fruit is available.",
    features: [
      { title: "Leaves", clues: ["Usually five to nine leaflets, commonly seven; undersides are often whitish or noticeably paler.", "Usually five to nine leaflets too; undersides tend to be pale green, with very short leaflet stalks."], images: ["white-ash-detail-1.webp", "compare-green-ash-leaves.webp"], note: "Count whole leaves at the twig, not leaflets. Leaflet number and color overlap; these photographs do not show every underside." },
      { title: "Bark", clues: ["Mature bark often forms interlacing ridges and a diamond-like pattern.", "Mature bark also forms intersecting ridges and diamond-shaped furrows."], images: ["white-ash-detail-2.webp", "compare-green-ash-bark.webp"], note: "Bark alone does not reliably separate these ashes. Examine leaves and fallen fruit as well." },
      { title: "Winged fruits", clues: ["The wing attaches near the end of a relatively plump seed body and extends little along its sides.", "The seed body is narrower, with the wing extending farther alongside it."], images: ["compare-white-ash-seeds.webp", "compare-green-ash-seeds.webp"], note: "Compare mature, naturally fallen samaras. Only female trees bear fruit, so its absence does not settle identity. Images are not at a common scale." },
    ],
  },
] as const;

export function comparisonsForTree(slug: string) {
  return treeComparisons.filter(pair => pair.slugs.some(value => value === slug));
}
export function comparisonImage(filename: string) {
  for (const slug of [...new Set(treeComparisons.flatMap(pair => [...pair.slugs]))]) {
    const image = getTree(slug)?.detailImages.find(photo => photo.image.endsWith("/" + filename));
    if (image) return image;
    const tree = getTree(slug);
    if (tree?.image.endsWith("/" + filename)) return { image: tree.image, imageAlt: tree.imageAlt, imageWidth: tree.imageWidth, imageHeight: tree.imageHeight, credit: tree.credit };
  }
  const image = Object.values(extraImages).find(photo => photo.image.endsWith("/" + filename));
  if (!image) throw new Error(`Missing comparison photograph: ${filename}`);
  return image;
}

// Supplement the profile references where a comparative feature needs a clearer source.
export function additionalComparisonReferences(slug: string): readonly { label: string; url: string }[] {
  if (slug === "paper-birch-yellow-birch") return [{ label: "UNH Extension: Yellow birch seed catkins", url: "https://extension.unh.edu/blog/2018/08/champions-mid-succession-forests" }];
  if (slug === "white-ash-green-ash") return [
    { label: "USDA: White ash plant guide", url: "https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_fram2.pdf" },
    { label: "Oregon State University: Green ash", url: "https://landscapeplants.oregonstate.edu/plants/fraxinus-pennsylvanica" },
  ];
  return [];
}
