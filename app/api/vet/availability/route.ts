import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { vetService } from "@/lib/services/vet.service";
import { updateVetAvailabilityDto } from "@/lib/dto/vet.dto";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor", "vet");
  const data = await vetService.getAvailableVets();
  return res.success(data);
});

export const PUT = handler(async (req) => {
  const auth = requireRole(req, "vet");
  const dto = await validate(req, updateVetAvailabilityDto);
  await vetService.updateAvailability(auth.userId, dto);
  return res.success({ message: "Availability updated" });
});
