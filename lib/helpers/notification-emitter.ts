import { EventEmitter } from "events";

/**
 * Singleton EventEmitter for real-time notifications.
 *
 * Persists across route handler invocations in the same Node process.
 * For multi-instance deployments, replace with Redis Pub/Sub.
 */
export interface NotificationEvent {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  related_type: string | null;
  related_id: number | null;
  created_at: string;
}

const globalForEmitter = globalThis as unknown as {
  __notificationEmitter?: EventEmitter;
};

export const notificationEmitter =
  globalForEmitter.__notificationEmitter ?? new EventEmitter();

// Unlimited listeners — we may have many concurrent SSE clients
notificationEmitter.setMaxListeners(0);

if (!globalForEmitter.__notificationEmitter) {
  globalForEmitter.__notificationEmitter = notificationEmitter;
}

/**
 * Emit a notification to a specific user.
 * SSE listeners for that user will receive it.
 */
export function emitNotification(userId: number, event: NotificationEvent) {
  notificationEmitter.emit(`notification:${userId}`, event);
}
