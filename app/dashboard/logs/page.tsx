"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { useAuthStore, useToastStore } from "@/lib/stores";

interface Task {
  id: number;
  report_id: number | null;
  assigned_by: number | null;
  assigned_to: number | null;
  type: string;
  status: string;
  priority: string;
  notes: string | null;
  rejection_reason: string | null;
  deadline: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const TYPE_STYLES: Record<string, { bg: string; icon: string }> = {
  rescue: {
    bg: "bg-error-container/60 text-on-error-container",
    icon: "emergency",
  },
  feeding: {
    bg: "bg-primary-container text-on-primary-container",
    icon: "restaurant",
  },
  vet_transport: {
    bg: "bg-tertiary-container text-on-tertiary-container",
    icon: "local_shipping",
  },
  other: {
    bg: "bg-surface-container-high text-on-surface-variant",
    icon: "task",
  },
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-surface-container-high text-on-surface-variant",
  accepted: "bg-secondary-container text-on-secondary-container",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-primary-container text-on-primary-container",
  rejected: "bg-error-container text-on-error-container",
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-error-container text-on-error-container",
  high: "bg-secondary-fixed text-on-secondary-fixed",
  medium: "bg-secondary-container text-on-secondary-container",
  low: "bg-surface-container-high text-on-surface-variant",
};

function formatType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LogsPage() {
  const token = useAuthStore((s) => s.token);
  const addToast = useToastStore((s) => s.addToast);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!token) return;

    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Failed to load tasks");
        }

        const data = await res.json();
        setTasks(data.data ?? []);
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : "Failed to load activity logs",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token, addToast]);

  const filteredTasks = tasks.filter((t) => {
    if (typeFilter && t.type !== typeFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

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
            Monitor task assignments, track volunteer activities, and review
            operational progress across the system.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
            <Icon name="refresh" className="text-lg" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="rescue">Rescue</option>
          <option value="feeding">Feeding</option>
          <option value="vet_transport">Vet Transport</option>
          <option value="other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="ml-auto flex items-center gap-2 text-sm text-on-surface-variant">
          <Icon name="filter_list" className="text-lg" />
          <span>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Task Type
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Assigned To
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Priority
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Notes
                  </th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-16 text-center text-on-surface-variant"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, i) => {
                    const typeStyle = TYPE_STYLES[task.type] || TYPE_STYLES.other;
                    return (
                      <tr
                        key={task.id}
                        className={`hover:bg-surface-bright transition-colors group ${
                          i % 2 === 1 ? "bg-surface-container-low/10" : ""
                        }`}
                      >
                        {/* Task Type Badge */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeStyle.bg}`}
                            >
                              <Icon
                                name={typeStyle.icon}
                                className="text-base"
                              />
                            </div>
                            <span className="font-bold text-on-surface text-sm">
                              {formatType(task.type)}
                            </span>
                          </div>
                        </td>

                        {/* Assigned To */}
                        <td className="px-8 py-5">
                          {task.assigned_to ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
                                #{task.assigned_to}
                              </div>
                              <span className="text-sm text-on-surface-variant">
                                User {task.assigned_to}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-on-surface-variant italic">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Priority Badge */}
                        <td className="px-8 py-5">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                              PRIORITY_STYLES[task.priority] ||
                              PRIORITY_STYLES.medium
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                              STATUS_STYLES[task.status] ||
                              STATUS_STYLES.pending
                            }`}
                          >
                            {task.status === "in_progress" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                            {task.status === "completed" && (
                              <Icon name="check" className="text-xs" />
                            )}
                            {formatStatus(task.status)}
                          </span>
                        </td>

                        {/* Notes */}
                        <td className="px-8 py-5 text-sm text-on-surface-variant max-w-[180px] truncate">
                          {task.notes || "--"}
                        </td>

                        {/* Created Date */}
                        <td className="px-8 py-5 text-sm text-on-surface-variant">
                          {new Date(task.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Insights Summary */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Icon name="insights" className="text-primary text-2xl" />
          <h3 className="text-2xl font-bold text-on-surface font-headline">
            System Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="check_circle" className="text-primary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">94.2%</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Completion Rate
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Tasks successfully completed within assigned deadlines
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="schedule" className="text-secondary text-2xl" />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">18m</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Avg Response Time
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Average time from task creation to volunteer acceptance
            </p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)] text-center">
            <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center mx-auto mb-4">
              <Icon
                name="group"
                className="text-on-tertiary-container text-2xl"
              />
            </div>
            <p className="text-3xl font-bold text-on-surface mb-1">42</p>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              Active Volunteers
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Volunteers who completed at least one task this month
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex justify-center py-10">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full mb-4">
            <Icon name="info" className="text-secondary text-sm" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
              Audit Trail
            </span>
          </div>
          <p className="text-sm text-on-surface-variant italic font-body">
            All task status changes and assignments are permanently logged for
            accountability and compliance review.
          </p>
        </div>
      </div>
    </section>
  );
}
