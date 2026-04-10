"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms";
import { useAuthStore, useNotificationsStore, type NotificationItem } from "@/lib/stores";

interface TopBarProps {
  userName: string;
  userRole: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  task_assigned: "assignment",
  task_updated: "edit_note",
  report_status: "report",
  donation: "volunteer_activism",
  vet_request: "medical_services",
  system: "info",
};

export default function TopBar({ userName, userRole }: TopBarProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    connect,
    disconnect,
  } = useNotificationsStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  function handleNotificationClick(n: NotificationItem) {
    if (!n.is_read) markAsRead(n.id);
    setNotifOpen(false);

    // Navigate based on related resource
    if (n.related_type === "task" && n.related_id) {
      router.push(`/dashboard/map?taskId=${n.related_id}`);
    } else if (n.related_type === "report" && n.related_id) {
      router.push(`/dashboard/logs`);
    } else if (n.type === "donation") {
      router.push(`/dashboard/donations`);
    } else if (n.type === "vet_request") {
      router.push(`/dashboard/vets`);
    } else {
      router.push(`/dashboard/notifications`);
    }
  }

  // Connect to SSE and load initial notifications
  useEffect(() => {
    fetchNotifications();
    connect();
    return () => {
      disconnect();
    };
  }, [fetchNotifications, connect, disconnect]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = userName.split(" ").map((n) => n.charAt(0).toUpperCase()).join("").slice(0, 2);
  const recentNotifications = notifications.slice(0, 8);

  return (
    <header className="fixed top-0 right-0 left-64 z-40 bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm shadow-emerald-900/5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            placeholder="Search data..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-500 hover:bg-emerald-50 rounded-full transition-colors relative"
          >
            <Icon name="notifications" filled={unreadCount > 0} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface text-sm">Notifications</p>
                  <p className="text-xs text-on-surface-variant">
                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Icon name="notifications_off" className="text-4xl text-on-surface-variant/30 mb-2 inline-block" />
                    <p className="text-sm text-on-surface-variant">No notifications yet</p>
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left px-4 py-3 border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-low transition-colors flex items-start gap-3 ${
                        !n.is_read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        !n.is_read ? "bg-primary-container text-primary" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        <Icon name={NOTIFICATION_ICONS[n.type] || "info"} className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-on-surface text-sm truncate">{n.title}</p>
                          {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-on-surface-variant/60 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* View all link */}
              <Link
                href="/dashboard/notifications"
                onClick={() => setNotifOpen(false)}
                className="block text-center py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/10"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        <button className="p-2 text-slate-500 hover:bg-emerald-50 rounded-full transition-colors">
          <Icon name="help_outline" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface leading-none">{userName}</p>
              <p className="text-[10px] text-on-surface-variant capitalize">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
            <Icon name="expand_more" className={`text-on-surface-variant text-lg transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <p className="font-bold text-on-surface text-sm">{userName}</p>
                <p className="text-xs text-on-surface-variant">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase">
                  {userRole}
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Icon name="person" className="text-lg text-on-surface-variant" />
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <Icon name="dashboard" className="text-lg text-on-surface-variant" />
                  Dashboard
                </Link>
              </div>
              <div className="py-1 border-t border-outline-variant/10">
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/10 transition-colors"
                >
                  <Icon name="logout" className="text-lg" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
