import type { ChampionState } from "./champion-trees";

export type TreeVisit = {
  slug: string; championId: string; state: ChampionState; name: string; scientificName: string;
  place: string; arrival: string; access: string; checked: string;
  sources: { label: string; href: string }[];
  practice: { title: string; text: string; href: string; label: string };
};

export const treeVisits: TreeVisit[] = [
  {
    slug: "pinchot-sycamore", championId: "ct-128002", state: "CT",
    name: "The Pinchot Sycamore", scientificName: "Platanus occidentalis",
    place: "Pinchot Sycamore Tree Park · Simsbury, Connecticut",
    arrival: "Find the park on Route 185 (Hartford Road), below the bridge on the eastern bank of the Farmington River. The Connecticut register places the tree in this small park.",
    access: "Simsbury Parks lists the park as open. Consult its facility page for current information before setting out; park opening hours are not specified there.",
    checked: "2026-10-07",
    sources: [
      { label: "Simsbury Parks · visitor information", href: "https://simsburyct.myrec.com/info/facilities/details.aspx?FacilityID=7724" },
      { label: "Connecticut’s Notable Trees · tree location", href: "https://oak.conncoll.edu/notabletrees/ViewTreeData.jsp?selected=128002" },
    ],
    practice: { title: "Make room for perspective", text: "From a comfortable place, take in the whole crown. Then rest your attention on one patch of bark. Move gently between the whole and the detail for five unhurried breaths.", href: "/trees/sycamore#practice", label: "Continue the Sycamore practice" },
  },
  {
    slug: "university-green-redwood", championId: "vt-21", state: "VT",
    name: "Dawn redwood on University Green", scientificName: "Metasequoia glyptostroboides",
    place: "University of Vermont · Burlington, Vermont",
    arrival: "Vermont places this tree on the south side of University Green and publishes public tree coordinates in its record. Open the champion record below for that location link.",
    access: "Vermont’s record explicitly lists public access. If driving, use designated visitor parking, such as the College Street Visitor Lot, and follow the posted payment and time limits.",
    checked: "2026-10-07",
    sources: [
      { label: "Vermont · public access and tree location", href: "https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/BigTreeSurvey_ExperienceView/FeatureServer/0/21" },
      { label: "UVM · visitor parking guidance", href: "https://www.uvm.edu/transportation/short-term-parking-color-codes" },
      { label: "UVM · campus maps and self-guided visits", href: "https://www.uvm.edu/admissions/undergraduate/visit-options" },
    ],
    practice: { title: "Return to one detail", text: "Choose a branch against the sky. Notice its outline, the light, and any movement. Let the sounds of campus come and go, returning to that one detail whenever attention wanders.", href: "/trees/dawn-redwood#practice", label: "Continue the Dawn Redwood practice" },
  },
  {
    slug: "smith-castor-aralia", championId: "dcr-2026-24", state: "MA",
    name: "Castor aralia at Smith College", scientificName: "Kalopanax septemlobus",
    place: "Smith College Campus Arboretum · Northampton, Massachusetts",
    arrival: "DCR’s May 2026 register places this tree on the south side of College Hall, at 10 Elm Street. Use Smith’s campus directions and parking map to plan your arrival.",
    access: "Smith’s outdoor arboretum and gardens are free and open daily, year-round. Visitor parking includes the West Street garage; consult the visitor page for options. Groups of ten or more should arrange their visit with the garden.",
    checked: "2026-10-07",
    sources: [
      { label: "Smith College · visiting, parking, and group guidance", href: "https://garden.smith.edu/visit" },
      { label: "DCR · May 2026 tree register (row 24, Excel)", href: "/data/massachusetts-champion-trees-may-2026.xlsx" },
    ],
    practice: { title: "Meet a tree without a story", text: "Before deciding what this tree means to you, notice three things: a line, a texture, and a space between branches. Stay with what you can see. Let any personal meaning arrive in its own time.", href: "/lessons/first-five-minutes", label: "Begin an observation practice" },
  },
];
