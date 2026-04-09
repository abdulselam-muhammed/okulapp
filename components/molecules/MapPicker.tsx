"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Label, Icon } from "@/components/atoms";

const LeafletMap = dynamic(() => import("@/components/atoms/LeafletMap"), { ssr: false });

interface MapPickerProps {
  label?: string;
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapPicker({ label = "Location", lat, lng, onChange }: MapPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(value: string) {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function selectResult(result: SearchResult) {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onChange(newLat, newLng);
    setQuery(result.display_name);
    setResults([]);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="map-picker">{label}</Label>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
            <Icon name="search" className="text-lg" />
          </div>
          <input
            className="w-full pl-11 pr-10 py-3 bg-surface-container-low border-none rounded-md font-body text-sm text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Search address or place..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Results Dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant/10 overflow-hidden">
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(r)}
                className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors flex items-start gap-3 border-b border-outline-variant/5 last:border-0"
              >
                <Icon name="location_on" className="text-primary text-lg mt-0.5 shrink-0" />
                <span className="text-xs text-on-surface leading-relaxed line-clamp-2">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-on-surface-variant">Search an address or click on the map to select</p>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm">
        <LeafletMap
          markers={[]}
          height="240px"
          zoom={12}
          onClick={(newLat, newLng) => {
            onChange(newLat, newLng);
            setQuery("");
            setResults([]);
          }}
          selectedPosition={lat && lng ? { lat, lng } : null}
        />
      </div>

      {/* Selected Location */}
      {lat && lng && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg border border-primary/10 mt-2">
          <Icon name="pin_drop" className="text-primary text-lg" />
          <div className="text-xs">
            <p className="font-bold text-on-surface">Selected Location</p>
            <p className="text-on-surface-variant">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(0, 0);
              setQuery("");
            }}
            className="ml-auto p-1 hover:bg-error-container/20 rounded-full transition-colors"
          >
            <Icon name="close" className="text-on-surface-variant text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
