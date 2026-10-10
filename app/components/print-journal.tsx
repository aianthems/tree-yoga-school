"use client";
export default function PrintJournal() {
  return <button type="button" className="button primary" onClick={() => window.print()}>Print journal / save as PDF</button>;
}
