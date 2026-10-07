"use client";

import { useState } from "react";

export default function ShareLink({ href, label }: { href: string; label: string }) {
  const [copiedHref, setCopiedHref] = useState("");
  const [manual, setManual] = useState<{ href: string; url: string } | null>(null);
  async function copy() {
    const url = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedHref(href);
      setManual(null);
    } catch {
      setManual({ href, url });
    }
  }
  return <div className="champion-share">
    <button type="button" className="button secondary" onClick={copy}>{label}</button>
    <span role="status" aria-live="polite">{copiedHref === href ? "Link copied." : ""}</span>
    {manual?.href === href && <label>Copy this link<input readOnly value={manual.url} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
