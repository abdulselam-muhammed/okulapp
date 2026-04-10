import { handler, pagination } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { activityLog } from "@/lib/services/activity-log.service";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor");
  const { limit, offset } = pagination(req);
  const data = await activityLog.getAll(limit, offset);
  return res.success(data);
});
