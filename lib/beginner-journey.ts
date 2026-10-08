import { firstPractice } from "./first-practice";
import { introLessons } from "./intro-lessons";

type JourneyLink = { title: string; href: string };
export type JourneyDay = {
  day: number; title: string; duration: string; purpose: string; preparation: string;
  options: readonly { title: string; text: string }[];
  steps: readonly { title: string; text: string }[];
  reflection: string; links: readonly JourneyLink[];
};
const observationPreparation = "Choose a tree in a permitted place with stable ground, clear of traffic and hazardous branches. Sit or stand comfortably, using your usual supports. You can observe from a bench, wheelchair, or accessible path. Leave the tree and its surroundings undisturbed.";
const observationOptions = [
  { title: "One familiar tree", text: "Return to the same tree when convenient. An ordinary tree near home is enough; you do not need a champion tree or a special trip." },
  { title: "Adapt the visit", text: "Shorten the practice or observe from a comfortable window viewpoint if an outdoor visit is not suitable today." },
];
function lessonDay(day: number, slug: string, title: string): JourneyDay {
  const lesson = introLessons.find(item => item.slug === slug);
  if (!lesson) throw new Error(`Missing journey lesson: ${slug}`);
  return { day, title, duration: lesson.duration, purpose: lesson.purpose,
    preparation: lesson.preparation, options: lesson.options, steps: lesson.steps,
    reflection: lesson.reflection, links: [{ title: `Full lesson: ${lesson.title}`, href: `/lessons/${slug}` }] };
}
export const beginnerJourney: readonly JourneyDay[] = [
  {
    day: 1, title: "Meet one tree", duration: "About 5 minutes",
    purpose: "Begin with a simple encounter. Give one tree your attention without needing to identify it or feel anything particular.",
    preparation: observationPreparation, options: observationOptions, steps: firstPractice.steps,
    reflection: firstPractice.reflection,
    links: [{ title: "Open outdoor practice", href: "/practice/first-five-minutes" }, { title: "Full lesson: Your First Five Minutes", href: "/lessons/first-five-minutes" }],
  },
  {
    day: 2, title: "Look a little closer", duration: "About 5 minutes",
    purpose: "Return to observation with a smaller focus. Discover how much there is to notice in one ordinary detail.",
    preparation: observationPreparation, options: observationOptions,
    steps: [
      { title: "Arrive again", text: "Settle at a comfortable viewpoint. Notice the tree as a whole before choosing a detail." },
      { title: "Choose one detail", text: "Look at a patch of bark, a branch outline, or a leaf you can see without reaching. Notice its shape, texture, or color." },
      { title: "Give it another moment", text: "Keep looking gently. Notice light, movement, or a space you missed at first. Let your breathing remain natural." },
      { title: "Widen the view", text: "Take in the whole tree and its surroundings again. Finish whenever you like." },
    ],
    reflection: "What appeared when you stayed with one detail a little longer?",
    links: [{ title: "Revisit the observation practice", href: "/practice/first-five-minutes" }],
  },
  lessonDay(3, "meditation-with-a-tree", "Return your attention"),
  lessonDay(4, "gentle-yoga-with-a-tree", "Explore gentle movement"),
  lessonDay(5, "tree-yoga-hiking", "Take a noticing walk"),
  {
    day: 6, title: "Get to know your tree", duration: "5–10 minutes",
    purpose: "Connect direct observation with curiosity about the tree itself. Let the Tree Library offer a practice or a question to explore.",
    preparation: observationPreparation, options: observationOptions,
    steps: [
      { title: "Begin with what you see", text: "Notice the crown, bark, and any visible leaves or needles from your comfortable viewpoint. You do not need to collect anything." },
      { title: "Explore the Library", text: "Before or after your visit, browse a species you recognize or want to learn about. The profiles are starting points for observation, not complete identification keys. It is fine to leave your tree unnamed." },
      { title: "Choose a practice", text: "If a Library profile fits your tree, try its outdoor practice. Otherwise, return to First Five Minutes and stay with direct observation." },
      { title: "Notice your own response", text: "Consider what interested you. The Library’s themes are invitations to reflect; your experience may suggest a different meaning, or none at all." },
    ],
    reflection: "What would you like to learn about this tree on another visit?",
    links: [{ title: "Explore the Tree Library", href: "/trees" }, { title: "Open First Five Minutes outdoors", href: "/practice/first-five-minutes" }],
  },
  {
    day: 7, title: "Make the practice your own", duration: "5–10 minutes",
    purpose: "Return to the pathway that suited you best. Finish the journey with a small, realistic invitation to begin again.",
    preparation: "Choose a familiar, permitted setting. Use the preparation and seated, standing, or stationary options in your chosen lesson below. A shorter visit is welcome.",
    options: observationOptions,
    steps: [
      { title: "Recall one moment", text: "Think of something you noticed during these visits: a detail, a sound, a comfortable movement, or a pause along a path." },
      { title: "Choose your pathway", text: "Choose observation, meditation, gentle movement, or walking from the links below. One practice is enough; you do not need to combine them." },
      { title: "Practice at your own pace", text: "Repeat the lesson you chose, adapting its duration and position to today. Give yourself a few minutes with the tree." },
      { title: "Choose a small return", text: "Consider one place and an occasion when you might practice again. A few minutes near home can be a complete next visit." },
    ],
    reflection: "Which practice would you like to return to, and what would make that return easy?",
    links: [
      { title: "Observation · First Five Minutes", href: "/practice/first-five-minutes" },
      { title: "Meditation with a Tree", href: "/lessons/meditation-with-a-tree" },
      { title: "Gentle Yoga with a Tree", href: "/lessons/gentle-yoga-with-a-tree" },
      { title: "Tree Yoga Hiking", href: "/lessons/tree-yoga-hiking" },
    ],
  },
];
