import type { Tree } from "./trees";
type Images = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const newPracticeImages: Record<string, Images> = {
  "american-elm": {
    "image": "/images/trees/american-elm-detail-1.webp",
    "imageAlt": "American elm with an upright trunk and spreading leafy canopy",
    "imageWidth": 525,
    "imageHeight": 700,
    "credit": {
      "photographer": "Matt Lavin from Bozeman, Montana, USA",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ulmus_americana_(5101982719).jpg",
      "label": "Ulmus americana (5101982719).jpg · resized and converted to WebP"
    },
    "detailImages": [
      {
        "image": "/images/trees/american-elm.webp",
        "imageAlt": "American elm growing beside a city street",
        "imageWidth": 393,
        "imageHeight": 700,
        "credit": {
          "photographer": "Lendert Van Laer",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Amerikaanse_iep_(Ulmus_americana).jpg",
          "label": "Amerikaanse iep (Ulmus americana).jpg · resized and converted to WebP"
        }
      },
      {
        "image": "/images/trees/american-elm-detail-2.webp",
        "imageAlt": "Ridged bark on an American elm trunk",
        "imageWidth": 900,
        "imageHeight": 675,
        "credit": {
          "photographer": "Matt Lavin from Bozeman, Montana, USA",
          "license": "CC BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ulmus_americana_(5102577518).jpg",
          "label": "Ulmus americana (5102577518).jpg · resized and converted to WebP"
        }
      }
    ]
  },
  "bald-cypress": {
    "image": "/images/trees/bald-cypress.webp",
    "imageAlt": "Bald cypress showing seasonal foliage color",
    "imageWidth": 467,
    "imageHeight": 700,
    "credit": {
      "photographer": "Crusier",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/taxodium-distichum/",
      "label": "Taxodium distichum, going deciduous for the winter. · resized and converted to WebP"
    },
    "detailImages": [
      {
        "image": "/images/trees/bald-cypress-detail-1.webp",
        "imageAlt": "Fine green foliage of bald cypress",
        "imageWidth": 450,
        "imageHeight": 600,
        "credit": {
          "photographer": "Forest and Kim Starr",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/taxodium-distichum/",
          "label": "Taxodium distichum needle-like leaves · resized and converted to WebP"
        }
      },
      {
        "image": "/images/trees/bald-cypress-detail-2.webp",
        "imageAlt": "Rounded seed cones of bald cypress",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Tatters",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/taxodium-distichum/",
          "label": "Taxodium distichum seed cones · resized and converted to WebP"
        }
      }
    ]
  },
  "eastern-redbud": {
    "image": "/images/trees/eastern-redbud.webp",
    "imageAlt": "Eastern redbud covered in pink spring flowers",
    "imageWidth": 900,
    "imageHeight": 599,
    "credit": {
      "photographer": "Dcrjsr",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercis-canadensis/",
      "label": "Cercis canadensis tree form with pink blooms · resized and converted to WebP"
    },
    "detailImages": [
      {
        "image": "/images/trees/eastern-redbud-detail-1.webp",
        "imageAlt": "Broad heart-shaped leaves of eastern redbud",
        "imageWidth": 900,
        "imageHeight": 675,
        "credit": {
          "photographer": "David J. Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercis-canadensis/",
          "label": "Cercis canadensis leaves · resized and converted to WebP"
        }
      },
      {
        "image": "/images/trees/eastern-redbud-detail-2.webp",
        "imageAlt": "Close view of eastern redbud flowers",
        "imageWidth": 900,
        "imageHeight": 657,
        "credit": {
          "photographer": "USGS Bee Inventory and Monitoring Lab (specifically, Helen Lowe Metzman)",
          "license": "Public Domain Mark 1.0",
          "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/cercis-canadensis/",
          "label": "Cercis canadensis. flower close-up · resized and converted to WebP"
        }
      }
    ]
  },
  "white-ash": {
    "image": "/images/trees/white-ash.webp",
    "imageAlt": "White ash growing at the University of Kentucky Arboretum",
    "imageWidth": 450,
    "imageHeight": 600,
    "credit": {
      "photographer": "Photographer not listed (NC State source)",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/about/cc0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/fraxinus-americana/",
      "label": "fraxinus americana · resized and converted to WebP"
    },
    "detailImages": [
      {
        "image": "/images/trees/white-ash-detail-1.webp",
        "imageAlt": "White ash compound leaves with several leaflets",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Virens",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/fraxinus-americana/",
          "label": "Leaves · resized and converted to WebP"
        }
      },
      {
        "image": "/images/trees/white-ash-detail-2.webp",
        "imageAlt": "Furrowed bark on a white ash trunk",
        "imageWidth": 600,
        "imageHeight": 397,
        "credit": {
          "photographer": "Derek Ramsey",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/fraxinus-americana/",
          "label": "Bark · resized and converted to WebP"
        }
      }
    ]
  }
};
