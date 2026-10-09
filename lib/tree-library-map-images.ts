import type { Tree } from "./trees";
type Images = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;
export const mapTreeImages: Record<string, Images> = {
  "green-ash": {
    "image": "/images/trees/green-ash.webp",
    "imageAlt": "Green ash trees with compound foliage in an open landscape",
    "imageWidth": 600,
    "imageHeight": 450,
    "credit": {
      "photographer": "Matt Lavin",
      "license": "CC-BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/fraxinus-pennsylvanica/",
      "label": "Green Ash"
    },
    "detailImages": [
      {
        "image": "/images/trees/green-ash-detail-1.webp",
        "imageAlt": "Yellow autumn green ash leaves showing their leaflets",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Matt Lavin",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/fraxinus-pennsylvanica/",
          "label": "Fall color"
        }
      }
    ]
  },
  "black-oak": {
    "image": "/images/trees/black-oak.webp",
    "imageAlt": "Black oak with a broad leafy crown in an open landscape",
    "imageWidth": 675,
    "imageHeight": 900,
    "credit": {
      "photographer": "Willow",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-velutina/",
      "label": "Form"
    },
    "detailImages": [
      {
        "image": "/images/trees/black-oak-detail-1.webp",
        "imageAlt": "Three black oak leaves showing their variable bristle-tipped lobes",
        "imageWidth": 750,
        "imageHeight": 499,
        "credit": {
          "photographer": "Bruce Kirchoff",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-velutina/",
          "label": "Leaves with bristle tipped lobes"
        }
      },
      {
        "image": "/images/trees/black-oak-detail-2.webp",
        "imageAlt": "Black oak acorns showing scaly cups and rounded nuts",
        "imageWidth": 750,
        "imageHeight": 499,
        "credit": {
          "photographer": "Bruce Kirchoff",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-velutina/",
          "label": "Acorns"
        }
      }
    ]
  },
  "sweetgum": {
    "image": "/images/trees/sweetgum.webp",
    "imageAlt": "Sweetgum trunk and leafy branches viewed from below in spring",
    "imageWidth": 678,
    "imageHeight": 900,
    "credit": {
      "photographer": "skdavidson",
      "license": "CC-BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/liquidambar-styraciflua/",
      "label": "form in spring Brunswick Nature Park"
    },
    "detailImages": [
      {
        "image": "/images/trees/sweetgum-detail-1.webp",
        "imageAlt": "Star-shaped sweetgum leaf beside ridged bark",
        "imageWidth": 750,
        "imageHeight": 556,
        "credit": {
          "photographer": "skdavidson",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/liquidambar-styraciflua/",
          "label": "leaf in spring Brunswick Nature Park"
        }
      },
      {
        "image": "/images/trees/sweetgum-detail-2.webp",
        "imageAlt": "Sweetgum branch with emerging leaves and hanging brown fruit clusters",
        "imageWidth": 589,
        "imageHeight": 750,
        "credit": {
          "photographer": "Cathy deWitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/liquidambar-styraciflua/",
          "label": "Gumballs or seed heads, flowers and leaves"
        }
      }
    ]
  },
  "bur-oak": {
    "image": "/images/trees/bur-oak.webp",
    "imageAlt": "Bur oak foliage showing rounded lobes and narrowed leaf middles",
    "imageWidth": 900,
    "imageHeight": 733,
    "credit": {
      "photographer": "Andrey Zharkikh",
      "license": "CC BY 2.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-macrocarpa/",
      "label": "Quercus macrocarpa - Leaves"
    },
    "detailImages": [
      {
        "image": "/images/trees/bur-oak-detail-1.webp",
        "imageAlt": "Developing bur oak acorn with a fringed cup among leaves",
        "imageWidth": 750,
        "imageHeight": 563,
        "credit": {
          "photographer": "Matt Levin",
          "license": "CC-BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-macrocarpa/",
          "label": "Quercus macrocarpa - Acorn"
        }
      }
    ]
  }
};
