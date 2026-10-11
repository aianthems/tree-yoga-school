import type { Metadata } from "next";
import { siteOrigin, siteDescription, pageMetadata } from "../lib/site-seo";
import "./globals.css";
import SiteFooter from "./components/site-footer";
import FallingLeaves from "./components/falling-leaves";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  ...pageMetadata("/", "Tree Yoga School", siteDescription),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<SiteFooter /><FallingLeaves /></body></html>;
}
