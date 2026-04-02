import { handler, param } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { userService } from "@/lib/services/user.service";
import { ApiError } from "@/lib/helpers/api-error";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor");

  const lat = param(req, "lat");
  const lng = param(req, "lng");
  const radius = param(req, "radius");

  if (!lat || !lng) {
    throw ApiError.badRequest("lat and lng query parameters are required");
  }

  const volunteers = await userService.getNearbyVolunteers(
    Number(lat),
    Number(lng),
    radius ? Number(radius) : undefined
  );
  return res.success(volunteers);
});
