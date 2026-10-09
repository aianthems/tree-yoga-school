import type { MetadataRoute } from "next";
import { discoveryPages, siteOrigin } from "../lib/site-seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return discoveryPages.map(page => ({ url: `${siteOrigin}${page.path}` }));
}
