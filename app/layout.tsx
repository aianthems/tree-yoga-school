import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tree Yoga School",
  description:
    "Rooted in nature. Practiced in the real world. A living school for yoga, meditation, and learning with trees.",
  openGraph: {
    title: "Tree Yoga School",
    description:
      "Nature is the teacher. Technology is the tool. Practice is the point.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
