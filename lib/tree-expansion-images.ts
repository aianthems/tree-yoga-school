import type { Tree } from "./trees";

type Images = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const expansionImages: Record<string, Images> = {
  "tulip-tree": {
    "image": "/images/trees/tulip-tree.webp",
    "imageAlt": "Flowers close-up showing orange-blotched tepals & many stamens",
    "imageWidth": 640,
    "imageHeight": 480,
    "credit": {
      "photographer": "Mark Robinson",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/liriodendron-tulipifera/",
      "label": "Liriodendron tulipifera (Cabarrus County, NC)"
    },
    "detailImages": [
      {
        "image": "/images/trees/tulip-tree-detail-1.webp",
        "imageAlt": "Close-up of the distinctively shaped, 4-lobed leaf.",
        "imageWidth": 1024,
        "imageHeight": 768,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/liriodendron-tulipifera/",
          "label": "Liriodendron tulipifera. Leaf (Warren County, NC)"
        }
      },
      {
        "image": "/images/trees/tulip-tree-detail-2.webp",
        "imageAlt": "Leaf Buds & Seed Husks - Winter - Warren Co., NC",
        "imageWidth": 834,
        "imageHeight": 1024,
        "credit": {
          "photographer": "Cathy DeWitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/liriodendron-tulipifera/",
          "label": "Liriodendron tulipifera - spent fruiits; the seeds have dropped out- Winter - Warren Co., NC"
        }
      }
    ]
  },
  "sassafras": {
    "image": "/images/trees/sassafras.webp",
    "imageAlt": "Form",
    "imageWidth": 768,
    "imageHeight": 1024,
    "credit": {
      "photographer": "Pymouss",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/sassafras-albidum/",
      "label": "Form"
    },
    "detailImages": [
      {
        "image": "/images/trees/sassafras-detail-1.webp",
        "imageAlt": "Different leaf shape",
        "imageWidth": 1024,
        "imageHeight": 682,
        "credit": {
          "photographer": "David J. Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/sassafras-albidum/",
          "label": "Different leaf shape"
        }
      },
      {
        "image": "/images/trees/sassafras-detail-2.webp",
        "imageAlt": "Fall leaves in Moore County. Shows 3 shapes of leaves",
        "imageWidth": 1024,
        "imageHeight": 768,
        "credit": {
          "photographer": "Susan Strine",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/sassafras-albidum/",
          "label": "Fall leaves in Moore County. Shows 3 shapes of leaves"
        }
      }
    ]
  },
  "dawn-redwood": {
    "image": "/images/trees/dawn-redwood.webp",
    "imageAlt": "Form",
    "imageWidth": 729,
    "imageHeight": 1024,
    "credit": {
      "photographer": "Cathy Dewitt",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/metasequoia-glyptostroboides/",
      "label": "Form"
    },
    "detailImages": [
      {
        "image": "/images/trees/dawn-redwood-detail-1.webp",
        "imageAlt": "Metasequoia glyptostroboides",
        "imageWidth": 768,
        "imageHeight": 1024,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/metasequoia-glyptostroboides/",
          "label": "Form (Wake County, NC)- winter"
        }
      },
      {
        "image": "/images/trees/dawn-redwood-detail-2.webp",
        "imageAlt": "Metasequoia glyptostroboides",
        "imageWidth": 768,
        "imageHeight": 1024,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/metasequoia-glyptostroboides/",
          "label": "Bark (Wake County, NC)"
        }
      }
    ]
  },
  "blackgum": {
    "image": "/images/trees/blackgum.webp",
    "imageAlt": "Blackgum with a leafy crown at the Arnold Arboretum in Boston",
    "imageWidth": 803,
    "imageHeight": 1200,
    "credit": {
      "photographer": "Bostonian13",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Nyssa_sylvatica_tree.jpg",
      "label": "Blackgum with a leafy crown at the Arnold Arboretum in Boston"
    },
    "detailImages": [
      {
        "image": "/images/trees/blackgum-leaves.webp",
        "imageAlt": "Blackgum leaves photographed at the North Carolina Arboretum",
        "imageWidth": 1200,
        "imageHeight": 800,
        "credit": {
          "photographer": "David J. Stang",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Nyssa_sylvatica_24zz.jpg",
          "label": "Blackgum leaves photographed at the North Carolina Arboretum"
        }
      }
    ]
  }
};
