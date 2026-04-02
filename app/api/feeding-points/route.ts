import { handler, validate, pagination } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { feedingPointService } from "@/lib/services/feeding-point.service";
import { createFeedingPointDto } from "@/lib/dto/feeding-point.dto";

export const GET = handler(async (req) => {
  getAuth(req);
  const { limit, offset } = pagination(req);
  const data = await feedingPointService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = requireRole(req, "admin", "advisor");
  const dto = await validate(req, createFeedingPointDto);
  const point = await feedingPointService.create(auth.userId, dto);
  return res.created(point);
});
