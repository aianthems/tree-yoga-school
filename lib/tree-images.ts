import type { Tree } from "./trees";

// Real photographs; licenses and original sources are retained in ATTRIBUTION.md.
type TreeImages = Pick<Tree, "image" | "imageAlt" | "imageWidth" | "imageHeight" | "credit" | "detailImages">;

export const treeImages: Record<string, TreeImages> = {
  "red-maple": {
    "detailImages": [
      {
        "image": "/images/trees/red-maple-leaves.webp",
        "imageAlt": "New red maple leaves emerging beside buds",
        "imageWidth": 843,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Cathy DeWitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-rubrum/",
          "label": "Emerging leaves and buds"
        }
      },
      {
        "image": "/images/trees/red-maple-bark.webp",
        "imageAlt": "Red maple trunk showing its bark texture",
        "imageWidth": 600,
        "imageHeight": 450,
        "credit": {
          "photographer": "Amanda Munoz",
          "license": "CC BY 2.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-rubrum/",
          "label": "Trunk and bark"
        }
      },
      {
        "image": "/images/trees/red-maple-samaras.webp",
        "imageAlt": "Paired red maple samaras with red wings",
        "imageWidth": 921,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Carol Jacobs-Carre",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-rubrum/",
          "label": "Paired winged fruits"
        }
      }
    ],
    "image": "/images/trees/red-maple.webp",
    "imageAlt": "Red maple crown and trunk in early spring",
    "imageWidth": 1000,
    "imageHeight": 750,
    "credit": {
      "photographer": "Cathy Dewitt",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-rubrum/",
      "label": "Red maple in early spring"
    }
  },
  "red-oak": {
    "detailImages": [
      {
        "image": "/images/trees/red-oak-leaves.webp",
        "imageAlt": "Northern red oak leaves with pointed lobes",
        "imageWidth": 975,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Cathy DeWitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-rubra/",
          "label": "Bristle-tipped leaf lobes"
        }
      },
      {
        "image": "/images/trees/red-oak-bark.webp",
        "imageAlt": "Gray ridged bark of a northern red oak",
        "imageWidth": 750,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Sebastian Martin Dicke",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bark_of_the_northern_red_oak.jpg",
          "label": "Ridged bark"
        }
      },
      {
        "image": "/images/trees/red-oak-acorns.webp",
        "imageAlt": "Northern red oak acorns and their shallow caps on the forest floor",
        "imageWidth": 1000,
        "imageHeight": 691,
        "credit": {
          "photographer": "Dcrjsr",
          "license": "CC BY 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Quercus_rubra_N_red_oak_acorns.jpg",
          "label": "Acorns and shallow caps"
        }
      }
    ],
    "image": "/images/trees/red-oak.webp",
    "imageAlt": "Northern red oak with a spreading crown",
    "imageWidth": 600,
    "imageHeight": 450,
    "credit": {
      "photographer": "Wendy Cutler",
      "license": "CC BY 4.0",
      "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-rubra/",
      "label": "Northern red oak"
    }
  },
  "yellow-birch": {
    "detailImages": [
      {
        "image": "/images/trees/yellow-birch-leaves.webp",
        "imageAlt": "Yellow birch leaves showing pointed tips and toothed margins",
        "imageWidth": 600,
        "imageHeight": 400,
        "credit": {
          "photographer": "Annalei Salo",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-alleghaniensis/",
          "label": "Toothed leaves"
        }
      },
      {
        "image": "/images/trees/yellow-birch-bark.webp",
        "imageAlt": "Yellow birch bark showing thin curling strips",
        "imageWidth": 750,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Kieran Hunt",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yellow_Birch_Bark,_Betula_alleghaniensis.jpg",
          "label": "Peeling bark"
        }
      }
    ],
    "image": "/images/trees/yellow-birch.webp",
    "imageAlt": "Yellow birch trunk and crown in its surroundings",
    "imageWidth": 450,
    "imageHeight": 600,
    "credit": {
      "photographer": "Chris M.",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-alleghaniensis/",
      "label": "Yellow birch"
    }
  },
  "balsam-fir": {
    "detailImages": [
      {
        "image": "/images/trees/balsam-fir-needles.webp",
        "imageAlt": "Flat green balsam fir needles along a twig",
        "imageWidth": 960,
        "imageHeight": 720,
        "credit": {
          "photographer": "NPS",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:The_short_needles_of_a_Balsam_Fir_are_flat_and_slightly_rounded_at_the_tips,_as_opposed_to_the_sharp,_round_needles_of_spruce_(f2e4034e-32a7-4c50-bd02-abf13f8e8ac1).jpg",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_short_needles_of_a_Balsam_Fir_are_flat_and_slightly_rounded_at_the_tips,_as_opposed_to_the_sharp,_round_needles_of_spruce_(f2e4034e-32a7-4c50-bd02-abf13f8e8ac1).jpg",
          "label": "Flat needles"
        }
      },
      {
        "image": "/images/trees/balsam-fir-bark.webp",
        "imageAlt": "Gray bark with resin blisters on a young balsam fir",
        "imageWidth": 818,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Keith Kanoti, Maine Forest Service, United States",
          "license": "CC BY 3.0 us",
          "licenseUrl": "https://creativecommons.org/licenses/by/3.0/us/deed.en",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Abies_balsamea_bark.jpg",
          "label": "Young bark and resin blisters"
        }
      },
      {
        "image": "/images/trees/balsam-fir-cones.webp",
        "imageAlt": "Balsam fir cones standing upright near the top of the tree",
        "imageWidth": 600,
        "imageHeight": 400,
        "credit": {
          "photographer": "Chepas",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/abies-balsamea/",
          "label": "Upright seed cones"
        }
      }
    ],
    "image": "/images/trees/balsam-fir.webp",
    "imageAlt": "Balsam fir growing at Sherburne National Wildlife Refuge in Minnesota",
    "imageWidth": 800,
    "imageHeight": 1000,
    "credit": {
      "photographer": "U.S. Fish and Wildlife Service",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Abies_balsamea1.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Abies_balsamea1.jpg",
      "label": "Balsam fir in Minnesota"
    }
  },
  "tamarack": {
    "detailImages": [
      {
        "image": "/images/trees/tamarack-needles.webp",
        "imageAlt": "Clusters of tamarack needles turning golden in autumn",
        "imageWidth": 750,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Mike Gifford from Ottawa, Canada",
          "license": "CC BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina_needles_close_up.jpg",
          "label": "Autumn needles"
        }
      },
      {
        "image": "/images/trees/tamarack-bark.webp",
        "imageAlt": "Tamarack bark beside a branch of needle clusters",
        "imageWidth": 665,
        "imageHeight": 1000,
        "credit": {
          "photographer": "Robert H. Mohlenbrock / USDA NRCS",
          "license": "Public domain",
          "licenseUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina_bark.jpg",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina_bark.jpg",
          "label": "Bark and branch"
        }
      },
      {
        "image": "/images/trees/tamarack-cone.webp",
        "imageAlt": "Young female cones of tamarack on a branch",
        "imageWidth": 888,
        "imageHeight": 1000,
        "credit": {
          "photographer": "William (Ned) Friedman",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "sourceUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina_female_cone.jpg",
          "label": "Young female cones"
        }
      }
    ],
    "image": "/images/trees/tamarack.webp",
    "imageAlt": "Golden autumn tamarack in front of green black spruce in northern Minnesota",
    "imageWidth": 960,
    "imageHeight": 640,
    "credit": {
      "photographer": "NOAA",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Larix_laricina.jpg",
      "label": "Golden tamarack with black spruce behind"
    }
  },
  "sycamore": {
    "detailImages": [
      {
        "image": "/images/trees/sycamore-leaves.webp",
        "imageAlt": "Lobed American sycamore leaves beside a round seed ball",
        "imageWidth": 288,
        "imageHeight": 384,
        "credit": {
          "photographer": "Allen Bridgman",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/platanus-occidentalis/",
          "label": "Leaves and fruit"
        }
      },
      {
        "image": "/images/trees/sycamore-bark.webp",
        "imageAlt": "American sycamore bark with patches of pale and darker surfaces",
        "imageWidth": 288,
        "imageHeight": 384,
        "credit": {
          "photographer": "Elizabeth Moss",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/platanus-occidentalis/",
          "label": "Mottled bark"
        }
      },
      {
        "image": "/images/trees/sycamore-fruit.webp",
        "imageAlt": "Round American sycamore seed ball hanging from a stalk",
        "imageWidth": 1000,
        "imageHeight": 912,
        "credit": {
          "photographer": "Cathy Dewitt",
          "license": "CC BY 4.0",
          "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
          "sourceUrl": "https://plants.ces.ncsu.edu/plants/platanus-occidentalis/",
          "label": "Seed ball"
        }
      }
    ],
    "image": "/images/trees/sycamore.webp",
    "imageAlt": "American sycamore trunk and broad crown at Morton Arboretum",
    "imageWidth": 500,
    "imageHeight": 667,
    "credit": {
      "photographer": "Bruce Marlin",
      "license": "CC BY-SA 2.5",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sycamore_Platanus_occidentalis.jpg",
      "label": "American sycamore at Morton Arboretum"
    }
  }
};

export const treeDetailImages: Record<string, Tree["detailImages"]> = {
  "oak": [
    {
      "image": "/images/trees/oak-leaves.webp",
      "imageAlt": "White oak leaves with rounded lobes",
      "imageWidth": 600,
      "imageHeight": 450,
      "credit": {
        "photographer": "Wendy Cutler",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-alba/",
        "label": "Rounded leaf lobes"
      }
    },
    {
      "image": "/images/trees/oak-bark.webp",
      "imageAlt": "Gray bark on a mature white oak trunk",
      "imageWidth": 960,
      "imageHeight": 720,
      "credit": {
        "photographer": "Randy Harter",
        "license": "CC BY 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-alba/",
        "label": "Mature bark"
      }
    },
    {
      "image": "/images/trees/oak-acorn.webp",
      "imageAlt": "White oak leaf beside an acorn and its cap",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Cathy Dewitt",
        "license": "CC BY 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-alba/",
        "label": "Leaf and acorn"
      }
    }
  ],
  "birch": [
    {
      "image": "/images/trees/birch-leaves.webp",
      "imageAlt": "Paper birch leaves with toothed margins",
      "imageWidth": 754,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Krzysztof Ziarnek, Kenraiz",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-papyrifera/",
        "label": "Leaves"
      }
    },
    {
      "image": "/images/trees/birch-bark.webp",
      "imageAlt": "White paper birch bark with horizontal markings",
      "imageWidth": 750,
      "imageHeight": 1000,
      "credit": {
        "photographer": "InAweofGod'sCreation",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-papyrifera/",
        "label": "Papery bark"
      }
    },
    {
      "image": "/images/trees/birch-seeds.webp",
      "imageAlt": "Paper birch seed-bearing structures on a twig",
      "imageWidth": 1000,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Babij",
        "license": "CC-BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-papyrifera/",
        "label": "Seed-bearing structures"
      }
    }
  ],
  "maple": [
    {
      "image": "/images/trees/maple-leaves.webp",
      "imageAlt": "Sugar maple leaf showing its lobed outline",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Superior National Forest",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharum/",
        "label": "Leaf shape"
      }
    },
    {
      "image": "/images/trees/maple-bark.webp",
      "imageAlt": "Ridged bark at the base of a sugar maple trunk",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Derek Ramsey",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharum/",
        "label": "Mature bark"
      }
    },
    {
      "image": "/images/trees/maple-samaras.webp",
      "imageAlt": "Paired sugar maple samaras hanging from a leafy branch",
      "imageWidth": 960,
      "imageHeight": 720,
      "credit": {
        "photographer": "Quercus1981",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sugar_maple_3220.jpg",
        "label": "Paired winged fruits"
      }
    }
  ],
  "willow": [
    {
      "image": "/images/trees/willow-leaves.webp",
      "imageAlt": "Narrow young black willow leaves unfolding in spring",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Famartin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:2020-04-29_10_52_26_New_leaves_in_spring_on_a_Black_Willow_along_Stone_Heather_Drive_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg",
        "label": "Emerging leaves"
      }
    },
    {
      "image": "/images/trees/willow-bark.webp",
      "imageAlt": "Dark furrowed bark on a black willow trunk",
      "imageWidth": 1000,
      "imageHeight": 667,
      "credit": {
        "photographer": "PumpkinSky",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Black_Willow_NBG.jpg",
        "label": "Furrowed bark"
      }
    },
    {
      "image": "/images/trees/willow-catkins.webp",
      "imageAlt": "Black willow male catkins along a twig",
      "imageWidth": 600,
      "imageHeight": 400,
      "credit": {
        "photographer": "S.B._Johnny",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/salix-nigra/",
        "label": "Male catkins"
      }
    }
  ],
  "beech": [
    {
      "image": "/images/trees/beech-leaves.webp",
      "imageAlt": "American beech leaves with toothed edges and parallel veins",
      "imageWidth": 600,
      "imageHeight": 450,
      "credit": {
        "photographer": "Katja Schulz",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/fagus-grandifolia/",
        "label": "Leaves"
      }
    },
    {
      "image": "/images/trees/beech-bark.webp",
      "imageAlt": "Gray bark of an American beech trunk",
      "imageWidth": 695,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Cathy DeWitt",
        "license": "CC BY 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/fagus-grandifolia/",
        "label": "Smooth bark"
      }
    },
    {
      "image": "/images/trees/beech-fruit.webp",
      "imageAlt": "American beech immature fruit in a prickly husk",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Famartin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:2023-08-29_09_03_44_American_Beech_immature_fruit_along_Lochatong_Road_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg",
        "label": "Immature fruit"
      }
    }
  ],
  "hemlock": [
    {
      "image": "/images/trees/hemlock-needles.webp",
      "imageAlt": "Short eastern hemlock needles arranged along a twig",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Jina Lee",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/tsuga-canadensis/",
        "label": "Needles"
      }
    },
    {
      "image": "/images/trees/hemlock-bark.webp",
      "imageAlt": "Ridged brown bark on an eastern hemlock trunk",
      "imageWidth": 1000,
      "imageHeight": 662,
      "credit": {
        "photographer": "Derek Ramsey",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/tsuga-canadensis/",
        "label": "Bark"
      }
    },
    {
      "image": "/images/trees/hemlock-cones.webp",
      "imageAlt": "Eastern hemlock seed cones hanging from branches",
      "imageWidth": 1000,
      "imageHeight": 942,
      "credit": {
        "photographer": "Keith Kanoti, Maine Forest Service, USA",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/tsuga-canadensis/",
        "label": "Small cones"
      }
    }
  ],
  "cedar": [
    {
      "image": "/images/trees/cedar-foliage.webp",
      "imageAlt": "Northern white-cedar foliage arranged in flattened sprays",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Superior National Forest",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/thuja-occidentalis/",
        "label": "Scale-like foliage"
      }
    },
    {
      "image": "/images/trees/cedar-bark.webp",
      "imageAlt": "Northern white-cedar bark beside green foliage",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "MONGO",
        "license": "Public domain",
        "licenseUrl": "https://commons.wikimedia.org/wiki/File:Eastern_Arborvitae_(Thuja_occidentalis)_bark_and_foliage.jpg",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Eastern_Arborvitae_(Thuja_occidentalis)_bark_and_foliage.jpg",
        "label": "Bark and foliage"
      }
    },
    {
      "image": "/images/trees/cedar-cones.webp",
      "imageAlt": "Developing seed cones on northern white-cedar foliage",
      "imageWidth": 750,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Abraham",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:20250823_Thuja_occidentalis_northern_white-cedar_%C5%BBywotnik_zachodni_female_cones_01.jpg",
        "label": "Developing seed cones"
      }
    }
  ],
  "aspen": [
    {
      "image": "/images/trees/aspen-leaves.webp",
      "imageAlt": "Quaking aspen leaves showing their rounded shape",
      "imageWidth": 1000,
      "imageHeight": 664,
      "credit": {
        "photographer": "James St. John",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/populus-tremuloides/",
        "label": "Leaf detail"
      }
    },
    {
      "image": "/images/trees/aspen-bark.webp",
      "imageAlt": "Pale quaking aspen bark with dark markings",
      "imageWidth": 701,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Jane S. Richardson",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/populus-tremuloides/",
        "label": "Pale bark"
      }
    },
    {
      "image": "/images/trees/aspen-catkins.webp",
      "imageAlt": "Quaking aspen catkins hanging from bare spring twigs",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Famartin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:2015-03-27_15_47_17_Quaking_Aspen_catkins_at_Great_Basin_College_in_Elko,_Nevada.JPG",
        "label": "Spring catkins"
      }
    }
  ],
  "spruce": [
    {
      "image": "/images/trees/spruce-needles.webp",
      "imageAlt": "Red spruce needles growing singly along a branch",
      "imageWidth": 1000,
      "imageHeight": 563,
      "credit": {
        "photographer": "Shenandoah National Park",
        "license": "CC BY 2.0",
        "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-rubens/",
        "label": "Needles on a branch"
      }
    },
    {
      "image": "/images/trees/spruce-bark.webp",
      "imageAlt": "Scaly bark on a red spruce trunk",
      "imageWidth": 750,
      "imageHeight": 1000,
      "credit": {
        "photographer": "Famartin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:2024-08-01_16_37_07_Red_Spruce_bark_along_Rensselaer_County_Route_42_(Taborton_Road)_in_Berlin,_Rensselaer_County,_New_York.jpg",
        "label": "Scaly bark"
      }
    },
    {
      "image": "/images/trees/spruce-cone.webp",
      "imageAlt": "A brown red spruce seed cone",
      "imageWidth": 1000,
      "imageHeight": 750,
      "credit": {
        "photographer": "Keith Kanoti, Maine Forest Service, Bugwood.org",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-rubens/",
        "label": "Seed cone"
      }
    }
  ]
};
