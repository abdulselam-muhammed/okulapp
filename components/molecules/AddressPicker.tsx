"use client";

import { useRef, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Label, Icon } from "@/components/atoms";

const LIBRARIES: ("places")[] = ["places"];

interface AddressPickerProps {
  label?: string;
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
}

export default function AddressPicker({
  label = "Address",
  value,
  onChange,
}: AddressPickerProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name || "";
      setInputValue(address);
      onChange(address, lat, lng);
    }
  }

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        <Label htmlFor="address">{label}</Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50">
            <Icon name="location_on" className="text-lg" />
          </div>
          <input
            className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Loading maps..."
            disabled
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="address">{label}</Label>
      <Autocomplete
        onLoad={(ac) => (autocompleteRef.current = ac)}
        onPlaceChanged={handlePlaceChanged}
        options={{ types: ["address"] }}
      >
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
            <Icon name="location_on" className="text-lg" />
          </div>
          <input
            className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Search for an address..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </Autocomplete>
    </div>
  );
}
