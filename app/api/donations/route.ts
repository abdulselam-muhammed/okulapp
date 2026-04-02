import { handler, validate, pagination } from "@/lib/helpers/controller";
import { getAuth, requireRole } from "@/lib/helpers/auth";
import * as res from "@/lib/helpers/api-response";
import { donationService } from "@/lib/services/donation.service";
import { createDonationDto } from "@/lib/dto/donation.dto";

export const GET = handler(async (req) => {
  requireRole(req, "admin", "advisor");
  const { limit, offset } = pagination(req);
  const data = await donationService.getAll(limit, offset);
  return res.success(data);
});

export const POST = handler(async (req) => {
  const auth = getAuth(req);
  const dto = await validate(req, createDonationDto);
  const donation = await donationService.donate(auth.userId, dto);
  return res.created(donation);
});
