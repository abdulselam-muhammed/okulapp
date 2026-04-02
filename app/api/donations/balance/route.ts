import { handler } from "@/lib/helpers/controller";
import { requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { donationService } from "@/lib/services/donation.service";

export const GET = handler(async (req) => {
  requireRole(req, "admin");
  const balance = await donationService.getBalance();
  return res.success({ balance });
});
