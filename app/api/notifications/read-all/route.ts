import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { notificationRepository } from "@/lib/repositories/notification.repository";

export const PATCH = handler(async (req) => {
  const auth = getAuth(req);
  await notificationRepository.markAllAsRead(auth.userId);
  return res.success({ message: "All notifications marked as read" });
});
