import type { ChampionState } from "./champion-trees";

export type TreeVisit = {
  slug: string; championId: string; state: ChampionState; name: string; scientificName: string;
  place: string; kind: string; arrival: string; walking: string; access: string; pause: string; checked: string;
  sources: { label: string; href: string }[];
  practice: { title: string; text: string; href: string; label: string };
};

export const treeVisits: TreeVisit[] = [
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
