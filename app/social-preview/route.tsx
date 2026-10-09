import { ImageResponse } from "next/og";
import { discoveryPages } from "../../lib/site-seo";
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "/";
  const page = discoveryPages.find(page => page.path === path);
  if (!page) return new Response("Page not found", { status: 404 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "68px 80px", background: "#f6f4eb", color: "#19362b" }}>
      <div style={{ display: "flex", fontSize: 30, letterSpacing: 3 }}>TREE YOGA SCHOOL</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: page.title.length > 45 ? 58 : 76, lineHeight: 1.1, marginBottom: 28 }}>{page.title}</div>
        <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: "#496056" }}>{page.description.length > 180 ? `${page.description.slice(0, 177)}…` : page.description}</div>
      </div>
      <div style={{ display: "flex", borderTop: "2px solid #bfc7ba", paddingTop: 24, fontSize: 24 }}>Observation · Meditation · Movement · Walking</div>
    </div>, { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
