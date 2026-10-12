import { poses } from "./book-pose-records.json";

export const bookPoses = poses;
export const poseHref = (pose: { slug: string }) => `/${pose.slug}`;
export const poseDescription = (pose: { title: string; printedPage: number }) =>
  `${pose.title}: original guidance from Alex Julian’s Tree Yoga School, printed page ${pose.printedPage}. Explore the pose and return to the complete reference library.`;

export const poseGroups = Array.from(new Set(bookPoses.map(pose => pose.title[0])))
  .sort().map(letter => ({ letter, poses: bookPoses.filter(pose => pose.title.startsWith(letter)) }));
