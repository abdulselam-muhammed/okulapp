import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/helpers/auth";
import { notificationEmitter, type NotificationEvent } from "@/lib/helpers/notification-emitter";

export const dynamic = "force-dynamic";

/**
 * Server-Sent Events endpoint for real-time notifications.
 *
 * Clients connect via EventSource with ?token=<jwt> (since EventSource
 * doesn't support custom headers).
 *
 * GET /api/notifications/stream?token=<jwt>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 401 });
  }

  let userId: number;
  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return new Response("Invalid token", { status: 401 });
  }

  const encoder = new TextEncoder();
  const eventName = `notification:${userId}`;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(encoder.encode(`: connected\n\n`));

      // Handler fires when the user receives a new notification
      const handler = (data: NotificationEvent) => {
        try {
          const payload = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Stream may have been closed
        }
      };

      notificationEmitter.on(eventName, handler);

      // Keep-alive ping every 25 seconds to prevent timeouts
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 25000);

      // Clean up on client disconnect
      req.signal.addEventListener("abort", () => {
        notificationEmitter.off(eventName, handler);
        clearInterval(keepAlive);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
