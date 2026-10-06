import { championTrees, townCoordinates, championManifest } from "../../../../lib/champion-tree-data";
import { townKey } from "../../../../lib/champion-trees";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return championManifest.map(s => ({ state: s.state })); }
export async function GET(_request: Request, { params }: { params: Promise<{ state: string }> }) {
 const { state } = await params;
 const trees = championTrees.filter(t => t.state === state);
 const coordinates = Object.fromEntries(trees.flatMap(t => { const key = townKey(t); return townCoordinates[key] ? [[key, townCoordinates[key]]] : []; }));
 return Response.json({ trees, coordinates });
}
