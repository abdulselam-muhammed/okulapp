"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore, useVetsStore } from "@/lib/stores";

interface FeedingPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  status: "active" | "needs_refill" | "inactive";
}

interface Task {
  id: number;
  type: string;
  status: string;
  priority: string;
  notes: string | null;
  assigned_to: number | null;
  report_id: number | null;
  created_at: string;
}

const MAP_CENTER = { lat: 39.925, lng: 32.860 }; // Ankara default

const STATUS_COLORS: Record<string, string> = {
  active: "#44674e",
  needs_refill: "#ac3434",
  inactive: "#888888",
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { bg: "bg-error-container/20", text: "text-error", label: "Urgent" },
  high: { bg: "bg-tertiary-container/30", text: "text-tertiary", label: "High" },
  medium: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Medium" },
  low: { bg: "bg-primary/10", text: "text-primary", label: "Low" },
};

const mapStyles = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c5e7ff" }] },
  { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#e7fff1" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#b7efd3" }] },
];

export default function MapPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const { vets, fetchVets, getAvailability } = useVetsStore();
  const [feedingPoints, setFeedingPoints] = useState<FeedingPoint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<FeedingPoint | null>(null);
  const [selectedVetId, setSelectedVetId] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [fpRes, taskRes] = await Promise.all([
        fetch("/api/feeding-points?limit=100", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/tasks?limit=100", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const fpData = await fpRes.json();
      const taskData = await taskRes.json();

      if (fpData.success) setFeedingPoints(fpData.data);
      if (taskData.success) setTasks(taskData.data);
    } catch {
      addToast("Failed to load map data", "error");
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    fetchData();
    fetchVets();
  }, [fetchData, fetchVets]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
    if (feedingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      feedingPoints.forEach((fp) => bounds.extend({ lat: Number(fp.latitude), lng: Number(fp.longitude) }));
      map.fitBounds(bounds, 80);
    }
  }, [feedingPoints]);

  useEffect(() => {
    if (mapRef && feedingPoints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      feedingPoints.forEach((fp) => bounds.extend({ lat: Number(fp.latitude), lng: Number(fp.longitude) }));
      mapRef.fitBounds(bounds, 80);
    }
  }, [mapRef, feedingPoints]);

  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");

  const stats = {
    activePoints: feedingPoints.filter((fp) => fp.status === "active").length,
    needsRefill: feedingPoints.filter((fp) => fp.status === "needs_refill").length,
    totalTasks: pendingTasks.length,
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-surface-container">
      {/* Google Map */}
      <div className="absolute inset-0">
        {!isLoaded || loading ? (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-on-surface-variant font-body text-sm">Loading map...</p>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={MAP_CENTER}
            zoom={14}
            onLoad={onMapLoad}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {feedingPoints.map((fp) => (
              <MarkerF
                key={fp.id}
                position={{ lat: Number(fp.latitude), lng: Number(fp.longitude) }}
                onClick={() => setSelectedPoint(fp)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: STATUS_COLORS[fp.status] || STATUS_COLORS.active,
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 3,
                }}
              />
            ))}

            {selectedPoint && (
              <InfoWindowF
                position={{ lat: Number(selectedPoint.latitude), lng: Number(selectedPoint.longitude) }}
                onCloseClick={() => setSelectedPoint(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{selectedPoint.name}</h4>
                  {selectedPoint.description && (
                    <p className="text-xs text-gray-600 mb-2">{selectedPoint.description}</p>
                  )}
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${
                      selectedPoint.status === "active"
                        ? "bg-green-600"
                        : selectedPoint.status === "needs_refill"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {selectedPoint.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </InfoWindowF>
            )}

            {/* Vet Markers */}
            {vets
              .filter((v) => v.latitude && v.longitude)
              .map((vet) => {
                const avail = getAvailability(vet.id);
                const isAvailable = avail?.is_available ?? false;
                return (
                  <MarkerF
                    key={`vet-${vet.id}`}
                    position={{ lat: Number(vet.latitude), lng: Number(vet.longitude) }}
                    onClick={() => setSelectedVetId(vet.id)}
                    icon={{
                      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                      fillColor: isAvailable ? "#3a647c" : "#888888",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                      scale: 1.5,
                      anchor: new google.maps.Point(12, 24),
                    }}
                  />
                );
              })}

            {selectedVetId && (() => {
              const vet = vets.find((v) => v.id === selectedVetId);
              if (!vet || !vet.latitude || !vet.longitude) return null;
              const avail = getAvailability(vet.id);
              return (
                <InfoWindowF
                  position={{ lat: Number(vet.latitude), lng: Number(vet.longitude) }}
                  onCloseClick={() => setSelectedVetId(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Dr. {vet.first_name} {vet.last_name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">{vet.email}</p>
                    {vet.phone && <p className="text-xs text-gray-600 mb-2">{vet.phone}</p>}
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${
                        avail?.is_available ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    >
                      {avail?.is_available ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                    {avail?.workload && (
                      <span className="inline-block ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-200 text-gray-700">
                        {avail.workload.toUpperCase()}
                      </span>
                    )}
                  </div>
                </InfoWindowF>
              );
            })()}
          </GoogleMap>
        )}
      </div>

      {/* Map Controls (Bottom Left) */}
      <div className="absolute bottom-8 left-6 z-20 flex flex-col gap-2">
        <button
          onClick={() => mapRef?.setZoom((mapRef.getZoom() || 14) + 1)}
          className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <Icon name="add" className="text-xl" />
        </button>
        <button
          onClick={() => mapRef?.setZoom((mapRef.getZoom() || 14) - 1)}
          className="w-10 h-10 bg-surface-container-lowest rounded-lg shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <Icon name="remove" className="text-xl" />
        </button>
        <button
          onClick={() => {
            if (mapRef && feedingPoints.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              feedingPoints.forEach((fp) => bounds.extend({ lat: Number(fp.latitude), lng: Number(fp.longitude) }));
              mapRef.fitBounds(bounds, 80);
            }
          }}
          className="w-10 h-10 bg-primary text-on-primary rounded-lg shadow-lg flex items-center justify-center hover:bg-primary-dim transition-colors mt-1"
        >
          <Icon name="my_location" className="text-xl" />
        </button>
      </div>

      {/* Legend (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-6 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-on-surface-variant font-medium">Active ({stats.activePoints})</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-error" />
            <span className="text-on-surface-variant font-medium">Needs Refill ({stats.needsRefill})</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-stone-400" />
            <span className="text-on-surface-variant font-medium">Inactive</span>
          </div>
          <div className="w-px h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-on-surface-variant font-medium">Vet ({vets.filter((v) => v.latitude && v.longitude).length})</span>
          </div>
        </div>
      </div>

      {/* Floating Right Panel — Tasks */}
      <div className="absolute top-6 right-6 bottom-8 z-20 w-96">
        <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-container">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-headline font-bold text-on-surface">Active Tasks</h3>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Pending and in-progress tasks</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon name="task_alt" className="text-4xl text-primary/30 mb-3" />
                <p className="text-sm text-on-surface-variant">No pending tasks</p>
              </div>
            ) : (
              pendingTasks.slice(0, 10).map((task) => {
                const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
                return (
                  <div key={task.id} className="bg-surface-container-low rounded-xl p-4 hover:bg-surface-container transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${p.bg} ${p.text} uppercase tracking-wider`}>
                        {p.label}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-on-surface text-sm mb-1 capitalize">
                      {task.type.replace("_", " ")} Task #{task.id}
                    </h4>
                    {task.notes && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{task.notes}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                        task.status === "in_progress" ? "bg-tertiary-container/30 text-tertiary" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {task.status.replace("_", " ")}
                      </span>
                      {task.assigned_to && (
                        <span className="text-[10px] text-on-surface-variant">
                          Assigned to #{task.assigned_to}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Stats Footer */}
          <div className="p-6 border-t border-surface-container">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="location_on" className="text-primary text-base" />
                <span className="text-sm font-bold text-on-surface">Feeding Points</span>
              </div>
              <span className="text-sm font-bold text-primary">{feedingPoints.length}</span>
            </div>
            <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
                style={{ width: feedingPoints.length > 0 ? `${(stats.activePoints / feedingPoints.length) * 100}%` : "0%" }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2">
              {stats.activePoints} of {feedingPoints.length} stations are active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
