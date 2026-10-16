import { firstPractice } from "./first-practice";
import { introLessons } from "./intro-lessons";

// Lesson and outdoor guide share their teaching sequence so they stay in sync.
export const lessonPractices = [
  {
    slug: "first-five-minutes", title: firstPractice.title, label: "Your First Five Minutes",
    duration: "About 5 minutes", steps: firstPractice.steps, reflection: firstPractice.reflection,
    preparation: "Sit or stand on stable ground in a permitted place, clear of hazardous branches and traffic. Keep your usual supports, leave paths clear, and let your breathing stay natural. You can observe without touching the tree.",
    options: [], lessonHref: "/lessons/first-five-minutes", reflectionHref: "/lessons/first-five-minutes#reflect",
  },
  ...introLessons.map(lesson => ({
    slug: lesson.slug, title: lesson.title, label: lesson.title, duration: lesson.duration,
    steps: lesson.steps, reflection: lesson.reflection, preparation: lesson.preparation,
    options: lesson.options, lessonHref: `/lessons/${lesson.slug}`, reflectionHref: `/lessons/${lesson.slug}#reflection`,
  })),
];
export function getLessonPractice(slug: string) {
  return lessonPractices.find(practice => practice.slug === slug);
}
