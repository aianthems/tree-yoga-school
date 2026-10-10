import type { ChampionState } from "./champion-trees";

export type TreeVisit = {
  slug: string; championId?: string; librarySlug?: string; state: ChampionState; name: string; scientificName: string;
  place: string; kind: string; arrival: string; walking: string; access: string; pause: string; checked: string;
  sources: { label: string; href: string }[];
  practice: { title: string; text: string; href: string; label: string };
};

export const treeVisits: TreeVisit[] = [
  {
    slug: "chatfield-cottonwood", state: "CO", name: "Cottonwood at Chatfield Farms", scientificName: "Populus deltoides", librarySlug: "eastern-cottonwood",
    place: "Denver Botanic Gardens Chatfield Farms · Littleton, Colorado", kind: "Public garden visit",
    arrival: "Arrive at 8500 W Deer Creek Canyon Road, Littleton. Parking is included with admission; the lot opens at 8:50 a.m. Ask Welcome Center staff for the Center Water Feature Garden cottonwood. The Gardens' 2024 walking guide describes crossing the first Deer Creek bridge southwest of the Earl J. Sinnamon Center and Deer Creek Schoolhouse toward a small pond. Use current signs and staff guidance to confirm the route.",
    walking: "The July 2025 grounds map distinguishes paved and unpaved paths and footbridges. The garden visit is separate from the marked 1.4-mile hiking trail; a parking-to-cottonwood distance is not published. Some areas need assistance for wheelchair access. Ask staff to identify a suitable route and viewpoint before crossing the creek. The Gardens identifies this tree as Populus deltoides; no champion designation is asserted here.",
    access: "Regular general-admission hours are listed as 9 a.m.–4 p.m. daily. Paid admission includes parking; check the current ticket page for prices, holiday hours, and early closures. Special events have separate arrangements. Pets are not permitted; service animals are welcome. Do not climb trees, pick plants, or enter garden beds.",
    pause: "Choose a permitted path-side viewpoint of the cottonwood, leaving the bridge and paths clear. Follow a moving leaf or branch tip, then widen your view to the surrounding garden. A short garden visit is enough.",
    checked: "2026-10-10",
    sources: [
      { label: "Denver Botanic Gardens · Chatfield hours, admission and closures", href: "https://www.botanicgardens.org/chatfield-farms" },
      { label: "Denver Botanic Gardens · cottonwood identification and garden approach (2024)", href: "https://www.botanicgardens.org/blog/may-walking-tour-center-water-feature-chatfield-farms" },
      { label: "Denver Botanic Gardens · parking and accessibility", href: "https://www.botanicgardens.org/chatfield-farms/parking-transportation-accessibility-chatfield-farms" },
      { label: "Denver Botanic Gardens · July 2025 grounds map (PDF)", href: "https://www.botanicgardens.org/sites/default/files/file/2025-07/ChatfieldFarmsMap-wlogo-07-2025.pdf" },
      { label: "Denver Botanic Gardens · accessible routes and support", href: "https://www.botanicgardens.org/accessibility" },
      { label: "Denver Botanic Gardens · visitor guidelines", href: "https://www.botanicgardens.org/chatfield-farms/chatfield-farms-visitor-guidelines" },
    ],
    practice: {
      title: "Notice movement. Allow change.",
      text: "Let a leaf's movement draw your attention, then include something relatively still: the trunk, a patch of ground, or a branch junction. Notice both without controlling your breathing. Consider one change you can meet with a little more flexibility.",
      href: "/trees/eastern-cottonwood#practice", label: "Explore Eastern Cottonwood and its practice",
    },
  },
  {
    slug: "burden-woods", state: "LA", name: "Cypress and the forest at Burden Woods", scientificName: "Taxodium distichum", librarySlug: "bald-cypress",
    place: "LSU AgCenter Botanic Gardens at Burden · Baton Rouge, Louisiana", kind: "Public woodland and wetland visit",
    arrival: "Enter at 4560 Essen Lane, Baton Rouge, near I-10. Follow the road toward the Burden Museum & Gardens Visitor Information Center and use the mapped visitor parking. Trees & Trails signs are behind the Steele Burden Memorial Orangerie. Ask staff about today's route to Black Swamp and the Mosaic Boardwalk before setting out.",
    walking: "LSU describes about three miles of trails through Burden Woods. Its linked 2019 map labels Black Swamp Trail as 0.7 miles and the Mosaic Boardwalk Loop as 0.19 miles; these are route labels, not distances from parking. Choose a shorter out-and-back if needed. The reviewed sources do not document a continuous step-free approach. Check wet-ground conditions and boardwalk access with staff. LSU's Black Swamp learning resources include bald cypress; this guide explores a woodland habitat, rather than one designated champion.",
    access: "Botanic Gardens admission and parking are free; neighboring museum and Windrush Gardens visits have separate fees. The current Trees & Trails page lists 8 a.m.–4:30 p.m., with closures on Easter, Thanksgiving, Christmas Eve, Christmas Day and New Year's Day. The general visitor page lists gates closing at 5 p.m.; plan to finish the trail by 4:30 p.m. Follow current notices rather than the older map's 'dusk' wording.",
    pause: "Use a dry, permitted viewpoint on the established route. Leave the boardwalk clear and remain out of the wetland. Notice a trunk line and the changing reflections or light nearby; use labels or staff guidance before naming an individual tree.",
    checked: "2026-10-10",
    sources: [
      { label: "LSU · visitor address, free admission and parking", href: "https://www.lsu.edu/botanic-gardens/visit/_index.php" },
      { label: "LSU · current Trees & Trails hours and trailhead", href: "https://www.lsu.edu/botanic-gardens/research/trees.php" },
      { label: "LSU · Burden Woods and Black Swamp habitat", href: "https://www.lsu.edu/botanic-gardens/gardens/gardens.php" },
      { label: "LSU · Black Swamp bald cypress learning resources", href: "https://www.lsu.edu/botanic-gardens/research/burdenbuddies.php" },
      { label: "LSU · 2019 trail map and route lengths (PDF)", href: "https://www.lsu.edu/botanic-gardens/images/tntmap.2019.pdf" },
    ],
    practice: {
      title: "One steady detail in a changing scene.",
      text: "Rest your attention on one visible line in a trunk. Include a passing sound, a reflection, or a shift in light. Return gently to the same detail, allowing the surroundings to change. Let a view from the path be enough.",
      href: "/trees/bald-cypress#practice", label: "Explore Bald Cypress and its practice",
    },
  },
  {
    slug: "keystone-post-oaks", state: "OK", name: "Post oaks of Keystone Ancient Forest", scientificName: "Quercus stellata", librarySlug: "post-oak",
    place: "Keystone Ancient Forest · Sand Springs, Oklahoma", kind: "Public preserve hike",
    arrival: "Arrive at 160 Ancient Forest Drive, Sand Springs. The Nature Conservancy describes heading north on Prue Road from the Highway 64/412 exit for about two miles to the sandstone-and-iron entrance opposite the second cell tower. Use the visitor-center parking and ask staff or a Trail Ambassador to help choose a post-oak viewpoint and route.",
    walking: "The preserve has marked trails through rocky Cross Timbers woodland. The city advertises ADA-compliant trails and all-terrain track chairs; ask which route is appropriate, how chairs are arranged, and whether they are available for your visit. The Nature Conservancy rates trails easy to moderate, but that does not establish accessibility on every trail. Follow marked routes and current staff advice. This is a forest encounter, with post oaks identified by the managing city, rather than a visit to one certified champion.",
    access: "The city and Nature Conservancy list Thursday, 7 a.m.–2 p.m., and Friday–Sunday, 7 a.m.–6 p.m. The property is locked promptly at closing. The reviewed pages do not state an admission fee; confirm arrangements with the visitor center. No reservations are normally required, but weather can change hike access. Pets are allowed only on designated dog days; verify the schedule before bringing one.",
    pause: "Choose a stable viewpoint on a route suited to you, with room for others to pass. Look at the oak's branches and its place among neighboring trees. Leave bark, leaves, and acorns attached or on the ground, and avoid stepping into undergrowth.",
    checked: "2026-10-10",
    sources: [
      { label: "City of Sand Springs · address, hours, post oaks and accessibility", href: "https://www.sandspringsok.gov/175/Keystone-Ancient-Forest" },
      { label: "Nature Conservancy · directions, hiking conditions and visiting guidelines", href: "https://www.nature.org/en-us/get-involved/how-to-help/places-we-protect/keystone-ancient-forest-preserve/" },
    ],
    practice: {
      title: "Choose a pace you can sustain.",
      text: "Notice one branch and the space around it. Consider a small commitment you can repeat without forcing yourself. Let a comfortable pause count, and choose one modest next step before continuing your walk.",
      href: "/trees/post-oak#practice", label: "Explore Post Oak and its practice",
    },
  },

  {
    slug: "angel-oak", state: "SC", name: "Angel Oak", scientificName: "Quercus virginiana",
    place: "Angel Oak Park · Johns Island, South Carolina", kind: "Public park visit",
    arrival: "Arrive at 3688 Angel Oak Road on Johns Island, using the City of Charleston's directions link. Follow the signed entrance and designated parking. The city pages do not describe parking capacity or a measured parking-to-tree route.",
    walking: "Explore the park around the spreading live oak from permitted viewpoints. The city lists benches and picnic facilities, but does not document a step-free route to the tree. Check ground conditions on arrival and keep clear of roots and low branches.",
    access: "Admission is free. Posted city hours are Monday–Saturday, 9 a.m.–5 p.m., and Sunday, 1–5 p.m.; last entry is 4:50 p.m. The park is closed on holidays. Food, drinks, blankets, props, and tripods are not allowed on or around the tree. Check the city pages for current notices before travelling.",
    pause: "Use a permitted bench or a stable viewpoint with room for others to pass. Keep belongings away from the tree and follow staff instructions; let a distant view of the limbs be enough.",
    checked: "2026-10-09",
    sources: [
      { label: "City of Charleston · park hours and facilities", href: "https://www.charleston-sc.gov/facilities/facility/details/Angel-Oak-Park-7" },
      { label: "City of Charleston · directions, holidays and tree rules", href: "https://www.charleston-sc.gov/153/Angel-Oak" },
    ],
    practice: {
      title: "Let the whole scene in.",
      text: "Choose one curve in a branch, then include the space around it. Notice a line, a texture, and an opening in the crown. Breathe naturally, letting observation come before any meaning you give the tree.",
      href: "/lessons/first-five-minutes", label: "Begin an observation practice",
    },
  },
  {
    slug: "lady-liberty-cypress", state: "FL", name: "Lady Liberty at Big Tree Park", scientificName: "Taxodium distichum",
    place: "Big Tree Park · Longwood, Florida", kind: "Public park and boardwalk visit",
    arrival: "Use Big Tree Park's entrance at 761 General Hutchison Parkway in Longwood; the county trail page spells the road Hutchinson. Use the park's designated parking and signs for the trees. The county lists restrooms, a water fountain, picnic facilities, and a playground at this trailhead.",
    walking: "Follow the park's signed nature walk and boardwalk through the hammock to Lady Liberty. The county does not publish a measured parking-to-tree distance in the reviewed visitor pages. Its 2020 accessibility report lists accessible parking and a sidewalk at the playground; it does not establish the current condition of the entire route to the tree. Confirm the approach and any boardwalk closures with park staff.",
    access: "The county's parks brochure lists Big Tree Park and Trailhead as open 8 a.m. to sunset. A separate entry fee is not stated in the reviewed county information. Check current park notices before travelling. Lady Liberty is the living bald cypress described by Seminole County Tourism; the original Senator tree was lost to fire in 2012.",
    pause: "Pause at a permitted viewpoint beside the established route, leaving the boardwalk clear. Stay out of the wetland and behind any protective barriers; use your usual supports and a comfortable viewing angle.",
    checked: "2026-10-09",
    sources: [
      { label: "Seminole County · Big Tree Park and boardwalk", href: "https://www.seminolecountyfl.gov/locations/location-info/big-tree-park" },
      { label: "Seminole County · park hours, 2025 brochure (PDF)", href: "https://www.seminolecountyfl.gov/docs/default-source/pdf/trails_parks_and_natural_lands_brochure_2025_for_web_ada.pdf" },
      { label: "Seminole County · trailhead address and amenities", href: "https://www.seminolecountyfl.gov/departments-services/parks-recreation/parks-trails-and-natural-lands/trails/cross-seminole-trail" },
      { label: "Seminole County Tourism · Lady Liberty and the Senator", href: "https://doorlandonorth.com/america-250-seminole-county-itinerary/" },
      { label: "Seminole County · 2020 accessibility report (PDF)", href: "https://www.seminolecountyfl.gov/docs/default-source/pdf/list-of-accessible-parksada.pdf?sfvrsn=8f7491cc_5" },
    ],
    practice: {
      title: "A steady form. A changing detail.",
      text: "Rest your attention on a trunk line or branch outline. Include a moving leaf, a passing sound, or a change in light. Let the scene change while you return gently to the same visible detail, breathing naturally.",
      href: "/trees/bald-cypress#practice", label: "Continue the Bald Cypress practice",
    },
  },
  {
    slug: "morton-bur-oaks", state: "IL", name: "Bur oaks in the Oak Collection", scientificName: "Quercus macrocarpa",
    place: "The Morton Arboretum · Lisle, Illinois", kind: "Arboretum collection visit",
    arrival: "Enter The Morton Arboretum at 4100 Illinois Route 53, Lisle. After admission, use the grounds map and one-way driving route to East Side parking lot P-8 for the Oak Collection. The Arboretum identifies mature bur oaks here; use tree labels or ask staff to help identify a suitable tree. This guide explores a collection, rather than a single designated champion.",
    walking: "The Oak Collection extends across 12 acres. Choose a walk suited to your time and mobility from P-8; no single parking-to-tree distance applies. Trails beyond the central visitor area are generally wood-chipped. Ask staff about the day's route conditions and accessibility instead of assuming the collection has a paved final approach.",
    access: "The collection is included with paid Arboretum admission, and admission includes parking. Buy online in advance or at the gatehouse; check current ticket prices for your date. General grounds hours are daily, 9 a.m. to sunset, with last entry one hour before sunset. Special holiday and weather arrangements may differ; consult the hours page.",
    pause: "Choose an established viewpoint where you can see a labelled bur oak without crossing planted areas or blocking a trail. Notice a branch and the opening beside it; leave bark, leaves, and acorns in place.",
    checked: "2026-10-09",
    sources: [
      { label: "Morton Arboretum · Oak Collection and P-8", href: "https://mortonarb.org/explore/activities/explore-grounds/oak-collection/" },
      { label: "Morton Arboretum · admission and tickets", href: "https://mortonarb.org/visit-the-arboretum/" },
      { label: "Morton Arboretum · address, parking and directions", href: "https://mortonarb.org/visit-the-arboretum/parking-and-directions/" },
      { label: "Morton Arboretum · grounds and holiday hours", href: "https://mortonarb.org/visit-the-arboretum/hours/" },
      { label: "Morton Arboretum · paths and exploring the Oak Collection", href: "https://mortonarb.org/guides/wonder-woods/" },
    ],
    practice: {
      title: "Make room to continue.",
      text: "Look at a branch, then at the space beside it. Give both room in your attention. Consider one ongoing effort and the pace or support that would help you sustain it; choose one modest next step.",
      href: "/trees/bur-oak#practice", label: "Continue the Bur Oak practice",
    },
  },
  {
    "slug": "pinchot-sycamore",
    "championId": "ct-128002",
    "state": "CT",
    "name": "The Pinchot Sycamore",
    "scientificName": "Platanus occidentalis",
    "place": "Pinchot Sycamore Tree Park · Simsbury, Connecticut",
    "arrival": "Find the park on Route 185 (Hartford Road), below the bridge on the eastern bank of the Farmington River. The Connecticut register places the tree in this small park. Use the signed park entrance and any designated parking; the facility page does not describe parking capacity.",
    "access": "Simsbury Parks lists the park as open. Consult its facility page for current information before setting out; park opening hours are not specified there. No admission fee is stated on the facility page; follow posted rules.",
    "checked": "2026-10-07",
    "sources": [
      {
        "label": "Simsbury Parks · visitor information",
        "href": "https://simsburyct.myrec.com/info/facilities/details.aspx?FacilityID=7724"
      },
      {
        "label": "Connecticut’s Notable Trees · tree location",
        "href": "https://oak.conncoll.edu/notabletrees/ViewTreeData.jsp?selected=128002"
      },
      {
        "label": "Town of Simsbury · park setting",
        "href": "https://www.simsbury-ct.gov/1059/Pinchot"
      }
    ],
    "practice": {
      "title": "Make room for perspective",
      "text": "From a comfortable place, take in the whole crown. Then rest your attention on one patch of bark. Move gently between the whole and the detail for five unhurried breaths.",
      "href": "/trees/sycamore#practice",
      "label": "Continue the Sycamore practice"
    },
    "kind": "Park visit",
    "walking": "The sources do not publish a measured parking-to-tree distance or a step-free route. This is a riverside park; choose your route according to conditions and keep back from the riverbank.",
    "pause": "Choose a stable spot with a clear view of the crown, leaving paths and the river access clear."
  },
  {
    "slug": "university-green-redwood",
    "championId": "vt-21",
    "state": "VT",
    "name": "Dawn redwood on University Green",
    "scientificName": "Metasequoia glyptostroboides",
    "place": "University of Vermont · Burlington, Vermont",
    "arrival": "Vermont places this tree on the south side of University Green and publishes public tree coordinates in its record. Open the champion record below for that location link.",
    "access": "Vermont’s record explicitly lists public access. If driving, use designated visitor parking, such as the College Street Visitor Lot, and follow the posted payment and time limits. No separate tree-entry fee is listed; parking charges apply as posted. Follow campus notices during events or winter weather.",
    "checked": "2026-10-07",
    "sources": [
      {
        "label": "Vermont · public access and tree location",
        "href": "https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/BigTreeSurvey_ExperienceView/FeatureServer/0/21"
      },
      {
        "label": "UVM · visitor parking guidance",
        "href": "https://www.uvm.edu/transportation/short-term-parking-color-codes"
      },
      {
        "label": "UVM · campus maps and self-guided visits",
        "href": "https://www.uvm.edu/admissions/undergraduate/visit-options"
      }
    ],
    "practice": {
      "title": "Return to one detail",
      "text": "Choose a branch against the sky. Notice its outline, the light, and any movement. Let the sounds of campus come and go, returning to that one detail whenever attention wanders.",
      "href": "/trees/dawn-redwood#practice",
      "label": "Continue the Dawn Redwood practice"
    },
    "kind": "Campus visit",
    "walking": "Use campus paths to reach the south side of University Green. Distance depends on your parking place; a measured step-free route to the tree is not supplied by the register. Snow or wet grass may affect your viewpoint.",
    "pause": "Pause beside a campus path where you can see a branch comfortably, without blocking people moving across the Green."
  },
  {
    "slug": "smith-castor-aralia",
    "championId": "dcr-2026-24",
    "state": "MA",
    "name": "Castor aralia at Smith College",
    "scientificName": "Kalopanax septemlobus",
    "place": "Smith College Campus Arboretum · Northampton, Massachusetts",
    "arrival": "DCR’s May 2026 register places this tree on the south side of College Hall, at 10 Elm Street. Use Smith’s campus directions and parking map to plan your arrival.",
    "access": "Smith’s outdoor arboretum and gardens are free and open daily, year-round. Visitor parking includes the West Street garage; consult the visitor page for options. Groups of ten or more should arrange their visit with the garden.",
    "checked": "2026-10-07",
    "sources": [
      {
        "label": "Smith College · visiting, parking, and group guidance",
        "href": "https://garden.smith.edu/visit"
      },
      {
        "label": "DCR · May 2026 tree register (row 24, Excel)",
        "href": "/data/massachusetts-champion-trees-may-2026.xlsx"
      },
      {
        "label": "Smith · campus map and accessibility",
        "href": "https://www.smith.edu/discover-smith/visit-campus"
      }
    ],
    "practice": {
      "title": "Meet a tree without a story",
      "text": "Before deciding what this tree means to you, notice three things: a line, a texture, and a space between branches. Stay with what you can see. Let any personal meaning arrive in its own time.",
      "href": "/lessons/first-five-minutes",
      "label": "Begin an observation practice"
    },
    "kind": "Campus arboretum",
    "walking": "Use Smith’s campus map to plan a route to College Hall from your chosen parking place. A measured route to this tree is not published; the campus map includes accessibility information.",
    "pause": "Choose a permitted, stable viewpoint on the south side of College Hall, clear of entrances, paths, and planted beds."
  },
  {
    "slug": "tamworth-big-pines",
    "championId": "nh-985",
    "state": "NH",
    "name": "The white pine at Big Pines",
    "scientificName": "Pinus strobus",
    "kind": "Forest walk",
    "place": "Big Pines Natural Area · Tamworth, New Hampshire",
    "arrival": "Use the signed Big Pines pull-off on the south side of Route 113A (Chinook Trail), about 2.8 miles west of its junction with Route 113 in Tamworth village. UNH describes the champion pine beside the uphill section of the Betty Steele Trail after the bridge. Download the Conservation Commission’s trail map before setting out; the Champion Map’s town marker is not the trailhead.",
    "walking": "UNH describes a loop of a little over one mile, crossing the Swift River gorge on a bridge with railings and climbing uphill past the pine. This is a woodland hike. The separate one-third-mile Easy Walker Nature Trail begins near parking, but does not provide the same route to the champion pine. Distance is from UNH’s 2022 guide; follow current trail signs.",
    "access": "The Conservation Commission manages these trails for pedestrian recreation. The reviewed trail information does not specify an entry fee or fixed opening hours. Check current notices and weather before travelling; snow, ice, or wet conditions can change the walk. The Great Hill tower is an optional, separate uphill extension.",
    "pause": "Find a stable place on the established trail with room for others to pass. View the crown from a comfortable distance rather than standing directly against the trunk or stretching your neck.",
    "sources": [
      {
        "label": "UNH Extension · pine, walking route and parking",
        "href": "https://extension.unh.edu/blog/2022/02/towering-trees-tamworth"
      },
      {
        "label": "Tamworth Conservation Commission · current trail maps",
        "href": "https://www.tamworthconservationcommission.org/managed-lands-trails"
      },
      {
        "label": "Tamworth · tower notices for an optional extension",
        "href": "https://www.tamworthconservationcommission.org/great-hill-tower"
      }
    ],
    "practice": {
      "title": "One pine. One clear point.",
      "text": "Choose a branch outline or patch of bark at an easy viewing angle. Let sounds and moving light remain in the background. Whenever attention wanders, return gently to that one detail, breathing naturally.",
      "href": "/trees/pine#practice",
      "label": "Continue the Pine practice"
    },
    "checked": "2026-10-07"
  },
  {
    "slug": "middlebury-american-elm",
    "championId": "vt-56",
    "state": "VT",
    "name": "American elm at Middlebury",
    "scientificName": "Ulmus americana",
    "kind": "Campus visit",
    "place": "Middlebury College · Middlebury, Vermont",
    "arrival": "Vermont’s public-access record locates this elm north of Pepin Gym on South Main Street. Middlebury recommends visitor spaces in Q Lot at the Mahaney Arts Center. Use the college campus map for the walk to Pepin Gym and the champion record’s published tree-position link for the final location.",
    "walking": "A campus walk whose length depends on your parking space and route. No measured parking-to-tree distance or verified step-free final approach is published in the tree record. Use the campus map’s accessible-route and parking information, and stay on established paths where possible.",
    "access": "The Vermont register explicitly lists public access to the tree. Middlebury says weekday visitors parking Monday–Friday, 8 a.m.–5 p.m., should display a college parking permit; obtain a temporary permit through its visitor-parking page. No separate tree admission fee is listed. Observe campus notices, posted parking restrictions, and event arrangements.",
    "pause": "Choose a stable viewpoint near a campus path with space to see the arching canopy. Keep entrances, athletic access, and walkways clear; use your usual seat or mobility supports.",
    "sources": [
      {
        "label": "Vermont · tree location and public access",
        "href": "https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/BigTreeSurvey_ExperienceView/FeatureServer/0/56"
      },
      {
        "label": "Middlebury · visitor parking and temporary permits",
        "href": "https://www.middlebury.edu/public-safety/parking-information/visitor-parking-information"
      },
      {
        "label": "Middlebury · campus map",
        "href": "https://www.middlebury.edu/sites/default/files/2023-10/MiddCampusMap_101623_webres.pdf"
      }
    ],
    "practice": {
      "title": "Make room.",
      "text": "Begin with one branch. Gradually widen your attention to nearby branches, the crown, and the surrounding scene. Notice what changes when a single concern has a little more room around it.",
      "href": "/trees/american-elm#practice",
      "label": "Continue the American Elm practice"
    },
    "checked": "2026-10-07"
  },
  {
    "slug": "blithewold-giant-sequoia",
    "championId": "ri-2026-131",
    "state": "RI",
    "name": "Giant sequoia at Blithewold",
    "scientificName": "Sequoiadendron giganteum",
    "kind": "Garden visit",
    "place": "Blithewold Manor, Gardens & Arboretum · Bristol, Rhode Island",
    "arrival": "Arrive at 101 Ferry Road (Route 114), Bristol. Check in at the Welcome Center next to the parking lot. Ask for the original giant sequoia planted in 1911 near the Enclosed Garden and Summerhouse, and use Blithewold’s grounds map to choose your route.",
    "walking": "A garden walk; an exact parking-to-tree distance is not published in the reviewed information. The grounds map identifies path materials, benches, and restrooms. Ask the Welcome Center about a route suited to your mobility and the day’s ground conditions.",
    "access": "General admission is required for the grounds and is purchased at the Welcome Center. As checked October 7, 2026, adult admission is $22; concessions and reciprocal memberships are listed by Blithewold. Through October 25, grounds hours are Tuesday–Saturday 10 a.m.–4 p.m. and Sunday 10 a.m.–3 p.m.; Mondays are closed. Later-season hours differ. Check both admission and hours pages for your date.",
    "pause": "Use an available bench or a stable permitted viewpoint indicated by the grounds map. Let the entire outline come into view while leaving paths and planted areas clear.",
    "sources": [
      {
        "label": "Blithewold · arboretum and original sequoia",
        "href": "https://www.blithewold.org/arboretum/"
      },
      {
        "label": "Blithewold · notable trees and grounds map",
        "href": "https://www.blithewold.org/arboretum/trees/"
      },
      {
        "label": "Blithewold · admission and concessions",
        "href": "https://www.blithewold.org/general-admission-tickets/"
      },
      {
        "label": "Blithewold · seasonal hours",
        "href": "https://www.blithewold.org/hours/"
      },
      {
        "label": "Rhode Island Tree Council · champion register",
        "href": "https://ritree.org/champion-tree/"
      }
    ],
    "practice": {
      "title": "Let scale become attention.",
      "text": "Notice the whole tree, then choose one visible detail: a branch, a bark pattern, or an opening against the sky. Give both the large form and the small detail a moment, without needing to describe the experience.",
      "href": "/lessons/first-five-minutes",
      "label": "Begin an observation practice"
    },
    "checked": "2026-10-07"
  },
  {
    "slug": "sunderland-buttonball",
    "championId": "dcr-2026-127",
    "state": "MA",
    "name": "The Buttonball Sycamore",
    "scientificName": "Platanus occidentalis",
    "kind": "Sidewalk viewing",
    "place": "North Main Street · Sunderland, Massachusetts",
    "arrival": "DCR places the Buttonball Tree on North Main Street in Sunderland. The town’s historical brochure and UMass describe it beside the sidewalk. Plan a view from the public sidewalk. A dedicated visitor parking area is not confirmed by these sources: use only legal, signed public parking and check local restrictions before leaving your vehicle.",
    "walking": "The walking distance depends on where you can legally park. The published sources do not establish a continuous step-free route or current sidewalk condition. Stay clear of traffic and follow any temporary pedestrian diversions.",
    "access": "This guide is for public-sidewalk viewing, with no ticketed entry described in the sources. It does not establish permission to enter the adjoining yard. Respect fences, root-protection areas, and current signs. The historical brochure dates to 2008 and UMass’s preservation account discusses earlier road works; neither provides live access conditions.",
    "pause": "Choose a clear section of public sidewalk where you can stop without obstructing others. Observe from that distance, keeping off the surrounding root area and private yard.",
    "sources": [
      {
        "label": "Sunderland Historical Commission · tree and sidewalk setting (PDF)",
        "href": "https://www.townofsunderland.us/sites/g/files/vyhlif3891/f/uploads/tree_trifold_oct_2008_2_0.pdf"
      },
      {
        "label": "UMass · tree location and preservation context",
        "href": "https://www.umass.edu/arboretum/news/historic-buttonball-tree-preserved"
      },
      {
        "label": "DCR · May 2026 register (row 127, Excel)",
        "href": "/data/massachusetts-champion-trees-may-2026.xlsx"
      }
    ],
    "practice": {
      "title": "A wider perspective.",
      "text": "From the sidewalk, take in as much of the crown as your viewpoint allows. Then notice one visible bark detail or branch. Move between the whole and the detail, allowing each view to add something to the other.",
      "href": "/trees/sycamore#practice",
      "label": "Continue the Sycamore practice"
    },
    "checked": "2026-10-07"
  },
  {
    "slug": "woodstock-yellowwood",
    "championId": "vt-44",
    "state": "VT",
    "name": "Yellowwood at Marsh–Billings–Rockefeller",
    "scientificName": "Cladrastis kentukea",
    "kind": "Park grounds",
    "place": "Marsh–Billings–Rockefeller National Historical Park · Woodstock, Vermont",
    "arrival": "Use the shared Billings Farm & Museum visitor parking at 69 Old River Road, following NPS arrival signs. Vermont places the yellowwood on the road to the national park visitor center and publishes its public tree coordinates. Use the official park map and the champion record’s tree-position link to identify it; the town marker is only approximate.",
    "walking": "Follow the park’s signed pedestrian approach from the shared parking area toward the visitor center. NPS provides maps and accessibility guidance, but the tree record gives no measured parking-to-tree distance or verified step-free final approach. Check the route with park staff if access details matter for your visit.",
    "access": "Vermont explicitly lists public access. NPS lists the grounds and trails as open during daylight throughout the year, with no entrance fee; guided tours and the separate Billings Farm & Museum may have charges. Building schedules differ from outdoor access. Check NPS conditions before travel, particularly during winter.",
    "pause": "Choose a stable, permitted viewpoint along the visitor approach, leaving the road or path clear. Stay out of planted beds and observe without needing to reach the trunk.",
    "sources": [
      {
        "label": "Vermont · yellowwood location and public access",
        "href": "https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/BigTreeSurvey_ExperienceView/FeatureServer/0/44"
      },
      {
        "label": "NPS · directions and planning",
        "href": "https://www.nps.gov/mabi/planyourvisit/index.htm"
      },
      {
        "label": "NPS · hours and admission information",
        "href": "https://www.nps.gov/mabi/planyourvisit/basicinfo.htm"
      },
      {
        "label": "NPS · conditions and seasonal notices",
        "href": "https://www.nps.gov/mabi/planyourvisit/conditions.htm"
      },
      {
        "label": "NPS · maps",
        "href": "https://www.nps.gov/mabi/planyourvisit/maps.htm"
      }
    ],
    "practice": {
      "title": "Meet a tree with curiosity.",
      "text": "Notice three visible details before looking for a story: a line, a texture, and a space between branches. Let an unfamiliar tree be an invitation to look again. Finish by naming one thing you had not noticed at first.",
      "href": "/lessons/first-five-minutes",
      "label": "Begin an observation practice"
    },
    "checked": "2026-10-07"
  }
];

export const treeVisitStateCount = new Set(treeVisits.map(visit => visit.state)).size;
export const treeVisitSummary = `${treeVisits.length} tree visits across ${treeVisitStateCount} states, with arrival guidance, walking details, and a practice to bring along.`;
