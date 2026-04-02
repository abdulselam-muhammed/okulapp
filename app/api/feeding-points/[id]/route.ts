import { handler } from "@/lib/helpers/controller";
import { getAuth } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { feedingPointService } from "@/lib/services/feeding-point.service";

export const GET = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  getAuth(req);
  const { id } = await ctx.params;
  const point = await feedingPointService.getById(Number(id));
  return res.success(point);
});
