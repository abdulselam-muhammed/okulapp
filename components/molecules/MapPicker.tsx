"use client";

import dynamic from "next/dynamic";
import { Label, Icon } from "@/components/atoms";

const LeafletMap = dynamic(() => import("@/components/atoms/LeafletMap"), { ssr: false });

interface MapPickerProps {
  label?: string;
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ label = "Location", lat, lng, onChange }: MapPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="map-picker">{label}</Label>
      <p className="text-xs text-on-surface-variant mb-2">Click on the map to select a location</p>

      <div className="rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm">
        <LeafletMap
          markers={[]}
          height="240px"
          zoom={12}
          onClick={(newLat, newLng) => onChange(newLat, newLng)}
          selectedPosition={lat && lng ? { lat, lng } : null}
        />
      </div>

      {lat && lng && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg border border-primary/10 mt-2">
          <Icon name="pin_drop" className="text-primary text-lg" />
          <div className="text-xs">
            <p className="font-bold text-on-surface">Selected Location</p>
            <p className="text-on-surface-variant">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(0, 0)}
            className="ml-auto p-1 hover:bg-error-container/20 rounded-full transition-colors"
          >
            <Icon name="close" className="text-on-surface-variant text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
