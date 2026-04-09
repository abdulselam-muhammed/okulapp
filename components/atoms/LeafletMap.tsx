"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  detail?: string;
  color: "green" | "red" | "blue" | "orange" | "gray";
  type?: "circle" | "pin" | "task";
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onClick?: (lat: number, lng: number) => void;
  selectedPosition?: { lat: number; lng: number } | null;
  onMapReady?: (map: L.Map) => void;
}

const COLORS: Record<string, string> = {
  green: "#44674e",
  red: "#ac3434",
  blue: "#3a647c",
  orange: "#815623",
  gray: "#888888",
};

function createIcon(color: string, type: "circle" | "pin" | "task" = "circle") {
  if (type === "pin") {
    return L.divIcon({
      className: "",
      html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="white" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  if (type === "task") {
    return L.divIcon({
      className: "",
      html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="${color}" stroke="white" stroke-width="1.2">
          <path d="M14.4 6l-.24-1.2c-.09-.46-.5-.8-.98-.8H6.82c-.48 0-.89.34-.98.8L5.6 6H14.4zM5 7l.84 9.26c.08.87.81 1.54 1.69 1.54h4.94c.88 0 1.61-.67 1.69-1.54L15 7H5zm6.5-5h-3c-.28 0-.5.22-.5.5s.22.5.5.5h3c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z"/>
          <path d="M20 7h-4l-1-1h-2l2 2h5v2h-1l-1 10H7L6 10H5V8h5L8 6H6L5 7H1v2h3l1 10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2l1-10h3V7z" fill="none"/>
          <circle cx="10" cy="12" r="5" fill="${color}" stroke="white" stroke-width="2"/>
          <path d="M8.5 12l1 1 2.5-2.5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  }

  return L.divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

export default function LeafletMap({
  markers,
  center = [39.925, 32.860],
  zoom = 14,
  height = "100%",
  onClick,
  selectedPosition,
  onMapReady,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    if (onMapReady) onMapReady(map);

    if (onClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onClick(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    markers.forEach((m) => {
      const icon = createIcon(COLORS[m.color] || COLORS.green, m.type);
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(layer);

      let popup = `<div style="font-family:sans-serif;min-width:160px;">
        <strong style="font-size:13px;">${m.label}</strong>`;
      if (m.detail) popup += `<br/><span style="font-size:11px;color:#666;">${m.detail}</span>`;
      popup += `</div>`;

      marker.bindPopup(popup);
    });

    // Fit bounds if markers exist
    if (markers.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers]);

  // Update selected position marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedMarkerRef.current) {
      map.removeLayer(selectedMarkerRef.current);
      selectedMarkerRef.current = null;
    }

    if (selectedPosition) {
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;background:#ac3434;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(172,52,52,0.3),0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      selectedMarkerRef.current = L.marker(
        [selectedPosition.lat, selectedPosition.lng],
        { icon }
      ).addTo(map);
      map.setView([selectedPosition.lat, selectedPosition.lng], Math.max(map.getZoom(), 15));
    }
  }, [selectedPosition]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%", borderRadius: "0.75rem", overflow: "hidden" }}
    />
  );
}
