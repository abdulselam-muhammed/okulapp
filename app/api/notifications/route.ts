import { handler, pagination, param } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { notificationRepository } from "@/lib/repositories/notification.repository";

export const GET = handler(async (req) => {
  const auth = getAuth(req);
  const { limit, offset } = pagination(req);
  const unreadOnly = param(req, "unread") === "true";

  const data = await notificationRepository.findByUser(
    auth.userId,
    unreadOnly,
    limit,
    offset
  );
  return res.success(data);
});
