import { handler } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { vetService } from "@/lib/services/vet.service";

export const GET = handler(async (req, ctx: { params: Promise<{ vetId: string }> }) => {
  requireRole(req, "admin", "advisor", "vet");
  const { vetId } = await ctx.params;
  const data = await vetService.getCasesByVet(Number(vetId));
  return res.success(data);
});
