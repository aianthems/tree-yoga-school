type PoseImage = { src: string; alt: string; width: number; height: number };

export const bookPoseImages: Record<string, PoseImage> = {
  "yoga-nidra": {
    src: "https://media.treeyogaschool.com/images/tree-yoga-poses/savasana.webp",
    alt: "Resting in Savasana on a mat beside a tree in an autumn woodland",
    width: 2048, height: 1185,
  },
  "wide-v-sit": {
    src: "https://media.treeyogaschool.com/images/tree-yoga-poses/wide-v-sit.webp",
    alt: "Seated in a wide V with both hands resting against a tree trunk",
    width: 2048, height: 1173,
  },
  "wheel-pose": {
    src: "https://media.treeyogaschool.com/images/tree-yoga-poses/wheel-pose.webp",
    alt: "Practicing Wheel Pose on a mat beside a tree, with hands and feet on the ground",
    width: 2048, height: 1167,
  },
  "warrior-iii": {
    src: "https://media.treeyogaschool.com/images/tree-yoga-poses/warrior-iii.webp",
    alt: "Balancing in Warrior III with one leg extended behind and hands against a tree",
    width: 2048, height: 1160,
  },
  "warrior-ii": {
    src: "https://media.treeyogaschool.com/images/tree-yoga-poses/warrior-ii.webp",
    alt: "Practicing Warrior II beside a tree, with arms extended and the front knee bent",
    width: 2048, height: 1158,
  },
};
