"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms";
import { useNotificationsStore, type NotificationItem } from "@/lib/stores";

const NOTIFICATION_ICONS: Record<string, string> = {
  task_assigned: "assignment",
  task_updated: "edit_note",
  report_status: "report",
  donation: "volunteer_activism",
  vet_request: "medical_services",
  system: "info",
};

const NOTIFICATION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  task_assigned: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Task Assigned" },
  task_updated: { bg: "bg-primary-container", text: "text-on-primary-container", label: "Task Updated" },
  report_status: { bg: "bg-tertiary-container", text: "text-on-tertiary-container", label: "Report" },
  donation: { bg: "bg-primary/10", text: "text-primary", label: "Donation" },
  vet_request: { bg: "bg-error-container/20", text: "text-error", label: "Vet Request" },
  system: { bg: "bg-surface-container-high", text: "text-on-surface-variant", label: "System" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationsStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filtered = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  function handleClick(n: NotificationItem) {
    if (!n.is_read) markAsRead(n.id);

    if (n.related_type === "task" && n.related_id) {
      router.push(`/dashboard/map?taskId=${n.related_id}`);
    } else if (n.related_type === "report" && n.related_id) {
      router.push(`/dashboard/logs`);
    } else if (n.type === "donation") {
      router.push(`/dashboard/donations`);
    } else if (n.type === "vet_request") {
      router.push(`/dashboard/vets`);
    }
  }

  return (
    <section className="pt-24 px-10 pb-20 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
            Activity Feed
          </span>
          <h2 className="text-4xl font-extrabold text-on-background font-headline tracking-tight">
            Notifications
          </h2>
          <p className="text-on-surface-variant max-w-md font-body leading-relaxed">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "All caught up."}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-6 py-3 bg-surface-container-lowest text-on-surface rounded-full font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm"
            >
              <Icon name="done_all" className="text-lg" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/10">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            filter === "all"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            filter === "unread"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-lg p-16 text-center">
            <Icon name="notifications_off" className="text-6xl text-on-surface-variant/30 mb-4 inline-block" />
            <p className="text-on-surface-variant">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const style = NOTIFICATION_STYLES[n.type] || NOTIFICATION_STYLES.system;
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left bg-surface-container-lowest rounded-lg p-5 shadow-[0_20px_40px_rgba(0,58,40,0.03)] hover:shadow-[0_20px_40px_rgba(0,58,40,0.08)] transition-all flex items-start gap-4 border-l-4 ${
                  !n.is_read ? "border-primary bg-primary/5" : "border-transparent"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  !n.is_read ? "bg-primary-container text-primary" : "bg-surface-container text-on-surface-variant"
                }`}>
                  <Icon name={NOTIFICATION_ICONS[n.type] || "info"} className="text-xl" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-bold text-on-surface">{n.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-2">{n.message}</p>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                    <Icon name="schedule" className="text-xs" />
                    {timeAgo(n.created_at)}
                    {n.related_type && n.related_id && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{n.related_type} #{n.related_id}</span>
                        <Icon name="arrow_forward" className="text-xs" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
