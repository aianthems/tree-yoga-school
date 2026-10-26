import type { Tree } from "./trees";
type TreeImages = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const westernLibraryImages: Record<string, TreeImages> = {
  "coast-redwood": {
    "image": "/images/trees/coast-redwood.webp",
    "imageAlt": "Coast redwood trunks and evergreen crowns in a northern California grove",
    "credit": {
      "photographer": "Acroterion",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:US_199_Redwood_Highway.jpg",
      "label": "Coast redwood grove"
    },
    "imageWidth": 801,
    "imageHeight": 1200,
    "detailImages": [
      {
        "image": "/images/trees/coast-redwood-needles.webp",
        "imageAlt": "Flat green needles on a coast redwood shoot",
        "credit": {
          "photographer": "Forest and Kim Starr",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/sequoia-sempervirens/",
          "label": "Needles"
        },
        "imageWidth": 600,
        "imageHeight": 450
      },
      {
        "image": "/images/trees/coast-redwood-cones.webp",
        "imageAlt": "Woody coast redwood cone and seeds",
        "credit": {
          "photographer": "Roger Culos",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/sequoia-sempervirens/",
          "label": "Cone and seeds"
        },
        "imageWidth": 1024,
        "imageHeight": 768
      }
    ]
  },
  "douglas-fir": {
    "image": "/images/trees/douglas-fir.webp",
    "imageAlt": "Douglas-fir trees growing in their native habitat",
    "credit": {
      "photographer": "Walter Siegmund",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/pseudotsuga-menziesii/",
      "label": "Tree form in native habitat"
    },
    "imageWidth": 768,
    "imageHeight": 1024,
    "detailImages": [
      {
        "image": "/images/trees/douglas-fir-needles.webp",
        "imageAlt": "Douglas-fir needles arranged along a twig",
        "credit": {
          "photographer": "David J. Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/pseudotsuga-menziesii/",
          "label": "Needles and twig"
        },
        "imageWidth": 1000,
        "imageHeight": 667
      },
      {
        "image": "/images/trees/douglas-fir-cone.webp",
        "imageAlt": "Douglas-fir seed cone with projecting three-pointed bracts",
        "credit": {
          "photographer": "Beentree",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/pseudotsuga-menziesii/",
          "label": "Seed cone"
        },
        "imageWidth": 766,
        "imageHeight": 1024
      }
    ]
  },
  "western-redcedar": {
    "image": "/images/trees/western-redcedar.webp",
    "imageAlt": "Western redcedar with an evergreen conical crown",
    "credit": {
      "photographer": "Walcoford",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/thuja-plicata/",
      "label": "Tree form"
    },
    "imageWidth": 516,
    "imageHeight": 1024,
    "detailImages": [
      {
        "image": "/images/trees/western-redcedar-foliage.webp",
        "imageAlt": "Flattened sprays of overlapping western redcedar scale leaves",
        "credit": {
          "photographer": "Rassil",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/thuja-plicata/",
          "label": "Foliage"
        },
        "imageWidth": 600,
        "imageHeight": 450
      },
      {
        "image": "/images/trees/western-redcedar-cones.webp",
        "imageAlt": "Developing western redcedar seed cones on a leafy shoot",
        "credit": {
          "photographer": "Walter Siegmund",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/thuja-plicata/",
          "label": "Developing seed cones"
        },
        "imageWidth": 1024,
        "imageHeight": 768
      }
    ]
  },
  "ponderosa-pine": {
    "image": "/images/trees/ponderosa-pine.webp",
    "imageAlt": "Ponderosa pine growing at Florissant in Colorado",
    "credit": {
      "photographer": "James St. John",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pinus_ponderosa_(ponderosa_pine_tree)_(Florissant_National_Monument,_Colorado,_USA)_10.jpg",
      "label": "Tree at Florissant, Colorado"
    },
    "imageWidth": 899,
    "imageHeight": 1200,
    "detailImages": [
      {
        "image": "/images/trees/ponderosa-pine-needles-cones.webp",
        "imageAlt": "Long bundled ponderosa pine needles and prickly seed cones",
        "credit": {
          "photographer": "Dcrjsr",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ponderosa_Pine_Pinus_ponderosa_needles_cones.jpg",
          "label": "Needles and cones"
        },
        "imageWidth": 951,
        "imageHeight": 1200
      }
    ]
  },
  "pacific-madrone": {
    "image": "/images/trees/pacific-madrone.webp",
    "imageAlt": "Pacific madrone with a broad leafy crown",
    "credit": {
      "photographer": "Walter Siegmund",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/arbutus-menziesii/",
      "label": "Tree form"
    },
    "imageWidth": 662,
    "imageHeight": 1023,
    "detailImages": [
      {
        "image": "/images/trees/pacific-madrone-bark.webp",
        "imageAlt": "Peeling reddish bark and smooth exposed surface on Pacific madrone",
        "credit": {
          "photographer": "NaJina McEnany",
          "license": "CC BY-SA 2.5",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/arbutus-menziesii/",
          "label": "Bark"
        },
        "imageWidth": 771,
        "imageHeight": 1024
      },
      {
        "image": "/images/trees/pacific-madrone-leaves.webp",
        "imageAlt": "Glossy oval Pacific madrone leaves",
        "credit": {
          "photographer": "http://www.nwplants.com",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/arbutus-menziesii/",
          "label": "Leaves"
        },
        "imageWidth": 1024,
        "imageHeight": 742
      }
    ]
  }
};
