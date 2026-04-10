import { create } from "zustand";
import { useAuthStore } from "./auth.store";
import { useToastStore } from "./toast.store";

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_type: string | null;
  related_id: number | null;
  created_at: string;
}

interface NotificationsStore {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  eventSource: EventSource | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: NotificationItem) => void;
  connect: () => void;
  disconnect: () => void;
}

function getToken() {
  return useAuthStore.getState().token;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  eventSource: null,

  fetchNotifications: async () => {
    const token = getToken();
    if (!token) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/notifications?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        const notifications: NotificationItem[] = data.data;
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.is_read).length,
        });
      }
    } catch {
      // Silent fail
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch {
      // Silent fail
    }
  },

  markAllAsRead: async () => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`/api/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch {
      // Silent fail
    }
  },

  addNotification: (notification) => {
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }));

    // Show toast for the new notification
    useToastStore.getState().addToast(notification.title + ": " + notification.message, "info");
  },

  connect: () => {
    const token = getToken();
    if (!token) return;

    // Close existing connection
    const existing = get().eventSource;
    if (existing) existing.close();

    const es = new EventSource(`/api/notifications/stream?token=${encodeURIComponent(token)}`);

    es.onmessage = (event) => {
      try {
        const data: NotificationItem = JSON.parse(event.data);
        get().addNotification(data);
      } catch {
        // Ignore malformed events
      }
    };

    es.onerror = () => {
      // Browser will auto-reconnect. If we want to stop retrying, close here.
    };

    set({ eventSource: es });
  },

  disconnect: () => {
    const es = get().eventSource;
    if (es) {
      es.close();
      set({ eventSource: null });
    }
  },
}));
