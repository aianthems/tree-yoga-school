import type { MetadataRoute } from "next";
import { siteOrigin, isIndexableDeployment } from "../lib/site-seo";
export default function robots(): MetadataRoute.Robots {
  if (!isIndexableDeployment()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/social-preview"] }, sitemap: `${siteOrigin}/sitemap.xml` };
}
