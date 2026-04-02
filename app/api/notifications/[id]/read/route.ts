import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { notificationRepository } from "@/lib/repositories/notification.repository";

export const PATCH = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  getAuth(req);
  const { id } = await ctx.params;
  await notificationRepository.markAsRead(Number(id));
  return res.success({ message: "Notification marked as read" });
});
