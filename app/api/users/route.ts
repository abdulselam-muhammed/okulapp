import { handler, pagination } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { userService } from "@/lib/services/user.service";
import { param } from "@/lib/helpers/controller";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor");
  const { limit, offset } = pagination(req);
  const role = param(req, "role");

  if (role) {
    const data = await userService.getByRole(role as any, limit, offset);
    return res.success(data);
  }

  const data = await userService.getAll(limit, offset);
  return res.success(data);
});
