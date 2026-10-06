"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { townCoordinates } from "../../lib/champion-trees";

export type TownGroup = { key: string; town: string; state: "MA" | "NH"; count: number };
type Engine = { L: typeof Leaflet; map: Leaflet.Map; markers: Leaflet.LayerGroup };

export default function ChampionMap({ groups, selectedTown, onTown, resetKey }: {
  groups: TownGroup[]; selectedTown: string | null; onTown: (town: string) => void; resetKey: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [failed, setFailed] = useState(false);
  const [tileError, setTileError] = useState(false);
  useEffect(() => {
    let disposed = false;
    let map: Leaflet.Map | undefined;
    let observer: ResizeObserver | undefined;
    import("leaflet").then((L) => {
      if (disposed || !container.current) return;
      map = L.map(container.current, { scrollWheelZoom: false, minZoom: 6, maxZoom: 14 });
      map.fitBounds([[41.2, -73.55], [45.1, -69.85]]);
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
      }).addTo(map);
      tiles.on("tileerror", () => { if (!disposed) setTileError(true); });
      tiles.on("tileload", () => { if (!disposed) setTileError(false); });
      L.control.scale({ imperial: true, metric: false }).addTo(map);
      const markers = L.layerGroup().addTo(map);
      observer = new ResizeObserver(() => map?.invalidateSize());
      observer.observe(container.current);
      setEngine({ L, map, markers });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; observer?.disconnect(); map?.remove(); };
  }, []);

  useEffect(() => {
    if (!engine) return;
    const { L, map, markers } = engine;
    markers.clearLayers();
    const points: Leaflet.LatLngTuple[] = [];
    groups.forEach(({ key, town, state, count }) => {
      const coordinate = townCoordinates[key];
      if (!coordinate) return;
      const point: Leaflet.LatLngTuple = [coordinate.lat, coordinate.lng];
      points.push(point);
      const marker = L.marker(point, {
        icon: L.divIcon({ className: "champion-marker", html: `<span>${count}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] }),
        title: `${town}, ${state}: ${count} ${count === 1 ? "tree" : "trees"}. Approximate municipality point.`,
        alt: `${town}, ${state}: show ${count} ${count === 1 ? "tree" : "trees"}`,
        keyboard: true,
      }).addTo(markers);
      const label = document.createElement("span");
      label.textContent = `${town}, ${state} · ${count} ${count === 1 ? "tree" : "trees"} · municipality point`;
      marker.bindTooltip(label, { direction: "top" });
      marker.on("click", () => onTown(key));
      const element = marker.getElement();
      element?.setAttribute("aria-label", `${town}, ${state}: show ${count} ${count === 1 ? "tree" : "trees"}. Approximate municipality point.`);
      element?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onTown(key);
        }
      });
    });
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [35, 35], maxZoom: 10, animate: false });
  }, [engine, groups, onTown, resetKey]);

  useEffect(() => {
    if (!engine || !selectedTown) return;
    const point = townCoordinates[selectedTown];
    if (point) engine.map.setView([point.lat, point.lng], Math.max(engine.map.getZoom(), 10), { animate: false });
  }, [engine, selectedTown]);

  return <div className="champion-map-wrap">
    <div ref={container} className="champion-map" role="region" aria-label="Interactive map of champion tree towns. Markers show approximate municipality points. Use the result list to browse every tree." />
    {!engine && <p className="champion-map-status" role="status">{failed ? "The map could not load. All tree records are available in the list." : "Opening the champion tree map…"}</p>}
    {tileError && <p className="champion-tile-error" role="status">Some map tiles could not load. Town markers and the complete list remain available.</p>}
  </div>;
}
