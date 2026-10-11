"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const leaves = [
  { side: "left", delay: "3s", duration: "19s", color: "#b88742", size: "19px" },
  { side: "right", delay: "14s", duration: "22s", color: "#7e8a59", size: "16px" },
  { side: "left", delay: "29s", duration: "21s", color: "#927252", size: "15px" },
  { side: "right", delay: "44s", duration: "18s", color: "#b59a58", size: "21px" },
];

export default function FallingLeaves() {
  const pathname = usePathname();
  const quietPage = pathname.startsWith("/champion-trees") || pathname.startsWith("/practice") || pathname === "/return-to-your-tree/journal";
  if (quietPage) return null;

  return <div key={pathname} className="falling-leaves" aria-hidden="true">
    {leaves.map((leaf, index) => <span key={index} className={`falling-leaf falling-leaf-${leaf.side}`} style={{ "--leaf-delay": leaf.delay, "--leaf-duration": leaf.duration, "--leaf-color": leaf.color, "--leaf-size": leaf.size } as CSSProperties}>
      <svg viewBox="0 0 32 44" fill="none" focusable="false"><path d="M16 2C3 10 1 24 9 33c4 5 12 5 16-1C33 20 26 7 16 2Z" fill="currentColor" /><path d="M16 9v32m0-16-7-7m7 1 7-7m-7 18 6-5" stroke="#fbf5e7" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round" /></svg>
    </span>)}
  </div>;
}
