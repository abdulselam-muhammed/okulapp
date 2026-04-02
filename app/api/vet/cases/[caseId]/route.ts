import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { vetService } from "@/lib/services/vet.service";
import { updateVetCaseDto } from "@/lib/dto/vet.dto";

export const PATCH = handler(async (req, ctx: { params: Promise<{ caseId: string }> }) => {
  requireRole(req, "vet");
  const { caseId } = await ctx.params;
  const dto = await validate(req, updateVetCaseDto);
  await vetService.updateCase(Number(caseId), dto);
  return res.success({ message: "Case updated" });
});
