import { z } from "zod";

export const createReportDto = z.object({
  type: z.enum(["injured_animal", "feeding_point"]),
  description: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  photo_url: z.string().url().optional(),
  // Injured animal specific fields
  species: z.string().max(100).optional(),
  condition_level: z.enum(["minor", "moderate", "severe", "critical"]).optional(),
});

export const updateReportStatusDto = z.object({
  status: z.enum([
    "pending",
    "approved",
    "assigned",
    "in_progress",
    "completed",
    "rejected",
    "needs_correction",
  ]),
  correction_note: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export type CreateReportDto = z.infer<typeof createReportDto>;
export type UpdateReportStatusDto = z.infer<typeof updateReportStatusDto>;
