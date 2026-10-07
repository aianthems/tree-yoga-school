import type { Tree } from "./trees";

type Images = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const fourTreeImages: Record<string, Images> = {
  "american-hornbeam": {
    "image": "/images/trees/american-hornbeam.webp",
    "imageAlt": "Smooth bark on \"muscled,\" fluted, sinewy branches.",
    "imageWidth": 800,
    "imageHeight": 600,
    "credit": {
      "photographer": "Katja Schulz",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/carpinus-caroliniana/",
      "label": "Carpinus caroliniana"
    },
    "detailImages": [
      {
        "image": "/images/trees/american-hornbeam-detail-1.webp",
        "imageAlt": "Shoots with ovate, alternate leaves & strong pinnate venation.",
        "imageWidth": 600,
        "imageHeight": 451,
        "credit": {
          "photographer": "Homer Edward Price",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/carpinus-caroliniana/",
          "label": "Carpinus caroliniana"
        }
      },
      {
        "image": "/images/trees/american-hornbeam-detail-2.webp",
        "imageAlt": "Leaves showing orange and gold coloration.",
        "imageWidth": 600,
        "imageHeight": 440,
        "credit": {
          "photographer": "Wendy Cutler",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/carpinus-caroliniana/",
          "label": "Carpinus caroliniana. Fall color"
        }
      }
    ]
  },
  "shagbark-hickory": {
    "image": "/images/trees/shagbark-hickory.webp",
    "imageAlt": "Form",
    "imageWidth": 510,
    "imageHeight": 600,
    "credit": {
      "photographer": "F. D. Richards",
      "license": "CC-BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/carya-ovata/",
      "label": "Form"
    },
    "detailImages": [
      {
        "image": "/images/trees/shagbark-hickory-detail-1.webp",
        "imageAlt": "Shaggy bark",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Kevin Faccenda",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/carya-ovata/",
          "label": "Shaggy bark"
        }
      },
      {
        "image": "/images/trees/shagbark-hickory-detail-2.webp",
        "imageAlt": "Leaves in May",
        "imageWidth": 1024,
        "imageHeight": 576,
        "credit": {
          "photographer": "Plant Image Library",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/carya-ovata/",
          "label": "Leaves in May"
        }
      }
    ]
  },
  "silver-maple": {
    "image": "/images/trees/silver-maple.webp",
    "imageAlt": "Foliage",
    "imageWidth": 586,
    "imageHeight": 480,
    "credit": {
      "photographer": "Olegivvit",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharinum/",
      "label": "Foliage"
    },
    "detailImages": [
      {
        "image": "/images/trees/silver-maple-detail-1.webp",
        "imageAlt": "Older bark",
        "imageWidth": 360,
        "imageHeight": 480,
        "credit": {
          "photographer": "Dimìtar Nàydenov",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharinum/",
          "label": "Older bark"
        }
      },
      {
        "image": "/images/trees/silver-maple-detail-2.webp",
        "imageAlt": "Samaras (fruits)",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Jason Sturner",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharinum/",
          "label": "Samaras (fruits)"
        }
      }
    ]
  },
  "black-cherry": {
    "image": "/images/trees/black-cherry.webp",
    "imageAlt": "Form",
    "imageWidth": 768,
    "imageHeight": 1024,
    "credit": {
      "photographer": "Kathleen Moore",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/prunus-serotina/",
      "label": "Prunus serotina. Form"
    },
    "detailImages": [
      {
        "image": "/images/trees/black-cherry-detail-1.webp",
        "imageAlt": "Leaf arrangement buds",
        "imageWidth": 1024,
        "imageHeight": 768,
        "credit": {
          "photographer": "Kathleen Moore",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/prunus-serotina/",
          "label": "Prunus serotina. Leaf arrangement buds"
        }
      },
      {
        "image": "/images/trees/black-cherry-detail-2.webp",
        "imageAlt": "Bark & Form - Fall - Buncombe Co., NC",
        "imageWidth": 420,
        "imageHeight": 315,
        "credit": {
          "photographer": "Randy Harter",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/prunus-serotina/",
          "label": "Prunus serotina. Bark & Form - Fall - Buncombe Co., NC"
        }
      },
      {
        "image": "/images/trees/black-cherry-detail-3.webp",
        "imageAlt": "Red berries and green leaves.",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Lee Anne McConnaughey",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/prunus-serotina/",
          "label": "Prunus serotina. Fruit"
        }
      }
    ]
  }
};
