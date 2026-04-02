import { handler, pagination } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { reportService } from "@/lib/services/report.service";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor");
  const { limit, offset } = pagination(req);
  const data = await reportService.getPending(limit, offset);
  return res.success(data);
});
