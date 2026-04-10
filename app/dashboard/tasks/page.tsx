"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms";
import { AddTaskModal } from "@/components/organisms";
import { useTasksStore } from "@/lib/stores";
import { useAbility } from "@/lib/hooks/useAbility";

const TYPE_ICONS: Record<string, string> = {
  rescue: "pets",
  feeding: "restaurant",
  vet_transport: "local_shipping",
  other: "task_alt",
};

const TYPE_STYLES: Record<string, string> = {
  rescue: "bg-error-container/20 text-error",
  feeding: "bg-primary-container text-on-primary-container",
  vet_transport: "bg-secondary-container text-on-secondary-container",
  other: "bg-surface-container-high text-on-surface-variant",
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-error-container/20 text-error",
  high: "bg-tertiary-container/30 text-tertiary",
  medium: "bg-secondary-container text-on-secondary-container",
  low: "bg-primary/10 text-primary",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-tertiary-container/30 text-tertiary",
  accepted: "bg-secondary-container text-on-secondary-container",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-primary/10 text-primary",
  rejected: "bg-error-container/20 text-error",
  cancelled: "bg-stone-100 text-stone-400",
};

export default function TasksPage() {
  const ability = useAbility();
  const canCreateTask = ability.can("create", "Task");
  const { tasks, loading, fetchTasks, updateTaskStatus } = useTasksStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filtered = tasks.filter((t) => {
    if (typeFilter && t.type !== typeFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.type.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q) ||
        String(t.id).includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "accepted").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <>
      <AddTaskModal open={showAddModal} onClose={() => setShowAddModal(false)} />

      <section className="pt-24 px-10 pb-20 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Operations</span>
            <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">Task Management</h2>
            <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
              Create, assign, and track tasks across the campus care network.
            </p>
          </div>
          {canCreateTask && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              <Icon name="add_task" className="text-lg" />
              New Task
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Tasks</p>
            <span className="text-3xl font-bold text-on-surface">{stats.total}</span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Pending</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{stats.pending}</span>
              {stats.pending > 0 && <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />}
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">In Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{stats.inProgress}</span>
              {stats.inProgress > 0 && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,58,40,0.03)]">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Completed</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{stats.completed}</span>
              <Icon name="check_circle" className="text-primary text-sm" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-surface-container-lowest rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
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
            className="px-4 py-3 bg-surface-container-lowest rounded-full font-bold text-sm border-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,58,40,0.05)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container text-on-surface-variant">
                    <tr>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Task</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Type</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-center">Priority</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Assigned To</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest">Date</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-on-surface-variant">No tasks found.</td>
                      </tr>
                    ) : (
                      filtered.map((task, i) => (
                        <tr key={task.id} className={`hover:bg-surface-bright transition-colors group ${i % 2 === 1 ? "bg-surface-container-low/10" : ""}`}>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
                                <Icon name={TYPE_ICONS[task.type] || "task_alt"} />
                              </div>
                              <div>
                                <p className="font-bold text-on-surface capitalize">{task.type.replace("_", " ")} #{task.id}</p>
                                <p className="text-xs text-on-surface-variant line-clamp-1 max-w-[200px]">
                                  {task.notes?.replace(/\s*\[Location:.*\]/, "") || "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${TYPE_STYLES[task.type] || TYPE_STYLES.other}`}>
                              {task.type.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full capitalize ${STATUS_STYLES[task.status] || STATUS_STYLES.pending}`}>
                              {task.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant">
                            #{task.assigned_to || "—"}
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant">
                            {new Date(task.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {task.status === "pending" && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, "cancelled")}
                                  className="p-2 hover:bg-error-container/20 rounded-full transition-all"
                                  title="Cancel task"
                                >
                                  <Icon name="cancel" className="text-stone-400 group-hover:text-error text-lg" />
                                </button>
                              )}
                              {(task.status === "accepted" || task.status === "in_progress") && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, "completed")}
                                  className="p-2 hover:bg-primary/10 rounded-full transition-all"
                                  title="Mark complete"
                                >
                                  <Icon name="check_circle" className="text-stone-400 group-hover:text-primary text-lg" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 flex items-center justify-between border-t border-stone-50 bg-stone-50/30">
                <p className="text-xs text-on-surface-variant font-medium italic">
                  Showing {filtered.length} of {tasks.length} tasks
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
