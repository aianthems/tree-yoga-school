import type { Metadata } from "next";
import { siteOrigin, siteDescription, pageMetadata } from "../lib/site-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  ...pageMetadata("/", "Tree Yoga School", siteDescription),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
