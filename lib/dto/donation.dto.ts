import { z } from "zod";

export const createDonationDto = z.object({
  amount: z.number().positive(),
  payment_method: z.string().max(50).optional(),
  note: z.string().optional(),
  guest_email: z.string().email().optional(),
  guest_name: z.string().min(1).max(200).optional(),
});

export const createPurchaseDto = z.object({
  description: z.string().min(1).max(500),
  amount: z.number().positive(),
  receipt_url: z.string().url().optional(),
});

export type CreateDonationDto = z.infer<typeof createDonationDto>;
export type CreatePurchaseDto = z.infer<typeof createPurchaseDto>;
