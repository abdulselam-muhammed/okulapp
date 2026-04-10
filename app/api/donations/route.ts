import { handler, validate, pagination } from "@/lib/helpers/controller";
import { requireRole, verifyToken } from "@/lib/helpers/auth";
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
  const dto = await validate(req, createDonationDto);

  // Try to authenticate — if valid, use their user ID
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = verifyToken(authHeader.slice(7));
      const donation = await donationService.donate(payload.userId, dto);
      return res.created(donation);
    } catch {
      // Invalid token — fall through to guest flow
    }
  }

  // Guest donation — requires guest_email + guest_name
  const donation = await donationService.donateAsGuest(dto);
  return res.created(donation);
});
