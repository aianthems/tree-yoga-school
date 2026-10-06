"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { type ChampionState } from "../../lib/champion-trees";

export type TownGroup = { key: string; town: string; state: ChampionState; count: number; precision: string };
type Engine = { L: typeof Leaflet; map: Leaflet.Map; markers: Leaflet.LayerGroup };

export default function ChampionMap({ groups, selectedTown, onTown, resetKey, coordinates: townCoordinates }: {
  coordinates: Record<string, { lat: number; lng: number }>; groups: TownGroup[]; selectedTown: string | null; onTown: (town: string) => void; resetKey: number;
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
      map = L.map(container.current, { scrollWheelZoom: false, minZoom: 4, maxZoom: 14 });
      map.fitBounds([[41.2, -73.55], [47.4, -66.9]]);
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
    const located = groups.flatMap(group => {
      const coordinate = townCoordinates[group.key];
      return coordinate ? [{ ...group, point: [coordinate.lat, coordinate.lng] as Leaflet.LatLngTuple }] : [];
    });
    const redraw = () => {
      markers.clearLayers();
      // Keep marker centers at least 44 pixels apart. Cluster anchors remain at
      // a source municipality point; each cluster retains all its town groups.
      const clusters: { anchor: Leaflet.Point; towns: typeof located }[] = [];
      located.forEach(group => {
        const pixel = map.latLngToLayerPoint(group.point);
        const cluster = clusters.find(c => c.anchor.distanceTo(pixel) < 44);
        if (cluster) cluster.towns.push(group);
        else clusters.push({ anchor: pixel, towns: [group] });
      });
      clusters.forEach(({ towns }) => {
        const first = towns[0];
        const count = towns.reduce((total, town) => total + town.count, 0);
        const combined = towns.length > 1;
        const name = combined
          ? `Zoom to ${towns.length} places with ${count} tree records. Approximate municipality or county points.`
          : `${first.town}, ${first.state}: show ${count} ${count === 1 ? "tree" : "trees"}. Approximate ${first.precision} point.`;
        const activate = () => {
          if (combined) map.fitBounds(L.latLngBounds(towns.map(t => t.point)), { padding: [50, 50], maxZoom: Math.min(map.getZoom() + 2, 14), animate: false });
          else onTown(first.key);
        };
        const marker = L.marker(first.point, {
          icon: L.divIcon({ className: `champion-marker${combined ? " champion-cluster" : ""}`, html: `<span>${count}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] }),
          title: name, alt: name, keyboard: true,
        }).addTo(markers);
        const label = document.createElement("span");
        label.textContent = combined
          ? `${count} records · ${towns.length} places · select to zoom in`
          : `${first.town}, ${first.state} · ${count} ${count === 1 ? "tree" : "trees"} · ${first.precision} point`;
        marker.bindTooltip(label, { direction: "top" });
        marker.on("click", activate);
        const element = marker.getElement();
        element?.setAttribute("aria-label", name);
        element?.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); event.stopPropagation(); activate();
          }
        });
      });
    };
    if (located.length) map.fitBounds(L.latLngBounds(located.map(t => t.point)), { padding: [35, 35], maxZoom: 10, animate: false });
    redraw();
    map.on("zoomend", redraw);
    return () => { map.off("zoomend", redraw); };

  }, [engine, groups, onTown, resetKey, townCoordinates]);

  useEffect(() => {
    if (!engine || !selectedTown) return;
    const point = townCoordinates[selectedTown];
    if (point) engine.map.setView([point.lat, point.lng], selectedTown.includes(":county:") ? 7 : Math.max(engine.map.getZoom(), 10), { animate: false });
  }, [engine, selectedTown, townCoordinates]);

  return <div className="champion-map-wrap">
    <div ref={container} className="champion-map" role="region" aria-label="Interactive map of champion tree places. Markers show approximate municipality or county points, with precision stated in each label. Use the result list to browse every tree." />
    {!engine && <p className="champion-map-status" role="status">{failed ? "The map could not load. All tree records are available in the list." : "Opening the champion tree map…"}</p>}
    {tileError && <p className="champion-tile-error" role="status">Some map tiles could not load. Place markers and the complete list remain available.</p>}
  </div>;
}
