import metadata from "./tree-identification-data.json";
export type TreeIdentification = { foliage: readonly string[]; arrangement: readonly string[]; lobes: readonly string[]; bark: readonly string[]; sourceUrl: string };
export const treeIdentification: Readonly<Record<string, TreeIdentification>> = metadata;
export const identificationOptions = {
  foliage: [{ value: "broad", label: "Broad leaves" }, { value: "needles", label: "Needles" }, { value: "scales", label: "Scale-like foliage" }],
  arrangement: [{ value: "alternate", label: "Alternate · staggered along the twig" }, { value: "opposite", label: "Opposite · paired at a node" }, { value: "whorled", label: "Whorled · three or more at a node" }],
  lobes: [{ value: "lobed", label: "Lobed · deep divisions in the outline" }, { value: "unlobed", label: "Unlobed · smooth or toothed edge" }],
  bark: [{ value: "smooth", label: "Smooth mature bark" }, { value: "peeling", label: "Peeling or shaggy bark" }, { value: "patchwork", label: "Patchwork of different colors" }, { value: "corky", label: "Corky ridges or warts" }, { value: "blocks", label: "Distinct blocky plates" }, { value: "furrowed", label: "Ridges and furrows" }],
} as const;
