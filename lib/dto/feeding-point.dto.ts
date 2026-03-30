import { z } from "zod";

export const createFeedingPointDto = z.object({
  name: z.string().min(1).max(150),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().optional(),
});

export const refillFeedingPointDto = z.object({
  refill_type: z.enum(["food", "water", "both"]),
  note: z.string().optional(),
  photo_url: z.string().url().optional(),
});

export type CreateFeedingPointDto = z.infer<typeof createFeedingPointDto>;
export type RefillFeedingPointDto = z.infer<typeof refillFeedingPointDto>;
