import { z } from "zod";

export const updateVetAvailabilityDto = z.object({
  is_available: z.boolean(),
  workload: z.enum(["light", "moderate", "heavy"]).optional(),
  note: z.string().optional(),
});

export const createVetCaseDto = z.object({
  animal_id: z.number().int().positive(),
  task_id: z.number().int().positive().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

export const updateVetCaseDto = z.object({
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  outcome: z.enum(["ongoing", "recovered", "released", "deceased"]).optional(),
  notes: z.string().optional(),
});

export type UpdateVetAvailabilityDto = z.infer<typeof updateVetAvailabilityDto>;
export type CreateVetCaseDto = z.infer<typeof createVetCaseDto>;
export type UpdateVetCaseDto = z.infer<typeof updateVetCaseDto>;
