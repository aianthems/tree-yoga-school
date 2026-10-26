import type { Tree } from "./trees";
type TreeImages = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const visitConnectionImages: Record<string, TreeImages> = {
  "southern-live-oak": {
    "image": "/images/trees/southern-live-oak.webp",
    "imageAlt": "Mature Southern live oak with a broad spreading crown",
    "credit": {
      "photographer": "Lucy Bradley",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/about/cc0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-virginiana/",
      "label": "Mature form"
    },
    "imageWidth": 1024,
    "imageHeight": 768,
    "detailImages": [
      {
        "image": "/images/trees/southern-live-oak-acorns.webp",
        "imageAlt": "Southern live oak acorns and leathery leaves on a twig",
        "credit": {
          "photographer": "Marcus Q on Flickr",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-virginiana/",
          "label": "Acorns and leaves"
        },
        "imageWidth": 1024,
        "imageHeight": 682
      }
    ]
  },
  "giant-sequoia": {
    "image": "/images/trees/giant-sequoia.webp",
    "imageAlt": "Giant sequoia trunk and towering evergreen crown",
    "credit": {
      "photographer": "A. Poulos",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/sequoiadendron-giganteum/",
      "label": "Mature form"
    },
    "imageWidth": 768,
    "imageHeight": 1024,
    "detailImages": [
      {
        "image": "/images/trees/giant-sequoia-foliage.webp",
        "imageAlt": "Close view of pointed giant sequoia foliage",
        "credit": {
          "photographer": "Aethonatic",
          "license": "CC0",
          "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sequoiadendron_giganteum_leaves_-_22_March_2026.jpg",
          "label": "Foliage"
        },
        "imageWidth": 1200,
        "imageHeight": 801
      }
    ]
  },
  "american-yellowwood": {
    "image": "/images/trees/american-yellowwood.webp",
    "imageAlt": "American yellowwood trunk and leafy crown",
    "credit": {
      "photographer": "David J Stang",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/cladrastis-kentukea/",
      "label": "Tree form"
    },
    "imageWidth": 682,
    "imageHeight": 1024,
    "detailImages": [
      {
        "image": "/images/trees/american-yellowwood-leaves.webp",
        "imageAlt": "Pinnately compound American yellowwood leaves",
        "credit": {
          "photographer": "David J Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cladrastis-kentukea/",
          "label": "Leaves"
        },
        "imageWidth": 682,
        "imageHeight": 1024
      },
      {
        "image": "/images/trees/american-yellowwood-flowers.webp",
        "imageAlt": "Hanging clusters of white American yellowwood flowers",
        "credit": {
          "photographer": "Agnieszka Kwiecie\u0144",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cladrastis-kentukea/",
          "label": "Flowers"
        },
        "imageWidth": 768,
        "imageHeight": 1024
      }
    ]
  },
  "castor-aralia": {
    "image": "/images/trees/castor-aralia.webp",
    "imageAlt": "Lobed castor aralia leaves beside the trunk",
    "credit": {
      "photographer": "Sten Porse",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kalopanax-pictus-leaves.JPG",
      "label": "Leaves and trunk"
    },
    "imageWidth": 1200,
    "imageHeight": 765,
    "detailImages": [
      {
        "image": "/images/trees/castor-aralia-flowers.webp",
        "imageAlt": "Rounded clusters of creamy white castor aralia flowers",
        "credit": {
          "photographer": "Qwert1234",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/kalopanax-septemlobus/",
          "label": "Flowers"
        },
        "imageWidth": 768,
        "imageHeight": 1024
      }
    ]
  }
};
