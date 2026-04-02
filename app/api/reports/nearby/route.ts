import { handler, param } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { reportService } from "@/lib/services/report.service";
import { ApiError } from "@/lib/helpers/api-error";

export const GET = handler(async (req) => {
  getAuth(req);

  const lat = param(req, "lat");
  const lng = param(req, "lng");
  const radius = param(req, "radius");

  if (!lat || !lng) {
    throw ApiError.badRequest("lat and lng query parameters are required");
  }

  const data = await reportService.getNearby(
    Number(lat),
    Number(lng),
    radius ? Number(radius) : undefined
  );
  return res.success(data);
});
