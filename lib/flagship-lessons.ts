export const flagshipLessons = {
  "first-five-minutes": {
    prepareId: "choose", readId: "notice", reflectionId: "reflect",
    videoChapter: "when-and-where", videoDuration: "18:39",
    original: "Chapters 3 and 4 introduce choosing a tree and beginning with five or ten minutes; Chair Meditation offers a seated reference.",
    adaptation: "The four observation steps, accessible position choices, natural breathing, and reflection form a new introductory sequence.",
    visual: "bark", visualPrompt: "Try looking before naming. Find one groove, one color, and one change in the light.",
  },
  "meditation-with-a-tree": {
    prepareId: "prepare", readId: "practice", reflectionId: "reflection",
    videoChapter: "who-and-how", videoDuration: "31:56",
    original: "Chapter 3 presents meditation as a Tree Yoga pathway; Chair Meditation appears on printed page 92.",
    adaptation: "This short sequence uses an open-eyed visual anchor, natural breathing, and usual seated or standing supports. It is not a reproduction of Chair Meditation.",
    visual: "needles", visualPrompt: "Let one visible detail be your anchor. Notice a line or shape, then gently return to it when attention wanders.",
  },
  "gentle-yoga-with-a-tree": {
    prepareId: "prepare", readId: "practice", reflectionId: "reflection",
    videoChapter: "who-and-how", videoDuration: "31:56",
    original: "Chapter 5 includes Mountain Pose and elbow and shoulder movement references on printed pages 53–54 and 66–68.",
    adaptation: "The new sequence uses eyes-open steadiness, usual supports, small arm movements, and a seated alternative. It does not ask the tree to bear your weight or reproduce the book’s flows.",
    visual: "positions", visualPrompt: "Begin with your arms at rest. Choose seated or standing, keep your usual supports, and use only the small movements described below.",
  },
  "tree-yoga-hiking": {
    prepareId: "prepare", readId: "practice", reflectionId: "reflection",
    videoChapter: "who-and-how", videoDuration: "31:56",
    original: "Chapter 3 introduces Tree Yoga Hiking on printed pages 15–16.",
    adaptation: "A short route, deliberate pauses, an accessible-path option, and a stationary alternative make a new beginner sequence. Distance is not the goal.",
    visual: "trail", visualPrompt: "Choose a route that suits you. Pause only in a suitable place with the path clear; observing several trees from one viewpoint is also a complete option.",
  },
} as const;
export type FlagshipSlug = keyof typeof flagshipLessons;
