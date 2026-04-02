import { handler } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { feedingPointService } from "@/lib/services/feeding-point.service";

export const PATCH = handler(async (req, ctx: { params: Promise<{ refillId: string }> }) => {
  const auth = requireRole(req, "admin", "advisor");
  const { refillId } = await ctx.params;
  await feedingPointService.approveRefill(Number(refillId), auth.userId);
  return res.success({ message: "Refill approved" });
});
