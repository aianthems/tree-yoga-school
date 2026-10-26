import type { Tree } from "./trees";

type TreeImages = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const newEnglandLibraryImages: Record<string, TreeImages> = {
  "katsura": {
    "image": "/images/trees/katsura.webp",
    "imageAlt": "A mature Katsura tree at Morris Arboretum",
    "credit": {
      "photographer": "Lucy Bradley",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/about/cc0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercidiphyllum-japonicum/",
      "label": "Katsura at Morris Arboretum"
    },
    "imageWidth": 1024,
    "imageHeight": 768,
    "detailImages": [
      {
        "image": "/images/trees/katsura-leaves.webp",
        "imageAlt": "Rounded heart-shaped Katsura leaves with finely toothed edges",
        "credit": {
          "photographer": "Wendy Cutler",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercidiphyllum-japonicum/",
          "label": "Leaves"
        },
        "imageWidth": 600,
        "imageHeight": 450
      },
      {
        "image": "/images/trees/katsura-weeping.webp",
        "imageAlt": "Drooping branches on a weeping Katsura cultivar",
        "credit": {
          "photographer": "Cathy DeWitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercidiphyllum-japonicum/",
          "label": "Morioka weeping cultivar"
        },
        "imageWidth": 730,
        "imageHeight": 1024
      }
    ]
  },
  "red-pine": {
    "image": "/images/trees/red-pine.webp",
    "imageAlt": "Tall red pine trunks and evergreen crowns at Earl Rowe Provincial Park",
    "credit": {
      "photographer": "Jason Zhang",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pinus_resinosa_forest_at_Earl_Rowe_Provincial_Park.jpg",
      "label": "Red pine woodland"
    },
    "imageWidth": 1200,
    "imageHeight": 800,
    "detailImages": [
      {
        "image": "/images/trees/red-pine-cones.webp",
        "imageAlt": "Seed cones and paired needles of red pine",
        "credit": {
          "photographer": "Rhododendrites",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_pine_cones_(52371).jpg",
          "label": "Cones and needles"
        },
        "imageWidth": 1200,
        "imageHeight": 1107
      }
    ]
  },
  "jack-pine": {
    "image": "/images/trees/jack-pine.webp",
    "imageAlt": "Jack pine with an irregular spreading crown in Manitoba",
    "credit": {
      "photographer": "Mary Krieger",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/pinus-banksiana/",
      "label": "Tree form in Manitoba"
    },
    "imageWidth": 769,
    "imageHeight": 1024,
    "detailImages": [
      {
        "image": "/images/trees/jack-pine-needles-cones.webp",
        "imageAlt": "Short paired needles and curved cones on a jack pine twig",
        "credit": {
          "photographer": "Joe Walewski",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/pinus-banksiana/",
          "label": "Needles and cones"
        },
        "imageWidth": 1024,
        "imageHeight": 576
      }
    ]
  },
  "white-spruce": {
    "image": "/images/trees/white-spruce.webp",
    "imageAlt": "White spruce branch with blue-green needles and a hanging seed cone",
    "credit": {
      "photographer": "nicmcphee on Flickr",
      "license": "CC-BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-glauca/",
      "label": "Branch and seed cone"
    },
    "imageWidth": 1024,
    "imageHeight": 683,
    "detailImages": [
      {
        "image": "/images/trees/white-spruce-needles.webp",
        "imageAlt": "Individual white spruce needles radiating around a twig",
        "credit": {
          "photographer": "David J.Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-glauca/",
          "label": "Needles"
        },
        "imageWidth": 1000,
        "imageHeight": 665
      },
      {
        "image": "/images/trees/white-spruce-cones.webp",
        "imageAlt": "Hanging cylindrical seed cones on white spruce",
        "credit": {
          "photographer": "Dori",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-glauca/",
          "label": "Seed cones"
        },
        "imageWidth": 1024,
        "imageHeight": 780
      }
    ]
  },
  "black-spruce": {
    "image": "/images/trees/black-spruce.webp",
    "imageAlt": "Black spruce twig with short needles and developing cones",
    "credit": {
      "photographer": "Daderot",
      "license": "CC0 1.0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-mariana/",
      "label": "Needles and developing cones"
    },
    "imageWidth": 1024,
    "imageHeight": 734,
    "detailImages": [
      {
        "image": "/images/trees/black-spruce-needles.webp",
        "imageAlt": "Short bluish-green black spruce needles along a twig",
        "credit": {
          "photographer": "Arthur Chapman",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-mariana/",
          "label": "Needles"
        },
        "imageWidth": 1024,
        "imageHeight": 683
      }
    ]
  },
  "bigtooth-aspen": {
    "image": "/images/trees/bigtooth-aspen.webp",
    "imageAlt": "Bigtooth aspen foliage showing large teeth along the leaf margins",
    "credit": {
      "photographer": "User:Schzmo",
      "license": "Public domain",
      "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Populus_grandidentata.JPG",
      "label": "Leaves"
    },
    "imageWidth": 1200,
    "imageHeight": 900,
    "detailImages": [
      {
        "image": "/images/trees/bigtooth-aspen-twig.webp",
        "imageAlt": "Bigtooth aspen twig with a pointed winter bud",
        "credit": {
          "photographer": "DouglasGoldman",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Populus_grandidentata3.jpg",
          "label": "Twig and winter bud"
        },
        "imageWidth": 803,
        "imageHeight": 1200
      }
    ]
  }
};
