"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Icon } from "@/components/atoms";
import type { MapMarker } from "@/components/atoms/LeafletMap";
import { useAuthStore, useToastStore, useTasksStore, useVetsStore, useUsersStore } from "@/lib/stores";

const LeafletMap = dynamic(() => import("@/components/atoms/LeafletMap"), { ssr: false });

interface FeedingPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: "active" | "needs_refill" | "inactive";
}

interface Donation {
  id: number;
  donor_id: number;
  amount: number;
  created_at: string;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);
  const { tasks, fetchTasks } = useTasksStore();
  const { vets, fetchVets, getAvailability } = useVetsStore();
  const { users, fetchUsers } = useUsersStore();

  const [feedingPoints, setFeedingPoints] = useState<FeedingPoint[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchAll() {
      try {
        const [fpRes, donRes, balRes] = await Promise.all([
          fetch("/api/feeding-points?limit=100", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/donations?limit=10", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/donations/balance", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const fpData = await fpRes.json();
        const donData = await donRes.json();
        const balData = await balRes.json();

        if (fpData.success) setFeedingPoints(fpData.data);
        if (donData.success) setDonations(donData.data);
        if (balData.success) setBalance(balData.data.balance);
      } catch {
        addToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    fetchTasks();
    fetchVets();
    fetchUsers();
  }, [token, addToast, fetchTasks, fetchVets, fetchUsers]);

  // Stats
  const volunteerCount = users.filter((u) => u.role === "volunteer").length;
  const activeStations = feedingPoints.filter((fp) => fp.status === "active").length;
  const needsRefill = feedingPoints.filter((fp) => fp.status === "needs_refill").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  // Map markers
  const markers: MapMarker[] = useMemo(() => {
    const result: MapMarker[] = [];

    feedingPoints.forEach((fp) => {
      result.push({
        id: `fp-${fp.id}`,
        lat: Number(fp.latitude),
        lng: Number(fp.longitude),
        label: fp.name,
        detail: fp.status.replace("_", " ").toUpperCase(),
        color: fp.status === "active" ? "green" : fp.status === "needs_refill" ? "red" : "gray",
        type: "circle",
      });
    });

    vets.filter((v) => v.latitude && v.longitude).forEach((vet) => {
      const avail = getAvailability(vet.id);
      result.push({
        id: `vet-${vet.id}`,
        lat: Number(vet.latitude),
        lng: Number(vet.longitude),
        label: `Dr. ${vet.first_name} ${vet.last_name}`,
        detail: avail?.is_available ? "Available" : "Unavailable",
        color: avail?.is_available ? "blue" : "gray",
        type: "pin",
      });
    });

    tasks.forEach((task) => {
      const locMatch = task.notes?.match(/\[Location:\s*([-\d.]+),\s*([-\d.]+)\]/);
      if (!locMatch) return;
      const lat = parseFloat(locMatch[1]);
      const lng = parseFloat(locMatch[2]);
      if (isNaN(lat) || isNaN(lng)) return;
      const colors: Record<string, "red" | "orange" | "blue" | "green"> = { urgent: "red", high: "orange", medium: "blue", low: "green" };
      result.push({
        id: `task-${task.id}`,
        lat, lng,
        label: `${task.type.replace("_", " ")} Task #${task.id}`,
        detail: `${task.priority.toUpperCase()} — ${task.status.replace("_", " ")}`,
        color: colors[task.priority] || "orange",
        type: "task",
      });
    });

    return result;
  }, [feedingPoints, vets, tasks, getAvailability]);

  // Recent activity from tasks (latest 5)
  const recentTasks = [...tasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const taskIcons: Record<string, string> = { rescue: "pets", feeding: "restaurant", vet_transport: "local_shipping", other: "task_alt" };
  const statusStyles: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-tertiary-container/30", text: "text-tertiary" },
    accepted: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
    in_progress: { bg: "bg-primary/10", text: "text-primary" },
    completed: { bg: "bg-primary/10", text: "text-primary" },
    rejected: { bg: "bg-error-container/20", text: "text-error" },
    cancelled: { bg: "bg-stone-100", text: "text-stone-400" },
  };

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 px-10 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <span className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mb-2 block">System Overview</span>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
          Welcome back, {user?.first_name || "Curator"}
        </h2>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Real-time overview of all campus care operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container text-primary rounded-2xl"><Icon name="location_on" /></div>
            {needsRefill > 0 && <span className="text-xs font-bold text-error bg-error-container/20 px-2 py-1 rounded-full">{needsRefill} low</span>}
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Feeding Stations</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">{feedingPoints.length}</p>
          <p className="text-xs text-on-surface-variant mt-1">{activeStations} active</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container text-secondary rounded-2xl"><Icon name="groups" /></div>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{users.length} total</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Volunteers</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">{volunteerCount}</p>
          <p className="text-xs text-on-surface-variant mt-1">{vets.length} vets registered</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-2xl"><Icon name="task_alt" /></div>
            {pendingTasks.length > 0 && <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">{pendingTasks.length} pending</span>}
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Tasks</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">{tasks.length}</p>
          <p className="text-xs text-on-surface-variant mt-1">{completedTasks.length} completed</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm shadow-emerald-900/5 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-variant text-on-surface-variant rounded-2xl"><Icon name="payments" /></div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Balance</span>
          </div>
          <h3 className="text-on-surface-variant text-sm font-label uppercase tracking-wider">Donations</h3>
          <p className="text-4xl font-headline font-bold text-on-surface mt-1">${balance.toFixed(0)}</p>
          <p className="text-xs text-on-surface-variant mt-1">${totalDonations.toFixed(0)} total received</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-headline font-bold text-on-surface">Recent Tasks</h3>
            <Link href="/dashboard/logs" className="text-sm font-bold text-primary hover:underline">View all</Link>
          </div>
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-center text-on-surface-variant py-8">No tasks yet</p>
            ) : (
              recentTasks.map((task) => {
                const st = statusStyles[task.status] || statusStyles.pending;
                return (
                  <div key={task.id} className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:translate-x-1 transition-transform">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                        <Icon name={taskIcons[task.type] || "task_alt"} />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface capitalize">{task.type.replace("_", " ")} Task #{task.id}</h4>
                        <p className="text-sm text-on-surface-variant">
                          {task.notes?.replace(/\s*\[Location:.*\]/, "").slice(0, 60) || `Priority: ${task.priority}`}
                          {" — "}
                          {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize ${st.bg} ${st.text}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Live Map */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-headline font-bold text-on-surface">Live Map</h3>
              <Link href="/dashboard/map" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Full Map <Icon name="open_in_new" className="text-sm" />
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-64">
              <LeafletMap markers={markers} height="100%" zoom={13} />
            </div>
            <div className="mt-3 flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#44674e]" />
                <span className="text-on-surface-variant">Stations ({activeStations})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ac3434]" />
                <span className="text-on-surface-variant">Refill ({needsRefill})</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3a647c]" />
                <span className="text-on-surface-variant">Vets ({vets.filter((v) => v.latitude && v.longitude).length})</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-secondary-container/30 p-8 rounded-lg">
            <h4 className="text-secondary font-bold mb-4">Quick Stats</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-dim font-bold">STATION HEALTH</span>
                  <span className="text-secondary-dim">{feedingPoints.length > 0 ? Math.round((activeStations / feedingPoints.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-secondary-fixed-dim rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: feedingPoints.length > 0 ? `${(activeStations / feedingPoints.length) * 100}%` : "0%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-dim font-bold">TASK COMPLETION</span>
                  <span className="text-secondary-dim">{tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-secondary-fixed-dim rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: tasks.length > 0 ? `${(completedTasks.length / tasks.length) * 100}%` : "0%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-secondary-dim font-bold">VET AVAILABILITY</span>
                  <span className="text-secondary-dim">
                    {vets.length > 0 ? Math.round((vets.filter((v) => getAvailability(v.id)?.is_available).length / vets.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 bg-secondary-fixed-dim rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full transition-all" style={{ width: vets.length > 0 ? `${(vets.filter((v) => getAvailability(v.id)?.is_available).length / vets.length) * 100}%` : "0%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
