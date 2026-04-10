"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";
import { useAbility } from "@/lib/hooks/useAbility";

interface ActivityLogItem {
  id: number;
  user_id: number | null;
  action: "create" | "update" | "delete" | "approve" | "status_change";
  entity_type: string;
  entity_id: number | null;
  description: string;
  metadata: unknown;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  create: { bg: "bg-primary/10", text: "text-primary", icon: "add_circle" },
  update: { bg: "bg-secondary-container", text: "text-on-secondary-container", icon: "edit" },
  delete: { bg: "bg-error-container/20", text: "text-error", icon: "delete" },
  approve: { bg: "bg-primary-container", text: "text-on-primary-container", icon: "check_circle" },
  status_change: { bg: "bg-tertiary-container/30", text: "text-tertiary", icon: "swap_horiz" },
};

const ENTITY_ICONS: Record<string, string> = {
  task: "task_alt",
  user: "person",
  donation: "volunteer_activism",
  purchase: "payments",
  vet_case: "medical_services",
  vet_availability: "schedule",
  report: "report",
  feeding_point: "location_on",
  refill: "water_drop",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActivityLogsPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);
  const ability = useAbility();
  const canRead = ability.can("read", "ActivityLog");

  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = useCallback(async () => {
    if (!token || !canRead) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/activity-logs?limit=200", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLogs(data.data);
      else addToast(data.error?.message || "Failed to load activity logs", "error");
    } catch {
      addToast("Unable to connect to server", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, addToast, canRead]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchLogs();
  }

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter && log.action !== actionFilter) return false;
      if (entityFilter && log.entity_type !== entityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const userName = `${log.first_name || ""} ${log.last_name || ""}`.toLowerCase();
        return (
          log.description.toLowerCase().includes(q) ||
          userName.includes(q) ||
          log.entity_type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, actionFilter, entityFilter, search]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = logs.filter((l) => new Date(l.created_at) >= today).length;
    const createCount = logs.filter((l) => l.action === "create").length;
    const updateCount = logs.filter((l) => l.action === "update" || l.action === "status_change").length;
    const deleteCount = logs.filter((l) => l.action === "delete").length;
    return { total: logs.length, todayCount, createCount, updateCount, deleteCount };
  }, [logs]);

  const entityTypes = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.entity_type))).sort();
  }, [logs]);

  return (
    <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
            System Monitoring
          </span>
          <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
            Activity Logs
          </h2>
          <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
            Complete audit trail of every create, update, and delete action across the system.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-5 py-3 bg-surface-container-lowest text-on-surface rounded-full font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm disabled:opacity-60"
        >
          <Icon name="refresh" className={`text-lg ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total</p>
          <span className="text-2xl font-bold text-on-surface">{stats.total}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Today</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{stats.todayCount}</span>
            {stats.todayCount > 0 && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Created</p>
          <span className="text-2xl font-bold text-primary">{stats.createCount}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Updated</p>
          <span className="text-2xl font-bold text-tertiary">{stats.updateCount}</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
          <p className="text-xs font-bold text-error uppercase tracking-wider mb-1">Deleted</p>
          <span className="text-2xl font-bold text-error">{stats.deleteCount}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 shadow-sm"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-3 bg-surface-container-lowest rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
        >
          <option value="">All Actions</option>
          <option value="create">Created</option>
          <option value="update">Updated</option>
          <option value="delete">Deleted</option>
          <option value="approve">Approved</option>
          <option value="status_change">Status Changed</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-4 py-3 bg-surface-container-lowest rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
        >
          <option value="">All Types</option>
          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-surface-container-lowest rounded-lg shadow-[0_30px_60px_rgba(0,58,40,0.05)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Icon name="history" className="text-5xl text-on-surface-variant/30 mb-3 inline-block" />
            <p className="text-on-surface-variant">No activity logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/5">
            {filtered.map((log) => {
              const actionStyle = ACTION_STYLES[log.action] || ACTION_STYLES.update;
              const entityIcon = ENTITY_ICONS[log.entity_type] || "description";
              const userName = log.first_name && log.last_name
                ? `${log.first_name} ${log.last_name}`
                : "System";
              const initials = log.first_name && log.last_name
                ? `${log.first_name.charAt(0)}${log.last_name.charAt(0)}`.toUpperCase()
                : "SY";

              return (
                <div
                  key={log.id}
                  className="px-6 py-5 hover:bg-surface-container-low/30 transition-colors flex items-start gap-4"
                >
                  {/* Action icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${actionStyle.bg}`}>
                    <Icon name={actionStyle.icon} className={`${actionStyle.text} text-lg`} filled />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${actionStyle.bg} ${actionStyle.text}`}>
                          {log.action.replace("_", " ")}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-surface-container text-on-surface-variant uppercase">
                          <Icon name={entityIcon} className="text-xs" />
                          {log.entity_type.replace("_", " ")}
                        </span>
                        {log.entity_id && (
                          <span className="text-[10px] text-on-surface-variant font-mono">#{log.entity_id}</span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant whitespace-nowrap" title={formatDate(log.created_at)}>
                        {timeAgo(log.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-on-surface font-medium leading-relaxed mb-2">{log.description}</p>

                    {/* Actor */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-primary text-[10px] font-bold">
                        {initials}
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        by <span className="font-bold text-on-surface">{userName}</span>
                        {log.role && <span className="capitalize"> ({log.role})</span>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="p-6 flex items-center justify-between border-t border-stone-50 bg-stone-50/30">
            <p className="text-xs text-on-surface-variant font-medium italic">
              Showing {filtered.length} of {logs.length} activity logs
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
