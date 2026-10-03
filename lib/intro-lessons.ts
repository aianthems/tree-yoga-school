export const bookUrl = "https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf";

export type IntroLesson = {
  slug: string; number: string; title: string; duration: string; purpose: string;
  preparation: string; options: { title: string; text: string }[];
  steps: { title: string; text: string }[]; pause: string; reflection: string;
  adaptation: string; sources: { title: string; page: number; note: string }[];
};

export const introLessons: IntroLesson[] = [
  {
    slug: "meditation-with-a-tree", number: "01", title: "Meditation with a Tree", duration: "5–10 minutes",
    purpose: "Stay with one tree a little longer. Explore returning your attention patiently, without needing your mind or surroundings to become quiet.",
    preparation: "Choose a permitted place with stable ground, clear of damaged or hanging branches and other hazards. Use a bench, stable chair, wheelchair, or comfortable standing position. Choose suitable weather; you can observe from an accessible path without touching the tree.",
    options: [
      { title: "Seated", text: "Use your usual supports. Let your feet rest on the ground or their usual support, and choose a position you can maintain comfortably." },
      { title: "Standing", text: "Keep your usual support nearby or in use. Keep your eyes open. Change position or sit whenever you need to." },
    ],
    steps: [
      { title: "Arrive", text: "Notice the support beneath you. Let your breath continue naturally. There is no need to count it, deepen it, or hold it." },
      { title: "Choose an anchor", text: "Rest your attention on one detail of the tree: bark, leaves, or a branch. Let your gaze stay soft and move when it needs to." },
      { title: "Notice wandering", text: "Thoughts and sounds will come and go. When you realize your attention has moved, return gently to your chosen detail. You have not failed." },
      { title: "Widen and finish", text: "Notice the wider surroundings again. Let the practice end after about 5–10 minutes, or sooner. Take your time before moving on." },
    ],
    pause: "Put the screen aside. Let one tree hold your attention for a little while.",
    reflection: "What was it like to return your attention without judging where it had gone?",
    adaptation: "This new sequence develops the book’s meditation pathway and Chair Meditation into an introductory observation practice. Natural breathing, open eyes, usual supports, the duration, and the reflection are adaptations for this edition.",
    sources: [
      { title: "Chapter 3, printed pp. 13–15", page: 18, note: "The meditation pathway." },
      { title: "Chapter 4, printed p. 28", page: 33, note: "Starting with 5 or 10 minutes." },
      { title: "Chapter 5, Chair Meditation, printed p. 92", page: 97, note: "A seated practice beside a tree." },
    ],
  },
  {
    slug: "gentle-yoga-with-a-tree", number: "02", title: "Gentle Yoga with a Tree", duration: "About 5 minutes",
    purpose: "Bring a little comfortable movement into your time with a tree. Begin with steadiness and a small range of motion that suits you today.",
    preparation: "Choose a permitted place with firm, level ground, enough room, and no hazardous branches overhead. Keep your usual mobility aids and supports. This introductory sequence stays beside the tree without using it to bear weight. Stop any movement that causes pain, dizziness, or unsteadiness; rest instead.",
    options: [
      { title: "Seated", text: "Use a stable chair, bench, or your usual seat. Keep your normal supports and feet supported. The small arm movements can be practiced here." },
      { title: "Standing", text: "Stand comfortably with both feet supported and eyes open. Use your usual support. Skip an arm movement if it would require letting go of support you need." },
    ],
    steps: [
      { title: "Find your steady position", text: "Notice your feet or seat. Let your posture feel comfortable, with space to breathe. Observe the tree without leaning on it." },
      { title: "Bend and straighten gently", text: "Keep your upper arms relaxed beside you. Slowly bend and straighten one elbow a few times within a comfortable range, then the other. Let your breath remain natural." },
      { title: "Explore a small arm movement", text: "If comfortable, move one arm slightly forward and return it to your side, a few times. Keep the movement small; there is no need to reach overhead or behind you. Repeat with the other arm, or skip this step." },
      { title: "Become still again", text: "Let your arms rest. Notice how stillness feels after movement. Look at one detail of the tree, then finish at your own pace." },
    ],
    pause: "Put the screen aside. Explore a few small movements, then return to stillness.",
    reflection: "Which movement or position felt most comfortable and steady today?",
    adaptation: "This is a new introductory sequence informed by Mountain Pose and the book’s elbow and shoulder movement references. Seated options, smaller movements, natural breathing, and avoiding tree-supported loading are adaptations. It is not a reproduction of the book’s flows or circle exercises.",
    sources: [
      { title: "Chapter 3, printed pp. 16–17", page: 21, note: "Choosing a suitable tree and setting." },
      { title: "Chapter 5, Mountain Pose, printed pp. 53–54", page: 58, note: "Steady positioning beside a tree." },
      { title: "Chapter 5, printed pp. 66–68", page: 71, note: "Elbow and shoulder movement references, simplified for this lesson." },
    ],
  },
  {
    slug: "tree-yoga-hiking", number: "03", title: "Tree Yoga Hiking", duration: "About 10 minutes",
    purpose: "Turn a short, familiar walk into a practice of noticing. Give yourself permission to pause rather than making distance the goal.",
    preparation: "Choose a familiar, permitted route suited to your mobility, with stable surfaces and safe places to pause. Check weather and daylight, bring what you normally need, and keep navigation and communication tools available. Stay on permitted paths and leave roots, bark, plants, and wildlife undisturbed.",
    options: [
      { title: "Walk or move along an accessible path", text: "Use your usual pace, wheelchair, or mobility aid. Pick a route that lets you return comfortably. Keep your attention on the route while moving." },
      { title: "Stay in one place", text: "If a walk is not suitable today, observe two or three trees from a comfortable seat or accessible viewpoint. The practice is noticing, not covering distance." },
    ],
    steps: [
      { title: "Begin slowly", text: "Move at a comfortable pace. Notice the path and your surroundings. You do not need to synchronize breathing with movement." },
      { title: "Pause at one tree", text: "Stop in a safe place without blocking the path. Observe a detail you might have passed by: the trunk, a branch, or the shape of the canopy." },
      { title: "Notice another", text: "Continue only as far as suits you. Pause near a second tree and notice one difference. You can make this comparison from one viewpoint too." },
      { title: "Return with attention", text: "Head back while you still feel comfortable, or finish at your viewpoint. Notice something familiar as though you were seeing it for the first time." },
    ],
    pause: "Put the screen aside when you can. Take a short walk with one or two deliberate pauses.",
    reflection: "What changed when you gave yourself permission to stop and notice?",
    adaptation: "This short route with deliberate pauses adapts the book’s Tree Yoga Hiking pathway. The accessible and stationary alternatives, approximate duration, and reflection are new. Physical contact with trees is not required.",
    sources: [
      { title: "Chapter 3, Tree Yoga Hiking, printed pp. 15–16", page: 20, note: "Slowing down and noticing individual trees." },
      { title: "Chapter 4, printed p. 28", page: 33, note: "Beginning with a small, sustainable practice." },
    ],
  },
];
