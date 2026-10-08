import type { Tree } from "./trees";
type Images = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const growthTreeImages: Record<string, Images> = {
  "american-hophornbeam": {
    "image": "/images/trees/american-hophornbeam.webp",
    "imageAlt": "American hophornbeam with a leafy crown in a planted landscape",
    "imageWidth": 450,
    "imageHeight": 600,
    "credit": {
      "photographer": "BotBln",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "label": "Form",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/ostrya-virginiana/"
    },
    "detailImages": [
      {
        "image": "/images/trees/american-hophornbeam-detail-1.webp",
        "imageAlt": "Papery, hop-like fruit clusters hanging among hophornbeam leaves",
        "imageWidth": 400,
        "imageHeight": 600,
        "credit": {
          "photographer": "Eric Hunt",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "label": "Fruits, resemble hops",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/ostrya-virginiana/"
        }
      },
      {
        "image": "/images/trees/american-hophornbeam-detail-2.webp",
        "imageAlt": "Slender male hophornbeam catkins hanging from bare twigs",
        "imageWidth": 600,
        "imageHeight": 400,
        "credit": {
          "photographer": "Katja Schultz",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "label": "Male catkins, males are preformed catkins, 1/2 to 1 inches long, in clusters of 3's (resemble birds toes), present throughout the winter",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/ostrya-virginiana/"
        }
      }
    ]
  },
  "river-birch": {
    "image": "/images/trees/river-birch.webp",
    "imageAlt": "Layered, peeling bark on a river birch trunk",
    "imageWidth": 1024,
    "imageHeight": 768,
    "credit": {
      "photographer": "Kathleen Moore",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "label": "Betula nigra. Exfoliating bark.",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-nigra/"
    },
    "detailImages": [
      {
        "image": "/images/trees/river-birch-detail-1.webp",
        "imageAlt": "Toothed river birch leaves along a twig",
        "imageWidth": 768,
        "imageHeight": 1024,
        "credit": {
          "photographer": "Kathleen Moore",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "label": "Betula nigra. Leaves.",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-nigra/"
        }
      }
    ]
  },
  "black-walnut": {
    "image": "/images/trees/black-walnut.webp",
    "imageAlt": "Green-husked black walnuts among compound leaves",
    "imageWidth": 1024,
    "imageHeight": 726,
    "credit": {
      "photographer": "Cathy Dewitt",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "label": "Fruit and leaves (Warren County, NC)-Mid Fall",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/juglans-nigra/"
    },
    "detailImages": [
      {
        "image": "/images/trees/black-walnut-detail-1.webp",
        "imageAlt": "Furrowed black walnut trunk beneath a leafy crown",
        "imageWidth": 668,
        "imageHeight": 1024,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "label": "Bark (Warren County, NC)-Mid Fall",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/juglans-nigra/"
        }
      },
      {
        "image": "/images/trees/black-walnut-detail-2.webp",
        "imageAlt": "Compound black walnut leaves with many pointed leaflets",
        "imageWidth": 1024,
        "imageHeight": 776,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "label": "Leaves (Warren County,NC)-Mid Fall",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/juglans-nigra/"
        }
      }
    ]
  },
  "american-basswood": {
    "image": "/images/trees/american-basswood.webp",
    "imageAlt": "Broad American basswood canopy beside a city building",
    "imageWidth": 450,
    "imageHeight": 600,
    "credit": {
      "photographer": "Photo by Virens",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "label": "Tilia americana",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/tilia-americana/"
    },
    "detailImages": [
      {
        "image": "/images/trees/american-basswood-detail-1.webp",
        "imageAlt": "Pale yellow basswood flowers hanging beneath narrow bracts",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Photo by Virens",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "label": "Tilia americana blooms",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/tilia-americana/"
        }
      },
      {
        "image": "/images/trees/american-basswood-detail-2.webp",
        "imageAlt": "Heart-shaped basswood leaves with toothed margins",
        "imageWidth": 450,
        "imageHeight": 600,
        "credit": {
          "photographer": "Photo by Virens",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "label": "Tilia americana leaf detail",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/tilia-americana/"
        }
      }
    ]
  }
};
