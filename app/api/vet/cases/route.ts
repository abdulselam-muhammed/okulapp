import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { vetService } from "@/lib/services/vet.service";
import { createVetCaseDto } from "@/lib/dto/vet.dto";

export const GET = handler(async (req) => {
  const auth = requireRole(req, "vet", "admin", "advisor");

  if (auth.role === "vet") {
    const data = await vetService.getCasesByVet(auth.userId);
    return res.success(data);
  }

  // Admin/advisor would need a vetId param to see specific vet's cases
  // For now, return all cases for the requesting vet
  const data = await vetService.getCasesByVet(auth.userId);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = requireRole(req, "vet");
  const dto = await validate(req, createVetCaseDto);
  const caseId = await vetService.createCase(auth.userId, dto);
  return res.created({ id: caseId });
});
