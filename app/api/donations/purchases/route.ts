import { handler, validate } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { donationService } from "@/lib/services/donation.service";
import { createPurchaseDto } from "@/lib/dto/donation.dto";

export const POST = handler(async (req) => {
  const auth = requireRole(req, "admin");
  const dto = await validate(req, createPurchaseDto);
  const purchaseId = await donationService.purchase(auth.userId, dto);
  return res.created({ id: purchaseId });
});
