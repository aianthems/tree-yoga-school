import { mapPracticeTrees } from "./tree-library-map";
import { growthPracticeTrees } from "./tree-library-growth";
import { newPracticeTrees } from "./tree-library-new";
import { fourPracticeTrees } from "./tree-library-four";
import { tennesseeTrees } from "./tree-library-tennessee";
import { additionalTrees } from "./tree-library-expansion";
import { treeDetailImages } from "./tree-images";

type TreeImageCredit = { photographer: string; license: string; licenseUrl: string; sourceUrl: string; label: string };
type TreeDetailImage = { image: string; imageAlt: string; imageWidth: number; imageHeight: number; credit: TreeImageCredit };
export type Tree = {
 slug: string; name: string; species: string; scientificName: string; image: string; imageAlt: string; imageWidth: number; imageHeight: number;
 themes: readonly string[]; invitation: string; introduction: string; identity: readonly { title: string; text: string }[]; seasons: string;
 energies: readonly { title: string; observation: string; meaning: string; question: string }[];
 practiceTitle: string; practiceIntroduction: string; practice: readonly { title: string; text: string }[]; reflection: string; sourceUrl: string; sourceLabel?: string;
 credit: TreeImageCredit; detailImages: readonly TreeDetailImage[]; principles: string;
};

const pine = {
    slug: "pine",
    name: "Pine",
    species: "Eastern white pine",
    scientificName: "Pinus strobus",
    image: "/images/trees/pine.webp",
    imageAlt: "Eastern white pine with a broad green crown and layered branches in an open landscape",
    imageWidth: 600,
    imageHeight: 450,
    themes: ["Constancy", "Clarity", "Perseverance"],
    invitation: "Return to one clear point. Notice what stays, what changes, and how you begin again.",
    introduction: "An evergreen can be an invitation to consider constancy. Spend time with an actual pine: its individual shape, the light between its needles, and the life around it. Let the encounter come before the meaning.",
    identity: [
      { title: "Needles", text: "Eastern white pine has soft, flexible, blue-green needles gathered in bundles of five. Observe an accessible branch or fallen needles without picking living growth." },
      { title: "Cones", text: "Its seed cones are long and narrow, often curved, with scales that lack sharp spines. Compare more than one feature when identifying a tree." },
      { title: "Place", text: "This species is native to eastern North America, including Massachusetts and New Hampshire. Pines belong to the genus Pinus; this page focuses on one species rather than treating every pine as identical." },
    ],
    seasons: "Evergreen does not mean unchanging. Eastern white pine retains green foliage across the seasons while older needle bundles eventually fall. On repeated visits, notice new growth, fallen needles, weather, and shifting light.",
    energies: [
      { title: "Constancy", observation: "Green needles remain visible across the seasons.", meaning: "Consider a commitment you can return to through changing circumstances. Constancy can include rest and adjustment.", question: "What is worth returning to?" },
      { title: "Clarity", observation: "A single needle bundle offers one small, distinct detail to observe.", meaning: "Let one detail become your anchor. Clarity begins here as a practice of choosing where to place your attention.", question: "What deserves your attention today?" },
      { title: "Perseverance", observation: "An individual tree carries the visible record of its growth in branches and bark.", meaning: "Use that continuing growth as a prompt to begin again patiently. Your next visit can be small and still matter.", question: "What is your next sustainable step?" },
    ],
    practice: [
      { title: "Arrive beside a pine", text: "Choose a permitted place with stable ground, suitable weather, and no hazardous branches overhead. Sit on a bench, use your usual seat or wheelchair, or stand with your normal supports. You can observe from a distance." },
      { title: "Find one clear point", text: "Choose a detail you can see comfortably: a needle bundle, a patch of bark, or an opening between branches. Keep your eyes open and let your breath continue naturally." },
      { title: "Return gently", text: "Notice thoughts and nearby sounds. Whenever attention wanders, return to your detail. There is no need to make the mind silent or produce a particular feeling." },
      { title: "Carry one intention", text: "After a few minutes, widen your attention to the surroundings. Ask what you would like to return to in your day. Choose one small action, then finish at your own pace." },
    ],
    reflection: "What stayed familiar, and what surprised you when you looked again?",
    sourceUrl: "https://plants.ces.ncsu.edu/plants/pinus-strobus/",
  } as const;

const originalTrees: readonly Tree[] = [
{ ...pine, ...{
  "practiceTitle": "One pine. One clear point.",
  "practiceIntroduction": "A new observation meditation connecting the book’s one-pointed focus and perseverance to time beside a pine. Read once, then practice away from the screen.",
  "principles": "One-pointed focus, perseverance, and presence",
  "credit": {
    "photographer": "F. D. Richards",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceUrl": "https://plants.ces.ncsu.edu/plants/pinus-strobus/",
    "label": "Eastern white pine"
  },
  "detailImages": [
    {
      "image": "/images/trees/pine-needles.webp",
      "imageAlt": "Close view of Eastern white pine needles growing in bundles along a twig",
      "imageWidth": 1024,
      "imageHeight": 768,
      "credit": {
        "photographer": "Tom Glasgow",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/pinus-strobus/",
        "label": "Needles"
      }
    },
    {
      "image": "/images/trees/pine-bark.webp",
      "imageAlt": "Textured bark on the trunk of an Eastern white pine",
      "imageWidth": 400,
      "imageHeight": 600,
      "credit": {
        "photographer": "Nicholas A. Tonelli",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "sourceUrl": "https://plants.ces.ncsu.edu/plants/pinus-strobus/",
        "label": "Bark"
      }
    }
  ]
} },
{
  "slug": "oak",
  "name": "Oak",
  "species": "White oak",
  "scientificName": "Quercus alba",
  "image": "/images/trees/oak.webp",
  "imageAlt": "White oak: form in spring brunswick nature park",
  "imageWidth": 900,
  "imageHeight": 703,
  "themes": [
    "Strength",
    "Steadiness",
    "Patience"
  ],
  "invitation": "Give growth time. Find a steady place from which you can respond to change.",
  "introduction": "Give growth time. Find a steady place from which you can respond to change. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Leaves",
      "text": "Rounded lobes without bristle tips distinguish white oak leaves. Look at fallen leaves and compare several features."
    },
    {
      "title": "Crown",
      "text": "A mature white oak often develops a broad, rounded crown. A young tree can have a much narrower form."
    },
    {
      "title": "Place",
      "text": "Native to the eastern United States, white oak grows in varied woodland settings and supports many birds, insects, and mammals."
    }
  ],
  "seasons": "Watch leaves unfold, the crown fill, and autumn foliage turn reddish brown. In winter, follow the branching outline. A single visit shows one moment in a much longer life.",
  "energies": [
    {
      "title": "Strength",
      "observation": "A broad crown spreads above a substantial trunk.",
      "meaning": "Strength can mean offering support without holding everything tightly.",
      "question": "What can you support without controlling?"
    },
    {
      "title": "Steadiness",
      "observation": "Branches remain connected to a common trunk.",
      "meaning": "Choose one dependable point in your day, while leaving room to respond.",
      "question": "What helps you remain steady?"
    },
    {
      "title": "Patience",
      "observation": "White oak grows slowly and can live for many years.",
      "meaning": "Give something worthwhile enough time to develop. Small changes can belong to a long commitment.",
      "question": "What deserves more time?"
    }
  ],
  "practiceTitle": "Steady enough to grow.",
  "practiceIntroduction": "A new observation practice exploring strength, steadiness, patience beside white oak. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Find your base",
      "text": "Sit or stand with your usual supports on stable ground. Notice the contact of feet, seat, or wheels with the surface beneath you."
    },
    {
      "title": "Follow the branching",
      "text": "Let your gaze travel from a visible trunk into the crown. Notice how a steady base can hold many directions."
    },
    {
      "title": "Allow a little time",
      "text": "Rest your attention on one branch for a few natural breaths. When impatience appears, notice it and return without forcing stillness."
    },
    {
      "title": "Choose patient action",
      "text": "Think of something you are growing in your life. Name one small action you can repeat without rushing its result."
    }
  ],
  "reflection": "Where could you be patient enough to grow?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/quercus-alba/",
  "credit": {
    "photographer": "skdavidson",
    "license": "CC-BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/white_oak_in_spring__FXbeMInoRg0I.jpeg",
    "label": "form in spring Brunswick Nature Park"
  },
  "detailImages": [],
  "principles": "Strength, perseverance, and presence"
},
{
  "slug": "birch",
  "name": "Birch",
  "species": "Paper birch",
  "scientificName": "Betula papyrifera",
  "image": "/images/trees/birch.webp",
  "imageAlt": "Paper birch: form",
  "imageWidth": 602,
  "imageHeight": 900,
  "themes": [
    "Renewal",
    "Openness",
    "Beginnings"
  ],
  "invitation": "Look again. Let a familiar place become the beginning of a new encounter.",
  "introduction": "Look again. Let a familiar place become the beginning of a new encounter. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Bark",
      "text": "Paper birch is known for white bark that naturally peels in thin layers, with darker markings on mature trunks. Leave every layer attached."
    },
    {
      "title": "Form",
      "text": "Trees may have one trunk or several. Their young outline is often pyramidal, becoming more rounded or irregular with age."
    },
    {
      "title": "Place",
      "text": "Paper birch belongs to cool northern landscapes. It is a pioneer tree, often growing quickly when young."
    }
  ],
  "seasons": "Observe spring catkins, summer leaves, autumn yellow, and bark revealed in winter. Renewal is an invitation to look closely, not a demand that every season feel like a fresh start.",
  "energies": [
    {
      "title": "Renewal",
      "observation": "Papery bark reveals layers of different colors.",
      "meaning": "Let renewal mean noticing what is already unfolding, without stripping anything away.",
      "question": "What is beginning quietly?"
    },
    {
      "title": "Openness",
      "observation": "Light passes between small branches and leaves.",
      "meaning": "Leave a little space for an unfamiliar thought or a different view.",
      "question": "What could you meet with curiosity?"
    },
    {
      "title": "Beginnings",
      "observation": "Young paper birches can grow quickly in suitable places.",
      "meaning": "A beginning can be modest and imperfect. You can start from the conditions you have.",
      "question": "What is one possible first step?"
    }
  ],
  "practiceTitle": "Begin with fresh eyes.",
  "practiceIntroduction": "A new observation practice exploring renewal, openness, beginnings beside paper birch. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Visit something familiar",
      "text": "Choose a birch you can observe from a permitted path or stable seat. Let this be a visit without a task to complete."
    },
    {
      "title": "Find three new details",
      "text": "Notice a line in the bark, a branch angle, and the light around a leaf or twig. Keep the bark intact."
    },
    {
      "title": "Set aside one label",
      "text": "When you think “I know this,” look for a detail the label did not capture. Let curiosity take its time."
    },
    {
      "title": "Begin again",
      "text": "Choose one familiar part of your day to approach with this same attention. A fresh question is enough."
    }
  ],
  "reflection": "What becomes possible when you look again?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/betula-papyrifera/",
  "credit": {
    "photographer": "Joshua Mayer",
    "license": "CC-BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Betula_papyrifera_fo_ffHEIoyjAfp0.jpe",
    "label": "form"
  },
  "detailImages": [],
  "principles": "Acceptance, adaptability, and presence"
},
{
  "slug": "maple",
  "name": "Maple",
  "species": "Sugar maple",
  "scientificName": "Acer saccharum",
  "image": "/images/trees/maple.webp",
  "imageAlt": "Sugar maple: form",
  "imageWidth": 675,
  "imageHeight": 900,
  "themes": [
    "Generosity",
    "Transformation",
    "Rhythm"
  ],
  "invitation": "Notice the season you are in. Explore what you offer, receive, and allow to change.",
  "introduction": "Notice the season you are in. Explore what you offer, receive, and allow to change. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Leaves",
      "text": "Sugar maple typically has five-lobed leaves. Notice the outline and the arrangement of leaves on a twig, using more than color alone to identify it."
    },
    {
      "title": "Crown",
      "text": "Mature trees have a dense, spreading crown. Shade is one visible way a tree shapes the life around it."
    },
    {
      "title": "Place",
      "text": "Sugar maple is native to eastern and central North America. It favors moist, well-drained soils and cooler conditions."
    }
  ],
  "seasons": "Spring flowers and unfolding leaves give way to summer shade, winged fruits, and autumn red, orange, or yellow. Winter reveals the crown’s structure. Revisit rather than expecting every change at once.",
  "energies": [
    {
      "title": "Generosity",
      "observation": "A leafy crown creates a shaded space.",
      "meaning": "Consider the ordinary ways you make room for another life. Giving can coexist with receiving support.",
      "question": "What can you offer comfortably?"
    },
    {
      "title": "Transformation",
      "observation": "Autumn leaves change color before they fall.",
      "meaning": "Reflect on a change you can acknowledge without deciding immediately what it means.",
      "question": "What is changing in your life?"
    },
    {
      "title": "Rhythm",
      "observation": "The crown moves through leafy and bare seasons.",
      "meaning": "Notice your own rhythms of effort and rest. Repetition need not mean sameness.",
      "question": "What rhythm would serve you now?"
    }
  ],
  "practiceTitle": "A practice for this season.",
  "practiceIntroduction": "A new observation practice exploring generosity, transformation, rhythm beside sugar maple. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Name the season",
      "text": "Find a comfortable view of a maple. Describe what is actually present: buds, leaves, fruits, bare branches, or fallen foliage."
    },
    {
      "title": "Notice giving and receiving",
      "text": "Observe shade, light, nearby plants, or a passing animal. Let the scene prompt a reflection on the support you give and receive."
    },
    {
      "title": "Make room for change",
      "text": "Choose one visible change since a previous visit, or imagine returning in another season. Let your breath remain natural."
    },
    {
      "title": "Find a fitting rhythm",
      "text": "Ask whether today calls for effort, rest, or a small adjustment. Choose one action that fits your present circumstances."
    }
  ],
  "reflection": "What are you ready to give, and what are you ready to receive?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/acer-saccharum/",
  "credit": {
    "photographer": "Bruce Marlin",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Acer_saccharum_Bruce_xUEiSRKQCPn5.jpeg",
    "label": "form"
  },
  "detailImages": [],
  "principles": "Balance and optimization, adaptability, and release"
},
{
  "slug": "willow",
  "name": "Willow",
  "species": "Black willow",
  "scientificName": "Salix nigra",
  "image": "/images/trees/willow.webp",
  "imageAlt": "Black willow: form",
  "imageWidth": 450,
  "imageHeight": 600,
  "themes": [
    "Flexibility",
    "Release",
    "Flow"
  ],
  "invitation": "Make room for a different response. Explore a softer approach without losing your footing.",
  "introduction": "Make room for a different response. Explore a softer approach without losing your footing. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Leaves",
      "text": "Black willow has narrow, finely toothed leaves. This species is distinct from the ornamental weeping willow."
    },
    {
      "title": "Bark and crown",
      "text": "Older bark becomes dark and deeply furrowed. The spreading crown can be irregular, supported by one or several curved trunks."
    },
    {
      "title": "Place",
      "text": "A native of moist habitats in eastern and central North America, black willow often grows near streams and floodplains. Observe from firm ground away from unstable banks."
    }
  ],
  "seasons": "Look for spring catkins, summer foliage, and the open winter crown. Water levels and ground conditions may change between visits; choose a safe viewpoint each time.",
  "energies": [
    {
      "title": "Flexibility",
      "observation": "A crown can follow many irregular directions.",
      "meaning": "Allow a change of approach while keeping what matters in view. Flexibility includes respecting your limits.",
      "question": "Where could you adjust your approach?"
    },
    {
      "title": "Release",
      "observation": "A deciduous tree loses its leaves with the seasons.",
      "meaning": "Consider putting down one unnecessary demand for the length of this visit.",
      "question": "What can wait for a few minutes?"
    },
    {
      "title": "Flow",
      "observation": "Black willow often grows beside moving water.",
      "meaning": "If water is visible, watch its changing surface from a safe distance. Let flow suggest the possibility of a next step.",
      "question": "What could move a little more freely?"
    }
  ],
  "practiceTitle": "Soften your approach.",
  "practiceIntroduction": "A new observation practice exploring flexibility, release, flow beside black willow. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Choose firm ground",
      "text": "Observe from a stable path or seat, away from water’s edge and hazardous branches. Black willow wood can break; keep a comfortable distance."
    },
    {
      "title": "Follow an easy line",
      "text": "Trace one visible branch with your eyes. Let its direction be irregular without trying to correct it."
    },
    {
      "title": "Notice effort",
      "text": "Check for unnecessary effort in your gaze or hands. If comfortable, allow a little less. Keep normal supports and natural breathing."
    },
    {
      "title": "Try one adjustment",
      "text": "Bring to mind a situation that feels stuck. Ask whether one smaller or gentler approach is available. You do not need to solve it now."
    }
  ],
  "reflection": "Where could you soften without abandoning what matters?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/salix-nigra/",
  "credit": {
    "photographer": "Bruce Marlin",
    "license": "CC BY-SA 2.0 DE",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Salix_nigra_bruce_marlin_ccbysa20.jpg",
    "label": "Form"
  },
  "detailImages": [],
  "principles": "Adaptability, release, and balance and optimization"
},
{
  "slug": "beech",
  "name": "Beech",
  "species": "American beech",
  "scientificName": "Fagus grandifolia",
  "image": "/images/trees/beech.webp",
  "imageAlt": "American beech: form (wake county,nc)-mid winter",
  "imageWidth": 599,
  "imageHeight": 900,
  "themes": [
    "Presence",
    "Quiet confidence",
    "Simplicity"
  ],
  "invitation": "Stay with the ordinary detail. Let a few minutes of looking be enough.",
  "introduction": "Stay with the ordinary detail. Let a few minutes of looking be enough. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Bark",
      "text": "American beech has light gray bark that remains smooth as it ages. Observe without carving, marking, or removing anything."
    },
    {
      "title": "Leaves",
      "text": "Leaves have prominent veins and toothed edges. Some dry bronze leaves may remain attached into winter."
    },
    {
      "title": "Place",
      "text": "Native to eastern North America, American beech can form groves through shoots arising from its roots. Notice surface roots without walking over them."
    }
  ],
  "seasons": "Watch leaves emerge, deepen in summer, and turn golden bronze. Winter may hold dry leaves as well as bare twigs. The smooth trunk offers a familiar detail to revisit through changing light.",
  "energies": [
    {
      "title": "Presence",
      "observation": "A smooth trunk makes subtle light and shadow visible.",
      "meaning": "Stay with what is here before seeking something more dramatic.",
      "question": "What is here when you stop searching?"
    },
    {
      "title": "Quiet confidence",
      "observation": "The trunk’s form can be clear without bright color.",
      "meaning": "Consider a way to be present without needing to make an impression.",
      "question": "Where can you be quietly yourself?"
    },
    {
      "title": "Simplicity",
      "observation": "One patch of bark contains small changes of tone and texture.",
      "meaning": "Give a simple detail your full attention. Enough can be smaller than you expected.",
      "question": "What would be enough today?"
    }
  ],
  "practiceTitle": "One ordinary detail.",
  "practiceIntroduction": "A new observation practice exploring presence, quiet confidence, simplicity beside american beech. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Settle into a view",
      "text": "Choose a comfortable view of a beech trunk or branch. Stay on a permitted surface and leave roots and bark undisturbed."
    },
    {
      "title": "Observe without naming",
      "text": "For a short while, notice light, color, lines, and shadow. Let explanations wait."
    },
    {
      "title": "Return to the ordinary",
      "text": "When you start searching for a special experience, return to your chosen detail. A quiet or uneventful visit still counts."
    },
    {
      "title": "Carry simplicity",
      "text": "Finish by naming one thing you noticed. Ask what you could simplify in the next part of your day."
    }
  ],
  "reflection": "What did you notice when you stopped looking for something special?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/fagus-grandifolia/",
  "credit": {
    "photographer": "Cathy Dewitt",
    "license": "CC BY 4.0",
    "licenseUrl": "http://creativecommons.org/licenses/by/4.0/legalcode",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Fagus_grandiflora-Am_8izOZt8yuEPs.jpg",
    "label": "Form (Wake County,NC)-Mid Winter"
  },
  "detailImages": [],
  "principles": "Presence, acceptance, and one-pointed focus"
},
{
  "slug": "hemlock",
  "name": "Hemlock",
  "species": "Eastern hemlock",
  "scientificName": "Tsuga canadensis",
  "image": "/images/trees/hemlock.webp",
  "imageAlt": "Eastern hemlock: form",
  "imageWidth": 599,
  "imageHeight": 900,
  "themes": [
    "Stillness",
    "Shelter",
    "Listening"
  ],
  "invitation": "Listen beneath the branches. Make room for nearby sounds and your own response.",
  "introduction": "Listen beneath the branches. Make room for nearby sounds and your own response. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Needles",
      "text": "Eastern hemlock has short, flat needles, with two pale bands on their undersides. Observe an accessible branch without pulling it toward you."
    },
    {
      "title": "Cones and branches",
      "text": "Small hanging cones and gently drooping branches help distinguish this evergreen. Compare several visible features."
    },
    {
      "title": "Place",
      "text": "Native to eastern North America, eastern hemlock favors cool, moist conditions. Its health is threatened in many places by hemlock woolly adelgid."
    }
  ],
  "seasons": "Green needles persist through the year, while new growth, cones, and light change. Observe the actual tree’s condition; a thinning crown need not match an idealized picture of shelter.",
  "energies": [
    {
      "title": "Stillness",
      "observation": "Fine branches offer a place to rest the gaze.",
      "meaning": "Stillness can mean pausing your next action while life continues around you.",
      "question": "What happens when you pause?"
    },
    {
      "title": "Shelter",
      "observation": "Evergreen branches shape shade and cover.",
      "meaning": "Reflect on the conditions that help you feel supported. Use a safe nearby viewpoint rather than standing beneath hazardous limbs.",
      "question": "What helps you feel at ease?"
    },
    {
      "title": "Listening",
      "observation": "A leafy or needled setting has its own changing soundscape.",
      "meaning": "Let attention receive a sound without immediately explaining it. If hearing is unavailable, receive changes in light or movement.",
      "question": "What have you not yet attended to?"
    }
  ],
  "practiceTitle": "Let listening lead.",
  "practiceIntroduction": "A new observation practice exploring stillness, shelter, listening beside eastern hemlock. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Choose your place",
      "text": "Sit or stand with your usual supports where branches and ground are safe. You can remain on a path at a distance."
    },
    {
      "title": "Receive one sound",
      "text": "Notice a nearby sound, then one farther away. If you prefer, observe near and distant movements or patches of light."
    },
    {
      "title": "Leave room between",
      "text": "Notice changes and pauses without trying to create silence. Include your own thoughts as part of the encounter."
    },
    {
      "title": "Take listening with you",
      "text": "Reflect on a conversation or situation that could use more attention. Choose one way to listen before responding."
    }
  ],
  "reflection": "What becomes clearer when you make room to listen?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/tsuga-canadensis/",
  "credit": {
    "photographer": "David J. Stang",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/4.0/legalcode",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Tsuga_canadensis_for_S4nEwMZqCuos.jfif",
    "label": "Form"
  },
  "detailImages": [],
  "principles": "Presence, acceptance, and one-pointed focus"
},
{
  "slug": "cedar",
  "name": "Cedar",
  "species": "Northern white-cedar",
  "scientificName": "Thuja occidentalis",
  "image": "/images/trees/cedar.webp",
  "imageAlt": "Northern white-cedar: form",
  "imageWidth": 600,
  "imageHeight": 450,
  "themes": [
    "Continuity",
    "Belonging",
    "Care"
  ],
  "invitation": "Notice what supports a life. Reflect on belonging through the care you receive and offer.",
  "introduction": "Notice what supports a life. Reflect on belonging through the care you receive and offer. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Foliage",
      "text": "Northern white-cedar has scale-like foliage arranged in flattened sprays. It is also called American arborvitae."
    },
    {
      "title": "Names",
      "text": "Despite its common name, this species belongs to Thuja in the cypress family. It is distinct from true cedars in Cedrus and from eastern redcedar."
    },
    {
      "title": "Place",
      "text": "Native to eastern and central Canada and parts of the northern United States, this evergreen often grows in moist settings. Garden forms can look different from wild trees."
    }
  ],
  "seasons": "Watch new sprays develop and notice changing greens and winter tones. Evergreen life continues through change; individual foliage is not permanent. Observe the tree in the conditions of its own place.",
  "energies": [
    {
      "title": "Continuity",
      "observation": "Green sprays remain visible across seasons.",
      "meaning": "Think about a thread of care that continues through changes in your life.",
      "question": "What care has lasted?"
    },
    {
      "title": "Belonging",
      "observation": "A tree grows in relationship with soil, light, moisture, and neighboring life.",
      "meaning": "Let belonging be a relationship you participate in, rather than something you must prove.",
      "question": "Where do you feel supported?"
    },
    {
      "title": "Care",
      "observation": "Foliage and branches form a living structure around the trunk.",
      "meaning": "Consider one ordinary act that tends a relationship or a place. Care can begin with leaving the living tree undisturbed.",
      "question": "What can you tend today?"
    }
  ],
  "practiceTitle": "Trace a thread of care.",
  "practiceIntroduction": "A new observation practice exploring continuity, belonging, care beside northern white-cedar. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Meet this cedar",
      "text": "Find a comfortable view of its foliage or form. Notice whether it is a garden planting or part of a wider landscape."
    },
    {
      "title": "Observe its setting",
      "text": "Look at light, ground, and neighboring life without leaving the path. Name one visible condition supporting this tree."
    },
    {
      "title": "Remember support",
      "text": "Reflect on a person, place, or daily habit that supports you. Let appreciation arise if it does; no feeling is required."
    },
    {
      "title": "Offer one act of care",
      "text": "Choose a modest way to care for a relationship or permitted place today. It may be as simple as paying attention."
    }
  ],
  "reflection": "What supports your life, and how might you care for it?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/thuja-occidentalis/",
  "credit": {
    "photographer": "F.D. Richards",
    "license": "CC-BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Thuja_occidentalis_full_FD_Richards_cc_by_sa_20.jpg",
    "label": "Form"
  },
  "detailImages": [],
  "principles": "Unconditional love, acceptance, and perseverance"
},
{
  "slug": "aspen",
  "name": "Aspen",
  "species": "Quaking aspen",
  "scientificName": "Populus tremuloides",
  "image": "/images/trees/aspen.webp",
  "imageAlt": "Quaking aspen: native habitat",
  "imageWidth": 900,
  "imageHeight": 675,
  "themes": [
    "Sensitivity",
    "Connection",
    "Responsiveness"
  ],
  "invitation": "Watch what moves. Notice how you respond, with curiosity and room to choose.",
  "introduction": "Watch what moves. Notice how you respond, with curiosity and room to choose. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Leaves",
      "text": "Rounded leaves on flattened stalks can tremble in a slight breeze. Still air may leave them quiet; movement is not guaranteed."
    },
    {
      "title": "Bark",
      "text": "Young trunks often have pale bark, becoming darker and more furrowed near the base with age. Look beyond bark color when identifying a tree."
    },
    {
      "title": "Place",
      "text": "Quaking aspen grows widely in cool North American regions. It can produce new stems from roots, so some neighboring trunks belong to a connected clone."
    }
  ],
  "seasons": "Look for unfolding leaves, summer movement, and yellow autumn foliage. Bare winter branches reveal another kind of pattern. Connected trunks are not always obvious from the surface.",
  "energies": [
    {
      "title": "Sensitivity",
      "observation": "Flattened leaf stalks allow leaves to move readily in wind.",
      "meaning": "Sensitivity can be information. Notice a response before deciding how to act on it.",
      "question": "What are you noticing in yourself?"
    },
    {
      "title": "Connection",
      "observation": "Some groups of aspen stems grow from shared roots.",
      "meaning": "Use this as a prompt to consider support beyond what is immediately visible. Do not assume every nearby tree shares roots.",
      "question": "What connections sustain you?"
    },
    {
      "title": "Responsiveness",
      "observation": "Leaf movement changes as the breeze changes.",
      "meaning": "Reflect on the space between receiving a signal and choosing a response.",
      "question": "What response would fit this moment?"
    }
  ],
  "practiceTitle": "Notice, then choose.",
  "practiceIntroduction": "A new observation practice exploring sensitivity, connection, responsiveness beside quaking aspen. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Find a moving detail",
      "text": "Watch leaves from a stable seat or path. If there is no breeze or no foliage, choose shifting light or the branching pattern instead."
    },
    {
      "title": "Observe your response",
      "text": "Notice where your attention moves and whether thoughts or feelings arise. You do not need to interpret them immediately."
    },
    {
      "title": "Widen the scene",
      "text": "Include neighboring trunks and the ground around them. Let the scene prompt reflection on connections in your own life."
    },
    {
      "title": "Choose deliberately",
      "text": "Think of one situation that invites a response. Give yourself a moment, then choose one small action or a useful pause."
    }
  ],
  "reflection": "What changes when you notice your response before acting?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/populus-tremuloides/",
  "credit": {
    "photographer": "Tewy",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Populus_tremuloides__Eph4QpdlkN6l.jpg",
    "label": "Native habitat"
  },
  "detailImages": [],
  "principles": "Adaptability, presence, and balance and optimization"
},
{
  "slug": "spruce",
  "name": "Spruce",
  "species": "Red spruce",
  "scientificName": "Picea rubens",
  "image": "/images/trees/spruce.webp",
  "imageAlt": "Red spruce: form",
  "imageWidth": 900,
  "imageHeight": 675,
  "themes": [
    "Resolve",
    "Aspiration",
    "Balance"
  ],
  "invitation": "Follow a direction without rushing. Bring a worthwhile aspiration back to a grounded next step.",
  "introduction": "Follow a direction without rushing. Bring a worthwhile aspiration back to a grounded next step. Begin with this individual tree: its form, its setting, and what you can observe today. Let the encounter come before the meaning.",
  "identity": [
    {
      "title": "Needles",
      "text": "Red spruce has short, four-sided needles attached individually to twigs. Their yellow-green color is one feature to compare with cones and tree form."
    },
    {
      "title": "Form",
      "text": "This evergreen usually has a narrow, conical crown. Notice the actual tree’s shape rather than expecting perfect symmetry."
    },
    {
      "title": "Place",
      "text": "Red spruce belongs to cool northeastern and Appalachian landscapes, including high elevations. It favors moisture and well-drained acidic soils."
    }
  ],
  "seasons": "Evergreen foliage provides continuity while buds, new shoots, and cones mark change. On repeated visits, notice weather and light as well as growth. A high-elevation encounter calls for suitable weather and a permitted trail.",
  "energies": [
    {
      "title": "Resolve",
      "observation": "A conical crown gives the tree a visible overall direction.",
      "meaning": "Resolve can mean choosing a direction that is worth returning to, even when progress is uneven.",
      "question": "What direction matters to you?"
    },
    {
      "title": "Aspiration",
      "observation": "The crown rises above branches arranged along the trunk.",
      "meaning": "Let upward growth prompt a reflection on aspiration. Your goal can be meaningful without becoming a demand for perfection.",
      "question": "What are you reaching toward?"
    },
    {
      "title": "Balance",
      "observation": "The crown spreads outward as well as upward.",
      "meaning": "Consider what supports your aspiration alongside what advances it. Rest and adjustment can belong to the same effort.",
      "question": "What support does your goal need?"
    }
  ],
  "practiceTitle": "Reach with a steady base.",
  "practiceIntroduction": "A new observation practice exploring resolve, aspiration, balance beside red spruce. Read once, then spend a few minutes with the tree.",
  "practice": [
    {
      "title": "Find your support",
      "text": "Choose a stable viewpoint with your usual supports. Notice contact with the ground or seat; no balancing pose is needed."
    },
    {
      "title": "Follow the crown",
      "text": "Move your gaze comfortably along the trunk and branches. You need not look directly overhead or strain your neck."
    },
    {
      "title": "Name an aspiration",
      "text": "Bring to mind one goal that matters. Notice what makes it worthwhile and what conditions could support it."
    },
    {
      "title": "Choose the next step",
      "text": "Name one action small enough for your actual day. Finish by returning attention to the tree and surrounding place."
    }
  ],
  "reflection": "How can you reach toward what matters while staying grounded?",
  "sourceUrl": "https://plants.ces.ncsu.edu/plants/picea-rubens/",
  "credit": {
    "photographer": "bobistraveling",
    "license": "CC BY 2.0",
    "licenseUrl": "http://creativecommons.org/licenses/by/2.0/legalcode",
    "sourceUrl": "https://eit-planttoolbox-prod.s3.amazonaws.com/media/images/Picea_rubens_form__b_3oVAxAbdcvcP.jpg",
    "label": "Form"
  },
  "detailImages": [],
  "principles": "One-pointed focus and aspiration for excellence, perseverance, and balance and optimization"
}
];

export const trees: readonly Tree[] = [
  ...originalTrees.map(tree => ({ ...tree, detailImages: treeDetailImages[tree.slug] ?? tree.detailImages })),
  ...additionalTrees,
  ...tennesseeTrees,
  ...fourPracticeTrees,
  ...newPracticeTrees,
  ...growthPracticeTrees,
  ...mapPracticeTrees,
];

export function getTree(slug: string) { return trees.find((tree) => tree.slug === slug); }

