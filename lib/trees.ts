export const trees = [
  {
    slug: "pine",
    name: "Pine",
    species: "Eastern white pine",
    scientificName: "Pinus strobus",
    image: "/images/trees/pine.webp",
    imageAlt: "Eastern white pine with a broad green crown and layered branches in an open landscape",
    imageWidth: 600,
    imageHeight: 450,
    themes: ["Constancy", "Clarity", "Perseverance"],
    invitation: "Return to one clear point. Notice what stays, what changes, and how you begin again.",
    introduction: "An evergreen can be an invitation to consider constancy. Spend time with an actual pine: its individual shape, the light between its needles, and the life around it. Let the encounter come before the meaning.",
    identity: [
      { title: "Needles", text: "Eastern white pine has soft, flexible, blue-green needles gathered in bundles of five. Observe an accessible branch or fallen needles without picking living growth." },
      { title: "Cones", text: "Its seed cones are long and narrow, often curved, with scales that lack sharp spines. Compare more than one feature when identifying a tree." },
      { title: "Place", text: "This species is native to eastern North America, including Massachusetts and New Hampshire. Pines belong to the genus Pinus; this page focuses on one species rather than treating every pine as identical." },
    ],
    seasons: "Evergreen does not mean unchanging. Eastern white pine retains green foliage across the seasons while older needle bundles eventually fall. On repeated visits, notice new growth, fallen needles, weather, and shifting light.",
    energies: [
      { title: "Constancy", observation: "Green needles remain visible across the seasons.", meaning: "Consider a commitment you can return to through changing circumstances. Constancy can include rest and adjustment.", question: "What is worth returning to?" },
      { title: "Clarity", observation: "A single needle bundle offers one small, distinct detail to observe.", meaning: "Let one detail become your anchor. Clarity begins here as a practice of choosing where to place your attention.", question: "What deserves your attention today?" },
      { title: "Perseverance", observation: "An individual tree carries the visible record of its growth in branches and bark.", meaning: "Use that continuing growth as a prompt to begin again patiently. Your next visit can be small and still matter.", question: "What is your next sustainable step?" },
    ],
    practice: [
      { title: "Arrive beside a pine", text: "Choose a permitted place with stable ground, suitable weather, and no hazardous branches overhead. Sit on a bench, use your usual seat or wheelchair, or stand with your normal supports. You can observe from a distance." },
      { title: "Find one clear point", text: "Choose a detail you can see comfortably: a needle bundle, a patch of bark, or an opening between branches. Keep your eyes open and let your breath continue naturally." },
      { title: "Return gently", text: "Notice thoughts and nearby sounds. Whenever attention wanders, return to your detail. There is no need to make the mind silent or produce a particular feeling." },
      { title: "Carry one intention", text: "After a few minutes, widen your attention to the surroundings. Ask what you would like to return to in your day. Choose one small action, then finish at your own pace." },
    ],
    reflection: "What stayed familiar, and what surprised you when you looked again?",
    sourceUrl: "https://plants.ces.ncsu.edu/plants/pinus-strobus/",
  },
] as const;

export function getTree(slug: string) {
  return trees.find((tree) => tree.slug === slug);
}
