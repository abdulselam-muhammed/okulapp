import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { feedingPointService } from "@/lib/services/feeding-point.service";
import { refillFeedingPointDto } from "@/lib/dto/feeding-point.dto";

export const POST = handler(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(req, "volunteer");
  const { id } = await ctx.params;
  const dto = await validate(req, refillFeedingPointDto);
  const refillId = await feedingPointService.refill(Number(id), auth.userId, dto);
  return res.created({ id: refillId, message: "Refill request submitted" });
});
