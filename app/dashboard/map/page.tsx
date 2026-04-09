"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { Icon } from "@/components/atoms";
import { AddTaskModal } from "@/components/organisms";
import type { MapMarker } from "@/components/atoms/LeafletMap";
import { useAuthStore, useToastStore, useVetsStore, useTasksStore } from "@/lib/stores";

const LeafletMap = dynamic(() => import("@/components/atoms/LeafletMap"), { ssr: false });

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
  created_at: string;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { bg: "bg-error-container/20", text: "text-error", label: "Urgent" },
  high: { bg: "bg-tertiary-container/30", text: "text-tertiary", label: "High" },
  medium: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Medium" },
  low: { bg: "bg-primary/10", text: "text-primary", label: "Low" },
};

export default function MapPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);
  const { vets, fetchVets, getAvailability } = useVetsStore();
  const { tasks: storeTasks, fetchTasks } = useTasksStore();

  const [feedingPoints, setFeedingPoints] = useState<FeedingPoint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskLat, setTaskLat] = useState<number | null>(null);
  const [taskLng, setTaskLng] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Sync store tasks into local state
  useEffect(() => {
    if (storeTasks.length > 0) setTasks(storeTasks);
  }, [storeTasks]);

  useEffect(() => {
    fetchData();
    fetchVets();
    fetchTasks();
  }, [fetchData, fetchVets, fetchTasks]);

  // Build markers from all data sources
  const markers: MapMarker[] = useMemo(() => {
    const result: MapMarker[] = [];

    // Feeding points
    feedingPoints.forEach((fp) => {
      const statusColor = fp.status === "active" ? "green" : fp.status === "needs_refill" ? "red" : "gray";
      result.push({
        id: `fp-${fp.id}`,
        lat: Number(fp.latitude),
        lng: Number(fp.longitude),
        label: fp.name,
        detail: `${fp.status.replace("_", " ").toUpperCase()}${fp.description ? " — " + fp.description : ""}`,
        color: statusColor,
        type: "circle",
      });
    });

    // Vets with locations
    vets.filter((v) => v.latitude && v.longitude).forEach((vet) => {
      const avail = getAvailability(vet.id);
      const isAvailable = avail?.is_available ?? false;
      result.push({
        id: `vet-${vet.id}`,
        lat: Number(vet.latitude),
        lng: Number(vet.longitude),
        label: `Dr. ${vet.first_name} ${vet.last_name}`,
        detail: `${isAvailable ? "Available" : "Unavailable"}${avail?.workload ? " — Workload: " + avail.workload : ""}${vet.phone ? " — " + vet.phone : ""}`,
        color: isAvailable ? "blue" : "gray",
        type: "pin",
      });
    });

    // Tasks with location in notes
    tasks.forEach((task) => {
      const locMatch = task.notes?.match(/\[Location:\s*([-\d.]+),\s*([-\d.]+)\]/);
      if (!locMatch) return;

      const taskLat = parseFloat(locMatch[1]);
      const taskLng = parseFloat(locMatch[2]);
      if (isNaN(taskLat) || isNaN(taskLng)) return;

      const priorityColor: Record<string, "red" | "orange" | "blue" | "green"> = {
        urgent: "red",
        high: "orange",
        medium: "blue",
        low: "green",
      };

      result.push({
        id: `task-${task.id}`,
        lat: taskLat,
        lng: taskLng,
        label: `${task.type.replace("_", " ")} Task #${task.id}`,
        detail: `Priority: ${task.priority.toUpperCase()} — Status: ${task.status.replace("_", " ")}${task.notes ? "\n" + task.notes.replace(/\s*\[Location:.*\]/, "") : ""}`,
        color: priorityColor[task.priority] || "orange",
        type: "task",
      });
    });

    return result;
  }, [feedingPoints, vets, getAvailability, tasks]);

  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");

  const stats = {
    activePoints: feedingPoints.filter((fp) => fp.status === "active").length,
    needsRefill: feedingPoints.filter((fp) => fp.status === "needs_refill").length,
    vetsOnMap: vets.filter((v) => v.latitude && v.longitude).length,
  };

  function handleMapSearch(value: string) {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) { setSearchResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
          { headers: { "Accept-Language": "en" } }
        );
        setSearchResults(await res.json());
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function flyToResult(result: { lat: string; lon: string; display_name: string }) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, { duration: 1.5 });
    }
    setSearchQuery(result.display_name);
    setSearchResults([]);
  }

  return (
    <>
    <AddTaskModal
      open={showAddTask}
      onClose={() => { setShowAddTask(false); setTaskLat(null); setTaskLng(null); }}
      initialLat={taskLat}
      initialLng={taskLng}
    />

    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-surface-container">
      {/* Map */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-on-surface-variant font-body text-sm">Loading map...</p>
            </div>
          </div>
        ) : (
          <LeafletMap markers={markers} height="100%" onMapReady={(map) => { mapRef.current = map; }} />
        )}
      </div>

      {/* Search Bar (Top Left) */}
      <div className="absolute top-6 left-6 z-[1000] w-80">
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="text-on-surface-variant text-lg" />
            </div>
            <input
              className="w-full pl-11 pr-10 py-3 bg-surface-container-lowest/95 backdrop-blur-md border-none rounded-xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 shadow-lg transition-all"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => handleMapSearch(e.target.value)}
            />
            {searching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => flyToResult(r)}
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors flex items-start gap-3 border-b border-outline-variant/5 last:border-0"
                >
                  <Icon name="location_on" className="text-primary text-lg mt-0.5 shrink-0" />
                  <span className="text-xs text-on-surface leading-relaxed line-clamp-2">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-[#44674e]" />
            <span className="text-on-surface-variant font-medium">Active ({stats.activePoints})</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-[#ac3434]" />
            <span className="text-on-surface-variant font-medium">Needs Refill ({stats.needsRefill})</span>
          </div>
          <div className="w-px h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-[#3a647c]" />
            <span className="text-on-surface-variant font-medium">Vet ({stats.vetsOnMap})</span>
          </div>
          <div className="w-px h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-[#815623]" />
            <span className="text-on-surface-variant font-medium">Task ({tasks.filter((t) => t.notes?.match(/\[Location:/)).length})</span>
          </div>
        </div>
      </div>

      {/* Floating Right Panel — Tasks */}
      <div className="absolute top-6 right-6 bottom-8 z-[1000] w-96">
        <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-container">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-headline font-bold text-on-surface">Active Tasks</h3>
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">Pending and in-progress tasks</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-md"
            >
              <Icon name="add_task" className="text-lg" />
              New Task
            </button>
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
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                style={{ width: feedingPoints.length > 0 ? `${(stats.activePoints / feedingPoints.length) * 100}%` : "0%" }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2">
              {stats.activePoints} of {feedingPoints.length} stations active
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
